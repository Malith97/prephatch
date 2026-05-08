import { NextResponse } from "next/server";

type WebhookEvent = {
  id?: string;
  type?: string;
  data?: {
    object?: {
      userId?: string;
      packageSlug?: string;
      paymentStatus?: string;
    };
  };
};

const processedEvents = new Set<string>();
const entitlements = new Map<string, Set<string>>();

function isWebhookAuthorized(request: Request): boolean {
  const configuredSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!configuredSecret) {
    return true;
  }

  const providedSecret = request.headers.get("x-webhook-secret")?.trim();
  return providedSecret === configuredSecret;
}

export async function POST(request: Request) {
  const requestedAt = new Date().toISOString();

  if (!isWebhookAuthorized(request)) {
    console.info(
      `[payments-api] ts=${requestedAt} method=POST path=/api/payments/webhook result=unauthorized`,
    );
    return NextResponse.json(
      {
        error: {
          code: "unauthorized",
          message: "Webhook signature validation failed.",
        },
      },
      { status: 401 },
    );
  }

  let event: WebhookEvent;
  try {
    event = (await request.json()) as WebhookEvent;
  } catch {
    console.info(
      `[payments-api] ts=${requestedAt} method=POST path=/api/payments/webhook result=invalid_json`,
    );
    return NextResponse.json({ error: { code: "invalid_payload", message: "Webhook payload must be valid JSON." } }, { status: 400 });
  }

  if (!event.id || !event.type) {
    console.info(
      `[payments-api] ts=${requestedAt} method=POST path=/api/payments/webhook result=invalid_event_shape`,
    );
    return NextResponse.json({ error: { code: "invalid_payload", message: "Webhook event id and type are required." } }, { status: 400 });
  }

  if (processedEvents.has(event.id)) {
    console.info(`[payments-api] ts=${requestedAt} method=POST path=/api/payments/webhook result=duplicate event=${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  processedEvents.add(event.id);

  if (event.type === "checkout.session.completed") {
    const userId = event.data?.object?.userId;
    const packageSlug = event.data?.object?.packageSlug;

    if (userId && packageSlug) {
      const owned = entitlements.get(userId) ?? new Set<string>();
      owned.add(packageSlug);
      entitlements.set(userId, owned);
      console.info(`[payments-api] ts=${requestedAt} method=POST path=/api/payments/webhook result=entitlement_issued user=${userId} package=${packageSlug} event=${event.id}`);
    }
  }

  console.info(
    `[payments-api] ts=${requestedAt} method=POST path=/api/payments/webhook result=ok event=${event.id} type=${event.type}`,
  );

  return NextResponse.json({ received: true });
}
