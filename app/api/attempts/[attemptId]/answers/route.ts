import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../../../lib/auth/request-user";
import { autosaveAttempt } from "../../../../../server/exams/attempt-service";
import type { AutosaveAttemptRequest } from "../../../../../server/exams/attempt-types";

type AttemptAnswersRouteContext = {
  params: {
    attemptId: string;
  };
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "unauthorized",
        message: "User context is required to save an attempt.",
      },
    },
    { status: 401 },
  );
}

export async function PATCH(
  request: Request,
  context: AttemptAnswersRouteContext,
) {
  const requestedAt = new Date().toISOString();
  const userId = resolveRequestUserId(request);

  if (!userId) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=PATCH path=/api/attempts/${context.params.attemptId}/answers result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  let payload: AutosaveAttemptRequest;
  try {
    payload = (await request.json()) as AutosaveAttemptRequest;
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

  const result = autosaveAttempt(userId, context.params.attemptId, payload ?? {});

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=PATCH path=/api/attempts/${context.params.attemptId}/answers result=${result.code} user=${userId}`,
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
    `[attempt-api] ts=${requestedAt} method=PATCH path=/api/attempts/${context.params.attemptId}/answers result=ok user=${userId} version=${result.value.attempt.version}`,
  );

  return NextResponse.json(result.value);
}
