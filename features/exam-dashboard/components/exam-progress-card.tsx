import type { ExamWorkspaceData } from "../../exams/mock-exam-workspace";

type ExamProgressCardProps = {
  exam: ExamWorkspaceData;
};

export function ExamProgressCard({ exam }: Readonly<ExamProgressCardProps>) {
  return (
    <section className="ph-surface rounded-[34px] p-6 sm:p-8">
      <p className="ph-eyebrow">
        Exam progress
      </p>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/70 bg-bg/35 shadow-inner">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(91,140,255,0.95),rgba(32,211,194,0.82))] text-2xl font-semibold text-text-primary shadow-glow">
            {exam.readiness.score}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/70">
            Current readiness
          </p>
          <h2 className="text-3xl font-semibold text-text-primary">
            {exam.readiness.label}
          </h2>
          <p className="text-sm leading-7 text-text-secondary">
            {exam.readiness.note}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {exam.progressSummary.slice(0, 2).map((metric) => (
          <article
            key={metric.label}
            className="rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">
              {metric.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {metric.note}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
