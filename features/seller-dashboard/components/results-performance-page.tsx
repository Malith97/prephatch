"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import { formatDateTime } from "../utils/formatting";
import { EmptyState, MetricCard, SellerPageHeader } from "./seller-ui";

export function ResultsPerformancePage() {
  const studio = useSellerStudio();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const studentById = useMemo(
    () => new Map(studio.students.map((student) => [student.id, student])),
    [studio.students],
  );

  const courseById = useMemo(
    () => new Map(studio.courses.map((course) => [course.id, course])),
    [studio.courses],
  );

  const mockById = useMemo(
    () => new Map(studio.mockExamConfigs.map((config) => [config.id, config])),
    [studio.mockExamConfigs],
  );

  const rows = useMemo(() => {
    return studio.results
      .filter((result) => (courseFilter === "all" ? true : result.courseId === courseFilter))
      .filter((result) => {
        if (!search.trim()) {
          return true;
        }

        const query = search.trim().toLowerCase();
        const student = studentById.get(result.studentId);
        const course = courseById.get(result.courseId);
        const mock = mockById.get(result.mockExamId);

        return (
          (student?.name.toLowerCase().includes(query) ?? false) ||
          (student?.email.toLowerCase().includes(query) ?? false) ||
          (course?.title.toLowerCase().includes(query) ?? false) ||
          (mock?.title.toLowerCase().includes(query) ?? false)
        );
      })
      .map((result) => ({
        result,
        student: studentById.get(result.studentId),
        course: courseById.get(result.courseId),
        mock: mockById.get(result.mockExamId),
      }))
      .sort((left, right) => (left.result.submittedAt > right.result.submittedAt ? -1 : 1));
  }, [
    studio.results,
    search,
    courseFilter,
    studentById,
    courseById,
    mockById,
  ]);

  const averageScore =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + row.result.scorePercent, 0) / rows.length
      : 0;
  const passRate =
    rows.length > 0
      ? (rows.filter((row) => row.result.passed).length / rows.length) * 100
      : 0;
  const averageDuration =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + row.result.durationMinutes, 0) / rows.length
      : 0;

  const topPerformers = [...rows]
    .sort((left, right) => right.result.scorePercent - left.result.scorePercent)
    .slice(0, 3);

  const needsSupport = [...rows]
    .filter((row) => row.result.scorePercent < 70)
    .sort((left, right) => left.result.scorePercent - right.result.scorePercent)
    .slice(0, 3);

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Mock results"
        title="Monitor outcomes and intervene early"
        description="Track score quality, pass rates, and learner performance per mock exam to identify where your content or support needs attention."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Attempts" value={String(rows.length)} note="Filtered attempts" />
        <MetricCard
          label="Average score"
          value={`${averageScore.toFixed(1)}%`}
          note="Across selected rows"
          tone="accent"
        />
        <MetricCard
          label="Pass rate"
          value={`${passRate.toFixed(1)}%`}
          note="Score >= pass threshold"
          tone="success"
        />
        <MetricCard
          label="Avg duration"
          value={`${averageDuration.toFixed(0)} min`}
          note="Submission duration"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="ph-surface rounded-[30px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="ph-section-title">Attempt results table</h2>
            <div className="flex flex-wrap gap-2">
              <input
                className="ph-input min-w-[220px]"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student, course, mock"
              />
              <select
                className="ph-input min-w-[170px]"
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
              >
                <option value="all">All courses</option>
                {studio.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="No mock results found"
                description="Try a broader filter or wait for new attempts to sync."
              />
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    <th className="px-3 py-3">Student</th>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Mock exam</th>
                    <th className="px-3 py-3">Score</th>
                    <th className="px-3 py-3">Pass</th>
                    <th className="px-3 py-3">Duration</th>
                    <th className="px-3 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.result.id} className="border-b border-border/40 last:border-none">
                      <td className="px-3 py-3">
                        <p className="font-medium text-text-primary">{row.student?.name ?? "Unknown"}</p>
                        <p className="text-xs text-text-secondary">{row.student?.email ?? "-"}</p>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{row.course?.title ?? "Unknown"}</td>
                      <td className="px-3 py-3 text-text-secondary">{row.mock?.title ?? row.result.mockExamId}</td>
                      <td className="px-3 py-3 text-text-secondary">{row.result.scorePercent}%</td>
                      <td className="px-3 py-3">
                        <span className={`ph-badge ${row.result.passed ? "ph-badge-success" : "ph-badge-warning"}`}>
                          {row.result.passed ? "Pass" : "Needs work"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{row.result.durationMinutes} min</td>
                      <td className="px-3 py-3 text-text-secondary">{formatDateTime(row.result.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <section className="ph-surface rounded-[30px] p-6">
            <p className="ph-eyebrow">Top performers</p>
            <h2 className="ph-section-title mt-2">Highest scores</h2>
            <div className="mt-4 space-y-3">
              {topPerformers.map((row) => (
                <article key={`top-${row.result.id}`} className="rounded-[18px] border border-border/70 bg-bg/30 p-4">
                  <p className="text-sm font-medium text-text-primary">{row.student?.name ?? "Unknown"}</p>
                  <p className="text-xs text-text-secondary">{row.course?.title ?? "Unknown"}</p>
                  <p className="mt-1 text-sm text-accent">{row.result.scorePercent}%</p>
                </article>
              ))}
            </div>
          </section>

          <section className="ph-surface rounded-[30px] p-6">
            <p className="ph-eyebrow">Needs support</p>
            <h2 className="ph-section-title mt-2">At-risk learners</h2>
            <div className="mt-4 space-y-3">
              {needsSupport.length === 0 ? (
                <p className="text-sm text-text-secondary">No at-risk learners in current filter.</p>
              ) : (
                needsSupport.map((row) => (
                  <article key={`risk-${row.result.id}`} className="rounded-[18px] border border-border/70 bg-bg/30 p-4">
                    <p className="text-sm font-medium text-text-primary">{row.student?.name ?? "Unknown"}</p>
                    <p className="text-xs text-text-secondary">{row.course?.title ?? "Unknown"}</p>
                    <p className="mt-1 text-sm text-warning">{row.result.scorePercent}% score</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
