import type { Metadata } from "next";

import { PlatformUtilityPage } from "../../../../features/platform-dashboard/components/platform-utility-page";

export const metadata: Metadata = {
  title: "Settings | PrepHatch",
  description: "Manage account preferences in PrepHatch.",
};

export default function SettingsRoute() {
  return (
    <PlatformUtilityPage
      eyebrow="Settings"
      title="Account-wide preferences."
      description="This route is for account identity, notification preferences, and product-level defaults. Exam-specific settings remain inside each exam workspace."
      bullets={[
        "Manage learner profile details and default study preferences.",
        "Control notification behavior once reminder systems are connected.",
        "Keep package-scoped settings out of the platform-level account area.",
      ]}
      actionHref="/dashboard"
      actionLabel="Back to dashboard"
    />
  );
}
