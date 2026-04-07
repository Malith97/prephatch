import Link from "next/link";

import type { ExamWorkspaceMock } from "../mock-exam-workspace";
import { ExamSectionHeading } from "./exam-section-heading";

type ExamMockListProps = {
  mocks: ExamWorkspaceMock[];
};

export function ExamMockList({ mocks }: Readonly<ExamMockListProps>) {
  return (
    <section className="ph-surface rounded-[36px] p-6 sm:p-8">
      <ExamSectionHeading
        eyebrow="Mock exam list"
        title="Choose where to start, continue, or stage the next attempt."
      />

      <div className="mt-6 grid gap-4">
        {mocks.map((mock) => (
          <article
            key={mock.id}
            className="ph-hover-lift rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle transition duration-200 hover:border-primary/20 hover:bg-surface-elevated/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {mock.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-text-secondary">{mock.note}</p>
              </div>
              <span className="ph-badge ph-badge-neutral">
                {mock.access}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Mode
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {mock.mode}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {mock.status}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Questions
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {mock.questions}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Duration
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {mock.duration}
                </p>
              </div>
            </div>

            <Link
              href={mock.href}
              className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift mt-5"
            >
              {mock.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
