import type { ExamTrendPoint } from "../exam-dashboard-utils";

type ScoreTrendChartProps = {
  data: ExamTrendPoint[];
};

export function ScoreTrendChart({ data }: Readonly<ScoreTrendChartProps>) {
  if (data.length === 0) {
    return (
      <section className="ph-surface rounded-[34px] p-6 sm:p-8">
        <p className="ph-eyebrow">
          Score trend
        </p>
        <p className="mt-4 text-sm leading-7 text-text-secondary">
          No scored attempts are available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="ph-surface rounded-[34px] p-6 sm:p-8">
      <p className="ph-eyebrow">
        Score trend
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-text-primary">
        Attempt scores over time
      </h2>

      <div className="mt-6 grid min-h-[220px] grid-cols-[repeat(auto-fit,minmax(72px,1fr))] items-end gap-3">
        {data.map((point) => (
          <div key={point.label} className="flex h-full flex-col justify-end">
            <div className="relative flex-1 rounded-[24px] border border-border/70 bg-bg/35 p-3 shadow-subtle">
              <div className="absolute inset-x-3 bottom-3 top-3 flex items-end">
                <div
                  className="w-full rounded-[18px] bg-[linear-gradient(180deg,rgba(91,140,255,0.92),rgba(32,211,194,0.82))]"
                  style={{ height: `${Math.max(point.score, 8)}%` }}
                />
              </div>
              <div className="absolute right-3 top-3 text-xs font-semibold text-text-primary">
                {point.score}%
              </div>
            </div>
            <p className="mt-3 text-center text-xs uppercase tracking-[0.14em] text-text-secondary/70">
              {point.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
