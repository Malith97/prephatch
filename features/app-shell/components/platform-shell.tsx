import Link from "next/link";
import type { ReactNode } from "react";

import type { AppSessionUser } from "../../../lib/auth/app-session";
import { AuthenticatedShell } from "./authenticated-shell";
import { getPlatformNavigationItems } from "../navigation";

export function PlatformShell({
  children,
  sessionUser,
}: Readonly<{
  children: ReactNode;
  sessionUser: AppSessionUser;
}>) {
  return (
    <AuthenticatedShell
      sessionUser={sessionUser}
      navigationItems={getPlatformNavigationItems(sessionUser.role)}
      headerEyebrow="Platform dashboard"
      headerTitle="Switch between owned certifications, new packages, and account-level actions."
      headerDescription="This layer owns cross-exam orientation, purchase flows, billing, and learner account surfaces."
      headerActions={
        <>
          <span className="ph-badge ph-badge-primary">
            Paid active
          </span>
          <Link
            href="/dashboard/marketplace"
            className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift"
          >
            Open marketplace
          </Link>
        </>
      }
      railPanel={
        <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
          <p className="ph-eyebrow-inverse">
            Command center
          </p>
          <p className="mt-3 text-lg font-semibold text-text-primary">
            Multi-exam study management
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Keep platform-level decisions here: what you own, what to buy next,
            what is expiring, and where to resume.
          </p>
        </div>
      }
    >
      {children}
    </AuthenticatedShell>
  );
}
