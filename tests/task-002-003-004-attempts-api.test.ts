import { beforeEach, describe, expect, it, vi } from "vitest";

import { PATCH as patchAttemptAnswers } from "../app/api/attempts/[attemptId]/answers/route";
import { GET as getAttempt } from "../app/api/attempts/[attemptId]/route";
import { POST as submitAttempt } from "../app/api/attempts/[attemptId]/submit/route";
import { POST as createAttempt } from "../app/api/attempts/route";
import { clearAttemptStore } from "../server/exams/attempt-service";
import { setAttemptsRepositoryForTests } from "../server/exams/db-repository";
import { FakeAttemptsRepository, fakeExam } from "./helpers/fake-attempts-repository";

const USER_HEADER = "x-prephatch-user-id";
const ORG_HEADER = "x-prephatch-organization-id";
const EXAM_SLUG = "aws-saa-c03";
const MOCK_ID = "mock-version-free";

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

let repository: FakeAttemptsRepository;

function buildJsonRequest(url: string, body: unknown, userId = "dev-user-a"): Request {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [USER_HEADER]: userId,
      [ORG_HEADER]: "dev-organization",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  repository = new FakeAttemptsRepository();
  setAttemptsRepositoryForTests(repository);
  await clearAttemptStore();
  vi.restoreAllMocks();
});

describe("TASK-002/003/004 attempts API", () => {
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
        slug: EXAM_SLUG,
        mock_exam_id: MOCK_ID,
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
    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    const createPayload = (await createResponse.json()) as {
      attempt: AttemptPayload;
    };

    const question = fakeExam.questions[0];
    const patchResponse = await patchAttemptAnswers(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
            [ORG_HEADER]: "dev-organization",
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
            [ORG_HEADER]: "dev-organization",
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
            [ORG_HEADER]: "dev-organization",
          },
          body: JSON.stringify({
            answers: {
              [fakeExam.questions[0].id]: fakeExam.questions[0].options[0].id,
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
    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );

    const createPayload = (await createResponse.json()) as {
      attempt: AttemptPayload;
    };

    const firstQuestion = fakeExam.questions[0];
    await patchAttemptAnswers(
      new Request(
        `http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            [USER_HEADER]: "dev-user-a",
            [ORG_HEADER]: "dev-organization",
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
            [ORG_HEADER]: "dev-organization",
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
            [ORG_HEADER]: "dev-organization",
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

    const latestResponse = await getAttempt(
      new Request(
        `http://localhost/api/attempts/latest-local?examSlug=${EXAM_SLUG}`,
        {
          method: "GET",
          headers: {
            [USER_HEADER]: "dev-user-a",
            [ORG_HEADER]: "dev-organization",
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

  it("uses immutable attempt snapshots when source questions mutate before submit", async () => {
    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", {
        examSlug: EXAM_SLUG,
        mockId: MOCK_ID,
      }),
    );
    const createPayload = (await createResponse.json()) as { attempt: AttemptPayload };
    const firstQuestion = fakeExam.questions[0];

    await patchAttemptAnswers(
      new Request(`http://localhost/api/attempts/${createPayload.attempt.attemptId}/answers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          [USER_HEADER]: "dev-user-a",
          [ORG_HEADER]: "dev-organization",
        },
        body: JSON.stringify({
          answers: { [firstQuestion.id]: firstQuestion.correctOptionId },
          expectedVersion: createPayload.attempt.version,
        }),
      }),
      { params: { attemptId: createPayload.attempt.attemptId } },
    );

    repository.mutateCorrectAnswer(firstQuestion.id, "A");

    const response = await submitAttempt(
      buildJsonRequest(`http://localhost/api/attempts/${createPayload.attempt.attemptId}/submit`, {
        idempotencyKey: "snapshot-test",
      }),
      { params: { attemptId: createPayload.attempt.attemptId } },
    );
    const payload = (await response.json()) as { attempt: AttemptPayload };
    expect(payload.attempt.score?.correctCount).toBe(1);
  });

  it("persists result fetches across route calls and blocks cross-user reads", async () => {
    const createResponse = await createAttempt(
      buildJsonRequest("http://localhost/api/attempts", { examSlug: EXAM_SLUG, mockId: MOCK_ID }),
    );
    const createPayload = (await createResponse.json()) as { attempt: AttemptPayload };
    await submitAttempt(
      buildJsonRequest(`http://localhost/api/attempts/${createPayload.attempt.attemptId}/submit`, {
        idempotencyKey: "reload-test",
      }),
      { params: { attemptId: createPayload.attempt.attemptId } },
    );

    const reloadResponse = await getAttempt(
      new Request(`http://localhost/api/attempts/${createPayload.attempt.attemptId}?examSlug=${EXAM_SLUG}`, {
        headers: { [USER_HEADER]: "dev-user-a", [ORG_HEADER]: "dev-organization" },
      }),
      { params: { attemptId: createPayload.attempt.attemptId } },
    );
    expect(reloadResponse.status).toBe(200);

    const forbiddenResponse = await getAttempt(
      new Request(`http://localhost/api/attempts/${createPayload.attempt.attemptId}?examSlug=${EXAM_SLUG}`, {
        headers: { [USER_HEADER]: "dev-user-b", [ORG_HEADER]: "dev-organization" },
      }),
      { params: { attemptId: createPayload.attempt.attemptId } },
    );
    expect(forbiddenResponse.status).toBe(404);
  });
});
