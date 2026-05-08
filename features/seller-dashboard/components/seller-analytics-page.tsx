"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import {
  buildEnrollmentTrend,
  buildRevenueTrend,
  buildScoreTrend,
  computeSellerAnalytics,
  getWindowFromPeriod,
  type PeriodKey,
} from "../utils/analytics";
import { formatCurrency, formatPercent } from "../utils/formatting";
import { MetricCard, MiniTrend, SellerPageHeader } from "./seller-ui";

export function SellerAnalyticsPage() {
  const studio = useSellerStudio();
  const [period, setPeriod] = useState<PeriodKey>("90d");
  const [courseId, setCourseId] = useState<string>("all");

  const window = useMemo(() => getWindowFromPeriod(period), [period]);

  const analytics = useMemo(
    () =>
      computeSellerAnalytics(studio, {
        window,
        courseId: courseId === "all" ? undefined : courseId,
      }),
    [studio, window, courseId],
  );

  const enrollmentTrend = useMemo(
    () =>
      buildEnrollmentTrend(studio.enrollments, {
        window,
        courseId: courseId === "all" ? undefined : courseId,
      }),
    [studio.enrollments, window, courseId],
  );

  const scoreTrend = useMemo(
    () =>
      buildScoreTrend(studio.results, {
        window,
        courseId: courseId === "all" ? undefined : courseId,
      }),
    [studio.results, window, courseId],
  );

  const revenueTrend = useMemo(
    () =>
      buildRevenueTrend(studio.revenueRecords, {
        window,
        courseId: courseId === "all" ? undefined : courseId,
      }),
    [studio.revenueRecords, window, courseId],
  );

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Seller analytics"
        title="Course health, learner quality, and growth signals"
        description="Track enrollments, completion, score quality, and course-level performance using configurable date and course filters."
        actions={
          <div className="flex flex-wrap gap-2">
            <select
              className="ph-input min-w-[130px]"
              value={period}
              onChange={(event) => setPeriod(event.target.value as PeriodKey)}
            >
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last 365 days</option>
              <option value="all">All time</option>
            </select>
            <select
              className="ph-input min-w-[170px]"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
            >
              <option value="all">All courses</option>
              {studio.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Students"
          value={String(analytics.totalStudents)}
          note={`${analytics.activeStudents} active`}
        />
        <MetricCard
          label="Completion"
          value={formatPercent(analytics.completionRate)}
          note="Average completion rate"
          tone="success"
        />
        <MetricCard
          label="Average score"
          value={formatPercent(analytics.averageScore)}
          note={`${formatPercent(analytics.passRate)} pass rate`}
          tone="accent"
        />
        <MetricCard
          label="Net revenue"
          value={formatCurrency(analytics.netRevenueMinor)}
          note={`${analytics.refundedOrders} refunds`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="ph-surface rounded-[30px] p-6">
          <p className="ph-eyebrow">Enrollment trend</p>
          <h2 className="ph-section-title mt-2">Enrollments over time</h2>
          <div className="mt-4">
            <MiniTrend points={enrollmentTrend.map((point) => point.value)} />
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            {enrollmentTrend.map((point) => `${point.label}: ${point.value}`).join("  •  ") || "No data"}
          </p>
        </article>

        <article className="ph-surface rounded-[30px] p-6">
          <p className="ph-eyebrow">Score trend</p>
          <h2 className="ph-section-title mt-2">Average score trend</h2>
          <div className="mt-4">
            <MiniTrend points={scoreTrend.map((point) => point.value)} />
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            {scoreTrend
              .map((point) => `${point.label}: ${point.value.toFixed(1)}%`)
              .join("  •  ") || "No data"}
          </p>
        </article>

        <article className="ph-surface rounded-[30px] p-6">
          <p className="ph-eyebrow">Revenue trend</p>
          <h2 className="ph-section-title mt-2">Net revenue trend</h2>
          <div className="mt-4">
            <MiniTrend points={revenueTrend.map((point) => point.value)} />
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            {revenueTrend
              .map((point) => `${point.label}: ${formatCurrency(point.value)}`)
              .join("  •  ") || "No data"}
          </p>
        </article>
      </section>

      <section className="ph-surface rounded-[30px] p-6">
        <h2 className="ph-section-title">Course popularity and outcomes</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Identify top performers and lagging courses to prioritize new content, coaching, and pricing changes.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="ph-table">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                <th className="px-3 py-3">Course</th>
                <th className="px-3 py-3">Enrollments</th>
                <th className="px-3 py-3">Active</th>
                <th className="px-3 py-3">Completion</th>
                <th className="px-3 py-3">Avg score</th>
                <th className="px-3 py-3">Pass rate</th>
                <th className="px-3 py-3">Attempts</th>
                <th className="px-3 py-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.courseInsights.map((course) => (
                <tr key={course.courseId} className="border-b border-border/40 last:border-none">
                  <td className="px-3 py-3 font-medium text-text-primary">{course.courseTitle}</td>
                  <td className="px-3 py-3 text-text-secondary">{course.enrollments}</td>
                  <td className="px-3 py-3 text-text-secondary">{course.activeStudents}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatPercent(course.completionRate)}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatPercent(course.averageScore)}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatPercent(course.passRate)}</td>
                  <td className="px-3 py-3 text-text-secondary">{course.attempts}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatCurrency(course.revenueMinor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
