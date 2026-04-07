import Link from "next/link";

import type { PromoBannerData } from "../platform-dashboard-data";

type PromoBannerProps = {
  banner: PromoBannerData;
};

export function PromoBanner({ banner }: Readonly<PromoBannerProps>) {
  return (
    <section className="ph-surface-elevated overflow-hidden rounded-[34px] p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-3">
          <p className="ph-eyebrow-inverse">
            {banner.eyebrow}
          </p>
          <h2 className="ph-section-title">
            {banner.title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-text-secondary">
            {banner.body}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link
            href={banner.primaryHref}
            className="ph-btn ph-button-primary ph-hover-lift w-full sm:w-auto"
          >
            {banner.primaryLabel}
          </Link>
          <Link
            href={banner.secondaryHref}
            className="ph-btn ph-button-secondary ph-hover-lift w-full sm:w-auto"
          >
            {banner.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
