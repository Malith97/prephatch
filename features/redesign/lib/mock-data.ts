import type { Metric, PackageItem, Question, WeakArea } from "../types";

export function getMarketplacePackages(): Promise<PackageItem[]> {
  return Promise.resolve([
    {
      id: "pkg-1",
      slug: "data-analyst-foundation",
      title: "Data Analyst Foundation Mock Suite",
      provider: "PrepHatch Labs",
      description: "45 full-length mocks with solutions and exam-style timing.",
      price: "$39",
      tags: ["Analytics", "Beginner", "Timed"],
      rating: 4.8,
    },
    {
      id: "pkg-2",
      slug: "cloud-security-pro",
      title: "Cloud Security Pro Challenge Pack",
      provider: "CertSprint",
      description: "Advanced scenario questions focused on architecture and controls.",
      price: "$59",
      tags: ["Security", "Advanced", "Case-based"],
      rating: 4.7,
    },
    {
      id: "pkg-3",
      slug: "product-analytics-ace",
      title: "Product Analytics Ace",
      provider: "Signal Academy",
      description: "Topic-structured mocks for metrics, funnels, and experimentation.",
      price: "$29",
      tags: ["Product", "Intermediate", "Topic-wise"],
      rating: 4.6,
    },
  ]);
}

export function getDashboardMetrics(): Promise<Metric[]> {
  return Promise.resolve([
    { id: "accuracy", label: "Accuracy", value: "74%", delta: "+6% this week" },
    { id: "streak", label: "Study Streak", value: "12 days", delta: "2 days to next milestone" },
    { id: "mocks", label: "Mocks Completed", value: "18", delta: "+3 this week" },
    { id: "readiness", label: "Readiness", value: "78/100", delta: "Trending upward" },
  ]);
}

export function getSampleQuestion(): Question {
  return {
    id: "q-1",
    index: 7,
    total: 40,
    prompt: "Which metric best measures conversion quality across an onboarding funnel?",
    options: [
      { id: "a", label: "A", text: "Daily active users" },
      { id: "b", label: "B", text: "Activation rate by cohort" },
      { id: "c", label: "C", text: "Total page views" },
      { id: "d", label: "D", text: "Bounce rate alone" },
    ],
  };
}

export function getWeakAreas(): WeakArea[] {
  return [
    {
      id: "w-1",
      topic: "Statistical Significance",
      accuracy: 46,
      recommendation: "Review confidence intervals and p-value interpretation with timed drills.",
    },
    {
      id: "w-2",
      topic: "Data Modeling",
      accuracy: 52,
      recommendation: "Practice star schema vs. snowflake mapping with case-based questions.",
    },
    {
      id: "w-3",
      topic: "Security Controls",
      accuracy: 58,
      recommendation: "Revisit IAM policy boundaries and least-privilege scenarios.",
    },
  ];
}
