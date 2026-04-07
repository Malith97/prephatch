import Link from "next/link";

import { ExamLogoBadge } from "../../../components/exam-logo-badge";
import type { MarketplaceExamCardData } from "../platform-dashboard-data";

type MarketplaceExamCardProps = {
  exam: MarketplaceExamCardData;
};

export function MarketplaceExamCard({
  exam,
}: Readonly<MarketplaceExamCardProps>) {
  return (
    <article className="ph-hover-lift rounded-[30px] border border-border/70 bg-bg/35 p-5 shadow-subtle transition duration-200 hover:border-primary/20 hover:bg-surface-elevated/70">
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
          <p className="text-sm leading-7 text-text-secondary">
            {exam.description}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="ph-badge ph-badge-neutral">
          {exam.priceLabel}
        </span>
        <span className="text-xs uppercase tracking-[0.16em] text-text-secondary/65">
          Package preview
        </span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {exam.featureList.map((feature) => (
          <div
            key={feature.label}
            className="rounded-[22px] border border-border/70 bg-surface-elevated/70 px-4 py-3"
          >
            <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
              {feature.label}
            </dt>
            <dd className="mt-2 text-sm font-semibold text-text-primary">
              {feature.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href={exam.buyHref}
          className="ph-btn ph-button-primary ph-hover-lift w-full sm:w-auto"
        >
          Buy access
        </Link>
        <Link
          href={exam.previewHref}
          className="ph-btn ph-button-secondary ph-hover-lift w-full sm:w-auto"
        >
          Preview
        </Link>
      </div>
    </article>
  );
}
