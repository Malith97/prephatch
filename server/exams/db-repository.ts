import { createHash } from "node:crypto";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServiceClient } from "../db/supabase-service";
import { SCORE_PREVIEW_LABEL } from "./scoring";
import type { AttemptAnswers, MockExam, Question, QuestionOption } from "./types";
import type { AttemptScore, PublicExamAttempt } from "./attempt-types";

export type RuntimeAttemptStatus = "created" | "in_progress" | "submitted" | "auto_submitted" | "graded" | "expired" | "cancelled";

type JsonRecord = Record<string, unknown>;

type SnapshotQuestion = Question & {
  examVersionQuestionId: string;
  questionVersionId: string;
  sectionId: string | null;
  points: number;
};

export type RuntimeExam = MockExam & {
  organizationId: string;
  examId: string;
  examVersionId: string;
  packageVersionId: string | null;
  packageTier: "free" | "premium" | "unknown";
  passScore: number;
  maxAttemptsPerUser: number;
};

type AttemptRow = {
  id: string;
  organization_id: string;
  user_id: string;
  exam_id: string;
  exam_version_id: string;
  attempt_no: number;
  status: RuntimeAttemptStatus;
  started_at: string | null;
  submitted_at: string | null;
  expires_at: string | null;
  row_version: number;
  autosave_version: number;
  time_spent_seconds: number;
  metadata: JsonRecord | null;
  updated_at: string;
  created_at: string;
};

type AnswerRow = {
  id: string;
  attempt_id: string;
  exam_version_question_id: string;
  answer_payload: JsonRecord;
  is_flagged: boolean;
  score_awarded: number | null;
  answered_at: string;
  updated_at: string;
};

type ResultRow = {
  id: string;
  attempt_id: string;
  raw_score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  breakdown: JsonRecord;
  graded_at: string;
};

export type AttemptsRepository = {
  listCatalogPackages(): Promise<RuntimeExam[]>;
  findRuntimeExam(input: {
    organizationId: string;
    examSlug?: string;
    examId?: string;
    mockId?: string;
    mockExamId?: string;
    includeAnswers: boolean;
  }): Promise<RuntimeExam | null>;
  findRuntimeExamByVersion(input: {
    organizationId: string;
    examVersionId: string;
    includeAnswers: boolean;
  }): Promise<RuntimeExam | null>;
  hasAccess(input: {
    organizationId: string;
    userId: string;
    exam: RuntimeExam;
  }): Promise<boolean>;
  findActiveAttempt(input: {
    organizationId: string;
    userId: string;
    examVersionId: string;
  }): Promise<PublicExamAttempt | null>;
  createAttempt(input: {
    organizationId: string;
    userId: string;
    exam: RuntimeExam;
    mockId: string;
    idempotencyKey?: string;
  }): Promise<{ attempt: PublicExamAttempt; resumed: boolean }>;
  getAttempt(input: {
    organizationId: string;
    userId: string;
    attemptId: string;
    examSlug?: string;
  }): Promise<PublicExamAttempt | null>;
  getLatestSubmittedAttempt(input: {
    organizationId: string;
    userId: string;
    examSlug: string;
  }): Promise<PublicExamAttempt | null>;
  autosaveAttempt(input: {
    organizationId: string;
    userId: string;
    attemptId: string;
    answers?: AttemptAnswers;
    currentQuestionIndex?: number;
    flaggedQuestionIds?: string[];
    expectedVersion?: number;
  }): Promise<PublicExamAttempt>;
  submitAttempt(input: {
    organizationId: string;
    userId: string;
    attemptId: string;
    idempotencyKey?: string;
  }): Promise<{ attempt: PublicExamAttempt; submittedAlready: boolean; expired: boolean }>;
  listAttemptsForOwner(input: {
    organizationId?: string | null;
    userId: string;
  }): Promise<PublicExamAttempt[]>;
  clearForTests?(): void;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toMillis(value: string | null | undefined): number {
  return value ? Date.parse(value) : Date.now();
}

function asRecord(value: unknown): JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeTier(value: unknown): "free" | "premium" | "unknown" {
  return value === "free" || value === "premium" ? value : "unknown";
}

function hasFreeMetadata(metadata: JsonRecord): boolean {
  return metadata.free === true || metadata.free === "true" || metadata.tier === "free";
}

function resolveMetadataTier(...metadataRecords: JsonRecord[]): "free" | "premium" | "unknown" {
  for (const metadata of metadataRecords) {
    const tier = normalizeTier(metadata.tier);
    if (tier !== "unknown") {
      return tier;
    }
  }

  return metadataRecords.some(hasFreeMetadata) ? "free" : "unknown";
}

function normalizeOption(option: unknown): QuestionOption | null {
  const record = asRecord(option);
  const id = asString(record.id);
  const text = asString(record.text);

  if (!id || !text) {
    return null;
  }

  return {
    id,
    label: asString(record.label) ?? id,
    text,
  };
}

function normalizeOptions(value: unknown): QuestionOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeOption).filter((option): option is QuestionOption => option !== null);
}

