import type { Metadata } from "next";

import { PlatformUtilityPage } from "../../../../features/platform-dashboard/components/platform-utility-page";

export const metadata: Metadata = {
  title: "Billing | PrepHatch",
  description: "Manage package purchases and renewals in PrepHatch.",
};

export default function BillingRoute() {
  return (
    <PlatformUtilityPage
      eyebrow="Billing"
      title="Purchases, renewals, and access windows."
      description="Commerce stays at the platform level because it spans packages and entitlements."
      bullets={[
        "Track one-time package purchases and their 365-day access windows.",
        "Surface renewal timing without mixing billing controls into the exam workspace.",
        "Keep invoices, payment methods, and entitlement history in one place.",
      ]}
      actionHref="/dashboard/marketplace"
      actionLabel="Review marketplace"
    />
  );
}
