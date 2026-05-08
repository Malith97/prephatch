import { SCORE_PREVIEW_LABEL } from "./scoring";
import { getExamBySlug } from "./mock-repository";
import type {
  AutosaveAttemptRequest,
  AutosaveAttemptResponse,
  AttemptScore,
  CreateAttemptRequest,
  CreateAttemptResponse,
  ExamAttemptRecord,
  PublicExamAttempt,
  SubmitAttemptRequest,
  SubmitAttemptResponse,
} from "./attempt-types";

type ServiceErrorCode =
  | "invalid_payload"
  | "exam_not_found"
  | "attempt_not_found"
  | "unauthorized"
  | "attempt_already_submitted"
  | "attempt_expired"
  | "version_conflict"
  | "invalid_answer_payload";

type ServiceError = {
  ok: false;
  code: ServiceErrorCode;
  status: number;
  message: string;
  attempt?: PublicExamAttempt;
};

type ServiceSuccess<T> = {
  ok: true;
  value: T;
};

type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

const attemptsById = new Map<string, ExamAttemptRecord>();
const activeAttemptByOwnerAndExam = new Map<string, string>();
const latestSubmittedByOwnerAndExam = new Map<string, string>();
const creationIdempotencyByOwner = new Map<string, string>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toPublicAttempt(attempt: ExamAttemptRecord): PublicExamAttempt {
  return {
    attemptId: attempt.attemptId,
    examId: attempt.examId,
    examSlug: attempt.examSlug,
    mockId: attempt.mockId,
    startedAt: attempt.startedAt,
    endsAt: attempt.endsAt,
    status: attempt.status,
    answers: clone(attempt.answers),
    currentQuestionIndex: attempt.currentQuestionIndex,
    flaggedQuestionIds: [...attempt.flaggedQuestionIds],
    version: attempt.version,
    updatedAt: attempt.updatedAt,
    submittedAt: attempt.submittedAt,
    score: attempt.score ? clone(attempt.score) : undefined,
  };
}

function activeAttemptKey(
  ownerUserId: string,
  examSlug: string,
  mockId: string,
): string {
  return `${ownerUserId}:${examSlug}:${mockId}`;
}

function ownerExamKey(ownerUserId: string, examSlug: string): string {
  return `${ownerUserId}:${examSlug}`;
}