function getCorrectChoice(value: unknown): string {
  const record = asRecord(value);
  const choice = asString(record.choice);
  if (choice) {
    return choice;
  }

  const selected = record.selected;
  if (Array.isArray(selected) && typeof selected[0] === "string") {
    return selected[0];
  }

  return "";
}

function buildRequestHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function getSelectedOption(answerPayload: JsonRecord | undefined): string | null {
  if (!answerPayload) {
    return null;
  }

  const selected = answerPayload.selected;
  if (Array.isArray(selected) && typeof selected[0] === "string") {
    return selected[0];
  }

  return null;
}

function selectedPayload(optionId: string | null): JsonRecord {
  return optionId ? { selected: [optionId] } : { selected: [] };
}

function getAttemptMetadata(attempt: AttemptRow): JsonRecord {
  return asRecord(attempt.metadata);
}

function getSnapshotQuestions(attempt: AttemptRow): SnapshotQuestion[] {
  const snapshot = getAttemptMetadata(attempt).questionSnapshot;
  if (!Array.isArray(snapshot)) {
    return [];
  }

  return snapshot.map((entry) => {
    const record = asRecord(entry);
    return {
      id: asString(record.id) ?? "",
      examVersionQuestionId: asString(record.examVersionQuestionId) ?? asString(record.id) ?? "",
      questionVersionId: asString(record.questionVersionId) ?? "",
      sectionId: asString(record.sectionId),
      topicLabel: asString(record.topicLabel) ?? "General",
      prompt: asString(record.prompt) ?? "",
      explanation: asString(record.explanation) ?? "",
      correctOptionId: asString(record.correctOptionId) ?? "",
      options: normalizeOptions(record.options),
      points: asNumber(record.points) ?? 1,
    };
  }).filter((question) => question.id && question.examVersionQuestionId);
}

function publicStatus(status: RuntimeAttemptStatus): "in_progress" | "submitted" {
  return status === "submitted" || status === "auto_submitted" || status === "graded"
    ? "submitted"
    : "in_progress";
}

function scoreFromSnapshot(
  questions: SnapshotQuestion[],
  answers: AttemptAnswers,
): AttemptScore {
  const questionResults = questions.map((question) => {
    const selectedOptionId = answers[question.id] ?? null;
    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
      topicLabel: question.topicLabel,
    };
  });

  const correctCount = questionResults.filter((result) => result.isCorrect).length;
  const unansweredCount = questionResults.filter((result) => result.selectedOptionId === null).length;
  const incorrectCount = questionResults.length - correctCount - unansweredCount;
  const total = Math.max(questions.length, 1);
  const percentageScore = Number(((correctCount / total) * 100).toFixed(2));
  const scaledScorePreview = Math.round(100 + (percentageScore / 100) * 900);

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    percentageScore,
    scaledScorePreview,
    questionResults,
    previewFormulaLabel: SCORE_PREVIEW_LABEL,
    computedAt: Date.now(),
  };
}

function buildTopicBreakdown(score: AttemptScore): JsonRecord {
  const topics = new Map<string, { correct: number; incorrect: number; unanswered: number; total: number }>();

  for (const result of score.questionResults) {
    const topicLabel = result.topicLabel ?? "General";
    const topic = topics.get(topicLabel) ?? { correct: 0, incorrect: 0, unanswered: 0, total: 0 };
    topic.total += 1;

    if (result.isCorrect) {
      topic.correct += 1;
    } else if (result.selectedOptionId === null) {
      topic.unanswered += 1;
    } else {
      topic.incorrect += 1;
    }

    topics.set(topicLabel, topic);
  }

  return {
    question_results: score.questionResults,
    section_scores: Object.fromEntries(topics.entries()),
    counts: {
      correct: score.correctCount,
      incorrect: score.incorrectCount,
      unanswered: score.unansweredCount,
    },
  };
}

function normalizeQuestionResult(value: unknown): AttemptScore["questionResults"][number] | null {
  const record = asRecord(value);
  const questionId = asString(record.questionId) ?? asString(record.question_id);
  const selectedOptionId = asString(record.selectedOptionId) ?? asString(record.selected_option_id);
  const correctOptionId = asString(record.correctOptionId) ?? asString(record.correct_option_id);

  if (!questionId || !correctOptionId) {
    return null;
  }

  return {
    questionId,
    selectedOptionId,
    correctOptionId,
    isCorrect: Boolean(record.isCorrect ?? record.is_correct),
    topicLabel: asString(record.topicLabel) ?? asString(record.topic_label) ?? "General",
  };
}

function scoreFromPersistedResult(
  result: ResultRow,
  questions: SnapshotQuestion[],
  answers: AttemptAnswers,
): AttemptScore {
  const breakdown = asRecord(result.breakdown);
  const resultSnapshot = asRecord(breakdown.result_snapshot);
  const persistedQuestionResults = (
    Array.isArray(breakdown.question_results)
      ? breakdown.question_results
      : Array.isArray(resultSnapshot.question_results)
        ? resultSnapshot.question_results
        : []
  ).map(normalizeQuestionResult).filter(
    (entry): entry is AttemptScore["questionResults"][number] => entry !== null,
  );
  const questionResults = persistedQuestionResults.length > 0
    ? persistedQuestionResults
    : scoreFromSnapshot(questions, answers).questionResults;
  const correctCount = questionResults.filter((entry) => entry.isCorrect).length;
  const unansweredCount = questionResults.filter((entry) => entry.selectedOptionId === null).length;
  const incorrectCount = questionResults.length - correctCount - unansweredCount;
  const percentageScore = Number(result.percentage ?? 0);

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    percentageScore,
    scaledScorePreview: Math.round(100 + (percentageScore / 100) * 900),
    questionResults,
    previewFormulaLabel: SCORE_PREVIEW_LABEL,
    computedAt: Date.parse(result.graded_at) || Date.now(),
  };
}

