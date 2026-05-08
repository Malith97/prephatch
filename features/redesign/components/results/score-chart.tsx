"use client";

type ScorePoint = {
  label: string;
  value: number;
};

export function ScoreChart({ points }: { points: ScorePoint[] }) {
  return (
    <section className="phx-card" aria-label="Score trend chart">
      <h2 className="phx-heading-sm mb-4">Score Trend</h2>
      <ul className="space-y-3">
        {points.map((point) => (
          <li key={point.label} className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="phx-label">{point.label}</span>
              <span className="phx-body-sm tabular-nums">{point.value}</span>
            </div>
            <div className="phx-chart-track" aria-hidden="true">
              <div className="phx-chart-fill" style={{ width: `${Math.min(Math.max(point.value, 0), 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
