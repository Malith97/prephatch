import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../lib/auth/request-user";
import {
  createOrResumeAttempt,
} from "../../../server/exams/attempt-service";
import type { CreateAttemptRequest } from "../../../server/exams/attempt-types";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "unauthorized",
        message: "User context is required to create an attempt.",
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
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  let payload: CreateAttemptRequest;
  try {
    payload = (await request.json()) as CreateAttemptRequest;
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "invalid_payload",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 },
    );
  }

  if (!payload || typeof payload.examSlug !== "string" || !payload.examSlug.trim()) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_payload",
          message: "examSlug is required.",
        },
      },
      { status: 400 },
    );
  }

  const result = createOrResumeAttempt(userId, {
    examSlug: payload.examSlug.trim(),
    mockId: payload.mockId,
    idempotencyKey:
      typeof payload.idempotencyKey === "string"
        ? payload.idempotencyKey
        : undefined,
  });

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts result=${result.code} user=${userId}`,
    );
    return NextResponse.json(
      {
        error: {
          code: result.code,
          message: result.message,
        },
        attempt: result.attempt,
      },
      { status: result.status },
    );
  }

  console.info(
    `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts result=ok user=${userId} attemptId=${result.value.attempt.attemptId} resumed=${result.value.resumed}`,
  );

  return NextResponse.json(result.value);
}
