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
    <section className="ph-surface rounded-[36px] p-6 sm:p-8">
      <ExamSectionHeading
        eyebrow="Previous results"
        title="Recent attempts and the signal each one produced."
      />

      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <article
            key={result.id}
            className="ph-hover-lift rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle transition duration-200 hover:border-primary/20 hover:bg-surface-elevated/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {result.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-text-secondary">
                  {result.breakdown}
                </p>
              </div>
              <span className="ph-badge ph-badge-neutral">
                {result.dateLabel}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Score
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {result.scoreLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Readiness
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {result.readinessLabel}
                </p>
              </div>
            </div>

            <Link
              href={result.href}
              className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift mt-5"
            >
              Open result
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
