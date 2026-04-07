import type { ExamWorkspaceWeakArea } from "../../exams/mock-exam-workspace";
import { getWeakAreaScore } from "../exam-dashboard-utils";

type WeakAreasChartProps = {
  weakAreas: ExamWorkspaceWeakArea[];
};

export function WeakAreasChart({ weakAreas }: Readonly<WeakAreasChartProps>) {
  return (
    <section className="ph-surface rounded-[34px] p-6 sm:p-8">
      <p className="ph-eyebrow">
        Weak areas
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-text-primary">
        Topics most likely to change the next score
      </h2>

      <div className="mt-6 space-y-5">
        {weakAreas.map((area) => {
          const score = getWeakAreaScore(area);

          return (
            <article key={area.topic} className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  {area.topic}
                </h3>
                <span className="ph-badge ph-badge-warning">
                  {area.signal}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border/70">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(245,158,11,0.95),rgba(91,140,255,0.92))]"
                  style={{ width: `${Math.max(score, 14)}%` }}
                />
              </div>
              <p className="text-sm leading-7 text-text-secondary">
                {area.note}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
