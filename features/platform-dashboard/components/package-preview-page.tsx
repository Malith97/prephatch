import Link from "next/link";
import { notFound } from "next/navigation";

import { ExamLogoBadge } from "../../../components/exam-logo-badge";
import { SectionHeading } from "../../../components/section-heading";
import { getPackagePreviewData } from "../platform-dashboard-data";

type PackagePreviewPageProps = {
  packageSlug: string;
};

export function PackagePreviewPage({
  packageSlug,
}: Readonly<PackagePreviewPageProps>) {
  const packageData = getPackagePreviewData(packageSlug);

  if (!packageData) {
    notFound();
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <Link
          href="/dashboard/marketplace"
          className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
        >
          Back to marketplace
        </Link>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <ExamLogoBadge
                provider={packageData.provider}
                certificationCode={packageData.certificationCode}
              />
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="ph-badge ph-badge-secondary">
                    {packageData.provider}
                  </span>
                  <span className="ph-badge ph-badge-neutral">
                    {packageData.availability}
                  </span>
                  <span className="ph-badge ph-badge-primary">
                    {packageData.ownershipLabel}
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="ph-eyebrow">
                    {packageData.certificationCode}
                  </p>
                  <h1 className="ph-display-title">
                    {packageData.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-text-secondary">
                    {packageData.summary}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/marketplace"
                className="ph-btn ph-button-primary ph-hover-lift w-full sm:w-auto"
              >
                Buy access
              </Link>
              <Link
                href="/dashboard/help"
                className="ph-btn ph-button-secondary ph-hover-lift w-full sm:w-auto"
              >
                Ask a question
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-bg/35 p-6 shadow-subtle">
            <SectionHeading
              eyebrow="Package snapshot"
              title="Purchase-facing details"
              description={packageData.audience}
            />

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Price
                </dt>
                <dd className="mt-2 text-lg font-semibold text-text-primary">
                  {packageData.priceLabel}
                </dd>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  Access state
                </dt>
                <dd className="mt-2 text-lg font-semibold text-text-primary">
                  {packageData.ownershipLabel}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <SectionHeading
            eyebrow="What you get"
            title="Included package capabilities"
          />

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {packageData.inclusions.map((feature) => (
              <div
                key={feature.label}
                className="rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle"
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
        </section>

        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Focus areas"
            title="Primary study coverage"
          />

          <div className="mt-6 space-y-4">
            {packageData.focusAreas.map((focusArea) => (
              <article
                key={focusArea}
                className="rounded-[24px] border border-border/70 bg-bg/35 p-4 shadow-subtle"
              >
                <p className="text-sm leading-7 text-text-secondary">
                  {focusArea}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Mock lineup"
          title="Planned and included mock exams"
        />

        <div className="mt-6 grid gap-4">
          {packageData.mockLineup.map((mock) => (
            <article
              key={mock.id}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {mock.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">
                    {mock.note}
                  </p>
                </div>
                <span className="ph-badge ph-badge-neutral">
                  {mock.mode}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-border/70 bg-surface-elevated/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    Questions
                  </p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">
                    {mock.questions}
                  </p>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-surface-elevated/70 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    Duration
                  </p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">
                    {mock.duration}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
