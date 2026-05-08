import type { Metadata } from "next";

import { AuthWrapper, OnboardingForm, PublicShell } from "../../features/redesign/components";

export const metadata: Metadata = {
  title: "Onboarding | PrepHatch",
  description: "Set your learning goals and schedule for personalized exam preparation.",
};

export default function OnboardingPage() {
  return (
    <PublicShell>
      <AuthWrapper title="Set your prep plan" subtitle="Align sessions to your exam goal and available time.">
        <OnboardingForm />
      </AuthWrapper>
    </PublicShell>
  );
}
