import Link from "next/link";

import { BrandMark } from "../../../components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-10 pt-8 sm:px-6 sm:pt-10 xl:px-8">
      <div className="ph-surface-elevated mx-auto grid w-full max-w-[1600px] gap-8 rounded-[30px] px-6 py-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div className="ph-badge ph-badge-accent">Public preview</div>
          <BrandMark inverted />
          <p className="max-w-md text-sm leading-7 text-text-secondary">
            PrepHatch gives learners a high-signal path to certification readiness through
            realistic mock exams, weak-area diagnostics, and structured study loops.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-primary">Explore</h2>
          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            <Link href="/" className="w-fit hover:text-text-primary">Landing page</Link>
            <Link href="/login" className="w-fit hover:text-text-primary">Login</Link>
            <Link href="/register" className="w-fit hover:text-text-primary">Register</Link>
            <Link href="/exams" className="w-fit hover:text-text-primary">Mock catalog</Link>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-primary">Platform</h2>
          <p className="text-sm leading-7 text-text-secondary">
            This front-end preview supports review flows without requiring live auth or payment
            infrastructure.
          </p>
        </div>
      </div>
    </footer>
  );
}
