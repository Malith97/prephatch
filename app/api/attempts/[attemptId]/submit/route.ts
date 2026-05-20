import { NextResponse } from "next/server";

import { resolveRequestUserContext } from "../../../../../lib/auth/request-user";
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
  const userContext = await resolveRequestUserContext(request);

  if (!userContext) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts/${context.params.attemptId}/submit result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  const organizationId =
    userContext.organizationId ??
    (
      userContext.source === "dev_bypass" ||
      userContext.source === "header" ||
      userContext.source === "cookie"
        ? "dev-organization"
        : null
    );
  if (!organizationId) {
    return NextResponse.json(
      {
        error: {
          code: "invalid_context",
          message: "organization_id is required for attempt operations.",
        },
      },
      { status: 403 },
    );
  }

  let payload: SubmitAttemptRequest = {};
  try {
    const parsed = (await request.json()) as SubmitAttemptRequest | null;
    payload = parsed ?? {};
  } catch {
    payload = {};
  }

  const result = await submitAttempt(userContext.userId, context.params.attemptId, payload, {
    organizationId,
  });

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts/${context.params.attemptId}/submit result=${result.code} user=${userContext.userId}`,
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
    `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts/${context.params.attemptId}/submit result=ok user=${userContext.userId} submittedAlready=${result.value.submittedAlready}`,
  );

  return NextResponse.json(result.value);
}
