import type { Metadata } from "next";

import { LandingPage } from "../features/marketing/components/landing-page";

export const metadata: Metadata = {
  title: "PrepHatch | Premium Exam Prep, Mock Tests, and Certification Readiness",
  description:
    "PrepHatch is a premium online exam preparation platform with realistic mock tests, structured certification prep, analytics, and progress tracking.",
  keywords: [
    "exam prep",
    "online exam preparation",
    "mock tests",
    "certification prep",
    "certification exam practice",
    "AWS SAA-C03 prep",
  ],
  openGraph: {
    title: "PrepHatch | Premium Exam Prep Platform",
    description:
      "Pass certification exams with realistic mock exams, structured prep flows, and actionable readiness analytics.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepHatch | Premium Exam Prep Platform",
    description:
      "Structured online exam preparation with mock tests, analytics, and progress tracking for certification success.",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
