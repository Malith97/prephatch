import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PATCH as patchAttemptAnswers } from "../app/api/attempts/[attemptId]/answers/route";
import { GET as getAttempt } from "../app/api/attempts/[attemptId]/route";
import { POST as submitAttempt } from "../app/api/attempts/[attemptId]/submit/route";
import { POST as createAttempt } from "../app/api/attempts/route";
import { getExamBySlug } from "../server/exams/mock-repository";
import { clearAttemptStore } from "../server/exams/attempt-service";

const USER_HEADER = "x-prephatch-user-id";
const EXAM_SLUG = "aws-saa-c03";
const MOCK_ID = "free-mock-1";

type AttemptPayload = {
  attemptId: string;
  examSlug: string;
  mockId: string;
  status: "in_progress" | "submitted";
  startedAt: number;
  endsAt: number;
  answers: Record<string, string>;
  flaggedQuestionIds: string[];
  version: number;
  score?: {
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    percentageScore: number;
  };
};

function buildJsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [USER_HEADER]: "dev-user-a",
    },
    body: JSON.stringify(body),
  });
}

describe("TASK-002/003/004 attempts API", () => {
  beforeEach(() => {
    clearAttemptStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates and resumes an in-progress attempt idempotently for the same user/mock", async () => {
    const firstResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    expect(firstResponse.status).toBe(200);

    const firstPayload = (await firstResponse.json()) as {
      attempt: AttemptPayload;
      resumed: boolean;
    };

    expect(firstPayload.resumed).toBe(false);
    expect(firstPayload.attempt.status).toBe("in_progress");
    expect(firstPayload.attempt.examSlug).toBe(EXAM_SLUG);
    expect(firstPayload.attempt.mockId).toBe(MOCK_ID);
    expect(firstPayload.attempt.version).toBe(1);

    const secondResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    expect(secondResponse.status).toBe(200);

    const secondPayload = (await secondResponse.json()) as {
      attempt: AttemptPayload;
      resumed: boolean;
    };

    expect(secondPayload.resumed).toBe(true);
    expect(secondPayload.attempt.attemptId).toBe(firstPayload.attempt.attemptId);
  });

  it("autosaves answers and rejects stale writes via version conflict", async () => {
    const exam = getExamBySlug(EXAM_SLUG);
    expect(exam).not.toBeNull();
    if (!exam) {
      return;
    }

    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    const createPayload = (await createResponse.json()) as {
      attempt: AttemptPayload;
    };

    const question = exam.questions[0];
    const patchResponse = await patchAttemptAnswers(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
          },
          body: JSON.stringify({
            answers: {
              [question.id]: question.options[0].id,
            },
            currentQuestionIndex: 1,
            flaggedQuestionIds: [question.id],
            expectedVersion: createPayload.attempt.version,
          }),
        },
      ),
      {
        params: {
          attemptId: createPayload.attempt.attemptId,
        },
      },
    );

    expect(patchResponse.status).toBe(200);
    const patchedPayload = (await patchResponse.json()) as {
      attempt: AttemptPayload;
    };
    expect(patchedPayload.attempt.version).toBe(createPayload.attempt.version + 1);
    expect(patchedPayload.attempt.answers[question.id]).toBe(question.options[0].id);

    const staleWriteResponse = await patchAttemptAnswers(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
          },
          body: JSON.stringify({
            answers: {
              [question.id]: question.options[1].id,
            },
            expectedVersion: createPayload.attempt.version,
          }),
        },
      ),
      {
        params: {
          attemptId: createPayload.attempt.attemptId,
        },
      },
    );

    expect(staleWriteResponse.status).toBe(409);
    const staleWritePayload = (await staleWriteResponse.json()) as {
      error: { code: string };
    };
    expect(staleWritePayload.error.code).toBe("version_conflict");
  });

  it("rejects autosave writes past the attempt deadline", async () => {
    const exam = getExamBySlug(EXAM_SLUG);
    expect(exam).not.toBeNull();
    if (!exam) {
      return;
    }

    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    const createPayload = (await createResponse.json()) as {
      attempt: AttemptPayload;
    };

    vi.spyOn(Date, "now").mockReturnValue(createPayload.attempt.endsAt + 5_000);

    const response = await patchAttemptAnswers(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
          },
          body: JSON.stringify({
            answers: {
              [exam.questions[0].id]: exam.questions[0].options[0].id,
            },
            expectedVersion: createPayload.attempt.version,
          }),
        },
      ),
      {
        params: {
          attemptId: createPayload.attempt.attemptId,
        },
      },
    );

    expect(response.status).toBe(409);
    const payload = (await response.json()) as {
      error: { code: string };
    };
    expect(payload.error.code).toBe("attempt_expired");
  });

  it("submits with deterministic score and keeps submit idempotent across duplicate calls", async () => {
    const exam = getExamBySlug(EXAM_SLUG);
    expect(exam).not.toBeNull();
    if (!exam) {
      return;
    }

    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    const createPayload = (await createResponse.json()) as {
      attempt: AttemptPayload;
    };

    const firstQuestion = exam.questions[0];
    await patchAttemptAnswers(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
          },
          body: JSON.stringify({
            answers: {
              [firstQuestion.id]: firstQuestion.correctOptionId,
            },
            expectedVersion: createPayload.attempt.version,
          }),
        },
      ),
      {
        params: {
          attemptId: createPayload.attempt.attemptId,
        },
      },
    );

    const firstSubmitResponse = await submitAttempt(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
          },
          body: JSON.stringify({
            idempotencyKey: `submit:${createPayload.attempt.attemptId}`,
          }),
        },
      ),
      {
        params: {
          attemptId: createPayload.attempt.attemptId,
        },
      },
    );

    expect(firstSubmitResponse.status).toBe(200);
    const firstSubmitPayload = (await firstSubmitResponse.json()) as {
      attempt: AttemptPayload;
      submittedAlready: boolean;
    };
    expect(firstSubmitPayload.submittedAlready).toBe(false);
    expect(firstSubmitPayload.attempt.status).toBe("submitted");
    expect(firstSubmitPayload.attempt.score).toBeDefined();
    expect(firstSubmitPayload.attempt.score?.correctCount).toBeGreaterThanOrEqual(1);

    const secondSubmitResponse = await submitAttempt(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
          },
          body: JSON.stringify({
            idempotencyKey: `submit:${createPayload.attempt.attemptId}`,
          }),
        },
      ),
      {
        params: {
          attemptId: createPayload.attempt.attemptId,
        },
      },
    );

    expect(secondSubmitResponse.status).toBe(200);
    const secondSubmitPayload = (await secondSubmitResponse.json()) as {
      attempt: AttemptPayload;
      submittedAlready: boolean;
    };
    expect(secondSubmitPayload.submittedAlready).toBe(true);
    expect(secondSubmitPayload.attempt.attemptId).toBe(firstSubmitPayload.attempt.attemptId);

    const latestResponse = getAttempt(
      new Request(
        `http://localhost/api/attempts/latest-local?examSlug=${EXAM_SLUG}`,
        {
          method: "GET",
          headers: {
            [USER_HEADER]: "dev-user-a",
          },
        },
      ),
      {
        params: {
          attemptId: "latest-local",
        },
      },
    );

    expect(latestResponse.status).toBe(200);
    const latestPayload = (await latestResponse.json()) as {
      attempt: AttemptPayload;
    };
    expect(latestPayload.attempt.attemptId).toBe(firstSubmitPayload.attempt.attemptId);
  });
});
