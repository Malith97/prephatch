"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import type { CourseLevel, CourseStatus, SellerCourse } from "../types";
import { formatCurrency, formatDate } from "../utils/formatting";
import { EmptyState, SellerPageHeader } from "./seller-ui";

type CourseFormState = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  status: CourseStatus;
  price: string;
  discountPercent: string;
  discountLabel: string;
};

const defaultForm: CourseFormState = {
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  category: "",
  level: "beginner",
  status: "draft",
  price: "",
  discountPercent: "0",
  discountLabel: "",
};

function toForm(course: SellerCourse): CourseFormState {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    level: course.level,
    status: course.status,
    price: String((course.pricing.priceMinor / 100).toFixed(2)),
    discountPercent: String(course.pricing.discountPercent),
    discountLabel: course.pricing.discountLabel ?? "",
  };
}

export function CourseManagementPage() {
  const studio = useSellerStudio();
  const [form, setForm] = useState<CourseFormState>(defaultForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CourseStatus>("all");
  const [message, setMessage] = useState<string>("");

  const filteredCourses = useMemo(() => {
    return studio.courses
      .filter((course) => (statusFilter === "all" ? true : course.status === statusFilter))
      .filter((course) => {
        if (!search.trim()) {
          return true;
        }

        const query = search.trim().toLowerCase();
        return (
          course.title.toLowerCase().includes(query) ||
          course.slug.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
        );
      })
      .sort((left, right) => (left.updatedAt > right.updatedAt ? -1 : 1));
  }, [studio.courses, search, statusFilter]);

  const clearForm = () => {
    setForm(defaultForm);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const priceValue = Number(form.price);
    const discountValue = Number(form.discountPercent);

    if (!form.slug || !form.title || Number.isNaN(priceValue)) {
      setMessage("Slug, title, and valid pricing are required.");
      return;
    }

    const duplicateSlug = studio.courses.find(
      (course) => course.slug === form.slug && course.id !== form.id,
    );

    if (duplicateSlug) {
      setMessage("Another course already uses this slug.");
      return;
    }

    studio.saveCourse({
      id: form.id ?? studio.createId("course"),
      slug: form.slug,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      category: form.category || "General",
      level: form.level,
      status: form.status,
      updatedAt: new Date().toISOString(),
      publishedAt: form.status === "published" ? new Date().toISOString() : undefined,
      pricing: {
        priceMinor: Math.round(priceValue * 100),
        currency: "USD",
        discountPercent: Number.isNaN(discountValue) ? 0 : Math.max(0, discountValue),
        discountLabel: form.discountLabel || undefined,
      },
    });

    setMessage(form.id ? "Course updated." : "Course created.");
    clearForm();
  };

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Course management"
        title="Build and publish premium exam prep courses"
        description="Control lifecycle state, pricing, and launch readiness in one place. Draft first, publish when content quality checks are complete."
      />

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="ph-surface rounded-[30px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="ph-section-title">Courses</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="ph-input min-w-[220px]"
                placeholder="Search by title, slug, category"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | CourseStatus)}
                className="ph-input min-w-[170px]"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="No courses match this filter"
                description="Adjust your search or status filter to view matching courses."
              />
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="ph-table">
                <thead>
                  <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Updated</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-border/40 last:border-none">
                      <td className="px-3 py-3">
                        <p className="font-medium text-text-primary">{course.title}</p>
                        <p className="text-xs text-text-secondary">{course.slug}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="ph-badge ph-badge-neutral">{course.status}</span>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {formatCurrency(course.pricing.priceMinor, course.pricing.currency)}
                        {course.pricing.discountPercent > 0 ? (
                          <p className="text-xs text-accent">-{course.pricing.discountPercent}%</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{formatDate(course.updatedAt)}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                            onClick={() => {
                              setForm(toForm(course));
                              setMessage("");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                            onClick={() =>
                              studio.setCourseStatus(
                                course.id,
                                course.status === "published" ? "unpublished" : "published",
                              )
                            }
                          >
                            {course.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="ph-surface rounded-[30px] p-6">
          <h2 className="ph-section-title">{form.id ? "Edit course" : "Add course"}</h2>
          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="ph-input"
                placeholder="Course title"
              />
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="ph-input"
                placeholder="course-slug"
              />
            </div>

            <input
              value={form.subtitle}
              onChange={(event) => setForm((current) => ({ ...current, subtitle: event.target.value }))}
              className="ph-input"
              placeholder="Subtitle"
            />

            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="ph-input min-h-[100px]"
              placeholder="Description"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="ph-input"
                placeholder="Category"
              />
              <select
                value={form.level}
                onChange={(event) =>
                  setForm((current) => ({ ...current, level: event.target.value as CourseLevel }))
                }
                className="ph-input"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                className="ph-input"
                placeholder="Price (USD)"
              />
              <input
                value={form.discountPercent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, discountPercent: event.target.value }))
                }
                className="ph-input"
                placeholder="Discount %"
              />
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value as CourseStatus }))
                }
                className="ph-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <input
              value={form.discountLabel}
              onChange={(event) =>
                setForm((current) => ({ ...current, discountLabel: event.target.value }))
              }
              className="ph-input"
              placeholder="Discount label (optional)"
            />

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="ph-btn ph-button-primary ph-hover-lift">
                {form.id ? "Save course" : "Create course"}
              </button>
              <button
                type="button"
                className="ph-btn ph-button-secondary ph-hover-lift"
                onClick={clearForm}
              >
                Reset
              </button>
            </div>

            {message ? <p className="text-sm text-accent">{message}</p> : null}
          </form>
        </div>
      </section>
    </main>
  );
}
