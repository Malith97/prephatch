import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../../lib/auth/request-user";
import { getAttempt } from "../../../../server/exams/attempt-service";

type AttemptRouteContext = {
  params: {
    attemptId: string;
  };
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "unauthorized",
        message: "User context is required to read an attempt.",
      },
    },
    { status: 401 },
  );
}

export function GET(request: Request, context: AttemptRouteContext) {
  const requestedAt = new Date().toISOString();
  const userId = resolveRequestUserId(request);

  if (!userId) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=GET path=/api/attempts/${context.params.attemptId} result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  const examSlug = url.searchParams.get("examSlug") ?? undefined;
  const result = getAttempt(userId, context.params.attemptId, examSlug);

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=GET path=/api/attempts/${context.params.attemptId} result=${result.code} user=${userId}`,
    );
    return NextResponse.json(
      {
        error: {
          code: result.code,
          message: result.message,
        },
      },
      { status: result.status },
    );
  }

  console.info(
    `[attempt-api] ts=${requestedAt} method=GET path=/api/attempts/${context.params.attemptId} result=ok user=${userId}`,
  );

  return NextResponse.json({
    attempt: result.value,
  });
}
