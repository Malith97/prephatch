import type {
  AutosaveAttemptResponse,
  CreateAttemptResponse,
  PublicExamAttempt,
  SubmitAttemptResponse,
} from "../../server/exams/attempt-types";

type AttemptApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
  attempt?: PublicExamAttempt;
};

export class AttemptApiError extends Error {
  code: string;
  status: number;
  attempt?: PublicExamAttempt;

  constructor(
    message: string,
    status: number,
    code: string,
    attempt?: PublicExamAttempt,
  ) {
    super(message);
    this.name = "AttemptApiError";
    this.status = status;
    this.code = code;
    this.attempt = attempt;
  }
}

async function parseError(response: Response): Promise<AttemptApiError> {
  let payload: AttemptApiErrorPayload = {};
  try {
    payload = (await response.json()) as AttemptApiErrorPayload;
  } catch {
    payload = {};
  }

  return new AttemptApiError(
    payload.error?.message ?? "Attempt request failed.",
    response.status,
    payload.error?.code ?? "unknown_error",
    payload.attempt,
  );
}

export async function createAttempt(input: {
  examSlug: string;
  mockId?: string;
  idempotencyKey?: string;
}): Promise<CreateAttemptResponse> {
  const response = await fetch("/api/attempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as CreateAttemptResponse;
}

export async function autosaveAttempt(input: {
  attemptId: string;
  answers?: Record<string, string>;
  currentQuestionIndex?: number;
  flaggedQuestionIds?: string[];
  expectedVersion?: number;
}): Promise<AutosaveAttemptResponse> {
  const { attemptId, ...payload } = input;
  const response = await fetch(`/api/attempts/${attemptId}/answers`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as AutosaveAttemptResponse;
}

export async function submitAttempt(input: {
  attemptId: string;
  idempotencyKey?: string;
}): Promise<SubmitAttemptResponse> {
  const { attemptId, ...payload } = input;
  const response = await fetch(`/api/attempts/${attemptId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as SubmitAttemptResponse;
}

export async function readAttempt(input: {
  attemptId: string;
  examSlug?: string;
}): Promise<{ attempt: PublicExamAttempt }> {
  const query = input.examSlug
    ? `?examSlug=${encodeURIComponent(input.examSlug)}`
    : "";
  const response = await fetch(`/api/attempts/${input.attemptId}${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return (await response.json()) as { attempt: PublicExamAttempt };
}
