"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { readAttempt } from "../../../lib/exams/session-storage";
import { scoreAttempt } from "../../../server/exams/scoring";
import type {
  MockExam,
  Question,
  QuestionResult,
  ScorePreview,
  StoredAttempt,
} from "../../../server/exams/types";
import { getDefaultLiveMockHref } from "../mock-exam-workspace";
import { ExamSectionHeading } from "./exam-section-heading";

type ResultsSummaryProps = {
  exam: MockExam;
  attemptId: string;
};

type ResultsState =
  | {
      attempt: StoredAttempt;
      score: ScorePreview;
    }
  | null
  | undefined;

type TopicBreakdown = {
  topicLabel: string;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalQuestions: number;
  percentageScore: number;
};

function getOptionText(question: Question, optionId: string | null): string {
  if (!optionId) {
    return "No answer selected";
  }

  return (
    question.options.find((option) => option.id === optionId)?.text ??
    "Saved answer is no longer valid"
  );
}

function getQuestionResult(
  score: ScorePreview,
  questionId: string,
): QuestionResult | undefined {
  return score.questionResults.find((result) => result.questionId === questionId);
}

function buildTopicBreakdown(
  exam: MockExam,
  score: ScorePreview,
): TopicBreakdown[] {
  const breakdownMap = new Map<string, Omit<TopicBreakdown, "percentageScore">>();

  exam.questions.forEach((question) => {
    const questionResult = getQuestionResult(score, question.id);
    const existingBreakdown = breakdownMap.get(question.topicLabel) ?? {
      topicLabel: question.topicLabel,
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: 0,
      totalQuestions: 0,
    };

    existingBreakdown.totalQuestions += 1;

    if (questionResult?.isCorrect) {
      existingBreakdown.correctCount += 1;
    } else if (questionResult?.selectedOptionId === null) {
      existingBreakdown.unansweredCount += 1;
    } else {
      existingBreakdown.incorrectCount += 1;
    }

    breakdownMap.set(question.topicLabel, existingBreakdown);
  });

  return Array.from(breakdownMap.values())
    .map((topic) => ({
      ...topic,
      percentageScore: Math.round((topic.correctCount / topic.totalQuestions) * 100),
    }))
    .sort((left, right) => left.percentageScore - right.percentageScore);
}

function getReadinessState(percentageScore: number) {
  if (percentageScore >= 80) {
    return {
      label: "Ready",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
      message:
        "This is a strong readiness signal. Keep reinforcing your weaker topics, but you are trending in the right direction.",
    };
  }

  if (percentageScore >= 70) {
    return {
      label: "Borderline",
      tone: "border-amber-200 bg-amber-50 text-amber-800",
      message:
        "You are close. A focused review on the weakest topics should improve confidence before the next timed attempt.",
    };
  }

  return {
    label: "Not ready",
    tone: "border-rose-200 bg-rose-50 text-rose-800",
    message:
      "Treat this as a study signal rather than a setback. Use the review below to fix weak topics before retaking the mock.",
  };
}

function buildRecommendedActions(
  weakAreas: TopicBreakdown[],
  attempt: StoredAttempt,
  unansweredCount: number,
): string[] {
  const actions: string[] = [];
  const flaggedCount = (attempt.flaggedQuestionIds ?? []).length;

  if (weakAreas[0]) {
    actions.push(
      `Review ${weakAreas[0].topicLabel.toLowerCase()} first and replay the related answer explanations before your next timed run.`,
    );
  }

  if (weakAreas[1]) {
    actions.push(
      `Create a short note or cheatsheet entry for ${weakAreas[1].topicLabel.toLowerCase()} so the default pattern is easier to recall under pressure.`,
    );
  }

  if (unansweredCount > 0) {
    actions.push(
      `Retake the mock and aim to answer every question. You left ${unansweredCount} unanswered this time.`,
    );
  } else if (flaggedCount > 0) {
    actions.push(
      `Return to the ${flaggedCount} flagged question${
        flaggedCount === 1 ? "" : "s"
      } and make sure you understand why the correct option wins.`,
    );
  } else {
    actions.push(
      "Retake the mock under the same timed conditions to confirm the score holds when you move faster.",
    );
  }

  return actions.slice(0, 3);
}

