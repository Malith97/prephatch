"use client";

import Link from "next/link";

import { useSellerStudio } from "../context/seller-studio-provider";
import { computeSellerAnalytics } from "../utils/analytics";
import { formatCurrency, formatPercent } from "../utils/formatting";
import { MetricCard, SellerPageHeader } from "./seller-ui";

export function SellerDashboardHomePage() {
  const studio = useSellerStudio();
  const analytics = computeSellerAnalytics(studio);

  const draftCourses = studio.courses.filter((course) => course.status === "draft").length;
  const unpublishedCourses = studio.courses.filter(
    (course) => course.status === "unpublished",
  ).length;
  const draftQuestions = studio.questions.filter(
    (question) => question.status === "draft",
  ).length;
  const publishedQuestions = studio.questions.filter(
    (question) => question.status === "published",
  ).length;
  const examConfigsNeedingContent = studio.mockExamConfigs.filter(
    (config) => config.questionIds.length < config.questionCount,
  ).length;

  const topCourses = [...analytics.courseInsights]
    .sort((left, right) => right.revenueMinor - left.revenueMinor)
    .slice(0, 3);

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Seller studio"
        title="Operate your instructor business from one control surface"
        description="Manage courses, question quality, exam delivery, learner progress, and revenue without leaving the seller workspace."
        actions={
          <>
            <Link href="/seller/courses" className="ph-btn ph-button-primary ph-hover-lift">
              Add new course
            </Link>
            <Link
              href="/seller/questions"
              className="ph-btn ph-button-secondary ph-hover-lift"
            >
              Add questions
            </Link>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total students"
          value={String(analytics.totalStudents)}
          note={`${analytics.activeStudents} active in last 14 days`}
          tone="accent"
        />
        <MetricCard
          label="Completion rate"
          value={formatPercent(analytics.completionRate)}
          note="Across active enrollments"
          tone="success"
        />
        <MetricCard
          label="Average score"
          value={formatPercent(analytics.averageScore)}
          note={`${formatPercent(analytics.passRate)} pass rate`}
        />
        <MetricCard
          label="Net revenue"
          value={formatCurrency(analytics.netRevenueMinor)}
          note={`${analytics.refundedOrders} refunded orders`}
          tone="warning"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="ph-surface rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="ph-eyebrow">Course momentum</p>
              <h2 className="ph-section-title mt-2">Top course performance</h2>
            </div>
            <Link
              href="/seller/analytics"
              className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
            >
              Deep analytics
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  <th className="px-3 py-3">Course</th>
                  <th className="px-3 py-3">Enrollments</th>
                  <th className="px-3 py-3">Avg score</th>
                  <th className="px-3 py-3">Completion</th>
                  <th className="px-3 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course) => (
                  <tr key={course.courseId} className="border-b border-border/40 last:border-none">
                    <td className="px-3 py-3 font-medium text-text-primary">{course.courseTitle}</td>
                    <td className="px-3 py-3 text-text-secondary">{course.enrollments}</td>
                    <td className="px-3 py-3 text-text-secondary">{formatPercent(course.averageScore)}</td>
                    <td className="px-3 py-3 text-text-secondary">{formatPercent(course.completionRate)}</td>
                    <td className="px-3 py-3 text-text-secondary">{formatCurrency(course.revenueMinor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ph-surface rounded-[30px] p-6">
          <p className="ph-eyebrow">Content health</p>
          <h2 className="ph-section-title mt-2">Publishing checklist</h2>
          <div className="mt-5 space-y-3">
            <article className="rounded-[20px] border border-border/70 bg-bg/30 p-4">
              <p className="text-sm font-medium text-text-primary">Draft courses awaiting publish</p>
              <p className="mt-1 text-sm text-text-secondary">{draftCourses} draft, {unpublishedCourses} unpublished</p>
            </article>
            <article className="rounded-[20px] border border-border/70 bg-bg/30 p-4">
              <p className="text-sm font-medium text-text-primary">Question bank readiness</p>
              <p className="mt-1 text-sm text-text-secondary">
                {publishedQuestions} published / {studio.questions.length} total questions
              </p>
            </article>
            <article className="rounded-[20px] border border-border/70 bg-bg/30 p-4">
              <p className="text-sm font-medium text-text-primary">Mocks underconfigured</p>
              <p className="mt-1 text-sm text-text-secondary">
                {examConfigsNeedingContent} mock sets need more linked questions
              </p>
            </article>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/seller/questions" className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift">
              Resolve drafts ({draftQuestions})
            </Link>
            <Link href="/seller/mock-exams" className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift">
              Fix mock configs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
