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
      <div className="ph-animate-glow pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-0 h-72 w-72 rounded-full bg-secondary/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="ph-surface-elevated hidden rounded-[36px] p-5 lg:sticky lg:top-6 lg:flex lg:min-h-[calc(100vh-3rem)] lg:flex-col">
          <BrandMark inverted />

          <div className="mt-8 rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
            <p className="ph-eyebrow-inverse">
              Auth preview
            </p>
            <p className="mt-3 text-lg font-semibold text-text-primary">
              {mockSession.focusExam}
            </p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Shared shell is live. Real authentication checks can plug into
              this layout later without changing the dashboard structure.
            </p>
          </div>

          <div className="mt-6">
            <AppNavigation items={appNavigationItems} theme="dark" />
          </div>

          <div className="mt-auto rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
            <p className="text-sm font-semibold text-text-primary">
              {mockSession.name}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {mockSession.email}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="ph-badge ph-badge-accent">
                {mockSession.accessLabel}
              </span>
              <span className="ph-badge ph-badge-neutral">
                {mockSession.planLabel}
              </span>
            </div>
            <Link
              href="/login"
              className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift mt-5 w-fit"
            >
              Return to login preview
            </Link>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="ph-surface rounded-[32px] p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="lg:hidden">
                  <BrandMark />
                </div>
                <div className="hidden lg:block">
                  <p className="ph-eyebrow">
                    Authenticated preview shell
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                    Front-end app layout only. No real session enforcement yet.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ph-badge ph-badge-primary">
                    {mockSession.accessLabel}
                  </span>
                  <Link
                    href="/exams"
                    className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift"
                  >
                    Browse exams
                  </Link>
                </div>
              </div>

              <div className="border-t border-border/70 pt-4 lg:hidden">
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
