import Link from "next/link";

import type { ExamRecommendation } from "../exam-dashboard-utils";

type RecommendedActionsPanelProps = {
  recommendations: ExamRecommendation[];
};

export function RecommendedActionsPanel({
  recommendations,
}: Readonly<RecommendedActionsPanelProps>) {
  return (
    <section className="ph-surface-elevated rounded-[34px] p-6 sm:p-8">
      <p className="ph-eyebrow-inverse">
        Recommendations
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-text-primary">
        Suggested next actions
      </h2>

      <div className="mt-6 grid gap-4">
        {recommendations.map((recommendation) => (
          <article
            key={recommendation.id}
            className="rounded-[26px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
          >
            <h3 className="text-base font-semibold text-text-primary">
              {recommendation.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {recommendation.detail}
            </p>
            <Link
              href={recommendation.href}
              className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift mt-4"
            >
              {recommendation.ctaLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