async function assertNoError<T>(
  result: {
    data: T;
    error: { message: string; code?: string; details?: string | null; hint?: string | null } | null;
  },
): Promise<T> {
  if (result.error) {
    console.info("[supabase-db] query_failed", {
      code: result.error.code,
      message: result.error.message,
      details: result.error.details,
      hint: result.error.hint,
    });
    throw new Error(result.error.message);
  }

  return result.data;
}

class SupabaseAttemptsRepository implements AttemptsRepository {
  constructor(private readonly db: SupabaseClient) {}

  async listCatalogPackages(): Promise<RuntimeExam[]> {
    const { data: orgs } = await this.db
      .from("organizations")
      .select("id")
      .eq("is_active", true)
      .is("deleted_at", null)
      .limit(1);
    const organizationId = orgs?.[0]?.id;
    if (!organizationId) {
      return [];
    }

    const { data: exams } = await this.db
      .from("exams")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .is("deleted_at", null);

    const runtimeExams = await Promise.all(
      (exams ?? []).map((exam) =>
        this.findRuntimeExamByVersionForExamId({
          organizationId,
          examId: exam.id,
          includeAnswers: false,
        }),
      ),
    );

    return runtimeExams.filter((exam): exam is RuntimeExam => exam !== null);
  }

  async findRuntimeExam(input: {
    organizationId: string;
    examSlug?: string;
    examId?: string;
    mockId?: string;
    mockExamId?: string;
    includeAnswers: boolean;
  }): Promise<RuntimeExam | null> {
    if (input.mockExamId) {
      const byVersion = await this.findRuntimeExamByVersion({
        organizationId: input.organizationId,
        examVersionId: input.mockExamId,
        includeAnswers: input.includeAnswers,
      });
      if (byVersion) {
        return byVersion;
      }
    }

    const { data: examRows, error } = await this.db
      .from("exams")
      .select("id, organization_id, exam_code, title, description, kind, external_id, metadata")
      .eq("organization_id", input.organizationId)
      .eq("is_active", true)
      .is("deleted_at", null);

    if (error) {
      throw new Error(error.message);
    }

    const normalizedSlug = input.examSlug ? slugify(input.examSlug) : null;
    const exam = (examRows ?? []).find((row) => {
      if (input.examId && row.id === input.examId) {
        return true;
      }
      if (!normalizedSlug) {
        return false;
      }
      const metadataSlug = asString(asRecord(row.metadata).slug);
      return (
        slugify(row.exam_code) === normalizedSlug ||
        slugify(row.external_id ?? "") === normalizedSlug ||
        (metadataSlug ? slugify(metadataSlug) === normalizedSlug : false)
      );
    });

    if (!exam) {
      return null;
    }

    return this.findRuntimeExamByVersionForExamId({
      organizationId: input.organizationId,
      examId: exam.id,
      mockId: input.mockId ?? input.mockExamId,
      includeAnswers: input.includeAnswers,
    });
  }

  async findRuntimeExamByVersion(input: {
    organizationId: string;
    examVersionId: string;
    includeAnswers: boolean;
  }): Promise<RuntimeExam | null> {
    const { data: version } = await this.db
      .from("exam_versions")
      .select("exam_id")
      .eq("organization_id", input.organizationId)
      .eq("id", input.examVersionId)
      .maybeSingle();

    if (!version) {
      return null;
    }

    return this.buildRuntimeExam({
      organizationId: input.organizationId,
      examId: version.exam_id,
      examVersionId: input.examVersionId,
      includeAnswers: input.includeAnswers,
    });
  }

  private async findRuntimeExamByVersionForExamId(input: {
    organizationId: string;
    examId: string;
    mockId?: string;
    includeAnswers: boolean;
  }): Promise<RuntimeExam | null> {
    let selectedVersionId: string | null = null;

    if (input.mockId) {
      const normalizedMock = slugify(input.mockId);
      const { data: versions } = await this.db
        .from("exam_versions")
        .select("id, external_id, metadata")
        .eq("organization_id", input.organizationId)
        .eq("exam_id", input.examId)
        .eq("status", "published")
        .is("deleted_at", null);

      selectedVersionId =
        (versions ?? []).find(
          (version) =>
            version.id === input.mockId ||
            slugify(version.external_id ?? "") === normalizedMock ||
            slugify(asString(asRecord(version.metadata).slug) ?? "") === normalizedMock,
        )?.id ?? null;
    }

    if (!selectedVersionId) {
      const { data: version } = await this.db
        .from("exam_versions")
        .select("id")
        .eq("organization_id", input.organizationId)
        .eq("exam_id", input.examId)
        .eq("status", "published")
        .is("deleted_at", null)
        .order("version_no", { ascending: false })
        .limit(1)
        .maybeSingle();
      selectedVersionId = version?.id ?? null;
    }

    if (!selectedVersionId) {
      return null;
    }

    return this.buildRuntimeExam({
      organizationId: input.organizationId,
      examId: input.examId,
      examVersionId: selectedVersionId,
      includeAnswers: input.includeAnswers,
    });
  }

