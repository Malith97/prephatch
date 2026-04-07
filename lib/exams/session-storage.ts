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

function isStoredAttempt(value: unknown): value is StoredAttempt {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.examId === "string" &&
    typeof value.examSlug === "string" &&
    typeof value.startedAt === "number" &&
    typeof value.endsAt === "number" &&
    (value.status === "in_progress" || value.status === "submitted") &&
    isStringRecord(value.answers) &&
    (value.submittedAt === undefined || typeof value.submittedAt === "number")
  );
}

export function createLocalAttempt(exam: MockExam): StoredAttempt {
  const startedAt = Date.now();

  return {
    examId: exam.id,
    examSlug: exam.slug,
    startedAt,
    endsAt: startedAt + exam.durationMinutes * 60_000,
    status: "in_progress",
    answers: {},
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

    return parsed;
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
    JSON.stringify(attempt),
  );
}

export function clearAttempt(examSlug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(getStorageKey(examSlug));
}
