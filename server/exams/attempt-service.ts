import { getAttemptsRepository } from "./db-repository";
import type {
  AutosaveAttemptRequest,
  AutosaveAttemptResponse,
  CreateAttemptRequest,
  CreateAttemptResponse,
  PublicExamAttempt,
  SubmitAttemptRequest,
  SubmitAttemptResponse,
} from "./attempt-types";

type ServiceErrorCode =
  | "invalid_payload"
  | "invalid_context"
  | "exam_not_found"
  | "attempt_not_found"
  | "unauthorized"
  | "attempt_already_submitted"
  | "attempt_expired"
  | "attempt_limit_reached"
  | "version_conflict"
  | "invalid_answer_payload"
  | "access_denied"
  | "database_error";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function mapThrownError(error: unknown, fallbackMessage: string): ServiceError {
  const message = error instanceof Error ? error.message : fallbackMessage;
  const attempt = isRecord(error) && "attempt" in error
    ? (error.attempt as PublicExamAttempt | undefined)
    : undefined;

  if (message === "attempt_not_found") {
    return {
      ok: false,
      code: "attempt_not_found",
      status: 404,
      message: "Attempt not found.",
    };
  }

  if (message === "version_conflict") {
    return {
      ok: false,
      code: "version_conflict",
      status: 409,
      message: "Attempt state changed in another tab. Refresh state and retry.",
      attempt,
    };
  }

  if (message === "invalid_answer_payload") {
    return {
      ok: false,
      code: "invalid_answer_payload",
      status: 400,
      message: "Answers payload contains invalid question or option values.",
    };
  }

  if (message === "attempt_limit_reached") {
    return {
      ok: false,
      code: "attempt_limit_reached",
      status: 409,
      message: "You have reached the maximum number of attempts for this mock exam.",
    };
  }

  return {
    ok: false,
    code: "database_error",
    status: 500,
    message: fallbackMessage,
  };
}

function resolveOrganizationId(context?: { organizationId?: string | null }): string | null {
  return context?.organizationId?.trim() || null;
}

function resolveExamSlug(payload: CreateAttemptRequest): string | undefined {
  const rawSlug = payload.examSlug ?? payload.slug;
  return typeof rawSlug === "string" && rawSlug.trim() ? rawSlug.trim() : undefined;
}

export async function createOrResumeAttempt(
  ownerUserId: string,
  payload: CreateAttemptRequest,
  context?: {
    organizationId?: string | null;
  },
): Promise<ServiceResult<CreateAttemptResponse>> {
  if (!payload || !isRecord(payload)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "Payload must be a JSON object.",
    };
  }

  const examSlug = resolveExamSlug(payload);
  const mockExamId = typeof payload.mock_exam_id === "string" ? payload.mock_exam_id.trim() : undefined;
  if (!examSlug && !mockExamId && !payload.examId) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "examSlug, slug, examId, or mock_exam_id is required.",
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

  if (payload.idempotencyKey !== undefined && typeof payload.idempotencyKey !== "string") {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "idempotencyKey must be a string when provided.",
    };
  }

  const organizationId = resolveOrganizationId(context);
  if (!organizationId) {
    return {
      ok: false,
      code: "invalid_context",
      status: 400,
      message: "organizationId is required.",
    };
  }

  try {
    const repository = getAttemptsRepository();
    const exam = await repository.findRuntimeExam({
      organizationId,
      examSlug,
      examId: payload.examId,
      mockId: payload.mockId,
      mockExamId,
      includeAnswers: true,
    });

    if (!exam) {
      return {
        ok: false,
        code: "exam_not_found",
        status: 404,
        message: "Exam was not found.",
      };
    }

    if (payload.organizationId !== undefined && payload.organizationId !== organizationId) {
      return {
        ok: false,
        code: "invalid_payload",
        status: 400,
        message: "organizationId does not match authenticated organization.",
      };
    }

    const hasAccess = await repository.hasAccess({
      organizationId,
      userId: ownerUserId,
      exam,
    });

    if (!hasAccess) {
      return {
        ok: false,
        code: "access_denied",
        status: 403,
        message: "You do not have access to this mock exam.",
      };
    }

    const mockId = payload.mockId?.trim() || mockExamId || exam.examVersionId;
    const value = await repository.createAttempt({
      organizationId,
      userId: ownerUserId,
      exam,
      mockId,
      idempotencyKey: payload.idempotencyKey,
    });

    return { ok: true, value };
  } catch (error) {
    return mapThrownError(error, "Unable to create attempt.");
  }
}

