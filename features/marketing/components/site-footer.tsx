import Link from "next/link";

import { BrandMark } from "../../../components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="px-6 pb-10 pt-8 sm:pt-10">
      <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-[32px] border border-white/60 bg-slate-950 px-6 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:px-8 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
            Public preview
          </div>
          <BrandMark inverted />
          <p className="max-w-md text-sm leading-7 text-slate-300">
            PrepHatch is shaping a cleaner, calmer path to certification
            readiness with focused mock exams, trusted review, and a product
            experience built for confidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
            Explore
          </h2>
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            <Link
              href="/"
              className="inline-flex w-fit rounded-full transition duration-200 hover:text-white"
            >
              Landing page
            </Link>
            <Link
              href="/login"
              className="inline-flex w-fit rounded-full transition duration-200 hover:text-white"
            >
              Login preview
            </Link>
            <Link
              href="/register"
              className="inline-flex w-fit rounded-full transition duration-200 hover:text-white"
            >
              Register preview
            </Link>
            <Link
              href="/exams"
              className="inline-flex w-fit rounded-full transition duration-200 hover:text-white"
            >
              Existing exam prototype
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
            Notes
          </h2>
          <p className="text-sm leading-7 text-slate-300">
            The public auth surfaces are front-end only for now. No backend
            services are required to view or review them.
          </p>
        </div>
      </div>
    </footer>
  );
}
