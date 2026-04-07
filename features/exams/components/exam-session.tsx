"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

import {
  createLocalAttempt,
  readAttempt,
  writeAttempt,
} from "../../../lib/exams/session-storage";
import type { MockExam, StoredAttempt } from "../../../server/exams/types";

type ExamSessionProps = {
  exam: MockExam;
};

function formatRemainingTime(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ExamSession({ exam }: ExamSessionProps) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const isSubmittingRef = useRef(false);
  const remainingMs = attempt ? Math.max(0, attempt.endsAt - now) : 0;

  useEffect(() => {
    const storedAttempt = readAttempt(exam.slug);

    if (
      storedAttempt &&
      storedAttempt.examId === exam.id &&
      storedAttempt.status === "in_progress"
    ) {
      setAttempt(storedAttempt);
      return;
    }

    const freshAttempt = createLocalAttempt(exam);
    writeAttempt(freshAttempt);
    setAttempt(freshAttempt);
  }, [exam]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [attempt]);

  function persistAttempt(nextAttempt: StoredAttempt) {
    writeAttempt(nextAttempt);
    setAttempt(nextAttempt);
  }

  function submitAttempt(sourceAttempt: StoredAttempt) {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    const submittedAttempt: StoredAttempt = {
      ...sourceAttempt,
      status: "submitted",
      submittedAt: Date.now(),
    };

    persistAttempt(submittedAttempt);

    startTransition(() => {
      router.replace(`/exams/${exam.slug}/results`);
    });
  }

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress" || remainingMs > 0) {
      return;
    }

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    const submittedAttempt: StoredAttempt = {
      ...attempt,
      status: "submitted",
      submittedAt: Date.now(),
    };

    writeAttempt(submittedAttempt);
    setAttempt(submittedAttempt);

    startTransition(() => {
      router.replace(`/exams/${exam.slug}/results`);
    });
  }, [attempt, remainingMs, exam.slug, router]);

  function handleAnswerChange(questionId: string, optionId: string) {
    if (!attempt || attempt.status !== "in_progress") {
      return;
    }

    const nextAttempt: StoredAttempt = {
      ...attempt,
      answers: {
        ...attempt.answers,
        [questionId]: optionId,
      },
    };

    persistAttempt(nextAttempt);
  }

  if (!attempt) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16">
        <p className="text-sm text-slate-600">Preparing your local mock exam...</p>
      </main>
    );
  }

  const answeredCount = Object.keys(attempt.answers).length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              {exam.certificationCode}
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">{exam.title}</h1>
            <p className="text-sm text-slate-600">
              Local-only session. Your answers are stored in this browser tab
              session only.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
              Time remaining
            </p>
            <p className="text-3xl font-semibold">{formatRemainingTime(remainingMs)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
          <p>
            Answered {answeredCount} of {exam.questions.length} questions
          </p>
          <div className="flex gap-3">
            <Link
              href="/exams"
              className="inline-flex rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Back to exams
            </Link>
            <button
              type="button"
              onClick={() => submitAttempt(attempt)}
              className="inline-flex rounded-full bg-sky-700 px-5 py-2 font-semibold text-white transition hover:bg-sky-800"
            >
              Submit exam
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {exam.questions.map((question, index) => (
            <section
              key={question.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Question {index + 1}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {question.prompt}
                  </h2>
                </div>
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const checked = attempt.answers[question.id] === option.id;

                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer gap-3 rounded-2xl border px-4 py-3 transition ${
                          checked
                            ? "border-sky-700 bg-sky-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={checked}
                          onChange={() =>
                            handleAnswerChange(question.id, option.id)
                          }
                          className="mt-1"
                        />
                        <span className="text-sm leading-6 text-slate-700">
                          <span className="mr-2 font-semibold text-slate-950">
                            {option.label}.
                          </span>
                          {option.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
