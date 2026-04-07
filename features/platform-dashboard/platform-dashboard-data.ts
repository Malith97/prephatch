import {
  getMockExamWorkspace,
  type ExamWorkspaceData,
} from "../exams/mock-exam-workspace";
import {
  listMockExamCatalog,
  type ExamCatalogItem,
} from "../exams/mock-exam-catalog";

export type PlatformDashboardMetric = {
  label: string;
  value: string;
  note: string;
};

export type PurchasedExamCardData = {
  slug: string;
  provider: string;
  certificationCode: string;
  title: string;
  summary: string;
  completionPercentage: number;
  completionLabel: string;
  lastActivity: string;
  continueHref: string;
  weakAreaIndicator?: string;
};

export type MarketplaceFeature = {
  label: string;
  value: string;
};

export type MarketplaceExamCardData = {
  slug: string;
  provider: string;
  certificationCode: string;
  title: string;
  description: string;
  priceLabel: string;
  buyHref: string;
  previewHref: string;
  featureList: MarketplaceFeature[];
};

export type PromoBannerData = {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export type PackagePreviewData = {
  slug: string;
  provider: string;
  certificationCode: string;
  title: string;
  description: string;
  priceLabel: string;
  ownershipLabel: string;
  availability: string;
  audience: string;
  summary: string;
  focusAreas: string[];
  inclusions: MarketplaceFeature[];
  mockLineup: {
    id: string;
    title: string;
    mode: string;
    questions: number;
    duration: string;
    note: string;
  }[];
};

function getWorkspace(exam: ExamCatalogItem): ExamWorkspaceData | null {
  return getMockExamWorkspace(exam.slug);
}

function buildFeatureList(exam: ExamCatalogItem): MarketplaceFeature[] {
  const workspace = getWorkspace(exam);

  return [
    {
      label: "Mock exams",
      value: workspace ? String(workspace.mockExams.length) : exam.mockCountLabel,
    },
    {
      label: "Cheatsheets",
      value: workspace ? String(workspace.cheatsheet.length) : "Included",
    },
    {
      label: "Notes",
      value: workspace ? String(workspace.notes.length) : "Included",
    },
    {
      label: "Tips",
      value: workspace ? String(workspace.tips.length) : "Included",
    },
    {
      label: "Explanations",
      value: "Detailed review",
    },
    {
      label: "Analytics",
      value: "Weak area tracking",
    },
  ];
}

export function getPlatformDashboardMetrics(): PlatformDashboardMetric[] {
  const catalog = listMockExamCatalog();
  const purchasedCount = catalog.filter((exam) => exam.ownershipTone === "owned").length;
  const availableCount = catalog.filter((exam) => exam.ownershipTone !== "owned").length;

  return [
    {
      label: "Purchased exams",
      value: String(purchasedCount),
      note: "Currently unlocked certification workspaces",
    },
    {
      label: "Marketplace packages",
      value: String(availableCount),
      note: "Additional exams available to preview or buy",
    },
    {
      label: "Active access",
      value: "365 days",
      note: "One-time package access window from purchase date",
    },
  ];
}

export function getPurchasedExamCards(): PurchasedExamCardData[] {
  return listMockExamCatalog()
    .filter((exam) => exam.ownershipTone === "owned")
    .map((exam) => {
      const workspace = getWorkspace(exam);
      const completionPercentage = workspace?.readiness.score ?? 0;

      return {
        slug: exam.slug,
        provider: exam.provider,
        certificationCode: exam.certificationCode,
        title: exam.title,
        summary: workspace?.overview.summary ?? exam.detailSummary,
        completionPercentage,
        completionLabel: `${completionPercentage}% ready`,
        lastActivity: workspace?.previousResults[0]?.dateLabel ?? "No activity yet",
        continueHref: `/exam/${exam.slug}`,
        weakAreaIndicator: workspace?.weakAreas[0]?.topic,
      };
    });
}

export function getMarketplaceExamCards(): MarketplaceExamCardData[] {
  return listMockExamCatalog()
    .filter((exam) => exam.ownershipTone !== "owned")
    .map((exam) => ({
      slug: exam.slug,
      provider: exam.provider,
      certificationCode: exam.certificationCode,
      title: exam.title,
      description: exam.description,
      priceLabel: exam.priceLabel,
      buyHref: `/dashboard/marketplace/${exam.slug}`,
      previewHref: `/dashboard/marketplace/${exam.slug}`,
      featureList: buildFeatureList(exam),
    }));
}

export function getPromoBanner(): PromoBannerData {
  return {
    eyebrow: "New courses",
    title: "Azure and Google Cloud packages are staged for the next release wave.",
    body: "Preview the roadmap packages now, compare the mock coverage, and join the waitlist while the first AWS workspace continues to mature.",
    primaryHref: "/dashboard/marketplace",
    primaryLabel: "Review marketplace",
    secondaryHref: "/dashboard/help",
    secondaryLabel: "See rollout notes",
  };
}

export function getPackagePreviewData(packageSlug: string): PackagePreviewData | null {
  const exam = listMockExamCatalog().find((entry) => entry.slug === packageSlug);

  if (!exam) {
    return null;
  }

  const workspace = getWorkspace(exam);

  return {
    slug: exam.slug,
    provider: exam.provider,
    certificationCode: exam.certificationCode,
    title: exam.title,
    description: exam.description,
    priceLabel: exam.priceLabel,
    ownershipLabel: exam.ownershipLabel,
    availability: exam.availability === "live" ? "Available now" : "Planned release",
    audience:
      workspace?.overview.audience ??
      `${exam.provider} learners preparing for ${exam.title}.`,
    summary: workspace?.overview.summary ?? exam.detailSummary,
    focusAreas: workspace?.overview.focusAreas ?? exam.highlights,
    inclusions: buildFeatureList(exam),
    mockLineup:
      workspace?.mockExams.map((mock) => ({
        id: mock.id,
        title: mock.title,
        mode: mock.mode,
        questions: mock.questions,
        duration: mock.duration,
        note: mock.note,
      })) ?? [],
  };
}
