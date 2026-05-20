"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { readAttempt } from "../../../lib/exams/attempt-client";
import type { PublicExamAttempt } from "../../../server/exams/attempt-types";
import type {
  MockExam,
  Question,
  QuestionResult,
  ScorePreview,
} from "../../../server/exams/types";
import { getDefaultLiveMockHref } from "../mock-exam-workspace";
import { AiExplanationPanel } from "./ai-explanation-panel";
import { ExamSectionHeading } from "./exam-section-heading";

type ResultsSummaryProps = {
  exam: MockExam;
  attemptId: string;
};

type ResultsState =
  | {
      attempt: PublicExamAttempt;
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
  attempt: Pick<PublicExamAttempt, "flaggedQuestionIds">,
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
    let cancelled = false;

    async function loadAttempt() {
      try {
        const response = await readAttempt({
          attemptId,
          examSlug: exam.slug,
        });

        if (cancelled) {
          return;
        }

        const fetchedAttempt = response.attempt;
        const isSubmittedAttempt = fetchedAttempt.status === "submitted";
        if (!isSubmittedAttempt || !fetchedAttempt.score) {
          setResultsState(null);
          return;
        }

        setResultsState({
          attempt: fetchedAttempt,
          score: fetchedAttempt.score,
        });
      } catch {
        if (!cancelled) {
          setResultsState(null);
        }
      }
    }

    void loadAttempt();

    return () => {
      cancelled = true;
    };
  }, [attemptId, exam]);

  if (resultsState === undefined) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-4 py-16 sm:px-6 xl:px-8">
        <p role="status" className="text-sm text-text-secondary">
          Loading your submitted attempt...
        </p>
      </main>
    );
  }

  if (resultsState === null) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-6 rounded-[36px] p-8">
          <div className="space-y-2">
            <p className="ph-eyebrow">
              Results unavailable
            </p>
            <h1 className="text-3xl font-semibold text-text-primary">
              No matching submitted attempt was found for this result.
            </h1>
            <p className="text-sm leading-7 text-text-secondary">
              Return to the certification page to start a mock or reopen the
              latest results alias.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={examPageHref}
              className="ph-btn ph-button-primary ph-hover-lift"
            >
              Return to exam page
            </Link>
            <Link
              href={defaultMockHref}
              className="ph-btn ph-button-secondary ph-hover-lift"
            >
              Start this mock
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { attempt, score } = resultsState;
  const reviewExam = attempt.reviewQuestions?.length
    ? { ...exam, questions: attempt.reviewQuestions }
    : exam;
  const readinessState = getReadinessState(score.percentageScore);
  const topicBreakdown = buildTopicBreakdown(reviewExam, score);
  const weakAreas = topicBreakdown.filter((topic) => topic.percentageScore < 80);
  const effectiveWeakAreas =
    weakAreas.length > 0 ? weakAreas.slice(0, 3) : topicBreakdown.slice(0, 1);
  const recommendedActions = buildRecommendedActions(
    effectiveWeakAreas,
    attempt,
    score.unansweredCount,
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 xl:px-8">
      <div className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="ph-surface rounded-[36px] p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href={examPageHref}
                className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
              >
                Return to exam page
              </Link>
              <Link
                href={defaultMockHref}
                className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift"
              >
                Retake mock
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="ph-badge ph-badge-secondary">
                {reviewExam.certificationCode}
              </span>
              <span
                className={`ph-badge ${readinessState.tone}`}
              >
                {readinessState.label}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
                {reviewExam.title} review
              </h1>
              <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                {readinessState.message}
              </p>
              <p className="text-sm leading-7 text-text-secondary/75">
                Submitted at{" "}
                {new Date(
                  attempt.submittedAt ?? attempt.endsAt,
                ).toLocaleString()}.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Score
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {score.percentageScore}%
                </p>
              </div>
              <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Correct
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {score.correctCount}
                </p>
              </div>
              <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Incorrect
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {score.incorrectCount}
                </p>
              </div>
              <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Unanswered
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {score.unansweredCount}
                </p>
              </div>
            </div>
          </section>

          <section className="ph-surface-elevated rounded-[36px] p-6 sm:p-8">
            <ExamSectionHeading
              eyebrow="Readiness message"
              title={readinessState.label}
              description={readinessState.message}
              inverted
            />
            <div className="mt-6 grid gap-4">
              <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">
                  Scaled score preview
                </p>
                <p className="mt-2 text-3xl font-semibold text-text-primary">
                  {score.scaledScorePreview}
                </p>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {score.previewFormulaLabel}
                </p>
              </div>
              <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">
                  Review flags
                </p>
                <p className="mt-2 text-3xl font-semibold text-text-primary">
                  {(attempt.flaggedQuestionIds ?? []).length}
                </p>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  Questions you marked for review during the timed run.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <ExamSectionHeading
            eyebrow="Topic breakdown"
            title="See which topics held up and which ones need another pass."
          />
          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            {topicBreakdown.map((topic) => (
              <article
                key={topic.topicLabel}
                className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="max-w-[16rem] text-base font-semibold text-text-primary">
                    {topic.topicLabel}
                  </h2>
                  <span className="ph-badge ph-badge-neutral">
                    {topic.percentageScore}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-border/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500"
                    style={{ width: `${topic.percentageScore}%` }}
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm leading-6 text-text-secondary">
                  <p>Correct: {topic.correctCount}</p>
                  <p>Incorrect: {topic.incorrectCount}</p>
                  <p>Unanswered: {topic.unansweredCount}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="ph-surface rounded-[36px] p-6 sm:p-8">
            <ExamSectionHeading
              eyebrow="Weak areas"
              title="These are the topics most likely to raise the next score."
            />
            <div className="mt-6 space-y-4">
              {effectiveWeakAreas.map((topic) => (
                <article
                  key={topic.topicLabel}
                  className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-text-primary">
                      {topic.topicLabel}
                    </h2>
                    <span className="ph-badge ph-badge-warning">
                      {topic.percentageScore}% topic score
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {topic.incorrectCount > 0
                      ? "This topic had incorrect answers and should be reviewed before the next timed attempt."
                      : "This topic was left unanswered at least once and needs a cleaner recall pass."}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="ph-surface rounded-[36px] p-6 sm:p-8">
            <ExamSectionHeading
              eyebrow="Recommended next study actions"
              title="Use the review to make the next study block more targeted."
            />
            <div className="mt-6 grid gap-4">
              {recommendedActions.map((action) => (
                <article
                  key={action}
                  className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
                >
                  <p className="text-sm leading-7 text-text-secondary">{action}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <ExamSectionHeading
            eyebrow="Answer review"
            title="Question-by-question review of the submitted attempt."
          />
          <div className="mt-6 space-y-4">
            {reviewExam.questions.map((question, index) => {
              const questionResult = getQuestionResult(score, question.id);
              const wasFlagged = (attempt.flaggedQuestionIds ?? []).includes(question.id);

              return (
                <article
                  key={question.id}
                  className="rounded-[32px] border border-border/70 bg-bg/35 p-6 shadow-subtle"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="ph-badge ph-badge-neutral">
                          Question {index + 1}
                        </span>
                        <span className="ph-badge ph-badge-neutral">
                          {question.topicLabel}
                        </span>
                        {wasFlagged ? (
                          <span className="ph-badge ph-badge-warning">
                            Flagged during exam
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-xl font-semibold text-text-primary">
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
                    <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 px-4 py-4 text-sm leading-7 text-text-secondary">
                      <p className="font-semibold text-text-primary">Your answer</p>
                      <p className="mt-2">
                        {getOptionText(
                          question,
                          questionResult?.selectedOptionId ?? null,
                        )}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 px-4 py-4 text-sm leading-7 text-text-secondary">
                      <p className="font-semibold text-text-primary">
                        Correct answer
                      </p>
                      <p className="mt-2">
                        {getOptionText(question, question.correctOptionId)}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 px-4 py-4 text-sm leading-7 text-text-secondary md:col-span-2">
                      <p className="font-semibold text-text-primary">Explanation</p>
                      <p className="mt-2">{question.explanation}</p>
                      <AiExplanationPanel
                        examSlug={exam.slug}
                        questionId={question.id}
                        selectedOptionId={questionResult?.selectedOptionId ?? null}
                        correctOptionId={question.correctOptionId}
                      />
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
