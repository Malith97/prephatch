import Link from "next/link";

import type { ExamWorkspaceResult } from "../mock-exam-workspace";
import { ExamSectionHeading } from "./exam-section-heading";

type ExamPreviousResultsProps = {
  results: ExamWorkspaceResult[];
};

export function ExamPreviousResults({
  results,
}: Readonly<ExamPreviousResultsProps>) {
  return (
    <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
      <ExamSectionHeading
        eyebrow="Previous results"
        title="Recent attempts and the signal each one produced."
      />

      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <article
            key={result.id}
            className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5 transition duration-200 hover:border-slate-300 hover:bg-white"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  {result.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {result.breakdown}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                {result.dateLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Score
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {result.scoreLabel}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Readiness
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {result.readinessLabel}
                </p>
              </div>
            </div>

            <Link
              href={result.href}
              className="mt-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
            >
              Open result
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
