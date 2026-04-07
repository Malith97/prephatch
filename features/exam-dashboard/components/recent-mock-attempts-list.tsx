import Link from "next/link";

import type { ExamWorkspaceResult } from "../../exams/mock-exam-workspace";

type RecentMockAttemptsListProps = {
  results: Array<ExamWorkspaceResult & { canOpen: boolean }>;
};

export function RecentMockAttemptsList({
  results,
}: Readonly<RecentMockAttemptsListProps>) {
  return (
    <section className="ph-surface rounded-[34px] p-6 sm:p-8">
      <p className="ph-eyebrow">
        Recent attempts
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-text-primary">
        Latest mock outcomes
      </h2>

      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <article
            key={result.id}
            className="rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-text-primary">
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

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="ph-badge ph-badge-primary">
                  {result.scoreLabel}
                </span>
                <span className="ph-badge ph-badge-secondary">
                  {result.readinessLabel}
                </span>
              </div>

              <Link
                href={result.href}
                className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
              >
                {result.canOpen ? "Open result" : "See mock list"}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
