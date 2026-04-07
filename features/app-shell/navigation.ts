import type { NavigationItem } from "./components/app-navigation";

export const platformNavigationItems: NavigationItem[] = [
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

export function getExamNavigationItems(examSlug: string): NavigationItem[] {
  const baseHref = `/exam/${examSlug}`;

  return [
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
}
