import type { AppRole } from "../../lib/auth/app-session";
import type { NavigationItem } from "./components/app-navigation";

function canAccessSeller(role: AppRole): boolean {
  return role === "instructor" || role === "admin" || role === "super_admin";
}

function canAccessStudent(role: AppRole): boolean {
  return role === "student" || role === "unknown";
}

export function getPlatformNavigationItems(role: AppRole): NavigationItem[] {
  if (!canAccessStudent(role)) {
    return [
      {
        href: "/seller",
        label: "Seller Studio",
        description: "Instructor operations and revenue",
        activePrefixes: ["/seller"],
      },
    ];
  }

  const items: NavigationItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      description: "Cross-exam overview",
      exact: true,
    },
    {
      href: "/dashboard/my-exams",
      label: "My Exams",
      description: "Owned certifications",
    },
    {
      href: "/dashboard/marketplace",
      label: "Marketplace",
      description: "Discover and preview packages",
    },
    {
      href: "/dashboard/billing",
      label: "Billing",
      description: "Purchases and renewals",
    },
    {
      href: "/dashboard/achievements",
      label: "Achievements",
      description: "Milestones and streaks",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      description: "Account and preferences",
    },
    {
      href: "/dashboard/help",
      label: "Help",
      description: "Support and product guidance",
    },
  ];

  if (canAccessSeller(role)) {
    items.push({
      href: "/seller",
      label: "Seller Studio",
      description: "Instructor operations and revenue",
      activePrefixes: ["/seller"],
    });
  }

  return items;
}

export function getSellerNavigationItems(role: AppRole): NavigationItem[] {
  if (!canAccessSeller(role)) {
    return [];
  }

  return [
    {
      href: "/seller",
      label: "Overview",
      description: "Operational command center",
      exact: true,
    },
    {
      href: "/seller/courses",
      label: "Courses",
      description: "Catalog and publish lifecycle",
    },
    {
      href: "/seller/questions",
      label: "Question Bank",
      description: "Create and import questions",
    },
    {
      href: "/seller/mock-exams",
      label: "Mock Exams",
      description: "Timed exam configurations",
    },
    {
      href: "/seller/students",
      label: "Students",
      description: "Enrollments and activity",
    },
    {
      href: "/seller/results",
      label: "Results",
      description: "Mock performance outcomes",
    },
    {
      href: "/seller/analytics",
      label: "Analytics",
      description: "Growth and quality metrics",
    },
    {
      href: "/seller/revenue",
      label: "Revenue",
      description: "Income, payouts, forecast",
    },
  ];
}

export function getExamNavigationItems(examSlug: string, role: AppRole): NavigationItem[] {
  const baseHref = `/exam/${examSlug}`;
  const items: NavigationItem[] = [
    {
      href: baseHref,
      label: "Overview",
      description: "Progress and next actions",
      exact: true,
    },
    {
      href: `${baseHref}/mock-exams`,
      label: "Mock Exams",
      description: "Start and retry attempts",
      activePrefixes: [`${baseHref}/session`, `${baseHref}/results`],
    },
    {
      href: `${baseHref}/practice-questions`,
      label: "Practice Questions",
      description: "Targeted study sets",
    },
    {
      href: `${baseHref}/analytics`,
      label: "Analytics",
      description: "Score trends and mastery",
    },
    {
      href: `${baseHref}/weak-areas`,
      label: "Weak Areas",
      description: "Topics needing attention",
    },
    {
      href: `${baseHref}/notes`,
      label: "Notes",
      description: "Study notes and reminders",
    },
    {
      href: `${baseHref}/cheatsheets`,
      label: "Cheatsheets",
      description: "Quick recall references",
    },
    {
      href: `${baseHref}/tips`,
      label: "Tips",
      description: "Exam-time decision support",
    },
    {
      href: `${baseHref}/recommendations`,
      label: "Recommendations",
      description: "Suggested next moves",
    },
    {
      href: `${baseHref}/settings`,
      label: "Settings",
      description: "Exam-specific preferences",
    },
  ];

  if (canAccessSeller(role)) {
    items.push({
      href: "/seller",
      label: "Seller Studio",
      description: "Instructor operations and revenue",
      activePrefixes: ["/seller"],
    });
  }

  return items;
}
