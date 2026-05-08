import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark } from "../../../components/brand-mark";
import { mockSession } from "../mock-session";
import { AppNavigation, type NavigationItem } from "./app-navigation";

export function AuthenticatedShell({
  children,
  navigationItems,
  railPanel,
  headerEyebrow,
  headerTitle,
  headerDescription,
  headerActions,
}: Readonly<{
  children: ReactNode;
  navigationItems: NavigationItem[];
  railPanel: ReactNode;
  headerEyebrow: string;
  headerTitle: string;
  headerDescription: string;
  headerActions?: ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6 xl:px-8">
      <div className="ph-animate-glow pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-0 h-72 w-72 rounded-full bg-secondary/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-[1600px] gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="ph-surface-elevated hidden rounded-[30px] p-5 lg:sticky lg:top-6 lg:flex lg:min-h-[calc(100vh-3rem)] lg:flex-col">
          <BrandMark inverted />

          <div className="mt-7">{railPanel}</div>

          <div className="mt-5">
            <AppNavigation items={navigationItems} theme="dark" />
          </div>

          <div className="mt-auto rounded-2xl border border-border/70 bg-bg/35 p-5 shadow-subtle">
            <p className="text-sm font-semibold text-text-primary">{mockSession.name}</p>
            <p className="mt-1 text-sm text-text-secondary">{mockSession.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="ph-badge ph-badge-accent">{mockSession.accessLabel}</span>
              <span className="ph-badge ph-badge-neutral">{mockSession.planLabel}</span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-text-secondary/65">{mockSession.renewalDateLabel}</p>
            <Link href="/login" className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift mt-5 w-fit">
              Return to login preview
            </Link>
          </div>
        </aside>

        <div className="space-y-5">
          <header className="ph-surface rounded-[28px] p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <div className="lg:hidden">
                    <BrandMark />
                  </div>
                  <p className="ph-eyebrow">{headerEyebrow}</p>
                  <h1 className="text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">{headerTitle}</h1>
                  <p className="max-w-3xl text-sm leading-7 text-text-secondary">{headerDescription}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">{headerActions}</div>
              </div>

              <div className="border-t border-border/70 pt-4 lg:hidden">
                <AppNavigation items={navigationItems} compact theme="light" />
              </div>
            </div>
          </header>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
