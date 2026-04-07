"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

import {
  createLocalAttempt,
  normalizeStoredAttempt,
  readAttempt,
  writeAttempt,
} from "../../../lib/exams/session-storage";
import type { MockExam, StoredAttempt } from "../../../server/exams/types";

type ExamSessionProps = {
  exam: MockExam;
  mockId?: string;
  mockTitle?: string;
  backHref?: string;
  resultsHref?: string;
};

function formatRemainingTime(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clampQuestionIndex(index: number, questionCount: number): number {
  return Math.min(Math.max(index, 0), Math.max(questionCount - 1, 0));
}

function normalizeAttempt(
  attempt: StoredAttempt,
  exam: MockExam,
  resolvedMockId: string,
): StoredAttempt {
  return normalizeStoredAttempt({
    ...attempt,
    mockId: attempt.mockId ?? resolvedMockId,
    currentQuestionIndex: clampQuestionIndex(
      attempt.currentQuestionIndex ?? 0,
      exam.questions.length,
    ),
    flaggedQuestionIds: attempt.flaggedQuestionIds ?? [],
  });
}

function getQuestionState(
  attempt: StoredAttempt,
  questionId: string,
  index: number,
): "current" | "answered" | "flagged" | "default" {
  if ((attempt.currentQuestionIndex ?? 0) === index) {
    return "current";
  }

  if (attempt.answers[questionId]) {
    return "answered";
  }

  if ((attempt.flaggedQuestionIds ?? []).includes(questionId)) {
    return "flagged";
  }

  return "default";
}

export function ExamSession({
  exam,
  mockId,
  mockTitle,
  backHref,
  resultsHref,
}: ExamSessionProps) {
  const router = useRouter();
  const resolvedMockId = mockId ?? exam.slug;
  const resolvedMockTitle = mockTitle ?? `${exam.title} Mock`;
  const resolvedBackHref = backHref ?? `/exams/${exam.slug}`;
  const resolvedResultsBaseHref = resultsHref ?? `/exams/${exam.slug}/results`;
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const isSubmittingRef = useRef(false);
  const remainingMs = attempt ? Math.max(0, attempt.endsAt - now) : 0;

  useEffect(() => {
    const storedAttempt = readAttempt(exam.slug);

    if (
      storedAttempt &&
      storedAttempt.examId === exam.id &&
      storedAttempt.status === "in_progress" &&
      (storedAttempt.mockId === resolvedMockId || storedAttempt.mockId === undefined)
    ) {
      const normalizedAttempt = normalizeAttempt(
        storedAttempt,
        exam,
        resolvedMockId,
      );
      writeAttempt(normalizedAttempt);
      setAttempt(normalizedAttempt);
      return;
    }

    const freshAttempt = createLocalAttempt(exam, resolvedMockId);
    writeAttempt(freshAttempt);
    setAttempt(freshAttempt);
  }, [exam, resolvedMockId]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [attempt]);

  function persistAttempt(nextAttempt: StoredAttempt) {
    const normalizedAttempt = normalizeAttempt(nextAttempt, exam, resolvedMockId);
    writeAttempt(normalizedAttempt);
    setAttempt(normalizedAttempt);
  }

  function submitAttempt(
    sourceAttempt: StoredAttempt,
    confirmBeforeSubmit: boolean,
  ) {
    if (isSubmittingRef.current) {
      return;
    }

    if (confirmBeforeSubmit && typeof window !== "undefined") {
      const unansweredCount =
        exam.questions.length - Object.keys(sourceAttempt.answers).length;
      const message =
        unansweredCount > 0
          ? `You still have ${unansweredCount} unanswered question${
              unansweredCount === 1 ? "" : "s"
            }. Submit anyway?`
          : "Submit this mock exam?";

      if (!window.confirm(message)) {
        return;
      }
    }

    isSubmittingRef.current = true;

    const submittedAttempt: StoredAttempt = {
      ...sourceAttempt,
      mockId: sourceAttempt.mockId ?? resolvedMockId,
      status: "submitted",
      submittedAt: Date.now(),
    };

    persistAttempt(submittedAttempt);

    startTransition(() => {
      router.replace(
        `${resolvedResultsBaseHref}/${submittedAttempt.attemptId ?? "latest-local"}`,
      );
    });
  }

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress" || remainingMs > 0) {
      return;
    }

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    const submittedAttempt: StoredAttempt = {
      ...attempt,
      mockId: attempt.mockId ?? resolvedMockId,
      status: "submitted",
      submittedAt: Date.now(),
    };

    persistAttempt(submittedAttempt);

    startTransition(() => {
      router.replace(
        `${resolvedResultsBaseHref}/${submittedAttempt.attemptId ?? "latest-local"}`,
      );
    });
  }, [attempt, remainingMs, resolvedMockId, resolvedResultsBaseHref, router, exam]);

  function handleAnswerChange(questionId: string, optionId: string) {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    const nextAttempt: StoredAttempt = {
      ...attempt,
      answers: {
        ...attempt.answers,
        [questionId]: optionId,
      },
    };

    persistAttempt(nextAttempt);
  }

  function handleQuestionChange(nextIndex: number) {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    persistAttempt({
      ...attempt,
      currentQuestionIndex: clampQuestionIndex(nextIndex, exam.questions.length),
    });
  }

  function handleFlagToggle(questionId: string) {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    const flaggedQuestionIds = attempt.flaggedQuestionIds ?? [];
    const nextFlaggedQuestionIds = flaggedQuestionIds.includes(questionId)
      ? flaggedQuestionIds.filter((id) => id !== questionId)
      : [...flaggedQuestionIds, questionId];

    persistAttempt({
      ...attempt,
      flaggedQuestionIds: nextFlaggedQuestionIds,
    });
  }

  if (!attempt) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16">
        <p className="text-sm text-text-secondary">
          Preparing your local mock exam...
        </p>
      </main>
    );
  }

  const answeredCount = Object.keys(attempt.answers).length;
  const flaggedCount = (attempt.flaggedQuestionIds ?? []).length;
  const currentQuestionIndex = clampQuestionIndex(
    attempt.currentQuestionIndex ?? 0,
    exam.questions.length,
  );
  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = attempt.answers[currentQuestion.id];
  const isCurrentQuestionFlagged = (attempt.flaggedQuestionIds ?? []).includes(
    currentQuestion.id,
  );
  const progressPercentage = Math.round(
    (answeredCount / exam.questions.length) * 100,
  );
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="space-y-5">
        <section className="ph-surface rounded-[32px] p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <Link
                href={resolvedBackHref}
                className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
              >
                Back to exam details
              </Link>
              <div className="space-y-2">
                <p className="ph-eyebrow">
                  {exam.certificationCode}
                </p>
                <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                  {resolvedMockTitle}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-text-secondary">
                  One question at a time, with answer persistence, review flags,
                  and a focused navigation flow. Answers stay local to this
                  browser session.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-border/70 bg-bg/35 px-5 py-4 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Time remaining
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">
                  {formatRemainingTime(remainingMs)}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-bg/35 px-5 py-4 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Answered
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">
                  {answeredCount}/{exam.questions.length}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-bg/35 px-5 py-4 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Flagged
                </p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">
                  {flaggedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-text-secondary">
                Progress indicator
              </p>
              <p className="text-sm font-semibold text-text-primary">
                {progressPercentage}% complete
              </p>
            </div>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-border/70"
              role="progressbar"
              aria-label="Exam progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercentage}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="ph-surface rounded-[32px] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="ph-eyebrow">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {currentAnswer ? (
                    <span className="ph-badge ph-badge-primary">
                      Answer saved
                    </span>
                  ) : (
                    <span className="ph-badge ph-badge-neutral">
                      Unanswered
                    </span>
                  )}
                  {isCurrentQuestionFlagged ? (
                    <span className="ph-badge ph-badge-warning">
                      Flagged for review
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFlagToggle(currentQuestion.id)}
                aria-pressed={isCurrentQuestionFlagged}
                className={`ph-btn ph-btn-sm ${
                  isCurrentQuestionFlagged
                    ? "border border-warning/25 bg-warning/10 text-warning hover:-translate-y-0.5 hover:bg-warning/15"
                    : "ph-button-secondary ph-hover-lift"
                }`}
              >
                {isCurrentQuestionFlagged ? "Unflag question" : "Flag for review"}
              </button>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold leading-9 text-text-primary">
                {currentQuestion.prompt}
              </h2>
            </div>

            <fieldset className="mt-8 space-y-3">
              <legend className="sr-only">Answer options</legend>
              {currentQuestion.options.map((option) => {
                const checked = currentAnswer === option.id;

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer gap-4 rounded-[24px] border px-4 py-4 transition duration-200 ${
                      checked
                        ? "border-primary/35 bg-primary/10 shadow-glow"
                        : "border-border/70 bg-bg/35 hover:border-primary/20 hover:bg-surface-elevated/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.id}
                      checked={checked}
                      onChange={() =>
                        handleAnswerChange(currentQuestion.id, option.id)
                      }
                      className="ph-choice mt-1 h-4 w-4 border-border/80 bg-surface/80"
                    />
                    <span className="text-sm leading-7 text-text-secondary">
                      <span className="mr-2 font-semibold text-text-primary">
                        {option.label}.
                      </span>
                      {option.text}
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isFirstQuestion}
                  onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
                  className="ph-btn ph-button-secondary ph-hover-lift"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={isLastQuestion}
                  onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                  className="ph-btn ph-button-secondary ph-hover-lift"
                >
                  Next
                </button>
              </div>

              <button
                type="button"
                onClick={() => submitAttempt(attempt, true)}
                className="ph-btn ph-button-primary ph-hover-lift"
              >
                Submit exam
              </button>
            </div>
          </section>

          <aside className="ph-surface rounded-[32px] p-6 sm:p-6 xl:sticky xl:top-6 xl:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="ph-eyebrow">
                  Question panel
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Jump between questions, track progress, and revisit flagged
                  items before submitting.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-2">
              <div className="rounded-[24px] border border-border/70 bg-bg/35 px-4 py-3 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Answered
                </p>
                <p className="mt-2 text-lg font-semibold text-text-primary">
                  {answeredCount}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-bg/35 px-4 py-3 shadow-subtle">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Remaining
                </p>
                <p className="mt-2 text-lg font-semibold text-text-primary">
                  {exam.questions.length - answeredCount}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-bg/35 px-4 py-3 shadow-subtle sm:col-span-3 xl:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Flagged
                </p>
                <p className="mt-2 text-lg font-semibold text-text-primary">
                  {flaggedCount}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-6 xl:grid-cols-4">
              {exam.questions.map((question, index) => {
                const questionState = getQuestionState(attempt, question.id, index);
                const questionClasses =
                  questionState === "current"
                    ? "border-primary/25 bg-primary text-text-primary"
                    : questionState === "answered"
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : questionState === "flagged"
                        ? "border-warning/25 bg-warning/10 text-warning"
                        : "border-border/70 bg-surface-elevated/70 text-text-secondary";

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleQuestionChange(index)}
                    aria-current={questionState === "current" ? "step" : undefined}
                    className={`relative inline-flex h-11 items-center justify-center rounded-2xl border text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 ${questionClasses}`}
                    aria-label={`Open question ${index + 1}`}
                  >
                    {index + 1}
                    {(attempt.flaggedQuestionIds ?? []).includes(question.id) ? (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-400" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-3 text-xs uppercase tracking-[0.16em] text-text-secondary/75">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                Current question
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary/80" />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-warning" />
                Flagged
              </div>
            </div>

            <button
              type="button"
              onClick={() => submitAttempt(attempt, true)}
              className="ph-btn ph-button-primary ph-hover-lift mt-6 w-full"
            >
              Submit exam
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
