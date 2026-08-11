import { NextResponse } from "next/server";

import { resolveDevBypassOrganizationId } from "../../../lib/auth/dev-bypass-identity";
import { resolveRequestUserContext } from "../../../lib/auth/request-user";
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
  const userContext = await resolveRequestUserContext(request);

  if (!userContext) {
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

  const organizationId =
    userContext.organizationId ??
    (
      userContext.source === "dev_bypass" ||
      userContext.source === "header" ||
      userContext.source === "cookie"
        ? resolveDevBypassOrganizationId()
        : null
    );
  // Tenant guard: attempt creation requires explicit organization context.
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

  const result = await createOrResumeAttempt(
    userContext.userId,
    {
      examSlug: typeof payload.examSlug === "string" ? payload.examSlug.trim() : undefined,
      slug: typeof payload.slug === "string" ? payload.slug.trim() : undefined,
      mock_exam_id: typeof payload.mock_exam_id === "string" ? payload.mock_exam_id.trim() : undefined,
      examId: payload.examId,
      organizationId,
      mockId: payload.mockId,
      idempotencyKey:
        typeof payload.idempotencyKey === "string"
          ? payload.idempotencyKey
          : undefined,
    },
    {
      organizationId,
    },
  );

  if (!result.ok) {
    console.info(
      `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts result=${result.code} user=${userContext.userId} org=${organizationId} examSlug=${payload.examSlug ?? payload.slug ?? ""} mockId=${payload.mockId ?? payload.mock_exam_id ?? ""}`,
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
    `[attempt-api] ts=${requestedAt} method=POST path=/api/attempts result=ok user=${userContext.userId} org=${organizationId} examSlug=${payload.examSlug ?? payload.slug ?? ""} mockId=${payload.mockId ?? payload.mock_exam_id ?? ""} attemptId=${result.value.attempt.attemptId} resumed=${result.value.resumed}`,
  );

  return NextResponse.json(result.value);
}
