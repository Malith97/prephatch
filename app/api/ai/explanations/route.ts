import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../../lib/auth/request-user";

type ExplanationRequest = {
  examSlug?: string;
  questionId?: string;
  selectedOptionId?: string | null;
  correctOptionId?: string;
};

type ExplanationResponse = {
  explanation: string;
  cached: boolean;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { explanation: string; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const requestCounters = new Map<string, { count: number; resetAt: number }>();

function consumeRateLimit(key: string): boolean {
  const now = Date.now();
  const current = requestCounters.get(key);

  if (!current || current.resetAt <= now) {
    requestCounters.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  requestCounters.set(key, current);
  return true;
}

export async function POST(request: Request) {
  const requestedAt = new Date().toISOString();
  const userId = resolveRequestUserId(request);

  if (!userId) {
    return NextResponse.json(
      {
        error: {
          code: "unauthorized",
          message: "User context is required to generate explanations.",
        },
      },
      { status: 401 },
    );
  }

  const clientKey = userId;
  if (!consumeRateLimit(clientKey)) {
    console.info(
      `[ai-api] ts=${requestedAt} method=POST path=/api/ai/explanations result=rate_limited user=${userId}`,
    );
    return NextResponse.json(
      {
        error: {
          code: "rate_limited",
          message: "Too many explanation requests. Please retry shortly.",
        },
      },
      { status: 429 },
    );
  }

  let payload: ExplanationRequest;
  try {
    payload = (await request.json()) as ExplanationRequest;
  } catch {
    console.info(`[ai-api] ts=${requestedAt} method=POST path=/api/ai/explanations result=invalid_json`);
    return NextResponse.json({ error: { code: "invalid_payload", message: "Request body must be valid JSON." } }, { status: 400 });
  }

  if (!payload.examSlug || !payload.questionId || !payload.correctOptionId) {
    return NextResponse.json(
      { error: { code: "invalid_payload", message: "examSlug, questionId, and correctOptionId are required." } },
      { status: 400 },
    );
  }

  const key = `${payload.examSlug}:${payload.questionId}:${payload.selectedOptionId ?? "none"}:${payload.correctOptionId}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    console.info(
      `[ai-api] ts=${requestedAt} method=POST path=/api/ai/explanations result=ok cached=true user=${userId}`,
    );
    return NextResponse.json<ExplanationResponse>({ explanation: cached.explanation, cached: true });
  }

  const isCorrect = payload.selectedOptionId === payload.correctOptionId;
  const explanation = isCorrect
    ? "Correct selection. Keep reinforcing this reasoning pattern."
    : `Your selection does not match the correct answer (${payload.correctOptionId}). Review the underlying decision criteria and retry this question.`;

  cache.set(key, { explanation, expiresAt: Date.now() + CACHE_TTL_MS });
  console.info(
    `[ai-api] ts=${requestedAt} method=POST path=/api/ai/explanations result=ok cached=false user=${userId}`,
  );

  return NextResponse.json<ExplanationResponse>({ explanation, cached: false });
}
