"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type MetricsPayload = {
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

export function DashboardMetricsPanel() {
  const [payload, setPayload] = useState<MetricsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/dashboard/metrics", { headers: { Accept: "application/json" } });
      if (!response.ok) {
        throw new Error(`Failed to load dashboard metrics (${response.status})`);
      }
      const nextPayload = (await response.json()) as MetricsPayload;
      setPayload(nextPayload);
      console.info("[dashboard-runtime] metrics_loaded", {
        attempts: nextPayload.summary.totalAttempts,
        submitted: nextPayload.summary.submittedAttempts,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard metrics.";
      setError(message);
      setPayload(null);
      console.error("[dashboard-runtime] metrics_load_failed", { error: message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 15_000);
    return () => window.clearInterval(interval);
  }, [load]);

  const maxScore = useMemo(() => {
    if (!payload || payload.scoreTrend.length === 0) {
      return 100;
    }
    return Math.max(100, ...payload.scoreTrend.map((point) => point.score));
  }, [payload]);

  return (
    <section className="ph-surface rounded-[36px] p-6 sm:p-8" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="ph-eyebrow">Dashboard metrics</p>
          <h2 className="ph-section-title">Attempts, scores, weak areas, and trend.</h2>
        </div>
        <button type="button" onClick={() => void load()} className="ph-btn ph-btn-sm ph-button-secondary">
          Refresh
        </button>
      </div>

      {loading ? <p className="mt-6 text-sm text-text-secondary">Loading dashboard metrics...</p> : null}
      {error ? <p className="mt-6 text-sm text-red-500">{error}</p> : null}

      {!loading && !error && payload ? (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Total attempts" value={String(payload.summary.totalAttempts)} />
            <Metric label="Submitted" value={String(payload.summary.submittedAttempts)} />
            <Metric label="Average score" value={`${payload.summary.averageScore}%`} />
            <Metric label="Latest score" value={payload.summary.latestScore === null ? "-" : `${payload.summary.latestScore}%`} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
              <h3 className="text-base font-semibold text-text-primary">Weak areas</h3>
              <ul className="mt-4 space-y-3">
                {payload.weakAreas.length === 0 ? (
                  <li className="text-sm text-text-secondary">No submitted attempts yet.</li>
                ) : (
                  payload.weakAreas.map((area) => (
                    <li key={area.topic} className="text-sm text-text-secondary">
                      <span className="font-semibold text-text-primary">{area.topic}</span>: {area.accuracy}% ({area.total} questions)
                    </li>
                  ))
                )}
              </ul>
            </article>

            <article className="rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
              <h3 className="text-base font-semibold text-text-primary">Score trend</h3>
              <ul className="mt-4 space-y-3">
                {payload.scoreTrend.length === 0 ? (
                  <li className="text-sm text-text-secondary">No score trend yet.</li>
                ) : (
                  payload.scoreTrend.map((point) => (
                    <li key={point.attemptId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>{new Date(point.submittedAt).toLocaleDateString()}</span>
                        <span>{point.score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-elevated/75">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(point.score / maxScore) * 100}%` }} />
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </article>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
    </article>
  );
}
