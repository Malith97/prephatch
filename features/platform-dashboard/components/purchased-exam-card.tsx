import Link from "next/link";

import { ExamLogoBadge } from "../../../components/exam-logo-badge";
import type { PurchasedExamCardData } from "../platform-dashboard-data";

type PurchasedExamCardProps = {
  exam: PurchasedExamCardData;
};

export function PurchasedExamCard({ exam }: Readonly<PurchasedExamCardProps>) {
  return (
    <article className="ph-hover-lift rounded-[30px] border border-border/70 bg-bg/35 p-5 shadow-subtle transition duration-200 hover:border-primary/20 hover:bg-surface-elevated/70">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <ExamLogoBadge
            provider={exam.provider}
            certificationCode={exam.certificationCode}
          />
          <div className="space-y-2">
            <p className="ph-eyebrow">
              {exam.provider}
            </p>
            <h3 className="text-xl font-semibold text-text-primary">
              {exam.title}
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-text-secondary">
              {exam.summary}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="ph-badge ph-badge-success">
            Purchased
          </span>
          <span className="ph-badge ph-badge-neutral">
            Last activity {exam.lastActivity}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-text-secondary">
              Completion
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {exam.completionLabel}
            </p>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-border/70"
            role="progressbar"
            aria-label={`${exam.title} completion`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={exam.completionPercentage}
          >
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(91,140,255,1),rgba(32,211,194,0.96))]"
              style={{ width: `${exam.completionPercentage}%` }}
            />
          </div>

          {exam.weakAreaIndicator ? (
            <p className="text-sm leading-7 text-text-secondary">
              Weak area:{" "}
              <span className="font-medium text-text-primary">
                {exam.weakAreaIndicator}
              </span>
            </p>
          ) : null}
        </div>

        <Link
          href={exam.continueHref}
          className="ph-btn ph-button-primary ph-hover-lift w-full lg:w-auto"
        >
          Continue
        </Link>
      </div>
    </article>
  );
}
