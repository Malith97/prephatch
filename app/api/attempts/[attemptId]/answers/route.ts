import { NextResponse } from "next/server";

import { resolveDevBypassOrganizationId } from "../../../../../lib/auth/dev-bypass-identity";
import { resolveRequestUserContext } from "../../../../../lib/auth/request-user";
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
  const userContext = await resolveRequestUserContext(request);

  if (!userContext) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=PATCH path=/api/attempts/${context.params.attemptId}/answers result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  const organizationId =
    userContext.organizationId ??
    (
      userContext.source === "dev_bypass" ||
      userContext.source === "header" ||
      userContext.source === "cookie"
        ? resolveDevBypassOrganizationId()
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

  const result = await autosaveAttempt(
    userContext.userId,
    context.params.attemptId,
    payload ?? {},
    {
      organizationId,
    },
  );

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=PATCH path=/api/attempts/${context.params.attemptId}/answers result=${result.code} user=${userContext.userId} org=${organizationId}`,
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
    `[attempt-api] ts=${requestedAt} method=PATCH path=/api/attempts/${context.params.attemptId}/answers result=ok user=${userContext.userId} org=${organizationId} version=${result.value.attempt.version}`,
  );

  return NextResponse.json(result.value);
}
