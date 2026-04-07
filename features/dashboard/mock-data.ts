export const dashboardData = {
  welcome: {
    greeting: "Welcome back, Malithi",
    title: "Your AWS readiness is moving in the right direction.",
    description:
      "This dashboard preview shows how PrepHatch can guide a learner from access state to next action without requiring live auth yet.",
  },
  exams: [
    {
      title: "AWS SAA-C03 Free Preview Mock",
      access: "Enrolled",
      status: "Completed once",
      score: "76%",
      detail: "Used to validate the first end-to-end timed flow.",
    },
    {
      title: "AWS SAA-C03 Premium Timed Mock 01",
      access: "Purchased",
      status: "Ready to start",
      score: "Not started",
      detail: "Full-length timed set for confidence under exam conditions.",
    },
    {
      title: "AWS SAA-C03 Premium Timed Mock 02",
      access: "Purchased",
      status: "Resume available",
      score: "48 of 65 answered",
      detail: "Continue from your last saved checkpoint before the deadline.",
    },
  ],
  metrics: [
    {
      label: "Average score",
      value: "78%",
      note: "+7 points over the last two weeks",
    },
    {
      label: "Completed attempts",
      value: "4",
      note: "2 timed, 2 review passes",
    },
    {
      label: "Study streak",
      value: "6 days",
      note: "Consistent progress this week",
    },
    {
      label: "Premium mocks unlocked",
      value: "3",
      note: "1 free and 2 premium ready now",
    },
  ],
  recentActivity: [
    {
      title: "Completed the free preview mock",
      detail: "Submitted timed attempt and reviewed explanations for all missed questions.",
      timestamp: "Today, 10:20",
    },
    {
      title: "Resumed Premium Timed Mock 02",
      detail: "Worked through networking and database questions before pausing the browser session.",
      timestamp: "Yesterday, 19:45",
    },
    {
      title: "Reviewed weak areas snapshot",
      detail: "Flagged VPC routing and storage durability as next study targets.",
      timestamp: "Yesterday, 18:10",
    },
  ],
  readiness: {
    score: 78,
    label: "Borderline",
    note: "You are close to ready. Focused review across networking and storage should raise confidence quickly.",
    target: "Target 80%+ for a stronger real-exam signal.",
  },
  weakAreas: [
    {
      topic: "VPC routing and subnet boundaries",
      accuracy: "62%",
      note: "Spend time on public versus private patterns and internet gateway usage.",
    },
    {
      topic: "Storage durability and service fit",
      accuracy: "68%",
      note: "Revisit S3, EBS, and instance store tradeoffs in scenario questions.",
    },
    {
      topic: "Read scaling patterns",
      accuracy: "71%",
      note: "Read replicas and caching choices are improving but still inconsistent.",
    },
  ],
  quickActions: [
    {
      title: "Continue the working free mock",
      description: "Jump straight into the current prototype exam flow.",
      href: "/exams/aws-saa-c03/mock/aws-saa-c03-free-preview",
    },
    {
      title: "Review the latest results screen",
      description: "Open the existing local results experience.",
      href: "/exams/aws-saa-c03/results/latest-local",
    },
    {
      title: "Browse all available exams",
      description: "See the current mock catalog and start from the exam list.",
      href: "/exams",
    },
  ],
};
