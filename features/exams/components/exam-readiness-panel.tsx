import type { ExamWorkspaceReadiness } from "../mock-exam-workspace";

type ExamReadinessPanelProps = {
  readiness: ExamWorkspaceReadiness;
};

export function ExamReadinessPanel({
  readiness,
}: Readonly<ExamReadinessPanelProps>) {
  return (
    <section className="rounded-[36px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
        Readiness tracker
      </p>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-teal-300 text-2xl font-semibold text-slate-950">
            {readiness.score}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            Current signal
          </p>
          <h2 className="text-3xl font-semibold">{readiness.label}</h2>
          <p className="text-sm leading-7 text-slate-300">{readiness.note}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            Trend
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-200">{readiness.trend}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            Next milestone
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-200">{readiness.target}</p>
        </div>
      </div>
    </section>
  );
}
