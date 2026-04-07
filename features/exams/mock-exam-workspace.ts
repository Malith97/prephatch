import {
  getMockExamCatalogItem,
  type ExamCatalogItem,
} from "./mock-exam-catalog";

export type ExamWorkspaceMock = {
  id: string;
  title: string;
  mode: string;
  isLive: boolean;
  access: string;
  status: string;
  questions: number;
  duration: string;
  note: string;
  ctaLabel: string;
  href: string;
};

export type ExamWorkspaceResult = {
  id: string;
  title: string;
  scoreLabel: string;
  readinessLabel: string;
  dateLabel: string;
  breakdown: string;
  href: string;
};

export type ExamWorkspaceWeakArea = {
  topic: string;
  signal: string;
  note: string;
};

export type ExamWorkspaceResource = {
  title: string;
  body: string;
};

export type ExamWorkspaceCheatsheetItem = {
  label: string;
  detail: string;
};

export type ExamWorkspaceReadiness = {
  score: number;
  label: string;
  note: string;
  target: string;
  trend: string;
};

export type ExamWorkspaceMetric = {
  label: string;
  value: string;
  note: string;
};

export type ExamWorkspaceData = ExamCatalogItem & {
  overview: {
    summary: string;
    audience: string;
    focusAreas: string[];
  };
  mockExams: ExamWorkspaceMock[];
  previousResults: ExamWorkspaceResult[];
  weakAreas: ExamWorkspaceWeakArea[];
  notes: ExamWorkspaceResource[];
  cheatsheet: ExamWorkspaceCheatsheetItem[];
  tips: ExamWorkspaceResource[];
  readiness: ExamWorkspaceReadiness;
  progressSummary: ExamWorkspaceMetric[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

type ExamWorkspaceSupplement = Omit<
  ExamWorkspaceData,
  keyof ExamCatalogItem
>;

const workspaceSupplements: Record<string, ExamWorkspaceSupplement> = {
  "aws-saa-c03": {
    overview: {
      summary:
        "This workspace is designed around architecture decision quality, calm timed practice, and explanation-led review that helps learners decide what to study next.",
      audience:
        "Best for associate-level AWS learners preparing for architecture scenario questions and service tradeoff decisions.",
      focusAreas: [
        "Networking patterns, private and public boundaries, and secure defaults",
        "Storage durability, database scaling, and workload-fit decisions",
        "Resilience, scaling, cost-awareness, and common architecture tradeoffs",
      ],
    },
    mockExams: [
      {
        id: "aws-saa-c03-free-preview",
        title: "Free Preview Mock",
        mode: "Timed preview",
        isLive: true,
        access: "Included",
        status: "Completed once",
        questions: 4,
        duration: "10 minutes",
        note: "This is the working prototype flow already wired into the app.",
        ctaLabel: "Continue mock",
        href: "/exams/aws-saa-c03/mock/aws-saa-c03-free-preview",
      },
      {
        id: "aws-saa-c03-premium-01",
        title: "Premium Timed Mock 01",
        mode: "Full timed mock",
        isLive: false,
        access: "Purchased",
        status: "Ready to start",
        questions: 65,
        duration: "130 minutes",
        note: "Covers architecture fundamentals with balanced service-fit and scaling questions.",
        ctaLabel: "Start when live",
        href: "/dashboard",
      },
      {
        id: "aws-saa-c03-premium-02",
        title: "Premium Timed Mock 02",
        mode: "Full timed mock",
        isLive: false,
        access: "Purchased",
        status: "Resume planned",
        questions: 65,
        duration: "130 minutes",
        note: "Leans more heavily into resiliency, networking, and database tradeoffs.",
        ctaLabel: "See dashboard",
        href: "/dashboard",
      },
    ],
    previousResults: [
      {
        id: "aws-saa-c03-attempt-004",
        title: "Free Preview Mock",
        scoreLabel: "78%",
        readinessLabel: "Borderline",
        dateLabel: "Today, 10:20",
        breakdown: "3 correct, 1 incorrect, 0 unanswered",
        href: "/exams/aws-saa-c03/results/latest-local",
      },
      {
        id: "aws-saa-c03-attempt-003",
        title: "Concept review pass",
        scoreLabel: "74%",
        readinessLabel: "Borderline",
        dateLabel: "Apr 5",
        breakdown: "Architecture and storage improved from last attempt",
        href: "/dashboard",
      },
      {
        id: "aws-saa-c03-attempt-002",
        title: "Timed checkpoint",
        scoreLabel: "69%",
        readinessLabel: "Not ready",
        dateLabel: "Apr 1",
        breakdown: "Networking and read-scaling still needed work",
        href: "/dashboard",
      },
    ],
    weakAreas: [
      {
        topic: "VPC routing and subnet boundaries",
        signal: "62% accuracy",
        note: "Review internet gateway, NAT, and public versus private subnet patterns.",
      },
      {
        topic: "Storage durability and service fit",
        signal: "68% accuracy",
        note: "Clarify when S3, EBS, and ephemeral storage are the right fit.",
      },
      {
        topic: "Database read scaling",
        signal: "71% accuracy",
        note: "Practice when to reach for read replicas, caching, and managed scaling patterns.",
      },
    ],
    notes: [
      {
        title: "Architecture pattern reminder",
        body: "When a question mixes internet reachability with application isolation, start by mapping public entry points separately from private service tiers.",
      },
      {
        title: "Confidence check",
        body: "Current results suggest the learner understands broad service categories but still hesitates on networking and durability edge cases.",
      },
    ],
    cheatsheet: [
      {
        label: "S3",
        detail: "Durable multi-AZ object storage. Strong default for high-durability object use cases.",
      },
      {
        label: "Read replicas",
        detail: "Improve read scalability by offloading traffic from the primary relational database instance.",
      },
      {
        label: "ALB + Auto Scaling",
        detail: "Baseline stateless web pattern when a workload needs elastic horizontal scale.",
      },
      {
        label: "Private subnet",
        detail: "Use for backend tiers that should not be directly internet-addressable.",
      },
    ],
    tips: [
      {
        title: "Read the constraint before the service name",
        body: "Questions usually reveal the right answer through constraints like durability, latency, internet exposure, or managed operations.",
      },
      {
        title: "Eliminate impossible network designs first",
        body: "If an option exposes a private tier incorrectly or relies on a single fragile component, it is often safe to remove early.",
      },
      {
        title: "Watch for the scaling pattern",
        body: "Stateless compute, read-heavy databases, and durable object storage each have a recognizable default answer family.",
      },
    ],
    readiness: {
      score: 78,
      label: "Borderline",
      note: "You are close to the target. One or two focused study blocks across networking and storage should improve the next timed result.",
      target: "Push above 80% to move from borderline to ready.",
      trend: "+9 points over the last three attempts",
    },
    progressSummary: [
      {
        label: "Completed attempts",
        value: "4",
        note: "Momentum is strong and improving week over week.",
      },
      {
        label: "Best score",
        value: "78%",
        note: "Latest timed result is also the strongest result so far.",
      },
      {
        label: "Weak topics",
        value: "3",
        note: "Mostly clustered around networking and storage-fit questions.",
      },
      {
        label: "Premium access",
        value: "Active",
        note: "Additional timed mocks are unlocked in the planned product flow.",
      },
    ],
    primaryCta: {
      label: "Continue working mock",
      href: "/exams/aws-saa-c03/mock/aws-saa-c03-free-preview",
    },
    secondaryCta: {
      label: "Review latest results",
      href: "/exams/aws-saa-c03/results/latest-local",
    },
  },
  "aws-dva-c02": {
    overview: {
      summary:
        "This workspace models a developer-focused prep track with event-driven architecture, service integration, observability, and troubleshooting patterns.",
      audience:
        "Best for learners building and operating AWS applications who want scenario-based developer certification practice.",
      focusAreas: [
        "Serverless architecture, eventing, and asynchronous workflows",
        "API design, monitoring, logging, and deployment confidence",
        "Security, integration choices, and operational debugging under pressure",
      ],
    },
    mockExams: [
      {
        id: "aws-dva-c02-free-preview",
        title: "Developer Free Preview",
        mode: "Timed preview",
        isLive: false,
        access: "Planned",
        status: "Not live yet",
        questions: 12,
        duration: "20 minutes",
        note: "Planned entry path for the second AWS certification package.",
        ctaLabel: "Register interest",
        href: "/register",
      },
      {
        id: "aws-dva-c02-premium-01",
        title: "Premium Timed Mock 01",
        mode: "Full timed mock",
        isLive: false,
        access: "Enrolled",
        status: "Preview state",
        questions: 65,
        duration: "130 minutes",
        note: "Would emphasize Lambda, API Gateway, queues, and deployment confidence.",
        ctaLabel: "Open dashboard",
        href: "/dashboard",
      },
    ],
    previousResults: [
      {
        id: "aws-dva-c02-preview",
        title: "Catalog preview state",
        scoreLabel: "N/A",
        readinessLabel: "Planning",
        dateLabel: "Roadmap",
        breakdown: "No real attempt history yet for this package",
        href: "/register",
      },
    ],
    weakAreas: [
      {
        topic: "Event-driven service fit",
        signal: "Early interest",
        note: "Good future section for Lambda, SQS, SNS, and EventBridge tradeoffs.",
      },
      {
        topic: "Observability and debugging",
        signal: "Planned focus",
        note: "Logs, metrics, tracing, and deployment failure analysis would be emphasized here.",
      },
    ],
    notes: [
      {
        title: "Package status",
        body: "This certification path is scaffolded as a mock data workspace so the product shell can scale before the backend content pipeline is ready.",
      },
    ],
    cheatsheet: [
      {
        label: "Lambda",
        detail: "Good default for event-driven compute when operational overhead should stay low.",
      },
      {
        label: "EventBridge",
        detail: "Useful for event routing across services and decoupled integrations.",
      },
    ],
    tips: [
      {
        title: "Think in integration patterns",
        body: "Developer questions often hinge on choosing the right interaction style: sync, async, queued, or event-driven.",
      },
    ],
    readiness: {
      score: 0,
      label: "Not started",
      note: "This workspace is in planning mode and does not yet include live attempts.",
      target: "Start with a preview mock once the package goes live.",
      trend: "Package demand modeled, no attempt trend yet",
    },
    progressSummary: [
      {
        label: "Workspace state",
        value: "Preview",
        note: "Structure is ready even though live content is still pending.",
      },
      {
        label: "Planned mocks",
        value: "3",
        note: "One free path and two premium timed mocks are modeled.",
      },
    ],
    primaryCta: {
      label: "Register interest",
      href: "/register",
    },
    secondaryCta: {
      label: "Return to dashboard",
      href: "/dashboard",
    },
  },
  "azure-az-104": {
    overview: {
      summary:
        "This workspace preview shows how an administrator-focused certification track could sit inside the same package model without changing the surrounding UI.",
      audience:
        "Best for Azure learners focused on identity, virtual networks, storage, compute, and operational administration.",
      focusAreas: [
        "Identity, governance, and resource management",
        "Networking, storage, compute, and backup patterns",
        "Operational decision-making and day-to-day cloud administration",
      ],
    },
    mockExams: [
      {
        id: "azure-az-104-preview",
        title: "Azure Administrator Preview Mock",
        mode: "Timed preview",
        isLive: false,
        access: "Watchlist",
        status: "Coming soon",
        questions: 15,
        duration: "25 minutes",
        note: "Structured to prove catalog scale beyond the first AWS package.",
        ctaLabel: "Register interest",
        href: "/register",
      },
    ],
    previousResults: [
      {
        id: "azure-az-104-none",
        title: "No prior attempts",
        scoreLabel: "N/A",
        readinessLabel: "Roadmap",
        dateLabel: "Future package",
        breakdown: "This package has no learner history yet",
        href: "/register",
      },
    ],
    weakAreas: [
      {
        topic: "Identity and access administration",
        signal: "Planned focus",
        note: "A likely weak-area section once real learner data exists.",
      },
      {
        topic: "Network and storage operations",
        signal: "Planned focus",
        note: "Good candidate for operational decision scenarios and review loops.",
      },
    ],
    notes: [
      {
        title: "Multi-cloud readiness",
        body: "This package demonstrates the product can accommodate multiple providers while preserving a shared learner shell.",
      },
    ],
    cheatsheet: [
      {
        label: "Azure Virtual Network",
        detail: "Core networking boundary for workloads, subnets, and connectivity decisions.",
      },
      {
        label: "Microsoft Entra ID",
        detail: "Identity layer that would likely appear across admin and governance questions.",
      },
    ],
    tips: [
      {
        title: "Watch for admin responsibility boundaries",
        body: "Administrator questions often separate identity, governance, operations, and networking responsibilities.",
      },
    ],
    readiness: {
      score: 0,
      label: "Coming soon",
      note: "No readiness score is calculated yet because this package is still a forward-looking mock.",
      target: "Use the waitlist state to signal interest while the package is being shaped.",
      trend: "Catalog expansion path only",
    },
    progressSummary: [
      {
        label: "Catalog state",
        value: "Roadmap",
        note: "Azure is included to validate future multi-cloud growth.",
      },
      {
        label: "Launch shape",
        value: "1 package",
        note: "Free and premium mock structure can be reused here later.",
      },
    ],
    primaryCta: {
      label: "Register interest",
      href: "/register",
    },
    secondaryCta: {
      label: "Browse live AWS path",
      href: "/exams/aws-saa-c03",
    },
  },
  "gcp-ace": {
    overview: {
      summary:
        "This workspace preview represents a future associate-level Google Cloud path using the same package, progress, and readiness abstractions as the other certification tracks.",
      audience:
        "Best for learners who want a hands-on cloud operations certification path with deployment, networking, and platform fundamentals.",
      focusAreas: [
        "Deployment workflows and service operations",
        "Networking, IAM, and platform resource management",
        "Environment setup, troubleshooting, and workload fit",
      ],
    },
    mockExams: [
      {
        id: "gcp-ace-preview",
        title: "Associate Cloud Engineer Preview",
        mode: "Timed preview",
        isLive: false,
        access: "Planned",
        status: "Roadmap only",
        questions: 15,
        duration: "25 minutes",
        note: "Modeled to prove the system can grow beyond a single vendor.",
        ctaLabel: "Join waitlist preview",
        href: "/register",
      },
    ],
    previousResults: [
      {
        id: "gcp-ace-none",
        title: "No prior attempts",
        scoreLabel: "N/A",
        readinessLabel: "Roadmap",
        dateLabel: "Future package",
        breakdown: "This package is present as a scalable mock data placeholder",
        href: "/register",
      },
    ],
    weakAreas: [
      {
        topic: "Deployment and environment operations",
        signal: "Future signal",
        note: "A natural area for future learner analytics once the package is live.",
      },
      {
        topic: "Platform networking and IAM",
        signal: "Future signal",
        note: "Likely to produce the strongest weak-area insights in an ACE workspace.",
      },
    ],
    notes: [
      {
        title: "Scalability check",
        body: "This route exists to prove the selected exam page can support multiple providers without custom one-off layout code.",
      },
    ],
    cheatsheet: [
      {
        label: "IAM",
        detail: "Permission and identity decisions are likely to show up repeatedly in an ACE prep flow.",
      },
      {
        label: "VPC",
        detail: "Networking boundaries and connectivity choices remain central across providers.",
      },
    ],
    tips: [
      {
        title: "Map the platform equivalent",
        body: "When moving across providers, anchor to the underlying concept first instead of memorizing product names in isolation.",
      },
    ],
    readiness: {
      score: 0,
      label: "Roadmap preview",
      note: "This is a future-facing workspace preview rather than a live learner result surface.",
      target: "Use the same workspace scaffolding when the content pipeline expands.",
      trend: "No live trend yet",
    },
    progressSummary: [
      {
        label: "Provider coverage",
        value: "3 clouds",
        note: "This package helps demonstrate provider-scalable architecture now.",
      },
      {
        label: "Workspace status",
        value: "Preview",
        note: "Ready for future content without redesigning the detail route.",
      },
    ],
    primaryCta: {
      label: "Join waitlist preview",
      href: "/register",
    },
    secondaryCta: {
      label: "Open dashboard",
      href: "/dashboard",
    },
  },
};

function createDefaultSupplement(exam: ExamCatalogItem): ExamWorkspaceSupplement {
  return (
    workspaceSupplements[exam.slug] ?? {
      overview: {
        summary: exam.detailSummary,
        audience: `${exam.provider} learners exploring the ${exam.title} package.`,
        focusAreas: exam.highlights,
      },
      mockExams: [],
      previousResults: [],
      weakAreas: [],
      notes: [],
      cheatsheet: [],
      tips: [],
      readiness: {
        score: 0,
        label: exam.progressLabel,
        note: exam.progressDetail,
        target: "More detail will appear once live data is connected.",
        trend: "No trend yet",
      },
      progressSummary: [],
      primaryCta: {
        label: exam.primaryActionLabel,
        href: exam.primaryActionHref,
      },
      secondaryCta: {
        label: exam.secondaryActionLabel,
        href: exam.secondaryActionHref,
      },
    }
  );
}

export function getMockExamWorkspace(examSlug: string): ExamWorkspaceData | null {
  const exam = getMockExamCatalogItem(examSlug);

  if (!exam) {
    return null;
  }

  return {
    ...exam,
    ...createDefaultSupplement(exam),
  };
}

export function getExamWorkspaceMock(
  examSlug: string,
  mockId: string,
): ExamWorkspaceMock | null {
  return (
    getMockExamWorkspace(examSlug)?.mockExams.find((mock) => mock.id === mockId) ??
    null
  );
}

export function getDefaultLiveMock(examSlug: string): ExamWorkspaceMock | null {
  return (
    getMockExamWorkspace(examSlug)?.mockExams.find((mock) => mock.isLive) ?? null
  );
}

export function getDefaultLiveMockHref(examSlug: string): string {
  return getDefaultLiveMock(examSlug)?.href ?? `/exams/${examSlug}`;
}
