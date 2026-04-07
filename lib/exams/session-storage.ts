import type { MockExam, StoredAttempt } from "../../server/exams/types";

const STORAGE_PREFIX = "prephatch:local-attempt:";

function getStorageKey(examSlug: string): string {
  return `${STORAGE_PREFIX}${examSlug}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === "string");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isStoredAttempt(value: unknown): value is StoredAttempt {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.attemptId === undefined || typeof value.attemptId === "string") &&
    typeof value.examId === "string" &&
    typeof value.examSlug === "string" &&
    (value.mockId === undefined || typeof value.mockId === "string") &&
    typeof value.startedAt === "number" &&
    typeof value.endsAt === "number" &&
    (value.status === "in_progress" || value.status === "submitted") &&
    isStringRecord(value.answers) &&
    (value.currentQuestionIndex === undefined ||
      typeof value.currentQuestionIndex === "number") &&
    (value.flaggedQuestionIds === undefined ||
      isStringArray(value.flaggedQuestionIds)) &&
    (value.submittedAt === undefined || typeof value.submittedAt === "number")
  );
}

export function buildAttemptId(
  examSlug: string,
  startedAt: number,
  mockId?: string,
): string {
  const stableMockId = (mockId ?? examSlug).replace(/[^a-zA-Z0-9-]/g, "-");

  return `${examSlug}-${stableMockId}-${startedAt}`;
}

export function normalizeStoredAttempt(attempt: StoredAttempt): StoredAttempt {
  return {
    ...attempt,
    attemptId:
      attempt.attemptId ??
      buildAttemptId(attempt.examSlug, attempt.startedAt, attempt.mockId),
    currentQuestionIndex: attempt.currentQuestionIndex ?? 0,
    flaggedQuestionIds: attempt.flaggedQuestionIds ?? [],
  };
}

export function createLocalAttempt(
  exam: MockExam,
  mockId?: string,
): StoredAttempt {
  const startedAt = Date.now();

  return {
    attemptId: buildAttemptId(exam.slug, startedAt, mockId),
    examId: exam.id,
    examSlug: exam.slug,
    mockId,
    startedAt,
    endsAt: startedAt + exam.durationMinutes * 60_000,
    status: "in_progress",
    answers: {},
    currentQuestionIndex: 0,
    flaggedQuestionIds: [],
  };
}

export function readAttempt(examSlug: string): StoredAttempt | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(getStorageKey(examSlug));

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!isStoredAttempt(parsed)) {
      window.sessionStorage.removeItem(getStorageKey(examSlug));
      return null;
    }

    const normalizedAttempt = normalizeStoredAttempt(parsed);

    window.sessionStorage.setItem(
      getStorageKey(examSlug),
      JSON.stringify(normalizedAttempt),
    );

    return normalizedAttempt;
  } catch {
    window.sessionStorage.removeItem(getStorageKey(examSlug));
    return null;
  }
}

export function writeAttempt(attempt: StoredAttempt): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    getStorageKey(attempt.examSlug),
    JSON.stringify(normalizeStoredAttempt(attempt)),
  );
}

export function clearAttempt(examSlug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(getStorageKey(examSlug));
}
