import Link from "next/link";
import type { ReactNode } from "react";

import { AuthenticatedShell } from "./authenticated-shell";
import { sellerNavigationItems } from "../navigation";

export function SellerShell({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthenticatedShell
      navigationItems={sellerNavigationItems}
      headerEyebrow="Seller studio"
      headerTitle="Operate your course business across content quality, learner outcomes, and income."
      headerDescription="This workspace owns instructor-side operations: courses, questions, mocks, student performance, analytics, and payouts."
      headerActions={
        <>
          <span className="ph-badge ph-badge-accent">
            Instructor mode
          </span>
          <Link
            href="/dashboard"
            className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
          >
            Learner dashboard
          </Link>
        </>
      }
      railPanel={
        <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
          <p className="ph-eyebrow-inverse">
            Growth cockpit
          </p>
          <p className="mt-3 text-lg font-semibold text-text-primary">
            Course business operations
          </p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Keep publishing, question quality, learner outcomes, and revenue
            decisions in one focused instructor surface.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="ph-badge ph-badge-secondary">
              Content quality
            </span>
            <span className="ph-badge ph-badge-primary">
              Monetization
            </span>
          </div>
        </div>
      }
    >
      {children}
    </AuthenticatedShell>
  );
}