  private async buildRuntimeExam(input: {
    organizationId: string;
    examId: string;
    examVersionId: string;
    includeAnswers: boolean;
  }): Promise<RuntimeExam | null> {
    const [examResult, versionResult, evqResult, packageItemResult] = await Promise.all([
      this.db
        .from("exams")
        .select("id, organization_id, exam_code, title, description, metadata")
        .eq("organization_id", input.organizationId)
        .eq("id", input.examId)
        .maybeSingle(),
      this.db
        .from("exam_versions")
        .select("id, duration_minutes, pass_score, max_attempts_per_user, title_override, metadata")
        .eq("organization_id", input.organizationId)
        .eq("id", input.examVersionId)
        .maybeSingle(),
      this.db
        .from("exam_version_questions")
        .select("id, section_id, question_version_id, position, points")
        .eq("organization_id", input.organizationId)
        .eq("exam_version_id", input.examVersionId)
        .order("position", { ascending: true }),
      this.db
        .from("access_package_exam_items")
        .select("package_version_id")
        .eq("organization_id", input.organizationId)
        .eq("exam_version_id", input.examVersionId)
        .order("position", { ascending: true })
        .limit(1),
    ]);

    const exam = await assertNoError(examResult);
    const version = await assertNoError(versionResult);
    const evqs = await assertNoError(evqResult);
    const packageItems = await assertNoError(packageItemResult);

    if (!exam || !version || !evqs) {
      return null;
    }

    const questionVersionIds = evqs.map((evq) => evq.question_version_id);
    const { data: questionVersions, error: qvError } = await this.db
      .from("question_versions")
      .select("id, question_id, prompt, options, correct_answer, explanation, question_type")
      .eq("organization_id", input.organizationId)
      .in("id", questionVersionIds);

    if (qvError) {
      throw new Error(qvError.message);
    }

    const questionIds = (questionVersions ?? []).map((questionVersion) => questionVersion.question_id);
    const { data: questionRows, error: questionError } = await this.db
      .from("questions")
      .select("id, category")
      .eq("organization_id", input.organizationId)
      .in("id", questionIds);

    if (questionError) {
      throw new Error(questionError.message);
    }

    const questionVersionById = new Map((questionVersions ?? []).map((qv) => [qv.id, qv]));
    const questionById = new Map((questionRows ?? []).map((question) => [question.id, question]));

    const questions: SnapshotQuestion[] = evqs.map((evq) => {
      const qv = questionVersionById.get(evq.question_version_id);
      const sourceQuestion = qv ? questionById.get(qv.question_id) : null;
      const correctOptionId = input.includeAnswers ? getCorrectChoice(qv?.correct_answer) : "";
      return {
        id: evq.id,
        examVersionQuestionId: evq.id,
        questionVersionId: evq.question_version_id,
        sectionId: evq.section_id,
        topicLabel: sourceQuestion?.category ?? "General",
        prompt: qv?.prompt ?? "",
        explanation: input.includeAnswers ? qv?.explanation ?? "" : "",
        correctOptionId,
        options: normalizeOptions(qv?.options),
        points: Number(evq.points ?? 1),
      };
    });

    const examMetadata = asRecord(exam.metadata);
    const versionMetadata = asRecord(version.metadata);
    const packageVersionId = packageItems?.[0]?.package_version_id ?? null;
    const metadataTier = resolveMetadataTier(versionMetadata, examMetadata);
    const packageTier = packageVersionId
      ? await this.findPackageTier(input.organizationId, packageVersionId)
      : metadataTier;

    const certificationCode = String(exam.exam_code).split("-").slice(-1)[0] || String(exam.exam_code);
    const metadataSlug = asString(versionMetadata.slug) ?? asString(examMetadata.slug);
    const slug = slugify(metadataSlug ?? String(exam.exam_code));

    return {
      id: exam.id,
      slug,
      certificationCode,
      title: version.title_override ?? exam.title,
      description: exam.description ?? "",
      durationMinutes: Number(version.duration_minutes),
      questions,
      organizationId: input.organizationId,
      examId: exam.id,
      examVersionId: version.id,
      packageVersionId,
      packageTier: packageTier === "unknown" ? metadataTier : packageTier,
      passScore: Number(version.pass_score ?? 70),
      maxAttemptsPerUser: Number(version.max_attempts_per_user ?? 1),
    };
  }

