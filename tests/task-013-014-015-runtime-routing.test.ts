import { beforeEach, describe, expect, it, vi } from "vitest";

import { PATCH as patchAttemptAnswers } from "../app/api/attempts/[attemptId]/answers/route";
import { POST as submitAttempt } from "../app/api/attempts/[attemptId]/submit/route";
import { POST as createAttempt } from "../app/api/attempts/route";
import LegacyExamDetailRoute from "../app/exams/[examSlug]/page";
import { clearAttemptStore } from "../server/exams/attempt-service";

const USER_HEADER = "x-prephatch-user-id";

function buildCreateRequest() {
  return new Request("http://localhost/api/attempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [USER_HEADER]: "dev-user-a",
    },
    body: JSON.stringify({ examSlug: "aws-saa-c03", mockId: "free-mock-1" }),
  });
}

describe("TASK-013/014/015 runtime and routing", () => {
  beforeEach(() => {
    clearAttemptStore();
    vi.restoreAllMocks();
  });

  it("auto-submits expired attempts and keeps submit idempotent", async () => {
    const created = await createAttempt(buildCreateRequest());
    const createdPayload = (await created.json()) as {
      attempt: {
        attemptId: string;
        endsAt: number;
        version: number;
      };
    };

    vi.spyOn(Date, "now").mockReturnValue(createdPayload.attempt.endsAt + 1_000);

    const autosaveResponse = await patchAttemptAnswers(
      new Request(`http://localhost/api/attempts/${createdPayload.attempt.attemptId}/answers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          [USER_HEADER]: "dev-user-a",
        },
        body: JSON.stringify({
          answers: { q1: "a" },
          expectedVersion: createdPayload.attempt.version,
        }),
      }),
      { params: { attemptId: createdPayload.attempt.attemptId } },
    );

    expect(autosaveResponse.status).toBe(409);
    const autosavePayload = (await autosaveResponse.json()) as {
      error: { code: string };
      attempt?: { status: string };
    };
    expect(autosavePayload.error.code).toBe("attempt_expired");
    expect(autosavePayload.attempt?.status).toBe("submitted");

    const submitResponse = await submitAttempt(
      new Request(`http://localhost/api/attempts/${createdPayload.attempt.attemptId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [USER_HEADER]: "dev-user-a",
        },
        body: JSON.stringify({ idempotencyKey: "submit:test" }),
      }),
      { params: { attemptId: createdPayload.attempt.attemptId } },
    );

    expect(submitResponse.status).toBe(200);
    const submitPayload = (await submitResponse.json()) as {
      submittedAlready: boolean;
      attempt: { status: string };
    };
    expect(submitPayload.attempt.status).toBe("submitted");
    expect(submitPayload.submittedAlready).toBe(true);
  });

  it("keeps legacy /exams route redirecting to /exam", () => {
    expect(() =>
      LegacyExamDetailRoute({
        params: { examSlug: "aws-saa-c03" },
      }),
    ).toThrow();
  });
});
