"use client";

import { useMemo, useState } from "react";

import { useSellerStudio } from "../context/seller-studio-provider";
import type {
  QuestionDifficulty,
  QuestionType,
  SellerCourse,
  SellerQuestion,
} from "../types";
import {
  parseQuestionCsvImport,
  QUESTION_CSV_TEMPLATE,
} from "../utils/csv-import";
import { formatDateTime } from "../utils/formatting";
import { EmptyState, SellerPageHeader } from "./seller-ui";

type QuestionFormState = {
  id?: string;
  courseId: string;
  title: string;
  questionText: string;
  prompt: string;
  context: string;
  category: string;
  keywords: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  marks: string;
  explanation: string;
  status: "draft" | "published";
  options: string[];
  correctOptionIndexes: number[];
};

function getDefaultForm(courses: SellerCourse[]): QuestionFormState {
  return {
    courseId: courses[0]?.id ?? "",
    title: "",
    questionText: "",
    prompt: "",
    context: "",
    category: "",
    keywords: "",
    type: "single_choice",
    difficulty: "medium",
    marks: "1",
    explanation: "",
    status: "draft",
    options: ["", "", "", ""],
    correctOptionIndexes: [],
  };
}

function toQuestionForm(question: SellerQuestion): QuestionFormState {
  return {
    id: question.id,
    courseId: question.courseId,
    title: question.title,
    questionText: question.questionText,
    prompt: question.prompt,
    context: question.context,
    category: question.category,
    keywords: question.keywords.join(", "),
    type: question.type,
    difficulty: question.difficulty,
    marks: String(question.marks),
    explanation: question.explanation,
    status: question.status === "published" ? "published" : "draft",
    options: question.options.map((option) => option.text),
    correctOptionIndexes: question.correctOptionIds
      .map((optionId) => question.options.findIndex((option) => option.id === optionId))
      .filter((index) => index >= 0),
  };
}