  private async findPackageTier(organizationId: string, packageVersionId: string): Promise<"free" | "premium" | "unknown"> {
    const { data: packageVersion, error: versionError } = await this.db
      .from("access_package_versions")
      .select("package_id")
      .eq("organization_id", organizationId)
      .eq("id", packageVersionId)
      .maybeSingle();

    if (versionError) {
      throw new Error(versionError.message);
    }

    if (!packageVersion) {
      return "unknown";
    }

    const { data: packageRow, error: packageError } = await this.db
      .from("access_packages")
      .select("metadata")
      .eq("organization_id", organizationId)
      .eq("id", packageVersion.package_id)
      .maybeSingle();

    if (packageError) {
      throw new Error(packageError.message);
    }

    return normalizeTier(asRecord(packageRow?.metadata).tier);
  }

  async hasAccess(input: { organizationId: string; userId: string; exam: RuntimeExam }): Promise<boolean> {
    if (input.exam.packageTier === "free") {
      return true;
    }

    if (!input.exam.packageVersionId) {
      return false;
    }

    const now = new Date().toISOString();
    const [userAssignment, orgAssignment] = await Promise.all([
      this.db
        .from("package_user_assignments")
        .select("id")
        .eq("organization_id", input.organizationId)
        .eq("package_version_id", input.exam.packageVersionId)
        .eq("user_id", input.userId)
        .eq("is_active", true)
        .lte("valid_from", now)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .is("deleted_at", null)
        .limit(1),
      this.db
        .from("package_org_assignments")
        .select("id")
        .eq("organization_id", input.organizationId)
        .eq("package_version_id", input.exam.packageVersionId)
        .eq("is_active", true)
        .lte("valid_from", now)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .is("deleted_at", null)
        .limit(1),
    ]);

    if (userAssignment.error) {
      throw new Error(userAssignment.error.message);
    }
    if (orgAssignment.error) {
      throw new Error(orgAssignment.error.message);
    }

    return Boolean(userAssignment.data?.length || orgAssignment.data?.length);
  }

  async findActiveAttempt(input: { organizationId: string; userId: string; examVersionId: string }): Promise<PublicExamAttempt | null> {
    const { data, error } = await this.db
      .from("exam_attempts")
      .select("*")
      .eq("organization_id", input.organizationId)
      .eq("user_id", input.userId)
      .eq("exam_version_id", input.examVersionId)
      .in("status", ["created", "in_progress"])
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    const attempt = data?.[0] as AttemptRow | undefined;
    if (!attempt) {
      return null;
    }

    return this.toPublicAttempt(attempt, false);
  }

  async createAttempt(input: {
    organizationId: string;
    userId: string;
    exam: RuntimeExam;
    mockId: string;
    idempotencyKey?: string;
  }): Promise<{ attempt: PublicExamAttempt; resumed: boolean }> {
    const normalizedKey = input.idempotencyKey?.trim();
    if (normalizedKey) {
      const { data: existingRequest, error } = await this.db
        .from("attempt_creation_requests")
        .select("attempt_id")
        .eq("organization_id", input.organizationId)
        .eq("user_id", input.userId)
        .eq("idempotency_key", normalizedKey)
        .maybeSingle();
      if (error) {
        throw new Error(error.message);
      }
      if (existingRequest?.attempt_id) {
        const existingAttempt = await this.getAttempt({
          organizationId: input.organizationId,
          userId: input.userId,
          attemptId: existingRequest.attempt_id,
        });
        if (existingAttempt) {
          return { attempt: existingAttempt, resumed: true };
        }
      }
    }

    const activeAttempt = await this.findActiveAttempt({
      organizationId: input.organizationId,
      userId: input.userId,
      examVersionId: input.exam.examVersionId,
    });
    if (activeAttempt) {
      return { attempt: activeAttempt, resumed: true };
    }

    const { data: attemptRows, error: attemptsError } = await this.db
      .from("exam_attempts")
      .select("attempt_no")
      .eq("organization_id", input.organizationId)
      .eq("user_id", input.userId)
      .eq("exam_version_id", input.exam.examVersionId)
      .order("attempt_no", { ascending: false })
      .limit(1);

    if (attemptsError) {
      throw new Error(attemptsError.message);
    }

    const attemptNo = Number(attemptRows?.[0]?.attempt_no ?? 0) + 1;
    if (input.exam.maxAttemptsPerUser > 0 && attemptNo > input.exam.maxAttemptsPerUser) {
      throw new Error("attempt_limit_reached");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + input.exam.durationMinutes * 60_000);
    const snapshot = input.exam.questions.map((question) => ({
      id: question.id,
      examVersionQuestionId: (question as SnapshotQuestion).examVersionQuestionId ?? question.id,
      questionVersionId: (question as SnapshotQuestion).questionVersionId,
      sectionId: (question as SnapshotQuestion).sectionId,
      topicLabel: question.topicLabel,
      prompt: question.prompt,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
      points: (question as SnapshotQuestion).points ?? 1,
    }));

    const metadata = {
      examSlug: input.exam.slug,
      mockId: input.mockId,
      passScore: input.exam.passScore,
      currentQuestionIndex: 0,
      flaggedQuestionIds: [],
      questionSnapshot: snapshot,
    };

    const { data: attempt, error: insertError } = await this.db
      .from("exam_attempts")
      .insert({
        organization_id: input.organizationId,
        user_id: input.userId,
        exam_id: input.exam.examId,
        exam_version_id: input.exam.examVersionId,
        attempt_no: attemptNo,
        status: "in_progress",
        started_at: now.toISOString(),
        last_activity_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        client_timezone: "UTC",
        metadata,
      })
      .select("*")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    const requestHash = buildRequestHash({
      userId: input.userId,
      examVersionId: input.exam.examVersionId,
      mockId: input.mockId,
    });

    await this.db.from("attempt_creation_requests").insert({
      organization_id: input.organizationId,
      user_id: input.userId,
      exam_id: input.exam.examId,
      exam_version_id: input.exam.examVersionId,
      idempotency_key: normalizedKey || `create:${attempt.id}`,
      request_hash: requestHash,
      status: "accepted",
      accepted: true,
      attempt_id: attempt.id,
      processed_at: now.toISOString(),
    });

    return {
      attempt: await this.toPublicAttempt(attempt as AttemptRow, false),
      resumed: false,
    };
  }

