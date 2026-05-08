"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AttemptApiError,
  autosaveAttempt as autosaveAttemptRequest,
  createAttempt,
  submitAttempt as submitAttemptRequest,
} from "../../../lib/exams/attempt-client";
import type { PublicExamAttempt } from "../../../server/exams/attempt-types";
import type { MockExam } from "../../../server/exams/types";

type ExamSessionProps = {
  exam: MockExam;
  mockId?: string;
  mockTitle?: string;
  backHref?: string;
  resultsHref?: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

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
  attempt: PublicExamAttempt,
  exam: MockExam,
  resolvedMockId: string,
): PublicExamAttempt {
  return {
    ...attempt,
    mockId: attempt.mockId || resolvedMockId,
    currentQuestionIndex: clampQuestionIndex(
      attempt.currentQuestionIndex ?? 0,
      exam.questions.length,
    ),
    flaggedQuestionIds: attempt.flaggedQuestionIds ?? [],
    answers: attempt.answers ?? {},
  };
}

function getQuestionState(
  attempt: PublicExamAttempt,
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

function buildAttemptErrorMessage(error: unknown): string {
  if (error instanceof AttemptApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected network error while syncing attempt.";
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

  const [attempt, setAttempt] = useState<PublicExamAttempt | null>(null);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const latestAttemptRef = useRef<PublicExamAttempt | null>(null);
  const serverVersionRef = useRef<number>(0);
  const pendingSaveRef = useRef(false);
  const inFlightSaveRef = useRef(false);
  const saveTimerRef = useRef<number | null>(null);
  const editRevisionRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    latestAttemptRef.current = attempt;
  }, [attempt]);

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeAttempt() {
      setIsInitializing(true);
      setInitializationError(null);

      try {
        const response = await createAttempt({
          examSlug: exam.slug,
          mockId: resolvedMockId,
        });

        if (cancelled || isUnmountedRef.current) {
          return;
        }

        const normalizedAttempt = normalizeAttempt(
          response.attempt,
          exam,
          resolvedMockId,
        );
        console.info("[exam-runtime] attempt_initialized", {
          attemptId: normalizedAttempt.attemptId,
          examSlug: exam.slug,
          mockId: resolvedMockId,
        });
        latestAttemptRef.current = normalizedAttempt;
        serverVersionRef.current = normalizedAttempt.version;
        setAttempt(normalizedAttempt);
      } catch (error) {
        if (cancelled || isUnmountedRef.current) {
          return;
        }

        setInitializationError(buildAttemptErrorMessage(error));
        console.error("[exam-runtime] attempt_initialization_failed", {
          examSlug: exam.slug,
          mockId: resolvedMockId,
          error: buildAttemptErrorMessage(error),
        });
      } finally {
        if (!cancelled && !isUnmountedRef.current) {
          setIsInitializing(false);
        }
      }
    }

    void initializeAttempt();

    return () => {
      cancelled = true;
    };
  }, [exam, resolvedMockId]);

  const flushAutosave = useCallback(async () => {
    if (inFlightSaveRef.current || isSubmittingRef.current) {
      return;
    }

    const snapshot = latestAttemptRef.current;
    if (!snapshot || snapshot.status !== "in_progress" || !pendingSaveRef.current) {
      return;
    }

    inFlightSaveRef.current = true;
    pendingSaveRef.current = false;
    const sendingRevision = editRevisionRef.current;
    const expectedVersion = serverVersionRef.current;

    try {
      const response = await autosaveAttemptRequest({
        attemptId: snapshot.attemptId,
        answers: snapshot.answers,
        currentQuestionIndex: snapshot.currentQuestionIndex,
        flaggedQuestionIds: snapshot.flaggedQuestionIds,
        expectedVersion,
      });

      serverVersionRef.current = response.attempt.version;

      if (isUnmountedRef.current) {
        return;
      }

      if (editRevisionRef.current === sendingRevision) {
        const normalized = normalizeAttempt(response.attempt, exam, resolvedMockId);
        latestAttemptRef.current = normalized;
        setAttempt(normalized);
      } else {
        setAttempt((previousAttempt) => {
          if (!previousAttempt) {
            return previousAttempt;
          }

          const mergedAttempt = {
            ...previousAttempt,
            version: response.attempt.version,
            updatedAt: response.attempt.updatedAt,
            endsAt: response.attempt.endsAt,
          };
          latestAttemptRef.current = mergedAttempt;
          return mergedAttempt;
        });
        pendingSaveRef.current = true;
      }

      setSaveStatus("saved");
      setSaveError(null);
      console.info("[exam-runtime] attempt_autosaved", {
        attemptId: response.attempt.attemptId,
        version: response.attempt.version,
      });
    } catch (error) {
      if (isUnmountedRef.current) {
        return;
      }

      if (error instanceof AttemptApiError && error.attempt) {
        const normalized = normalizeAttempt(error.attempt, exam, resolvedMockId);
        latestAttemptRef.current = normalized;
        serverVersionRef.current = normalized.version;
        setAttempt(normalized);
      }

      if (
        error instanceof AttemptApiError &&
        (error.code === "version_conflict" || error.code === "attempt_expired")
      ) {
        setSaveError(error.message);
      } else {
        setSaveError(buildAttemptErrorMessage(error));
      }

      setSaveStatus("error");
      console.error("[exam-runtime] attempt_autosave_failed", {
        error: buildAttemptErrorMessage(error),
      });
    } finally {
      inFlightSaveRef.current = false;
      if (pendingSaveRef.current && !isUnmountedRef.current) {
        if (saveTimerRef.current) {
          window.clearTimeout(saveTimerRef.current);
        }
        saveTimerRef.current = window.setTimeout(() => {
          void flushAutosave();
        }, 60);
      }
    }
  }, [exam, resolvedMockId]);

  const scheduleAutosave = useCallback(() => {
    if (isSubmittingRef.current || !latestAttemptRef.current) {
      return;
    }

    pendingSaveRef.current = true;
    setSaveStatus("saving");
    setSaveError(null);

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      void flushAutosave();
    }, 300);
  }, [flushAutosave]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [attempt]);

  const remainingMs = attempt ? Math.max(0, attempt.endsAt - now) : 0;

  const submitAttempt = useCallback(
    async (confirmBeforeSubmit: boolean) => {
      const currentAttempt = latestAttemptRef.current;
      if (!currentAttempt || currentAttempt.status !== "in_progress") {
        return;
      }

      if (isSubmittingRef.current) {
        return;
      }

      if (confirmBeforeSubmit && typeof window !== "undefined") {
        const unansweredCount =
          exam.questions.length - Object.keys(currentAttempt.answers).length;
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
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }

      try {
        pendingSaveRef.current = true;
        await flushAutosave();
        const freshAttempt = latestAttemptRef.current;
        if (!freshAttempt) {
          return;
        }

        const response = await submitAttemptRequest({
          attemptId: freshAttempt.attemptId,
          idempotencyKey: `submit:${freshAttempt.attemptId}`,
        });
        const normalized = normalizeAttempt(response.attempt, exam, resolvedMockId);
        latestAttemptRef.current = normalized;
        setAttempt(normalized);
        setSaveStatus("idle");
        setSaveError(null);
        console.info("[exam-runtime] attempt_submitted", {
          attemptId: normalized.attemptId,
          score: normalized.score,
        });

        startTransition(() => {
          router.replace(`${resolvedResultsBaseHref}/${normalized.attemptId}`);
        });
      } catch (error) {
        if (error instanceof AttemptApiError && error.attempt) {
          const normalized = normalizeAttempt(error.attempt, exam, resolvedMockId);
          latestAttemptRef.current = normalized;
          setAttempt(normalized);
          if (normalized.status === "submitted") {
            startTransition(() => {
              router.replace(`${resolvedResultsBaseHref}/${normalized.attemptId}`);
            });
            return;
          }
        }

        setSaveStatus("error");
        setSaveError(buildAttemptErrorMessage(error));
        console.error("[exam-runtime] attempt_submit_failed", {
          error: buildAttemptErrorMessage(error),
        });
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [exam, flushAutosave, resolvedMockId, resolvedResultsBaseHref, router],
  );

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress" || remainingMs > 0) {
      return;
    }

    void submitAttempt(false);
  }, [attempt, remainingMs, submitAttempt]);

  const handleAnswerChange = useCallback(
    (questionId: string, optionId: string) => {
      const currentAttempt = latestAttemptRef.current;
      if (!currentAttempt || currentAttempt.status !== "in_progress") {
        return;
      }

      const nextAttempt = {
        ...currentAttempt,
        answers: {
          ...currentAttempt.answers,
          [questionId]: optionId,
        },
      };

      editRevisionRef.current += 1;
      latestAttemptRef.current = nextAttempt;
      setAttempt(nextAttempt);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const handleQuestionChange = useCallback(
    (nextIndex: number) => {
      const currentAttempt = latestAttemptRef.current;
      if (!currentAttempt || currentAttempt.status !== "in_progress") {
        return;
      }

      const nextAttempt = {
        ...currentAttempt,
        currentQuestionIndex: clampQuestionIndex(nextIndex, exam.questions.length),
      };

      editRevisionRef.current += 1;
      latestAttemptRef.current = nextAttempt;
      setAttempt(nextAttempt);
      scheduleAutosave();
    },
    [exam.questions.length, scheduleAutosave],
  );

  const handleFlagToggle = useCallback(
    (questionId: string) => {
      const currentAttempt = latestAttemptRef.current;
      if (!currentAttempt || currentAttempt.status !== "in_progress") {
        return;
      }

      const flaggedQuestionIds = currentAttempt.flaggedQuestionIds ?? [];
      const nextFlaggedQuestionIds = flaggedQuestionIds.includes(questionId)
        ? flaggedQuestionIds.filter((id) => id !== questionId)
        : [...flaggedQuestionIds, questionId];

      const nextAttempt = {
        ...currentAttempt,
        flaggedQuestionIds: nextFlaggedQuestionIds,
      };

      editRevisionRef.current += 1;
      latestAttemptRef.current = nextAttempt;
      setAttempt(nextAttempt);
      scheduleAutosave();
    },
    [scheduleAutosave],
  );

  const saveStateLabel = useMemo(() => {
    if (saveStatus === "saving") {
      return "Saving...";
    }
    if (saveStatus === "saved") {
      return "Saved";
    }
    if (saveStatus === "error") {
      return "Save failed";
    }
    return "Idle";
  }, [saveStatus]);

  if (isInitializing) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-4 py-16 sm:px-6 xl:px-8">
        <p className="text-sm text-text-secondary">
          Preparing your server-backed mock exam...
        </p>
      </main>
    );
  }

  if (initializationError || !attempt) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-4 rounded-3xl p-8">
          <p className="ph-eyebrow">Unable to start mock attempt</p>
          <h1 className="text-3xl font-semibold text-text-primary">
            Attempt initialization failed.
          </h1>
          <p className="text-sm leading-7 text-text-secondary">
            {initializationError ?? "Unable to create an attempt right now."}
          </p>
          <Link
            href={resolvedBackHref}
            className="ph-btn ph-button-primary ph-hover-lift"
          >
            Back to exam details
          </Link>
        </div>
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
    <main className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 xl:px-8">
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
                <p className="ph-eyebrow">{exam.certificationCode}</p>
                <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                  {resolvedMockTitle}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-text-secondary">
                  One question at a time, with server-backed save, review flags, and
                  a focused navigation flow.
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/75">
                  Save status: {saveStateLabel}
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

          {saveError ? (
            <p
              role="alert"
              className="mt-4 rounded-2xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm text-warning"
            >
              {saveError}
            </p>
          ) : null}

          <div className="mt-6 rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-text-secondary">Progress indicator</p>
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
                    <span className="ph-badge ph-badge-primary">Answer saved</span>
                  ) : (
                    <span className="ph-badge ph-badge-neutral">Unanswered</span>
                  )}
                  {isCurrentQuestionFlagged ? (
                    <span className="ph-badge ph-badge-warning">Flagged for review</span>
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
                      onChange={() => handleAnswerChange(currentQuestion.id, option.id)}
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

            <div className="mt-8 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={isFirstQuestion}
                onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
                className="ph-btn ph-button-secondary ph-hover-lift w-full sm:w-auto"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={isLastQuestion}
                onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                className="ph-btn ph-button-secondary ph-hover-lift w-full sm:ml-auto sm:w-auto"
              >
                Next
              </button>
            </div>
          </section>

          <aside className="ph-surface rounded-[32px] p-6 sm:p-6 xl:sticky xl:top-6 xl:self-start">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="ph-eyebrow">Question panel</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Jump between questions, track progress, and revisit flagged items
                  before submitting.
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
              onClick={() => void submitAttempt(true)}
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
