import Link from "next/link";

import { BrandMark } from "../../../components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="px-6 pb-10 pt-8 sm:pt-10">
      <div className="ph-surface-elevated mx-auto grid w-full max-w-[1600px] gap-8 rounded-[32px] px-6 py-10 sm:px-8 xl:px-8 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div className="space-y-4">
          <div className="ph-badge ph-badge-accent">
            Public preview
          </div>
          <BrandMark inverted />
          <p className="max-w-md text-sm leading-7 text-text-secondary">
            PrepHatch is shaping a cleaner, calmer path to certification
            readiness with focused mock exams, trusted review, and a product
            experience built for confidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-primary">
            Explore
          </h2>
          <div className="flex flex-col gap-3 text-sm text-text-secondary">
            <Link
              href="/"
              className="inline-flex w-fit rounded-full transition duration-200 ease-premium hover:text-text-primary"
            >
              Landing page
            </Link>
            <Link
              href="/login"
              className="inline-flex w-fit rounded-full transition duration-200 ease-premium hover:text-text-primary"
            >
              Login preview
            </Link>
            <Link
              href="/register"
              className="inline-flex w-fit rounded-full transition duration-200 ease-premium hover:text-text-primary"
            >
              Register preview
            </Link>
            <Link
              href="/exams"
              className="inline-flex w-fit rounded-full transition duration-200 ease-premium hover:text-text-primary"
            >
              Existing exam prototype
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-primary">
            Notes
          </h2>
          <p className="text-sm leading-7 text-text-secondary">
            The public auth surfaces are front-end only for now. No backend
            services are required to view or review them.
          </p>
        </div>
      </div>
    </footer>
  );
}
