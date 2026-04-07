export type ExamOwnershipTone = "owned" | "active" | "neutral" | "comingSoon";

export type ExamCatalogItem = {
  id: string;
  slug: string;
  provider: string;
  category: string;
  certificationCode: string;
  title: string;
  description: string;
  priceLabel: string;
  ownershipLabel: string;
  ownershipTone: ExamOwnershipTone;
  progressLabel: string;
  progressDetail: string;
  availability: "live" | "planned";
  detailSummary: string;
  mockCountLabel: string;
  formatLabel: string;
  detailCtaHref: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  highlights: string[];
};

const mockExamCatalog: ExamCatalogItem[] = [
  {
    id: "aws-saa-c03-package",
    slug: "aws-saa-c03",
    provider: "AWS",
    category: "Solutions Architecture",
    certificationCode: "SAA-C03",
    title: "AWS Solutions Architect Associate",
    description:
      "A premium prep track for the associate-level architecture exam with focused timed mocks and explanation-driven review.",
    priceLabel: "$79 one-time",
    ownershipLabel: "Purchased",
    ownershipTone: "owned",
    progressLabel: "Borderline readiness",
    progressDetail: "Last timed score 78%. Resume the live prototype mock now.",
    availability: "live",
    detailSummary:
      "The first PrepHatch certification path blends a free preview mock with premium timed sets and a calmer review loop.",
    mockCountLabel: "1 free + 2 premium mocks",
    formatLabel: "Timed and review-based practice",
    detailCtaHref: "/exams/aws-saa-c03",
    primaryActionLabel: "Open working mock player",
    primaryActionHref: "/exams/aws-saa-c03/mock/aws-saa-c03-free-preview",
    secondaryActionLabel: "Review latest results",
    secondaryActionHref: "/exams/aws-saa-c03/results/latest-local",
    highlights: [
      "Free preview mock already wired into the working prototype",
      "Premium path centered on architecture, networking, storage, and scaling decisions",
      "Readiness-oriented experience with explanations and next-step guidance",
    ],
  },
  {
    id: "aws-dva-c02-package",
    slug: "aws-dva-c02",
    provider: "AWS",
    category: "Developer",
    certificationCode: "DVA-C02",
    title: "AWS Developer Associate",
    description:
      "A developer-focused track for learners who want stronger confidence across event-driven systems, observability, and service integrations.",
    priceLabel: "$69 one-time",
    ownershipLabel: "Enrolled",
    ownershipTone: "active",
    progressLabel: "Free preview planned",
    progressDetail: "Catalog-ready package direction with learner interest already modeled.",
    availability: "planned",
    detailSummary:
      "This path is aimed at application builders who need mock practice around serverless patterns, APIs, monitoring, and troubleshooting.",
    mockCountLabel: "1 free + 2 premium mocks planned",
    formatLabel: "Timed mocks with guided review",
    detailCtaHref: "/exams/aws-dva-c02",
    primaryActionLabel: "Create launch account",
    primaryActionHref: "/register",
    secondaryActionLabel: "Return to dashboard",
    secondaryActionHref: "/dashboard",
    highlights: [
      "Strong emphasis on Lambda, API Gateway, queues, and observability",
      "Designed for practical application scenarios instead of disconnected trivia",
      "Good candidate for the second AWS track after SAA-C03",
    ],
  },
  {
    id: "azure-az-104-package",
    slug: "azure-az-104",
    provider: "Azure",
    category: "Administrator",
    certificationCode: "AZ-104",
    title: "Microsoft Azure Administrator",
    description:
      "A cloud operations path covering identity, virtual networks, compute, storage, and day-to-day administration patterns.",
    priceLabel: "$74 one-time",
    ownershipLabel: "Watchlist",
    ownershipTone: "neutral",
    progressLabel: "Coming soon",
    progressDetail: "Strong candidate for multi-cloud expansion after the AWS launch path stabilizes.",
    availability: "planned",
    detailSummary:
      "Azure administration prep will lean into realistic configuration tradeoffs and the service decisions that matter under exam pressure.",
    mockCountLabel: "Launch package planned",
    formatLabel: "Premium exam workspace",
    detailCtaHref: "/exams/azure-az-104",
    primaryActionLabel: "Register interest",
    primaryActionHref: "/register",
    secondaryActionLabel: "Browse current live path",
    secondaryActionHref: "/exams/aws-saa-c03",
    highlights: [
      "Identity and governance scenarios alongside operational Azure fundamentals",
      "Fits future multi-cloud expansion without changing the core product shell",
      "Mock structure planned to mirror the same calm PrepHatch review model",
    ],
  },
  {
    id: "gcp-ace-package",
    slug: "gcp-ace",
    provider: "Google Cloud",
    category: "Associate Engineer",
    certificationCode: "ACE",
    title: "Google Associate Cloud Engineer",
    description:
      "A scalable catalog entry for hands-on cloud operations learners who want guided practice around deployment, networking, and platform services.",
    priceLabel: "$72 one-time",
    ownershipLabel: "Planned",
    ownershipTone: "comingSoon",
    progressLabel: "Roadmap preview",
    progressDetail: "Included to prove the catalog can scale across providers and certification families.",
    availability: "planned",
    detailSummary:
      "The GCP track is a roadmap preview for a broader certification catalog built on the same package and exam abstractions.",
    mockCountLabel: "Future launch package",
    formatLabel: "Structured mock exam path",
    detailCtaHref: "/exams/gcp-ace",
    primaryActionLabel: "Join waitlist preview",
    primaryActionHref: "/register",
    secondaryActionLabel: "Open dashboard",
    secondaryActionHref: "/dashboard",
    highlights: [
      "Catalog-ready structure for multi-provider certification packages",
      "Good fit for expansion after AWS and Azure prove stronger demand",
      "Same ownership, progress, and readiness model as the rest of the platform",
    ],
  },
];

export function listMockExamCatalog(): ExamCatalogItem[] {
  return mockExamCatalog;
}

export function getMockExamCatalogItem(
  examSlug: string,
): ExamCatalogItem | null {
  return mockExamCatalog.find((exam) => exam.slug === examSlug) ?? null;
}
