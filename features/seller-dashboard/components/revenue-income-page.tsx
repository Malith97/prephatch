"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import {
  buildRevenueTrend,
  computeSellerAnalytics,
  getWindowFromPeriod,
  predictIncome,
  type PeriodKey,
} from "../utils/analytics";
import { formatCurrency, formatDate } from "../utils/formatting";
import { MetricCard, MiniTrend, SellerPageHeader } from "./seller-ui";

export function RevenueIncomePage() {
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

  const projection = useMemo(
    () =>
      predictIncome(studio.revenueRecords, {
        courseId: courseId === "all" ? undefined : courseId,
      }),
    [studio.revenueRecords, courseId],
  );

  const revenueTrend = useMemo(
    () =>
      buildRevenueTrend(studio.revenueRecords, {
        window,
        courseId: courseId === "all" ? undefined : courseId,
      }),
    [studio.revenueRecords, window, courseId],
  );

  const payoutRows = useMemo(
    () => [...studio.payouts].sort((left, right) => (left.id > right.id ? -1 : 1)),
    [studio.payouts],
  );

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Revenue & income"
        title="Understand earnings, payouts, and forward income potential"
        description="Track net revenue quality by course, monitor payouts, and use trend-based projection to plan upcoming income."
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
          label="Gross revenue"
          value={formatCurrency(analytics.revenueMinor)}
          note="Before discounts and refunds"
        />
        <MetricCard
          label="Net revenue"
          value={formatCurrency(analytics.netRevenueMinor)}
          note={`${analytics.refundedOrders} refunded orders`}
          tone="success"
        />
        <MetricCard
          label="Projected 30 days"
          value={formatCurrency(projection.projectedMinor)}
          note={`${projection.confidence} confidence`}
          tone="accent"
        />
        <MetricCard
          label="Projected 90 days"
          value={formatCurrency(projection.projected90Minor)}
          note={`${projection.growthPercent.toFixed(1)}% growth trend`}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="ph-surface rounded-[30px] p-6">
          <p className="ph-eyebrow">Income forecast</p>
          <h2 className="ph-section-title mt-2">Revenue trend and run-rate</h2>
          <div className="mt-4">
            <MiniTrend points={revenueTrend.map((point) => point.value)} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-border/70 bg-bg/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">Daily run-rate</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                {formatCurrency(projection.dailyRunRateMinor)}
              </p>
            </div>
            <div className="rounded-[18px] border border-border/70 bg-bg/25 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">Growth trend</p>
              <p className="mt-2 text-lg font-semibold text-text-primary">
                {projection.growthPercent.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            Forecast is trend-based and should be treated as planning guidance, not accounting truth.
          </p>
        </article>

        <article className="ph-surface rounded-[30px] p-6">
          <p className="ph-eyebrow">Course revenue mix</p>
          <h2 className="ph-section-title mt-2">Revenue by course</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="ph-table">
              <thead>
                <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  <th className="px-3 py-3">Course</th>
                  <th className="px-3 py-3">Enrollments</th>
                  <th className="px-3 py-3">Net revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.courseInsights.map((course) => (
                  <tr key={course.courseId} className="border-b border-border/40 last:border-none">
                    <td className="px-3 py-3 font-medium text-text-primary">{course.courseTitle}</td>
                    <td className="px-3 py-3 text-text-secondary">{course.enrollments}</td>
                    <td className="px-3 py-3 text-text-secondary">{formatCurrency(course.revenueMinor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="ph-surface rounded-[30px] p-6">
        <h2 className="ph-section-title">Payout summaries</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Track payout settlement status and reconcile your expected net with processor fees.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="ph-table">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                <th className="px-3 py-3">Period</th>
                <th className="px-3 py-3">Gross</th>
                <th className="px-3 py-3">Fees</th>
                <th className="px-3 py-3">Net</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Paid at</th>
              </tr>
            </thead>
            <tbody>
              {payoutRows.map((payout) => (
                <tr key={payout.id} className="border-b border-border/40 last:border-none">
                  <td className="px-3 py-3 font-medium text-text-primary">{payout.periodLabel}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatCurrency(payout.grossMinor)}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatCurrency(payout.feesMinor)}</td>
                  <td className="px-3 py-3 text-text-secondary">{formatCurrency(payout.netMinor)}</td>
                  <td className="px-3 py-3">
                    <span className={`ph-badge ${payout.status === "paid" ? "ph-badge-success" : "ph-badge-warning"}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-text-secondary">
                    {payout.paidAt ? formatDate(payout.paidAt) : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
