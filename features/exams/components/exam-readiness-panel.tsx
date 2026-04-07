import type { ExamWorkspaceReadiness } from "../mock-exam-workspace";

type ExamReadinessPanelProps = {
  readiness: ExamWorkspaceReadiness;
};

export function ExamReadinessPanel({
  readiness,
}: Readonly<ExamReadinessPanelProps>) {
  return (
    <section className="ph-surface-elevated rounded-[36px] p-6 sm:p-8">
      <p className="ph-eyebrow-inverse">
        Readiness tracker
      </p>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/70 bg-bg/35 shadow-inner">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(91,140,255,0.95),rgba(32,211,194,0.82))] text-2xl font-semibold text-text-primary shadow-glow">
            {readiness.score}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">
            Current signal
          </p>
          <h2 className="text-3xl font-semibold text-text-primary">
            {readiness.label}
          </h2>
          <p className="text-sm leading-7 text-text-secondary">{readiness.note}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">
            Trend
          </p>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            {readiness.trend}
          </p>
        </div>
        <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">
            Next milestone
          </p>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            {readiness.target}
          </p>
        </div>
      </div>
    </section>
  );
}
