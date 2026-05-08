"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import type { MockExamConfig } from "../types";
import { formatDateTime } from "../utils/formatting";
import { EmptyState, SellerPageHeader } from "./seller-ui";

type BuilderFormState = {
  id?: string;
  courseId: string;
  title: string;
  status: MockExamConfig["status"];
  questionCount: string;
  durationMinutes: string;
  passScore: string;
  randomizeQuestions: boolean;
  questionIds: string[];
};

function toForm(config: MockExamConfig): BuilderFormState {
  return {
    id: config.id,
    courseId: config.courseId,
    title: config.title,
    status: config.status,
    questionCount: String(config.questionCount),
    durationMinutes: String(config.durationMinutes),
    passScore: String(config.passScore),
    randomizeQuestions: config.randomizeQuestions,
    questionIds: [...config.questionIds],
  };
}

function defaultForm(courseId?: string): BuilderFormState {
  return {
    courseId: courseId ?? "",
    title: "",
    status: "draft",
    questionCount: "40",
    durationMinutes: "75",
    passScore: "70",
    randomizeQuestions: true,
    questionIds: [],
  };
}

export function MockExamBuilderPage() {
  const studio = useSellerStudio();
  const [form, setForm] = useState<BuilderFormState>(() =>
    defaultForm(studio.courses[0]?.id),
  );
  const [message, setMessage] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const availableQuestions = useMemo(
    () =>
      studio.questions.filter(
        (question) =>
          question.courseId === form.courseId && question.status !== "archived",
      ),
    [studio.questions, form.courseId],
  );

  const filteredConfigs = useMemo(
    () =>
      studio.mockExamConfigs
        .filter((config) =>
          courseFilter === "all" ? true : config.courseId === courseFilter,
        )
        .sort((left, right) => (left.updatedAt > right.updatedAt ? -1 : 1)),
    [studio.mockExamConfigs, courseFilter],
  );

  const courseById = useMemo(
    () => new Map(studio.courses.map((course) => [course.id, course])),
    [studio.courses],
  );

  const submitConfig = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const questionCount = Number(form.questionCount);
    const durationMinutes = Number(form.durationMinutes);
    const passScore = Number(form.passScore);

    if (!form.title || !form.courseId) {
      setMessage("Course and title are required.");
      return;
    }

    if (Number.isNaN(questionCount) || questionCount <= 0) {
      setMessage("Question count must be greater than zero.");
      return;
    }

    if (Number.isNaN(durationMinutes) || durationMinutes < 5) {
      setMessage("Duration must be at least 5 minutes.");
      return;
    }

    if (!form.randomizeQuestions && form.questionIds.length === 0) {
      setMessage("Manual mode requires selecting at least one question.");
      return;
    }

    if (!form.randomizeQuestions && form.questionIds.length < questionCount) {
      setMessage(
        `Manual mode needs at least ${questionCount} selected questions. Currently selected ${form.questionIds.length}.`,
      );
      return;
    }

    const now = new Date().toISOString();
    const existingCreatedAt = form.id
      ? studio.mockExamConfigs.find((config) => config.id === form.id)?.createdAt
      : undefined;

    studio.saveMockExamConfig({
      id: form.id ?? studio.createId("mock"),
      courseId: form.courseId,
      title: form.title,
      status: form.status,
      questionCount,
      durationMinutes,
      passScore: Number.isNaN(passScore) ? 70 : passScore,
      randomizeQuestions: form.randomizeQuestions,
      questionIds: form.randomizeQuestions
        ? availableQuestions.slice(0, questionCount).map((question) => question.id)
        : form.questionIds,
      createdAt: existingCreatedAt ?? now,
      updatedAt: now,
    });

    setMessage(form.id ? "Mock config updated." : "Mock config created.");
    setForm(defaultForm(form.courseId));
  };

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Mock exam builder"
        title="Configure exam sets with strict timing and question volume"
        description="Define duration, question count, pass threshold, and selection strategy. Keep drafts separate until content coverage is ready."
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="ph-surface rounded-[30px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="ph-section-title">Exam configurations</h2>
            <select
              className="ph-input min-w-[180px]"
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

          {filteredConfigs.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="No mock configurations yet"
                description="Create your first mock configuration to start packaging questions into timed assessments."
              />
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="ph-table">
                <thead>
                  <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    <th className="px-3 py-3">Mock exam</th>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Questions</th>
                    <th className="px-3 py-3">Duration</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Updated</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfigs.map((config) => (
                    <tr key={config.id} className="border-b border-border/40 last:border-none">
                      <td className="px-3 py-3 font-medium text-text-primary">{config.title}</td>
                      <td className="px-3 py-3 text-text-secondary">
                        {courseById.get(config.courseId)?.title ?? "Unknown"}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{config.questionCount}</td>
                      <td className="px-3 py-3 text-text-secondary">{config.durationMinutes} min</td>
                      <td className="px-3 py-3">
                        <span className="ph-badge ph-badge-neutral">{config.status}</span>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{formatDateTime(config.updatedAt)}</td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                          onClick={() => {
                            setForm(toForm(config));
                            setMessage("");
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="ph-surface rounded-[30px] p-6">
          <h2 className="ph-section-title">{form.id ? "Edit config" : "Create config"}</h2>
          <form className="mt-5 space-y-3" onSubmit={submitConfig}>
            <select
              className="ph-input"
              value={form.courseId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  courseId: event.target.value,
                  questionIds: [],
                }))
              }
            >
              {studio.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input
              className="ph-input"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Mock title"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="ph-input"
                value={form.questionCount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, questionCount: event.target.value }))
                }
                placeholder="Question count"
              />
              <input
                className="ph-input"
                value={form.durationMinutes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, durationMinutes: event.target.value }))
                }
                placeholder="Duration (mins)"
              />
              <input
                className="ph-input"
                value={form.passScore}
                onChange={(event) =>
                  setForm((current) => ({ ...current, passScore: event.target.value }))
                }
                placeholder="Pass score"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                className="ph-input"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as MockExamConfig["status"],
                  }))
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
              <label className="flex items-center gap-2 rounded-[22px] border border-border/70 bg-bg/30 px-4 py-3 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={form.randomizeQuestions}
                  className="ph-choice"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      randomizeQuestions: event.target.checked,
                    }))
                  }
                />
                Randomize question selection
              </label>
            </div>

            <article className="rounded-[20px] border border-border/70 bg-bg/25 p-4">
              <p className="text-sm font-medium text-text-primary">Question pool status</p>
              <p className="mt-1 text-sm text-text-secondary">
                {availableQuestions.length} available questions in selected course.
              </p>
              <p className="mt-1 text-xs text-text-secondary/80">
                Target count: {form.questionCount || "0"} questions, duration: {form.durationMinutes || "0"} minutes.
              </p>
            </article>

            {!form.randomizeQuestions ? (
              <div className="rounded-[20px] border border-border/70 bg-bg/25 p-4">
                <p className="text-sm font-medium text-text-primary">Manual question selection</p>
                <div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
                  {availableQuestions.map((question) => {
                    const checked = form.questionIds.includes(question.id);

                    return (
                      <label
                        key={question.id}
                        className="flex items-start gap-2 rounded-[14px] border border-border/55 bg-bg/20 px-3 py-2 text-sm text-text-secondary"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          className="ph-choice mt-1"
                          onChange={() =>
                            setForm((current) => {
                              const ids = new Set(current.questionIds);
                              if (ids.has(question.id)) {
                                ids.delete(question.id);
                              } else {
                                ids.add(question.id);
                              }

                              return {
                                ...current,
                                questionIds: [...ids],
                              };
                            })
                          }
                        />
                        <span>
                          <span className="font-medium text-text-primary">{question.title}</span>
                          <span className="block text-xs text-text-secondary/80">{question.category}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="ph-btn ph-button-primary ph-hover-lift">
                {form.id ? "Save config" : "Create config"}
              </button>
              <button
                type="button"
                className="ph-btn ph-button-secondary ph-hover-lift"
                onClick={() => setForm(defaultForm(studio.courses[0]?.id))}
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
