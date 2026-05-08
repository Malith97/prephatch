import { NextResponse } from "next/server";

import { resolveRequestUserId } from "../../../../lib/auth/request-user";
import { listAttemptsForOwner } from "../../../../server/exams/attempt-service";

type DashboardMetricsResponse = {
  summary: {
    totalAttempts: number;
    submittedAttempts: number;
    averageScore: number;
    latestScore: number | null;
  };
  weakAreas: Array<{
    topic: string;
    accuracy: number;
    total: number;
  }>;
  scoreTrend: Array<{
    attemptId: string;
    score: number;
    submittedAt: number;
  }>;
};

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: {
        code: "unauthorized",
        message: "User context is required to load dashboard metrics.",
      },
    },
    { status: 401 },
  );
}

export async function GET(request: Request) {
  const requestedAt = new Date().toISOString();
  const userId = resolveRequestUserId(request);

  if (!userId) {
    console.info(
      `[dashboard-api] ts=${requestedAt} method=GET path=/api/dashboard/metrics result=unauthorized`,
    );
    return unauthorizedResponse();
  }

  const attempts = listAttemptsForOwner(userId);
  const submitted = attempts.filter((attempt) => attempt.status === "submitted" && attempt.score);
  const scored = submitted.map((attempt) => attempt.score!.percentageScore);

  const weakAreasMap = new Map<string, { correct: number; total: number }>();
  for (const attempt of submitted) {
    for (const result of attempt.score!.questionResults) {
      const existing = weakAreasMap.get(result.topicLabel) ?? { correct: 0, total: 0 };
      existing.total += 1;
      if (result.isCorrect) {
        existing.correct += 1;
      }
      weakAreasMap.set(result.topicLabel, existing);
    }
  }

  const weakAreas = Array.from(weakAreasMap.entries())
    .map(([topic, stats]) => ({
      topic,
      accuracy: stats.total > 0 ? Number(((stats.correct / stats.total) * 100).toFixed(2)) : 0,
      total: stats.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  const scoreTrend = submitted
    .filter((attempt) => typeof attempt.submittedAt === "number")
    .map((attempt) => ({
      attemptId: attempt.attemptId,
      score: attempt.score!.percentageScore,
      submittedAt: attempt.submittedAt!,
    }))
    .sort((a, b) => a.submittedAt - b.submittedAt)
    .slice(-10);

  const payload: DashboardMetricsResponse = {
    summary: {
      totalAttempts: attempts.length,
      submittedAttempts: submitted.length,
      averageScore: scored.length
        ? Number((scored.reduce((sum, score) => sum + score, 0) / scored.length).toFixed(2))
        : 0,
      latestScore: scoreTrend.length ? scoreTrend[scoreTrend.length - 1].score : null,
    },
    weakAreas,
    scoreTrend,
  };

  console.info(
    `[dashboard-api] ts=${requestedAt} method=GET path=/api/dashboard/metrics result=ok user=${userId} attempts=${attempts.length} submitted=${submitted.length}`,
  );

  return NextResponse.json(payload);
}