export function ResultsSummary({ exam, attemptId }: ResultsSummaryProps) {
  const [resultsState, setResultsState] = useState<ResultsState>(undefined);
  const defaultMockHref = getDefaultLiveMockHref(exam.slug);
  const examPageHref = `/exams/${exam.slug}`;

  useEffect(() => {
    const storedAttempt = readAttempt(exam.slug);

    const attemptMatches =
      storedAttempt &&
      storedAttempt.examId === exam.id &&
      storedAttempt.status === "submitted" &&
      (attemptId === "latest-local" || storedAttempt.attemptId === attemptId);

    if (!storedAttempt || !attemptMatches) {
      setResultsState(null);
      return;
    }

    setResultsState({
      attempt: storedAttempt,
      score: scoreAttempt(exam, storedAttempt.answers),
    });
  }, [attemptId, exam]);

  if (resultsState === undefined) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16">
        <p role="status" className="text-sm text-slate-600">
          Loading your local review...
        </p>
      </main>
    );
  }

  if (resultsState === null) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="space-y-6 rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Results unavailable
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              No matching local attempt was found for this result.
            </h1>
            <p className="text-sm leading-7 text-slate-600">
              Return to the certification page to start a mock or reopen the
              latest local results alias.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={examPageHref}
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
              Return to exam page
            </Link>
            <Link
              href={defaultMockHref}
              className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
            >
              Start this mock
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { attempt, score } = resultsState;
  const readinessState = getReadinessState(score.percentageScore);
  const topicBreakdown = buildTopicBreakdown(exam, score);
  const weakAreas = topicBreakdown.filter((topic) => topic.percentageScore < 80);
  const effectiveWeakAreas =
    weakAreas.length > 0 ? weakAreas.slice(0, 3) : topicBreakdown.slice(0, 1);
  const recommendedActions = buildRecommendedActions(
    effectiveWeakAreas,
    attempt,
    score.unansweredCount,
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href={examPageHref}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
              >
                Return to exam page
              </Link>
              <Link
                href={defaultMockHref}
                className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
              >
                Retake mock
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                {exam.certificationCode}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${readinessState.tone}`}
              >
                {readinessState.label}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                {exam.title} review
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {readinessState.message}
              </p>
              <p className="text-sm leading-7 text-slate-500">
                Submitted locally at{" "}
                {new Date(
                  attempt.submittedAt ?? attempt.endsAt,
                ).toLocaleString()}.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Score
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {score.percentageScore}%
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Correct
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {score.correctCount}
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Incorrect
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {score.incorrectCount}
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Unanswered
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {score.unansweredCount}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[36px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-8">
            <ExamSectionHeading
              eyebrow="Readiness message"
              title={readinessState.label}
              description={readinessState.message}
              inverted
            />
            <div className="mt-6 grid gap-4">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Scaled score preview
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {score.scaledScorePreview}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {score.previewFormulaLabel}
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Review flags
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {(attempt.flaggedQuestionIds ?? []).length}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Questions you marked for review during the timed run.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <ExamSectionHeading
            eyebrow="Topic breakdown"
            title="See which topics held up and which ones need another pass."
          />
          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            {topicBreakdown.map((topic) => (
              <article
                key={topic.topicLabel}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="max-w-[16rem] text-base font-semibold text-slate-950">
                    {topic.topicLabel}
                  </h2>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                    {topic.percentageScore}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500"
                    style={{ width: `${topic.percentageScore}%` }}
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                  <p>Correct: {topic.correctCount}</p>
                  <p>Incorrect: {topic.incorrectCount}</p>
                  <p>Unanswered: {topic.unansweredCount}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
            <ExamSectionHeading
              eyebrow="Weak areas"
              title="These are the topics most likely to raise the next score."
            />
            <div className="mt-6 space-y-4">
              {effectiveWeakAreas.map((topic) => (
                <article
                  key={topic.topicLabel}
                  className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-950">
                      {topic.topicLabel}
                    </h2>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                      {topic.percentageScore}% topic score
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {topic.incorrectCount > 0
                      ? "This topic had incorrect answers and should be reviewed before the next timed attempt."
                      : "This topic was left unanswered at least once and needs a cleaner recall pass."}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
            <ExamSectionHeading
              eyebrow="Recommended next study actions"
              title="Use the review to make the next study block more targeted."
            />
            <div className="mt-6 grid gap-4">
              {recommendedActions.map((action) => (
                <article
                  key={action}
                  className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
                >
                  <p className="text-sm leading-7 text-slate-700">{action}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <ExamSectionHeading
            eyebrow="Answer review"
            title="Question-by-question review of the submitted attempt."
          />
          <div className="mt-6 space-y-4">
            {exam.questions.map((question, index) => {
              const questionResult = getQuestionResult(score, question.id);
              const wasFlagged = (attempt.flaggedQuestionIds ?? []).includes(question.id);

              return (
                <article
                  key={question.id}
                  className="rounded-[32px] border border-slate-200/80 bg-slate-50/90 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                          Question {index + 1}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                          {question.topicLabel}
                        </span>
                        {wasFlagged ? (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                            Flagged during exam
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-xl font-semibold text-slate-950">
                        {question.prompt}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        questionResult?.isCorrect
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                          : "border border-amber-200 bg-amber-50 text-amber-800"
                      }`}
                    >
                      {questionResult?.isCorrect ? "Correct" : "Review"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
                      <p className="font-semibold text-slate-950">Your answer</p>
                      <p className="mt-2">
                        {getOptionText(
                          question,
                          questionResult?.selectedOptionId ?? null,
                        )}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 text-sm leading-7 text-slate-700">
                      <p className="font-semibold text-slate-950">
                        Correct answer
                      </p>
                      <p className="mt-2">
                        {getOptionText(question, question.correctOptionId)}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 text-sm leading-7 text-slate-700 md:col-span-2">
                      <p className="font-semibold text-slate-950">Explanation</p>
                      <p className="mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