export async function autosaveAttempt(
  ownerUserId: string,
  attemptId: string,
  payload: AutosaveAttemptRequest,
  context?: {
    organizationId?: string | null;
  },
): Promise<ServiceResult<AutosaveAttemptResponse>> {
  if (!payload || !isRecord(payload)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "Payload must be a JSON object.",
    };
  }

  const organizationId = resolveOrganizationId(context);
  if (!organizationId) {
    return {
      ok: false,
      code: "invalid_context",
      status: 400,
      message: "organizationId is required.",
    };
  }

  if (payload.answers !== undefined && !isStringRecord(payload.answers)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "answers must be an object of questionId to optionId.",
    };
  }

  if (payload.flaggedQuestionIds !== undefined && !isStringArray(payload.flaggedQuestionIds)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "flaggedQuestionIds must be an array of question IDs.",
    };
  }

  if (
    payload.currentQuestionIndex !== undefined &&
    (!Number.isInteger(payload.currentQuestionIndex) || payload.currentQuestionIndex < 0)
  ) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "currentQuestionIndex must be a non-negative integer.",
    };
  }

  try {
    const existingAttempt = await getAttemptsRepository().getAttempt({
      organizationId,
      userId: ownerUserId,
      attemptId,
    });

    if (!existingAttempt) {
      return {
        ok: false,
        code: "attempt_not_found",
        status: 404,
        message: "Attempt not found.",
      };
    }

    if (existingAttempt.status !== "in_progress") {
      return {
        ok: false,
        code: "attempt_already_submitted",
        status: 409,
        message: "Attempt is already submitted.",
        attempt: existingAttempt,
      };
    }

    if (Date.now() > existingAttempt.endsAt) {
      const submitted = await getAttemptsRepository().submitAttempt({
        organizationId,
        userId: ownerUserId,
        attemptId,
        idempotencyKey: `timeout:${attemptId}`,
      });
      return {
        ok: false,
        code: "attempt_expired",
        status: 409,
        message: "Attempt has expired and was auto-submitted.",
        attempt: submitted.attempt,
      };
    }

    const attempt = await getAttemptsRepository().autosaveAttempt({
      organizationId,
      userId: ownerUserId,
      attemptId,
      answers: payload.answers,
      currentQuestionIndex: payload.currentQuestionIndex,
      flaggedQuestionIds: payload.flaggedQuestionIds,
      expectedVersion: payload.expectedVersion,
    });

    return {
      ok: true,
      value: { attempt },
    };
  } catch (error) {
    return mapThrownError(error, "Unable to save attempt.");
  }
}

export async function submitAttempt(
  ownerUserId: string,
  attemptId: string,
  payload: SubmitAttemptRequest,
  context?: {
    organizationId?: string | null;
  },
): Promise<ServiceResult<SubmitAttemptResponse>> {
  if (!payload || !isRecord(payload)) {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "Payload must be a JSON object.",
    };
  }

  if (payload.idempotencyKey !== undefined && typeof payload.idempotencyKey !== "string") {
    return {
      ok: false,
      code: "invalid_payload",
      status: 400,
      message: "idempotencyKey must be a string when provided.",
    };
  }

  const organizationId = resolveOrganizationId(context);
  if (!organizationId) {
    return {
      ok: false,
      code: "invalid_context",
      status: 400,
      message: "organizationId is required.",
    };
  }

  try {
    const result = await getAttemptsRepository().submitAttempt({
      organizationId,
      userId: ownerUserId,
      attemptId,
      idempotencyKey: payload.idempotencyKey,
    });

    return {
      ok: true,
      value: {
        attempt: result.attempt,
        submittedAlready: result.submittedAlready,
      },
    };
  } catch (error) {
    return mapThrownError(error, "Unable to submit attempt.");
  }
}

export async function getAttempt(
  ownerUserId: string,
  attemptId: string,
  examSlug?: string,
  context?: {
    organizationId?: string | null;
  },
): Promise<ServiceResult<PublicExamAttempt>> {
  const organizationId = resolveOrganizationId(context);
  if (!organizationId) {
    return {
      ok: false,
      code: "invalid_context",
      status: 400,
      message: "organizationId is required.",
    };
  }

  try {
    const attempt = attemptId === "latest-local"
      ? examSlug
        ? await getAttemptsRepository().getLatestSubmittedAttempt({
            organizationId,
            userId: ownerUserId,
            examSlug,
          })
        : null
      : await getAttemptsRepository().getAttempt({
          organizationId,
          userId: ownerUserId,
          attemptId,
          examSlug,
        });

    if (!attempt) {
      return {
        ok: false,
        code: "attempt_not_found",
        status: 404,
        message: attemptId === "latest-local"
          ? "No submitted attempt exists for this exam."
          : "Attempt not found.",
      };
    }

    return { ok: true, value: attempt };
  } catch (error) {
    return mapThrownError(error, "Unable to read attempt.");
  }
}

export async function clearAttemptStore(): Promise<void> {
  const repository = getAttemptsRepository();
  repository.clearForTests?.();
}

export async function listAttemptsForOwner(ownerUserId: string, organizationId?: string | null): Promise<PublicExamAttempt[]> {
  return getAttemptsRepository().listAttemptsForOwner({ userId: ownerUserId, organizationId });
}
