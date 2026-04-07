import Link from "next/link";

import type { ExamCatalogItem } from "../mock-exam-catalog";

type ExamCardProps = {
  exam: ExamCatalogItem;
};

const ownershipToneClasses = {
  owned: "ph-badge ph-badge-success",
  active: "ph-badge ph-badge-primary",
  neutral: "ph-badge ph-badge-neutral",
  comingSoon: "ph-badge ph-badge-warning",
} as const;

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <article className="ph-surface ph-hover-lift group flex h-full flex-col rounded-[32px] p-6 hover:border-primary/20">
      <div className="flex h-full flex-col space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="ph-badge ph-badge-secondary">
            {exam.provider}
          </span>
          <span className="ph-badge ph-badge-neutral">
            {exam.category}
          </span>
          <span className={ownershipToneClasses[exam.ownershipTone]}>
            {exam.ownershipLabel}
          </span>
        </div>

        <div className="space-y-3">
          <p className="ph-eyebrow">
            {exam.certificationCode}
          </p>
          <h2 className="text-2xl font-semibold text-text-primary">{exam.title}</h2>
          <p className="text-sm leading-7 text-text-secondary">
            {exam.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle">
            <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
              Price
            </p>
            <p className="mt-2 text-base font-semibold text-text-primary">
              {exam.priceLabel}
            </p>
          </div>
          <div className="rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle">
            <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
              Progress
            </p>
            <p className="mt-2 text-base font-semibold text-text-primary">
              {exam.progressLabel}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-surface-elevated/65 p-4 shadow-subtle">
          <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
            State detail
          </p>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            {exam.progressDetail}
          </p>
        </div>

        <Link
          href={exam.detailCtaHref}
          className="ph-btn ph-button-primary ph-hover-lift mt-auto w-fit"
        >
          View exam details
        </Link>
      </div>
    </article>
  );
}
