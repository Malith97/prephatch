import type { Metadata } from "next";

import { PlatformUtilityPage } from "../../../../features/platform-dashboard/components/platform-utility-page";

export const metadata: Metadata = {
  title: "Achievements | PrepHatch",
  description: "Track learning milestones in PrepHatch.",
};

export default function AchievementsRoute() {
  return (
    <PlatformUtilityPage
      eyebrow="Achievements"
      title="Cross-exam milestones and momentum."
      description="Achievements live at the platform level because they reflect the learner account, not a single certification."
      bullets={[
        "Show completion streaks and notable study consistency wins.",
        "Celebrate finished mocks, readiness improvements, and package milestones.",
        "Keep account-wide motivation separate from exam-specific analytics.",
      ]}
      actionHref="/dashboard/my-exams"
      actionLabel="Open my exams"
    />
  );
}
