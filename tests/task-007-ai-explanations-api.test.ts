import { afterEach, describe, expect, it } from "vitest";

import { POST as explain } from "../app/api/ai/explanations/route";

const USER_HEADER = "x-prephatch-user-id";

describe("TASK-007 AI explanations API", () => {
  afterEach(() => {
    process.env.ALLOW_DEV_BYPASS = "true";
  });

  it("returns deterministic explanation payload and cached hits", async () => {
    const body = {
      examSlug: "aws-saa-c03",
      questionId: "q1",
      selectedOptionId: "a",
      correctOptionId: "b",
    };

    const first = await explain(
      new Request("http://localhost/api/ai/explanations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [USER_HEADER]: "dev-user-a",
        },
        body: JSON.stringify(body),
      }),
    );

    expect(first.status).toBe(200);
    const firstPayload = (await first.json()) as {
      explanation: string;
      cached: boolean;
    };
    expect(firstPayload.explanation.length).toBeGreaterThan(10);
    expect(firstPayload.cached).toBe(false);

    const second = await explain(
      new Request("http://localhost/api/ai/explanations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [USER_HEADER]: "dev-user-a",
        },
        body: JSON.stringify(body),
      }),
    );

    expect(second.status).toBe(200);
    const secondPayload = (await second.json()) as {
      explanation: string;
      cached: boolean;
    };
    expect(secondPayload.cached).toBe(true);
  });

  it("rejects unauthorized requests when dev bypass is off", async () => {
    process.env.ALLOW_DEV_BYPASS = "false";

    const response = await explain(
      new Request("http://localhost/api/ai/explanations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examSlug: "aws-saa-c03",
          questionId: "q1",
          selectedOptionId: "a",
          correctOptionId: "b",
        }),
      }),
    );

    expect(response.status).toBe(401);
  });
});