export function QuestionBankPage() {
  const studio = useSellerStudio();
  const [form, setForm] = useState<QuestionFormState>(() => getDefaultForm(studio.courses));

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | QuestionDifficulty>("all");

  const [csvInput, setCsvInput] = useState("");
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const filteredQuestions = useMemo(() => {
    return studio.questions
      .filter((question) => (courseFilter === "all" ? true : question.courseId === courseFilter))
      .filter((question) => (typeFilter === "all" ? true : question.type === typeFilter))
      .filter((question) =>
        difficultyFilter === "all" ? true : question.difficulty === difficultyFilter,
      )
      .filter((question) => {
        if (!search.trim()) {
          return true;
        }

        const query = search.trim().toLowerCase();
        return (
          question.title.toLowerCase().includes(query) ||
          question.questionText.toLowerCase().includes(query) ||
          question.category.toLowerCase().includes(query) ||
          question.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        );
      })
      .sort((left, right) => (left.updatedAt > right.updatedAt ? -1 : 1));
  }, [
    studio.questions,
    search,
    courseFilter,
    typeFilter,
    difficultyFilter,
  ]);

  const courseById = useMemo(
    () => new Map(studio.courses.map((course) => [course.id, course])),
    [studio.courses],
  );

  const resetForm = () => {
    setForm(getDefaultForm(studio.courses));
    setMessage("");
  };

  const handleOptionCorrectToggle = (index: number) => {
    setForm((current) => {
      if (current.type === "single_choice") {
        return {
          ...current,
          correctOptionIndexes: [index],
        };
      }

      const set = new Set(current.correctOptionIndexes);
      if (set.has(index)) {
        set.delete(index);
      } else {
        set.add(index);
      }

      return {
        ...current,
        correctOptionIndexes: [...set.values()].sort((a, b) => a - b),
      };
    });
  };

  const submitManualQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedOptions = form.options.map((option) => option.trim()).filter(Boolean);
    const marks = Number(form.marks);

    if (!form.courseId || !form.title || !form.questionText || cleanedOptions.length < 2) {
      setMessage("Course, title, question text, and at least two options are required.");
      return;
    }

    if (form.type === "single_choice" && form.correctOptionIndexes.length !== 1) {
      setMessage("Single-choice questions require exactly one correct answer.");
      return;
    }

    if (form.type === "multiple_choice" && form.correctOptionIndexes.length < 2) {
      setMessage("Multiple-choice questions require at least two correct answers.");
      return;
    }

    const options = cleanedOptions.map((text, index) => ({
      id: String.fromCharCode(97 + index),
      label: String.fromCharCode(65 + index),
      text,
    }));

    const now = new Date().toISOString();
    const existingCreatedAt = form.id
      ? studio.questions.find((question) => question.id === form.id)?.createdAt
      : undefined;

    studio.saveQuestion({
      id: form.id ?? studio.createId("q"),
      courseId: form.courseId,
      status: form.status,
      type: form.type,
      title: form.title,
      questionText: form.questionText,
      prompt: form.prompt || "Choose the best answer.",
      context: form.context,
      category: form.category || "General",
      keywords: form.keywords
        .split(/[|,]/)
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      difficulty: form.difficulty,
      marks: Number.isNaN(marks) || marks <= 0 ? 1 : marks,
      options,
      correctOptionIds: form.correctOptionIndexes
        .map((index) => options[index]?.id)
        .filter(Boolean),
      explanation: form.explanation,
      createdAt: existingCreatedAt ?? now,
      updatedAt: now,
      source: "manual",
    });

    setMessage(form.id ? "Question updated." : "Question added to bank.");
    resetForm();
  };

  const runCsvImport = () => {
    setImportErrors([]);

    const result = parseQuestionCsvImport(csvInput, studio.courses, studio.createId);

    if (result.errors.length > 0) {
      setImportErrors(result.errors);
    }

    if (result.questions.length > 0) {
      studio.importQuestions(result.questions);
      setMessage(`Imported ${result.questions.length} question(s) from CSV.`);
    }
  };

  return (
    <main className="space-y-5">
      <SellerPageHeader
        eyebrow="Question bank"
        title="Manage high-quality questions at scale"
        description="Create manual questions with precise correctness rules, or import CSV batches with validation before they enter your question bank."
      />

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="ph-surface rounded-[30px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="ph-section-title">Question inventory</h2>
            <div className="flex flex-wrap gap-2">
              <input
                className="ph-input min-w-[220px]"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, prompt, category, keyword"
              />
              <select
                className="ph-input min-w-[150px]"
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
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as "all" | QuestionType)}
              >
                <option value="all">All types</option>
                <option value="single_choice">Single choice</option>
                <option value="multiple_choice">Multiple choice</option>
              </select>
              <select
                className="ph-input min-w-[140px]"
                value={difficultyFilter}
                onChange={(event) =>
                  setDifficultyFilter(event.target.value as "all" | QuestionDifficulty)
                }
              >
                <option value="all">All levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="No matching questions"
                description="Try broader filters, or add your first question manually or via CSV."
              />
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="ph-table">
                <thead>
                  <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    <th className="px-3 py-3">Question</th>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Difficulty</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Updated</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-border/40 last:border-none">
                      <td className="px-3 py-3">
                        <p className="font-medium text-text-primary">{question.title}</p>
                        <p className="line-clamp-2 text-xs text-text-secondary">
                          {question.questionText}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        {courseById.get(question.courseId)?.title ?? "Unknown"}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{question.type}</td>
                      <td className="px-3 py-3 text-text-secondary">{question.difficulty}</td>
                      <td className="px-3 py-3">
                        <span className="ph-badge ph-badge-neutral">{question.status}</span>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{formatDateTime(question.updatedAt)}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                            onClick={() => {
                              setForm(toQuestionForm(question));
                              setMessage("");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                            onClick={() =>
                              studio.saveQuestion({
                                ...question,
                                status:
                                  question.status === "published" ? "draft" : "published",
                              })
                            }
                          >
                            {question.status === "published" ? "Move to draft" : "Publish"}
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

        <div className="space-y-5">
          <section className="ph-surface rounded-[30px] p-6">
            <h2 className="ph-section-title">{form.id ? "Edit question" : "Add question manually"}</h2>
            <form className="mt-5 space-y-3" onSubmit={submitManualQuestion}>
              <select
                className="ph-input"
                value={form.courseId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, courseId: event.target.value }))
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
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Question title"
              />
              <textarea
                className="ph-input min-h-[90px]"
                value={form.questionText}
                onChange={(event) =>
                  setForm((current) => ({ ...current, questionText: event.target.value }))
                }
                placeholder="Question text"
              />
              <textarea
                className="ph-input min-h-[70px]"
                value={form.prompt}
                onChange={(event) =>
                  setForm((current) => ({ ...current, prompt: event.target.value }))
                }
                placeholder="Prompt / helper context"
              />
              <textarea
                className="ph-input min-h-[70px]"
                value={form.context}
                onChange={(event) =>
                  setForm((current) => ({ ...current, context: event.target.value }))
                }
                placeholder="Extra context / explanation framing"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="ph-input"
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  placeholder="Category"
                />
                <input
                  className="ph-input"
                  value={form.keywords}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, keywords: event.target.value }))
                  }
                  placeholder="Keywords: vpc, security, storage"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <select
                  className="ph-input"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as QuestionType,
                      correctOptionIndexes: [],
                    }))
                  }
                >
                  <option value="single_choice">Single choice</option>
                  <option value="multiple_choice">Multiple choice</option>
                </select>
                <select
                  className="ph-input"
                  value={form.difficulty}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      difficulty: event.target.value as QuestionDifficulty,
                    }))
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  className="ph-input"
                  value={form.marks}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, marks: event.target.value }))
                  }
                  placeholder="Marks"
                />
                <select
                  className="ph-input"
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as "draft" | "published",
                    }))
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="rounded-[20px] border border-border/70 bg-bg/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">Options and correct answer(s)</p>
                  <button
                    type="button"
                    className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        options: [...current.options, ""],
                      }))
                    }
                  >
                    Add option
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {form.options.map((option, index) => {
                    const label = String.fromCharCode(65 + index);
                    const isSelected = form.correctOptionIndexes.includes(index);

                    return (
                      <div key={`option-${index}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-text-secondary">
                          <input
                            type={form.type === "single_choice" ? "radio" : "checkbox"}
                            checked={isSelected}
                            className="ph-choice"
                            onChange={() => handleOptionCorrectToggle(index)}
                          />
                          {label}
                        </label>
                        <input
                          className="ph-input"
                          value={option}
                          onChange={(event) =>
                            setForm((current) => {
                              const copy = [...current.options];
                              copy[index] = event.target.value;
                              return {
                                ...current,
                                options: copy,
                              };
                            })
                          }
                          placeholder={`Option ${label}`}
                        />
                        <button
                          type="button"
                          className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                          onClick={() =>
                            setForm((current) => {
                              if (current.options.length <= 2) {
                                return current;
                              }

                              const nextOptions = current.options.filter((_, i) => i !== index);
                              const nextCorrect = current.correctOptionIndexes
                                .filter((correctIndex) => correctIndex !== index)
                                .map((correctIndex) =>
                                  correctIndex > index ? correctIndex - 1 : correctIndex,
                                );

                              return {
                                ...current,
                                options: nextOptions,
                                correctOptionIndexes: nextCorrect,
                              };
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <textarea
                className="ph-input min-h-[80px]"
                value={form.explanation}
                onChange={(event) =>
                  setForm((current) => ({ ...current, explanation: event.target.value }))
                }
                placeholder="Explanation shown after answer reveal"
              />

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="ph-btn ph-button-primary ph-hover-lift">
                  {form.id ? "Save question" : "Add question"}
                </button>
                <button
                  type="button"
                  className="ph-btn ph-button-secondary ph-hover-lift"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          <section className="ph-surface rounded-[30px] p-6">
            <h2 className="ph-section-title">CSV / Excel-compatible import</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Import pipe-delimited options and answer keys. Supports single and multiple choice.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
                onClick={() => setCsvInput(QUESTION_CSV_TEMPLATE)}
              >
                Load template
              </button>
              <label className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift cursor-pointer">
                Upload CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }

                    const text = await file.text();
                    setCsvInput(text);
                    setMessage(`Loaded ${file.name}`);
                  }}
                />
              </label>
            </div>

            <textarea
              className="ph-input mt-3 min-h-[200px] font-mono text-xs"
              value={csvInput}
              onChange={(event) => setCsvInput(event.target.value)}
              placeholder="Paste CSV rows here"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="ph-btn ph-button-primary ph-hover-lift"
                onClick={runCsvImport}
              >
                Validate & import
              </button>
              <button
                type="button"
                className="ph-btn ph-button-secondary ph-hover-lift"
                onClick={() => {
                  setCsvInput("");
                  setImportErrors([]);
                }}
              >
                Clear
              </button>
            </div>

            {importErrors.length > 0 ? (
              <div className="mt-3 rounded-[20px] border border-danger/30 bg-danger/10 p-4">
                <p className="text-sm font-medium text-danger">Import validation errors</p>
                <ul className="mt-2 space-y-1 text-sm text-text-secondary">
                  {importErrors.slice(0, 6).map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {message ? <p className="mt-3 text-sm text-accent">{message}</p> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
