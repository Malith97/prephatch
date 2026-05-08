import { afterEach, describe, expect, it } from "vitest";

import { POST as createCheckout } from "../app/api/payments/checkout/route";
import { POST as handleWebhook } from "../app/api/payments/webhook/route";

const USER_HEADER = "x-prephatch-user-id";

describe("TASK-005/006 payments APIs", () => {
  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it("creates sandbox checkout sessions for valid package slug", async () => {
    const response = await createCheckout(
      new Request("http://localhost/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [USER_HEADER]: "dev-user-a",
        },
        body: JSON.stringify({ packageSlug: "aws-saa-c03-pro" }),
      }),
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as {
      checkoutUrl: string;
      mode: string;
    };
    expect(payload.mode).toBe("sandbox");
    expect(payload.checkoutUrl).toContain("aws-saa-c03-pro");
  });

  it("processes webhook idempotently and protects endpoints with optional secret", async () => {
    process.env.STRIPE_WEBHOOK_SECRET = "local-secret";

    const unauthorized = await handleWebhook(
      new Request("http://localhost/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: "evt_1", type: "checkout.session.completed" }),
      }),
    );

    expect(unauthorized.status).toBe(401);

    const eventBody = {
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          userId: "dev-user-a",
          packageSlug: "aws-saa-c03-pro",
          paymentStatus: "paid",
        },
      },
    };

    const first = await handleWebhook(
      new Request("http://localhost/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": "local-secret",
        },
        body: JSON.stringify(eventBody),
      }),
    );
    expect(first.status).toBe(200);

    const duplicate = await handleWebhook(
      new Request("http://localhost/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": "local-secret",
        },
        body: JSON.stringify(eventBody),
      }),
    );

    expect(duplicate.status).toBe(200);
    const duplicatePayload = (await duplicate.json()) as {
      duplicate?: boolean;
    };
    expect(duplicatePayload.duplicate).toBe(true);
  });
});
