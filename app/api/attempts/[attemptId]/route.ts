import { NextResponse } from "next/server";

import { resolveDevBypassOrganizationId } from "../../../../lib/auth/dev-bypass-identity";
import { resolveRequestUserContext } from "../../../../lib/auth/request-user";
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

export async function GET(request: Request, context: AttemptRouteContext) {
  const requestedAt = new Date().toISOString();
  const userContext = await resolveRequestUserContext(request);
  if (!userContext) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=GET path=/api/attempts/${context.params.attemptId} result=unauthorized`,
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

  const url = new URL(request.url);
  const examSlug = url.searchParams.get("examSlug") ?? undefined;
  const result = await getAttempt(userContext.userId, context.params.attemptId, examSlug, {
    organizationId,
  });

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=GET path=/api/attempts/${context.params.attemptId} result=${result.code} user=${userContext.userId} org=${organizationId} examSlug=${examSlug ?? ""}`,
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
    `[attempt-api] ts=${requestedAt} method=GET path=/api/attempts/${context.params.attemptId} result=ok user=${userContext.userId} org=${organizationId} examSlug=${examSlug ?? ""}`,
  );

  return NextResponse.json({
    attempt: result.value,
  });
}
