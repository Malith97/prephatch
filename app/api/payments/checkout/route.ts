import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../../lib/auth/request-user";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "unauthorized",
        message: "User context is required to start checkout.",
      },
    },
    { status: 401 },
  );
}

export async function POST(request: Request) {
  const requestedAt = new Date().toISOString();
  const userId = resolveRequestUserId(request);

  if (!userId) {
    console.info(
      `[payments-api] ts=${requestedAt} method=POST path=/api/payments/checkout result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  let payload: { packageSlug?: string };
  try {
    payload = (await request.json()) as { packageSlug?: string };
  } catch {
    console.info(
      `[payments-api] ts=${requestedAt} method=POST path=/api/payments/checkout result=invalid_json user=${userId}`,
    );
    return NextResponse.json({ error: { code: "invalid_payload", message: "Request body must be valid JSON." } }, { status: 400 });
  }

  if (!payload.packageSlug) {
    console.info(
      `[payments-api] ts=${requestedAt} method=POST path=/api/payments/checkout result=missing_package user=${userId}`,
    );
    return NextResponse.json({ error: { code: "invalid_payload", message: "packageSlug is required." } }, { status: 400 });
  }

  if (!/^[a-z0-9-]+$/.test(payload.packageSlug)) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_payload",
          message: "packageSlug must be a lowercase slug.",
        },
      },
      { status: 400 },
    );
  }

  const checkoutUrl = `https://example.test/stripe/checkout?package=${encodeURIComponent(payload.packageSlug)}`;
  console.info(`[payments-api] ts=${requestedAt} method=POST path=/api/payments/checkout result=ok user=${userId} package=${payload.packageSlug}`);

  return NextResponse.json({ checkoutUrl, mode: "sandbox" });
}
