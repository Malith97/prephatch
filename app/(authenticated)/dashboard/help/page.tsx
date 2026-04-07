import type { Metadata } from "next";

import { PlatformUtilityPage } from "../../../../features/platform-dashboard/components/platform-utility-page";

export const metadata: Metadata = {
  title: "Help | PrepHatch",
  description: "Get product guidance and support in PrepHatch.",
};

export default function HelpRoute() {
  return (
    <PlatformUtilityPage
      eyebrow="Help"
      title="Support, FAQs, and rollout guidance."
      description="Help belongs to the platform dashboard because it spans access, billing, content questions, and exam workspace orientation."
      bullets={[
        "Explain the difference between platform navigation and exam workspace navigation.",
        "Provide answers about package access, expiry, and future course rollout.",
        "Keep support entry points visible without crowding the exam workspace.",
      ]}
      actionHref="/dashboard/marketplace"
      actionLabel="Preview packages"
    />
  );
}