function creationIdempotencyKey(
  ownerUserId: string,
  examSlug: string,
  mockId: string,
  idempotencyKey: string,
): string {
  return `${ownerUserId}:${examSlug}:${mockId}:${idempotencyKey}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function buildAttemptScore(attempt: ExamAttemptRecord): AttemptScore {
  const questionResults = attempt.questionSnapshot.map((question) => {
    const selectedOptionId = attempt.answers[question.questionId] ?? null;
    return {
      questionId: question.questionId,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
    };
  });

  const correctCount = questionResults.filter((result) => result.isCorrect).length;
  const unansweredCount = questionResults.filter(
    (result) => result.selectedOptionId === null,
  ).length;
  const incorrectCount = questionResults.length - correctCount - unansweredCount;
  const percentageScore = Number(
    ((correctCount / attempt.questionSnapshot.length) * 100).toFixed(2),
  );
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

function markSubmitted(attempt: ExamAttemptRecord, submittedAt: number): void {
  attempt.score = buildAttemptScore(attempt);
  attempt.status = "submitted";
  attempt.submittedAt = submittedAt;
  attempt.updatedAt = submittedAt;
  attempt.version += 1;

  activeAttemptByOwnerAndExam.delete(
    activeAttemptKey(attempt.ownerUserId, attempt.examSlug, attempt.mockId),
  );
  latestSubmittedByOwnerAndExam.set(
    ownerExamKey(attempt.ownerUserId, attempt.examSlug),
    attempt.attemptId,
  );
}

function validateAnswersPayload(
  attempt: ExamAttemptRecord,
  answers: Record<string, string>,
): boolean {
  const exam = getExamBySlug(attempt.examSlug);
  if (!exam) {
    return false;
  }

  const questionById = new Map(exam.questions.map((question) => [question.id, question]));
  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = questionById.get(questionId);
    if (!question) {
      return false;
    }

    const optionExists = question.options.some((option) => option.id === optionId);
    if (!optionExists) {
      return false;
    }
  }

  return true;
}

function validateFlaggedQuestions(
  attempt: ExamAttemptRecord,
  flaggedQuestionIds: string[],
): boolean {
  const questionIds = new Set(
    attempt.questionSnapshot.map((question) => question.questionId),
  );
  return flaggedQuestionIds.every((questionId) => questionIds.has(questionId));
}

function getAttemptForOwner(
  attemptId: string,
  ownerUserId: string,
): ServiceResult<ExamAttemptRecord> {
  const attempt = attemptsById.get(attemptId);
  if (!attempt) {
    return {
      ok: false,
      code: "attempt_not_found",
      status: 404,
      message: "Attempt not found.",
    };
  }

  if (attempt.ownerUserId !== ownerUserId) {
    return {
      ok: false,
      code: "unauthorized",
      status: 403,
      message: "You do not have access to this attempt.",
    };
  }

  return {
    ok: true,
    value: attempt,
  };
}

export function createOrResumeAttempt(
  ownerUserId: string,
  payload: CreateAttemptRequest,
): ServiceResult<CreateAttemptResponse> {
  if (!payload || typeof payload.examSlug !== "string" || !payload.examSlug.trim()) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "examSlug is required.",
    };
  }

  if (payload.mockId !== undefined && typeof payload.mockId !== "string") {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "mockId must be a string when provided.",
    };
  }

  if (
    payload.idempotencyKey !== undefined &&
    typeof payload.idempotencyKey !== "string"
  ) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "idempotencyKey must be a string when provided.",
    };
  }

  const examSlug = payload.examSlug.trim();

  const exam = getExamBySlug(examSlug);
  if (!exam) {
    return {
      ok: false,
      code: "exam_not_found",
      status: 404,
      message: "Exam was not found.",
    };
  }

  const mockId = (payload.mockId ?? exam.slug).trim();
  if (!mockId) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "mockId must be a non-empty string when provided.",
    };
  }

  const normalizedIdempotencyKey = payload.idempotencyKey?.trim();
  if (normalizedIdempotencyKey) {
    const attemptId = creationIdempotencyByOwner.get(
      creationIdempotencyKey(
        ownerUserId,
        exam.slug,
        mockId,
        normalizedIdempotencyKey,
      ),
    );
    if (attemptId) {
      const existingAttempt = attemptsById.get(attemptId);
      if (existingAttempt) {
        return {
          ok: true,
          value: {
            attempt: toPublicAttempt(existingAttempt),
            resumed: true,
          },
        };
      }
    }
  }

  const activeKey = activeAttemptKey(ownerUserId, exam.slug, mockId);
  const activeAttemptId = activeAttemptByOwnerAndExam.get(activeKey);
  if (activeAttemptId) {
    const activeAttempt = attemptsById.get(activeAttemptId);
    if (activeAttempt && activeAttempt.status === "in_progress") {
      return {
        ok: true,
        value: {
          attempt: toPublicAttempt(activeAttempt),
          resumed: true,
        },
      };
    }
  }

  const now = Date.now();
  const attemptId = crypto.randomUUID();
  const createdAttempt: ExamAttemptRecord = {
    attemptId,
    ownerUserId,
    examId: exam.id,
    examSlug: exam.slug,
    mockId,
    startedAt: now,
    endsAt: now + exam.durationMinutes * 60_000,
    status: "in_progress",
    answers: {},
    currentQuestionIndex: 0,
    flaggedQuestionIds: [],
    version: 1,
    createdAt: now,
    updatedAt: now,
    questionSnapshot: exam.questions.map((question) => ({
      questionId: question.id,
      topicLabel: question.topicLabel,
      correctOptionId: question.correctOptionId,
    })),
    submitIdempotency: {},
  };

  attemptsById.set(createdAttempt.attemptId, createdAttempt);
  activeAttemptByOwnerAndExam.set(activeKey, createdAttempt.attemptId);

  if (normalizedIdempotencyKey) {
    creationIdempotencyByOwner.set(
      creationIdempotencyKey(
        ownerUserId,
        exam.slug,
        mockId,
        normalizedIdempotencyKey,
      ),
      createdAttempt.attemptId,
    );
  }

  return {
    ok: true,
    value: {
      attempt: toPublicAttempt(createdAttempt),
      resumed: false,
    },
  };
}

export function autosaveAttempt(
  ownerUserId: string,
  attemptId: string,
  payload: AutosaveAttemptRequest,
): ServiceResult<AutosaveAttemptResponse> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "Payload must be a JSON object.",
    };
  }

  const attemptResult = getAttemptForOwner(attemptId, ownerUserId);
  if (!attemptResult.ok) {
    return attemptResult;
  }

  const attempt = attemptResult.value;
  if (attempt.status !== "in_progress") {
    return {
      ok: false,
      code: "attempt_already_submitted",
      status: 409,
      message: "Attempt is already submitted.",
      attempt: toPublicAttempt(attempt),
    };
  }

  const now = Date.now();
  if (now > attempt.endsAt) {
    markSubmitted(attempt, now);
    console.info(
      `[attempt-runtime] event=auto_submit attemptId=${attempt.attemptId} owner=${ownerUserId} reason=expired_at_autosave`,
    );
    return {
      ok: false,
      code: "attempt_expired",
      status: 409,
      message: "Attempt has expired and was auto-submitted.",
      attempt: toPublicAttempt(attempt),
    };
  }

  if (
    payload.expectedVersion !== undefined &&
    payload.expectedVersion !== attempt.version
  ) {
    return {
      ok: false,
      code: "version_conflict",
      status: 409,
      message: "Attempt state changed in another tab. Refresh state and retry.",
      attempt: toPublicAttempt(attempt),
    };
  }

  if (payload.answers !== undefined) {
    if (!isStringRecord(payload.answers)) {
      return {
        ok: false,
        code: "invalid_payload",
        status: 400,
        message: "answers must be an object of questionId to optionId.",
      };
    }

    if (!validateAnswersPayload(attempt, payload.answers)) {
      return {
        ok: false,
        code: "invalid_answer_payload",
        status: 400,
        message: "Answers payload contains invalid question or option values.",
      };
    }

    attempt.answers = {
      ...attempt.answers,
      ...payload.answers,
    };
  }

  if (payload.currentQuestionIndex !== undefined) {
    if (
      !Number.isInteger(payload.currentQuestionIndex) ||
      payload.currentQuestionIndex < 0
    ) {
      return {
        ok: false,
        code: "invalid_payload",
        status: 400,
        message: "currentQuestionIndex must be a non-negative integer.",
      };
    }

    attempt.currentQuestionIndex = payload.currentQuestionIndex;
  }

  if (payload.flaggedQuestionIds !== undefined) {
    if (!isStringArray(payload.flaggedQuestionIds)) {
      return {
        ok: false,
        code: "invalid_payload",
        status: 400,
        message: "flaggedQuestionIds must be an array of question IDs.",
      };
    }

    if (!validateFlaggedQuestions(attempt, payload.flaggedQuestionIds)) {
      return {
        ok: false,
        code: "invalid_answer_payload",
        status: 400,
        message: "flaggedQuestionIds contains invalid question values.",
      };
    }

    attempt.flaggedQuestionIds = [...payload.flaggedQuestionIds];
  }

  attempt.updatedAt = now;
  attempt.version += 1;

  return {
    ok: true,
    value: {
      attempt: toPublicAttempt(attempt),
    },
  };
}

export function submitAttempt(
  ownerUserId: string,
  attemptId: string,
  payload: SubmitAttemptRequest,
): ServiceResult<SubmitAttemptResponse> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "Payload must be a JSON object.",
    };
  }

  if (
    payload.idempotencyKey !== undefined &&
    typeof payload.idempotencyKey !== "string"
  ) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "idempotencyKey must be a string when provided.",
    };
  }

  const attemptResult = getAttemptForOwner(attemptId, ownerUserId);
  if (!attemptResult.ok) {
    return attemptResult;
  }

  const attempt = attemptResult.value;
  const now = Date.now();

  if (attempt.status === "submitted") {
    return {
      ok: true,
      value: {
        attempt: toPublicAttempt(attempt),
        submittedAlready: true,
      },
    };
  }

  if (attempt.endsAt <= now) {
    markSubmitted(attempt, now);
    console.info(
      `[attempt-runtime] event=auto_submit attemptId=${attempt.attemptId} owner=${ownerUserId} reason=expired_at_submit`,
    );
    return {
      ok: false,
      code: "attempt_expired",
      status: 409,
      message: "Attempt has expired and was auto-submitted.",
      attempt: toPublicAttempt(attempt),
    };
  }

  const normalizedIdempotencyKey = payload.idempotencyKey?.trim();
  if (
    normalizedIdempotencyKey &&
    attempt.submitIdempotency[normalizedIdempotencyKey]
  ) {
    return {
      ok: true,
      value: {
        attempt: toPublicAttempt(attempt),
        submittedAlready: true,
      },
    };
  }

  markSubmitted(attempt, now);

  if (normalizedIdempotencyKey) {
    attempt.submitIdempotency[normalizedIdempotencyKey] = {
      submittedAt: now,
      version: attempt.version,
    };
  }

  return {
    ok: true,
    value: {
      attempt: toPublicAttempt(attempt),
      submittedAlready: false,
    },
  };
}

export function getAttempt(
  ownerUserId: string,
  attemptId: string,
  examSlug?: string,
): ServiceResult<PublicExamAttempt> {
  if (attemptId === "latest-local") {
    if (!examSlug) {
      return {
        ok: false,
        code: "invalid_payload",
        status: 400,
        message: "examSlug query parameter is required for latest-local lookup.",
      };
    }

    const latestAttemptId = latestSubmittedByOwnerAndExam.get(
      ownerExamKey(ownerUserId, examSlug),
    );
    if (!latestAttemptId) {
      return {
        ok: false,
        code: "attempt_not_found",
        status: 404,
        message: "No submitted attempt exists for this exam.",
      };
    }

    const latestAttempt = attemptsById.get(latestAttemptId);
    if (!latestAttempt) {
      return {
        ok: false,
        code: "attempt_not_found",
        status: 404,
        message: "No submitted attempt exists for this exam.",
      };
    }

    if (latestAttempt.ownerUserId !== ownerUserId) {
      return {
        ok: false,
        code: "unauthorized",
        status: 403,
        message: "You do not have access to this attempt.",
      };
    }

    return {
      ok: true,
      value: toPublicAttempt(latestAttempt),
    };
  }

  const attemptResult = getAttemptForOwner(attemptId, ownerUserId);
  if (!attemptResult.ok) {
    return attemptResult;
  }

  const attempt = attemptResult.value;
  if (examSlug && attempt.examSlug !== examSlug) {
    return {
      ok: false,
      code: "attempt_not_found",
      status: 404,
      message: "Attempt does not belong to the requested exam.",
    };
  }

  return {
    ok: true,
    value: toPublicAttempt(attempt),
  };
}

export function clearAttemptStore(): void {
  attemptsById.clear();
  activeAttemptByOwnerAndExam.clear();
  latestSubmittedByOwnerAndExam.clear();
  creationIdempotencyByOwner.clear();
}

export function listAttemptsForOwner(ownerUserId: string): PublicExamAttempt[] {
  return Array.from(attemptsById.values())
    .filter((attempt) => attempt.ownerUserId === ownerUserId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((attempt) => toPublicAttempt(attempt));
}
