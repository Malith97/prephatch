import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../../../lib/auth/request-user";
import { submitAttempt } from "../../../../../server/exams/attempt-service";
import type { SubmitAttemptRequest } from "../../../../../server/exams/attempt-types";

type AttemptSubmitRouteContext = {
  params: {
    attemptId: string;
  };
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "unauthorized",
        message: "User context is required to submit an attempt.",
      },
    },
    { status: 401 },
  );
}

export async function POST(
  request: Request,
  context: AttemptSubmitRouteContext,
) {
  const requestedAt = new Date().toISOString();
  const userId = resolveRequestUserId(request);

  if (!userId) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts/${context.params.attemptId}/submit result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  let payload: SubmitAttemptRequest = {};
  try {
    const parsed = (await request.json()) as SubmitAttemptRequest | null;
    payload = parsed ?? {};
  } catch {
    payload = {};
  }

  const result = submitAttempt(userId, context.params.attemptId, payload);

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts/${context.params.attemptId}/submit result=${result.code} user=${userId}`,
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
    `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts/${context.params.attemptId}/submit result=ok user=${userId} submittedAlready=${result.value.submittedAlready}`,
  );

  return NextResponse.json(result.value);
}
