"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import type { EnrollmentStatus } from "../types";
import { formatDate } from "../utils/formatting";
import { EmptyState, MetricCard, SellerPageHeader } from "./seller-ui";

export function StudentsPage() {
  const studio = useSellerStudio();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | EnrollmentStatus>("all");

  const studentById = useMemo(
    () => new Map(studio.students.map((student) => [student.id, student])),
    [studio.students],
  );

  const courseById = useMemo(
    () => new Map(studio.courses.map((course) => [course.id, course])),
    [studio.courses],
  );

  const rows = useMemo(() => {
    return studio.enrollments
      .filter((enrollment) =>
        courseFilter === "all" ? true : enrollment.courseId === courseFilter,
      )
      .filter((enrollment) =>
        statusFilter === "all" ? true : enrollment.status === statusFilter,
      )
      .filter((enrollment) => {
        if (!search.trim()) {
          return true;
        }

        const student = studentById.get(enrollment.studentId);
        const course = courseById.get(enrollment.courseId);
        const query = search.trim().toLowerCase();

        return (
          (student?.name.toLowerCase().includes(query) ?? false) ||
          (student?.email.toLowerCase().includes(query) ?? false) ||
          (course?.title.toLowerCase().includes(query) ?? false)
        );
      })
      .map((enrollment) => ({
        enrollment,
        student: studentById.get(enrollment.studentId),
        course: courseById.get(enrollment.courseId),
      }))
      .sort((left, right) =>
        left.enrollment.lastActiveAt > right.enrollment.lastActiveAt ? -1 : 1,
      );
  }, [
    studio.enrollments,
    search,
    courseFilter,
    statusFilter,
    studentById,
    courseById,
  ]);

  const activeCount = rows.filter((row) => row.enrollment.status === "active").length;
  const completionRate =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + row.enrollment.completionPercent, 0) / rows.length
      : 0;

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Students & enrollments"
        title="Track who enrolled, who is active, and who needs intervention"
        description="Use search and filters to monitor learner activity, progress, and completion signals across each course."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Enrollments"
          value={String(rows.length)}
          note="Current filtered rows"
        />
        <MetricCard
          label="Active learners"
          value={String(activeCount)}
          note="Status is active"
          tone="accent"
        />
        <MetricCard
          label="Completion rate"
          value={`${completionRate.toFixed(1)}%`}
          note="Average completion"
          tone="success"
        />
        <MetricCard
          label="Avg attempts"
          value={
            rows.length > 0
              ? (rows.reduce((sum, row) => sum + row.enrollment.totalAttempts, 0) / rows.length).toFixed(1)
              : "0"
          }
          note="Mock attempts per enrollment"
        />
      </section>

      <section className="ph-surface rounded-[30px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="ph-section-title">Enrolled students</h2>
          <div className="flex flex-wrap gap-2">
            <input
              className="ph-input min-w-[220px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or course"
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
            <select
              className="ph-input min-w-[150px]"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | EnrollmentStatus)
              }
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              title="No enrollments found"
              description="Adjust filters or search terms to view students."
            />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Course</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Progress</th>
                  <th className="px-3 py-3">Completion</th>
                  <th className="px-3 py-3">Attempts</th>
                  <th className="px-3 py-3">Last active</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.enrollment.id}
                    className="border-b border-border/40 last:border-none"
                  >
                    <td className="px-3 py-3">
                      <p className="font-medium text-text-primary">{row.student?.name ?? "Unknown"}</p>
                      <p className="text-xs text-text-secondary">{row.student?.email ?? "-"}</p>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">
                      {row.course?.title ?? "Unknown"}
                    </td>
                    <td className="px-3 py-3">
                      <span className="ph-badge ph-badge-neutral">{row.enrollment.status}</span>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{row.enrollment.progressPercent}%</td>
                    <td className="px-3 py-3 text-text-secondary">{row.enrollment.completionPercent}%</td>
                    <td className="px-3 py-3 text-text-secondary">{row.enrollment.totalAttempts}</td>
                    <td className="px-3 py-3 text-text-secondary">{formatDate(row.enrollment.lastActiveAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
