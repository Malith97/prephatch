import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark } from "../../../components/brand-mark";
import { appNavigationItems, mockSession } from "../mock-session";
import { AppNavigation } from "./app-navigation";

export function AuthenticatedShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="ph-animate-glow pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal-300/15 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-[36px] border border-white/70 bg-slate-950 p-5 text-white shadow-[0_28px_90px_rgba(15,23,42,0.16)] lg:sticky lg:top-6 lg:flex lg:min-h-[calc(100vh-3rem)] lg:flex-col">
          <BrandMark inverted />

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              Auth preview
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {mockSession.focusExam}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Shared shell is live. Real authentication checks can plug into
              this layout later without changing the dashboard structure.
            </p>
          </div>

          <div className="mt-6">
            <AppNavigation items={appNavigationItems} theme="dark" />
          </div>

          <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-semibold text-white">{mockSession.name}</p>
            <p className="mt-1 text-sm text-slate-300">{mockSession.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                {mockSession.accessLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                {mockSession.planLabel}
              </span>
            </div>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:translate-y-px"
            >
              Return to login preview
            </Link>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="rounded-[32px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="lg:hidden">
                  <BrandMark />
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Authenticated preview shell
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Front-end app layout only. No real session enforcement yet.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-800">
                    {mockSession.accessLabel}
                  </span>
                  <Link
                    href="/exams"
                    className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
                  >
                    Browse exams
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-200/80 pt-4 lg:hidden">
                <AppNavigation items={appNavigationItems} compact theme="light" />
              </div>
            </div>
          </header>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
