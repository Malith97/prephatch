#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_ENV_FILES = [".env.local", ".env"];
const DEFAULT_PASS_SCORE = 70;

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return null;
  const index = trimmed.indexOf("=");
  const key = trimmed.slice(0, index).trim();
  let value = trimmed.slice(index + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return key ? [key, value] : null;
}

export function loadLocalEnv(cwd = process.cwd()) {
  for (const file of DEFAULT_ENV_FILES) {
    const path = resolve(cwd, file);
    if (!existsSync(path)) continue;
    const lines = readFileSync(path, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      const [key, value] = parsed;
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function buildClient() {
  loadLocalEnv();
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const key = serviceRoleKey || anonKey;
  return {
    usingServiceRole: Boolean(serviceRoleKey),
    supabase: createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
  };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeQuestion(rawQuestion, index) {
  const options = asArray(rawQuestion.options);
  const examVersionQuestionId =
    rawQuestion.examVersionQuestionId ||
    rawQuestion.exam_version_question_id ||
    rawQuestion.id;
  const correctOptionId = rawQuestion.correctOptionId || rawQuestion.correct_option_id;

  if (!examVersionQuestionId) throw new Error(`Snapshot question ${index + 1} is missing an id.`);
  if (!correctOptionId) throw new Error(`Snapshot question ${index + 1} is missing correctOptionId.`);
  if (!options.some((option) => option?.id === correctOptionId)) {
    throw new Error(`Snapshot question ${index + 1} correct option is not in options.`);
  }

  return {
    id: String(rawQuestion.id || examVersionQuestionId),
    examVersionQuestionId: String(examVersionQuestionId),
    topicLabel: String(rawQuestion.topicLabel || rawQuestion.topic_label || "General"),
    prompt: String(rawQuestion.prompt || ""),
    options,
    correctOptionId: String(correctOptionId),
    points: Number(rawQuestion.points ?? 1),
  };
}

function getQuestionSnapshot(attempt) {
  const snapshot = attempt?.metadata?.questionSnapshot;
  const questions = asArray(snapshot).map(normalizeQuestion);
  if (questions.length === 0) {
    throw new Error(`Attempt ${attempt?.id ?? "unknown"} has no metadata.questionSnapshot questions.`);
  }
  return questions;
}

function chooseAnswer(question, mode, index) {
  if (mode === "first") return question.options[0]?.id;
  if (mode === "alternate") return question.options[index % question.options.length]?.id;
  return question.correctOptionId;
}

export function scoreSnapshot(questions, answersByQuestionId, passScore = DEFAULT_PASS_SCORE) {
  const questionResults = questions.map((question) => {
    const selectedOptionId = answersByQuestionId[question.examVersionQuestionId] ?? null;
    const isCorrect = selectedOptionId === question.correctOptionId;
    return {
      questionId: question.examVersionQuestionId,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect,
      topicLabel: question.topicLabel,
      points: question.points,
      scoreAwarded: isCorrect ? question.points : 0,
    };
  });

  const totalQuestions = questionResults.length;
  const correctAnswers = questionResults.filter((result) => result.isCorrect).length;
  const rawScore = questionResults.reduce((sum, result) => sum + result.scoreAwarded, 0);
  const maxScore = questions.reduce((sum, question) => sum + question.points, 0);
  const percentage = maxScore > 0 ? Number(((rawScore / maxScore) * 100).toFixed(2)) : 0;
  const passed = percentage >= passScore;

  const topicScores = {};
  for (const result of questionResults) {
    const topic = result.topicLabel;
    topicScores[topic] ??= { correct: 0, incorrect: 0, unanswered: 0, total: 0, points_awarded: 0, points_possible: 0 };
    topicScores[topic].total += 1;
    topicScores[topic].points_awarded += result.scoreAwarded;
    topicScores[topic].points_possible += result.points;
    if (result.selectedOptionId === null) topicScores[topic].unanswered += 1;
    else if (result.isCorrect) topicScores[topic].correct += 1;
    else topicScores[topic].incorrect += 1;
  }

  return {
    totalQuestions,
    correctAnswers,
    rawScore,
    maxScore,
    percentage,
    passed,
    questionResults,
    topicScores,
  };
}

async function must(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}

async function findSeededAttempt(supabase, explicitAttemptId) {
  if (explicitAttemptId) {
    const data = await must(
      await supabase.from("exam_attempts").select("*").eq("id", explicitAttemptId).maybeSingle(),
      "fetch explicit attempt",
    );
    if (!data) throw new Error(`No exam_attempts row found for FREE_MOCK_ATTEMPT_ID=${explicitAttemptId}`);
    return data;
  }

  const rows = await must(
    await supabase
      .from("exam_attempts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50),
    "fetch seeded attempts",
  );
  const attempt = rows.find((row) => Array.isArray(row?.metadata?.questionSnapshot) && row.metadata.questionSnapshot.length > 0);
  if (!attempt) throw new Error("No seeded attempt found with metadata.questionSnapshot. Set FREE_MOCK_ATTEMPT_ID explicitly if needed.");
  return attempt;
}

async function fetchPassScore(supabase, attempt) {
  const version = await must(
    await supabase
      .from("exam_versions")
      .select("pass_score")
      .eq("id", attempt.exam_version_id)
      .maybeSingle(),
    "fetch pass score",
  );
  return Number(version?.pass_score ?? DEFAULT_PASS_SCORE);
}

async function persistAnswers(supabase, attempt, questions, answerMode) {
  const now = new Date().toISOString();
  const rows = questions.map((question, index) => {
    const selectedOptionId = chooseAnswer(question, answerMode, index);
    if (!selectedOptionId) throw new Error(`No selectable option for ${question.examVersionQuestionId}`);
    return {
      attempt_id: attempt.id,
      organization_id: attempt.organization_id,
      exam_version_question_id: question.examVersionQuestionId,
      user_id: attempt.user_id,
      answer_payload: { selected: [selectedOptionId] },
      is_flagged: false,
      is_final: false,
      answered_at: now,
      updated_at: now,
    };
  });

  await must(
    await supabase.from("attempt_answers").upsert(rows, { onConflict: "attempt_id,exam_version_question_id" }),
    "upsert attempt_answers",
  );

  return Object.fromEntries(rows.map((row) => [row.exam_version_question_id, row.answer_payload.selected[0]]));
}

async function finalizeAttempt(supabase, attempt, score) {
  const now = new Date().toISOString();
  await must(
    await supabase
      .from("exam_attempts")
      .update({
        status: "submitted",
        submitted_at: attempt.submitted_at || now,
        last_activity_at: now,
        time_spent_seconds: Math.max(0, Math.round((Date.now() - Date.parse(attempt.started_at || attempt.created_at || now)) / 1000)),
        updated_at: now,
      })
      .eq("id", attempt.id),
    "update exam_attempts submitted status",
  );

  for (const result of score.questionResults) {
    await must(
      await supabase
        .from("attempt_answers")
        .update({ is_final: true, score_awarded: result.scoreAwarded, updated_at: now })
        .eq("attempt_id", attempt.id)
        .eq("exam_version_question_id", result.questionId),
      `finalize answer ${result.questionId}`,
    );
  }
}

async function persistResult(supabase, attempt, score) {
  const existing = await must(
    await supabase
      .from("attempt_results")
      .select("id, result_version")
      .eq("attempt_id", attempt.id)
      .eq("is_current", true)
      .maybeSingle(),
    "fetch current attempt_result",
  );

  const resultSnapshot = {
    score_source: "exam_attempts.metadata.questionSnapshot",
    total_questions: score.totalQuestions,
    correct_answers: score.correctAnswers,
    raw_score: score.rawScore,
    max_score: score.maxScore,
    percentage: score.percentage,
    passed: score.passed,
    topic_scores: score.topicScores,
    question_results: score.questionResults,
  };

  const payload = {
    attempt_id: attempt.id,
    organization_id: attempt.organization_id,
    user_id: attempt.user_id,
    exam_id: attempt.exam_id,
    exam_version_id: attempt.exam_version_id,
    result_version: existing?.result_version ?? 1,
    is_current: true,
    raw_score: score.rawScore,
    max_score: score.maxScore,
    percentage: score.percentage,
    passed: score.passed,
    breakdown: { result_snapshot: resultSnapshot },
    graded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    await must(await supabase.from("attempt_results").update(payload).eq("id", existing.id), "update attempt_results");
    return existing.id;
  }

  const inserted = await must(
    await supabase.from("attempt_results").insert(payload).select("id").single(),
    "insert attempt_results",
  );
  return inserted.id;
}

export async function runFreeMockFlow({ attemptId = process.env.FREE_MOCK_ATTEMPT_ID, answerMode = process.env.ANSWER_MODE || "correct" } = {}) {
  const { supabase, usingServiceRole } = buildClient();
  await must(await supabase.from("exam_attempts").select("id").limit(1), "verify DB connection");

  const attempt = await findSeededAttempt(supabase, attemptId);
  const questions = getQuestionSnapshot(attempt);
  const passScore = await fetchPassScore(supabase, attempt);
  const answersByQuestionId = await persistAnswers(supabase, attempt, questions, answerMode);
  const score = scoreSnapshot(questions, answersByQuestionId, passScore);
  await finalizeAttempt(supabase, attempt, score);
  const resultId = await persistResult(supabase, attempt, score);

  return {
    using_service_role: usingServiceRole,
    attempt_id: attempt.id,
    result_id: resultId,
    total_questions: score.totalQuestions,
    correct_answers: score.correctAnswers,
    raw_score: score.rawScore,
    max_score: score.maxScore,
    score_percent: score.percentage,
    pass_score: passScore,
    passed: score.passed,
    results_url_hint: `/exam/free-mock-aptitude-gk-logic/results/${attempt.id}`,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runFreeMockFlow()
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