  async getAttempt(input: {
    organizationId: string;
    userId: string;
    attemptId: string;
    examSlug?: string;
  }): Promise<PublicExamAttempt | null> {
    const { data, error } = await this.db
      .from("exam_attempts")
      .select("*")
      .eq("organization_id", input.organizationId)
      .eq("user_id", input.userId)
      .eq("id", input.attemptId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    const attempt = data as AttemptRow;
    const metadata = getAttemptMetadata(attempt);
    if (input.examSlug && asString(metadata.examSlug) !== slugify(input.examSlug)) {
      return null;
    }

    return this.toPublicAttempt(attempt, publicStatus(attempt.status) === "submitted");
  }

  async getLatestSubmittedAttempt(input: {
    organizationId: string;
    userId: string;
    examSlug: string;
  }): Promise<PublicExamAttempt | null> {
    const normalizedSlug = slugify(input.examSlug);
    const { data, error } = await this.db
      .from("exam_attempts")
      .select("*")
      .eq("organization_id", input.organizationId)
      .eq("user_id", input.userId)
      .in("status", ["submitted", "auto_submitted", "graded"])
      .is("deleted_at", null)
      .order("submitted_at", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    const attempt = (data as AttemptRow[] | null)?.find(
      (row) => asString(getAttemptMetadata(row).examSlug) === normalizedSlug,
    );

    return attempt ? this.toPublicAttempt(attempt, true) : null;
  }

  async autosaveAttempt(input: {
    organizationId: string;
    userId: string;
    attemptId: string;
    answers?: AttemptAnswers;
    currentQuestionIndex?: number;
    flaggedQuestionIds?: string[];
    expectedVersion?: number;
  }): Promise<PublicExamAttempt> {
    const attempt = await this.getOwnedAttemptRow(input.organizationId, input.userId, input.attemptId);
    if (input.expectedVersion !== undefined && input.expectedVersion !== attempt.row_version) {
      const error = new Error("version_conflict");
      (error as Error & { attempt?: PublicExamAttempt }).attempt = await this.toPublicAttempt(attempt, false);
      throw error;
    }

    const questions = getSnapshotQuestions(attempt);
    const questionById = new Map(questions.map((question) => [question.id, question]));
    const metadata = getAttemptMetadata(attempt);
    const flaggedQuestionIds = input.flaggedQuestionIds ?? ((metadata.flaggedQuestionIds as string[] | undefined) ?? []);

    if (input.answers) {
      for (const [questionId, optionId] of Object.entries(input.answers)) {
        const question = questionById.get(questionId);
        if (!question || !question.options.some((option) => option.id === optionId)) {
          throw new Error("invalid_answer_payload");
        }
      }
    }

    for (const questionId of flaggedQuestionIds) {
      if (!questionById.has(questionId)) {
        throw new Error("invalid_answer_payload");
      }
    }

    const existingAnswers = await this.getAnswers(attempt.id, input.organizationId);
    const existingByQuestion = new Map(existingAnswers.map((answer) => [answer.exam_version_question_id, answer]));
    const answerRows = new Map<string, { optionId: string | null; isFlagged: boolean }>();

    for (const question of questions) {
      const existing = existingByQuestion.get(question.id);
      const existingOption = getSelectedOption(existing?.answer_payload);
      const nextOption = input.answers?.[question.id] ?? existingOption;
      const isFlagged = flaggedQuestionIds.includes(question.id);
      if (nextOption || isFlagged || existing) {
        answerRows.set(question.id, { optionId: nextOption, isFlagged });
      }
    }

    for (const [questionId, row] of answerRows.entries()) {
      await this.db.from("attempt_answers").upsert(
        {
          attempt_id: attempt.id,
          organization_id: input.organizationId,
          exam_version_question_id: questionId,
          user_id: input.userId,
          answer_payload: selectedPayload(row.optionId),
          is_flagged: row.isFlagged,
          answered_at: new Date().toISOString(),
        },
        { onConflict: "attempt_id,exam_version_question_id" },
      );
    }

    const nextMetadata = {
      ...metadata,
      currentQuestionIndex: input.currentQuestionIndex ?? asNumber(metadata.currentQuestionIndex) ?? 0,
      flaggedQuestionIds,
    };

    const { data: updatedAttempt, error } = await this.db
      .from("exam_attempts")
      .update({
        metadata: nextMetadata,
        last_activity_at: new Date().toISOString(),
        autosave_version: attempt.autosave_version + 1,
      })
      .eq("id", attempt.id)
      .eq("organization_id", input.organizationId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return this.toPublicAttempt(updatedAttempt as AttemptRow, false);
  }

  async submitAttempt(input: {
    organizationId: string;
    userId: string;
    attemptId: string;
    idempotencyKey?: string;
  }): Promise<{ attempt: PublicExamAttempt; submittedAlready: boolean; expired: boolean }> {
    const attempt = await this.getOwnedAttemptRow(input.organizationId, input.userId, input.attemptId);
    const alreadySubmitted = publicStatus(attempt.status) === "submitted";
    if (alreadySubmitted) {
      return {
        attempt: await this.toPublicAttempt(attempt, true),
        submittedAlready: true,
        expired: false,
      };
    }

    const now = new Date();
    const expired = Boolean(attempt.expires_at && Date.parse(attempt.expires_at) <= now.getTime());
    const idempotencyKey = input.idempotencyKey?.trim() || `submit:${attempt.id}`;

    const { data: existingSubmission } = await this.db
      .from("attempt_submission_requests")
      .select("id, accepted")
      .eq("attempt_id", attempt.id)
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (existingSubmission?.accepted) {
      return {
        attempt: await this.toPublicAttempt(attempt, true),
        submittedAlready: true,
        expired,
      };
    }

    const requestHash = buildRequestHash({ attemptId: attempt.id, userId: input.userId });
    const { data: submission, error: submissionError } = await this.db
      .from("attempt_submission_requests")
      .insert({
        attempt_id: attempt.id,
        organization_id: input.organizationId,
        user_id: input.userId,
        idempotency_key: idempotencyKey,
        request_hash: requestHash,
        status: "processing",
        accepted: false,
      })
      .select("id")
      .single();

    if (submissionError) {
      throw new Error(submissionError.message);
    }

    const answers = await this.getAnswerMap(attempt);
    const questions = getSnapshotQuestions(attempt);
    const score = scoreFromSnapshot(questions, answers);
    const submittedStatus = expired ? "auto_submitted" : "submitted";
    const passScore = asNumber(getAttemptMetadata(attempt).passScore) ?? 70;

    for (const result of score.questionResults) {
      await this.db
        .from("attempt_answers")
        .update({
          is_final: true,
          score_awarded: result.isCorrect ? questions.find((question) => question.id === result.questionId)?.points ?? 1 : 0,
        })
        .eq("attempt_id", attempt.id)
        .eq("exam_version_question_id", result.questionId);
    }

    const { data: submittedAttempt, error: attemptError } = await this.db
      .from("exam_attempts")
      .update({
        status: submittedStatus,
        submitted_at: now.toISOString(),
        last_activity_at: now.toISOString(),
        final_submission_id: submission.id,
        time_spent_seconds: Math.max(0, Math.round((now.getTime() - toMillis(attempt.started_at)) / 1000)),
      })
      .eq("id", attempt.id)
      .eq("organization_id", input.organizationId)
      .select("*")
      .single();

    if (attemptError) {
      throw new Error(attemptError.message);
    }

    const breakdown = {
      ...buildTopicBreakdown(score),
      result_snapshot: {
        score_source: "exam_attempts.metadata.questionSnapshot",
        total_questions: questions.length,
        correct_answers: score.correctCount,
        raw_score: score.correctCount,
        max_score: Math.max(questions.length, 1),
        percentage: score.percentageScore,
        passed: score.percentageScore >= passScore,
        pass_score: passScore,
        question_results: score.questionResults,
      },
    };
    const { data: resultRow, error: resultError } = await this.db
      .from("attempt_results")
      .insert({
        attempt_id: attempt.id,
        organization_id: input.organizationId,
        user_id: input.userId,
        exam_id: attempt.exam_id,
        exam_version_id: attempt.exam_version_id,
        result_version: 1,
        is_current: true,
        raw_score: score.correctCount,
        max_score: Math.max(questions.length, 1),
        percentage: score.percentageScore,
        passed: score.percentageScore >= passScore,
        breakdown,
        graded_at: now.toISOString(),
      })
      .select("id")
      .single();

    if (resultError && !resultError.message.includes("duplicate")) {
      throw new Error(resultError.message);
    }

    if (resultRow?.id) {
      const sectionScores = new Map<string, { awarded: number; possible: number }>();
      for (const question of questions) {
        const key = question.sectionId ?? "none";
        const section = sectionScores.get(key) ?? { awarded: 0, possible: 0 };
        section.possible += question.points;
        if (answers[question.id] === question.correctOptionId) {
          section.awarded += question.points;
        }
        sectionScores.set(key, section);
      }

      for (const [sectionId, section] of sectionScores.entries()) {
        await this.db.from("result_section_scores").insert({
          attempt_result_id: resultRow.id,
          organization_id: input.organizationId,
          section_id: sectionId === "none" ? null : sectionId,
          points_awarded: section.awarded,
          points_possible: section.possible,
        });
      }

      await this.db.from("user_exam_progress").upsert(
        {
          organization_id: input.organizationId,
          user_id: input.userId,
          exam_id: attempt.exam_id,
          latest_attempt_id: attempt.id,
          latest_result_id: resultRow.id,
          attempts_count: 1,
          best_score: score.percentageScore,
          last_activity_at: now.toISOString(),
        },
        { onConflict: "organization_id,user_id,exam_id" },
      );
    }

    await this.db
      .from("attempt_submission_requests")
      .update({
        status: "accepted",
        accepted: true,
        processed_at: now.toISOString(),
      })
      .eq("id", submission.id);

    return {
      attempt: await this.toPublicAttempt(submittedAttempt as AttemptRow, true),
      submittedAlready: false,
      expired,
    };
  }

  async listAttemptsForOwner(input: { organizationId?: string | null; userId: string }): Promise<PublicExamAttempt[]> {
    let query = this.db
      .from("exam_attempts")
      .select("*")
      .eq("user_id", input.userId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (input.organizationId) {
      query = query.eq("organization_id", input.organizationId);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return Promise.all((data as AttemptRow[] | null ?? []).map((attempt) => this.toPublicAttempt(attempt, publicStatus(attempt.status) === "submitted")));
  }

  private async getOwnedAttemptRow(organizationId: string, userId: string, attemptId: string): Promise<AttemptRow> {
    const { data, error } = await this.db
      .from("exam_attempts")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("user_id", userId)
      .eq("id", attemptId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error("attempt_not_found");
    }

    return data as AttemptRow;
  }

  private async getAnswers(attemptId: string, organizationId: string): Promise<AnswerRow[]> {
    const { data, error } = await this.db
      .from("attempt_answers")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("attempt_id", attemptId)
      .is("deleted_at", null);

    if (error) {
      throw new Error(error.message);
    }

    return (data as AnswerRow[] | null) ?? [];
  }

  private async getAnswerMap(attempt: AttemptRow): Promise<AttemptAnswers> {
    const answerRows = await this.getAnswers(attempt.id, attempt.organization_id);
    const answers: AttemptAnswers = {};
    for (const row of answerRows) {
      const optionId = getSelectedOption(row.answer_payload);
      if (optionId) {
        answers[row.exam_version_question_id] = optionId;
      }
    }
    return answers;
  }

  private async getResult(attemptId: string, organizationId: string): Promise<ResultRow | null> {
    const { data, error } = await this.db
      .from("attempt_results")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("attempt_id", attemptId)
      .eq("is_current", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return (data as ResultRow | null) ?? null;
  }

  private async toPublicAttempt(attempt: AttemptRow, includeReview: boolean): Promise<PublicExamAttempt> {
    const metadata = getAttemptMetadata(attempt);
    const answers = await this.getAnswerMap(attempt);
    const answerRows = await this.getAnswers(attempt.id, attempt.organization_id);
    const flaggedFromAnswers = answerRows
      .filter((answer) => answer.is_flagged)
      .map((answer) => answer.exam_version_question_id);
    const flaggedFromMetadata = Array.isArray(metadata.flaggedQuestionIds)
      ? metadata.flaggedQuestionIds.filter((value): value is string => typeof value === "string")
      : [];
    const flaggedQuestionIds = Array.from(new Set([...flaggedFromMetadata, ...flaggedFromAnswers]));
    const questions = getSnapshotQuestions(attempt);
    const persistedResult = publicStatus(attempt.status) === "submitted"
      ? await this.getResult(attempt.id, attempt.organization_id)
      : null;
    const result = publicStatus(attempt.status) === "submitted"
      ? persistedResult
        ? scoreFromPersistedResult(persistedResult, questions, answers)
        : scoreFromSnapshot(questions, answers)
      : undefined;

    return {
      attemptId: attempt.id,
      organizationId: attempt.organization_id,
      examId: attempt.exam_id,
      examSlug: asString(metadata.examSlug) ?? "",
      mockId: asString(metadata.mockId) ?? attempt.exam_version_id,
      startedAt: toMillis(attempt.started_at ?? attempt.created_at),
      endsAt: toMillis(attempt.expires_at),
      status: publicStatus(attempt.status),
      answers,
      currentQuestionIndex: asNumber(metadata.currentQuestionIndex) ?? 0,
      flaggedQuestionIds,
      version: attempt.row_version,
      updatedAt: toMillis(attempt.updated_at),
      submittedAt: toMillis(attempt.submitted_at ?? undefined),
      score: result,
      reviewQuestions: includeReview ? questions : undefined,
    };
  }
}

let repositoryOverride: AttemptsRepository | null = null;

export function getAttemptsRepository(): AttemptsRepository {
  return repositoryOverride ?? new SupabaseAttemptsRepository(getSupabaseServiceClient());
}

export function setAttemptsRepositoryForTests(repository: AttemptsRepository | null): void {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("setAttemptsRepositoryForTests is only available during tests.");
  }
  repositoryOverride = repository;
}

export const __private__ = {
  slugify,
  scoreFromSnapshot,
};
