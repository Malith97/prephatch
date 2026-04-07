import { SectionHeading } from "../../../components/section-heading";
import {
  getMarketplaceExamCards,
  getPlatformDashboardMetrics,
  getPromoBanner,
  getPurchasedExamCards,
} from "../platform-dashboard-data";
import { MarketplaceExamCard } from "./marketplace-exam-card";
import { PromoBanner } from "./promo-banner";
import { PurchasedExamCard } from "./purchased-exam-card";

export function PlatformDashboardPage() {
  const metrics = getPlatformDashboardMetrics();
  const purchasedExams = getPurchasedExamCards();
  const marketplaceExams = getMarketplaceExamCards();
  const promoBanner = getPromoBanner();

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-4">
            <p className="ph-eyebrow">
              Platform dashboard
            </p>
            <h1 className="ph-display-title">
              Manage every certification package from one cross-exam workspace.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-text-secondary">
              Purchased exams stay action-first here. Marketplace packages stay
              acquisition-first. Deep analytics and study resources live only
              inside each exam workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[26px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <p className="text-sm font-medium text-text-secondary/75">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {metric.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="My purchased exams"
          title="Continue owned workspaces without leaving the platform dashboard."
          description="Each card is optimized for resume behavior only: progress, last activity, and the fastest path back into the exam workspace."
        />

        <div className="mt-6 grid gap-4">
          {purchasedExams.map((exam) => (
            <PurchasedExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>

      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Marketplace"
          title="Preview additional certification packages before you commit."
          description="Marketplace cards stay purchase-oriented: scope, price, and included features. They do not expose owned-workspace analytics."
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {marketplaceExams.map((exam) => (
            <MarketplaceExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>

      <PromoBanner banner={promoBanner} />
    </main>
  );
}
