"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { readAttempt } from "../../../lib/exams/session-storage";
import { scoreAttempt } from "../../../server/exams/scoring";
import type {
  MockExam,
  Question,
  ScorePreview,
  StoredAttempt,
} from "../../../server/exams/types";

type ResultsSummaryProps = {
  exam: MockExam;
};

type ResultsState =
  | {
      attempt: StoredAttempt;
      score: ScorePreview;
    }
  | null
  | undefined;

function getOptionText(question: Question, optionId: string | null): string {
  if (!optionId) {
    return "No answer selected";
  }

  return (
    question.options.find((option) => option.id === optionId)?.text ??
    "Saved answer is no longer valid"
  );
}

export function ResultsSummary({ exam }: ResultsSummaryProps) {
  const [resultsState, setResultsState] = useState<ResultsState>(undefined);

  useEffect(() => {
    const storedAttempt = readAttempt(exam.slug);

    if (
      !storedAttempt ||
      storedAttempt.examId !== exam.id ||
      storedAttempt.status !== "submitted"
    ) {
      setResultsState(null);
      return;
    }

    setResultsState({
      attempt: storedAttempt,
      score: scoreAttempt(exam, storedAttempt.answers),
    });
  }, [exam]);

  if (resultsState === undefined) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16">
        <p className="text-sm text-slate-600">Loading your local results...</p>
      </main>
    );
  }

  if (resultsState === null) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Results unavailable
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              No valid local attempt was found for this exam.
            </h1>
            <p className="text-sm leading-7 text-slate-600">
              Start the local mock from the exam list and submit it before
              opening results.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/exams"
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to exams
            </Link>
            <Link
              href={`/exams/${exam.slug}/session`}
              className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Start this mock
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { attempt, score } = resultsState;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              {exam.certificationCode}
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-950">
                {exam.title} results
              </h1>
              <p className="text-sm leading-7 text-slate-600">
                Submitted locally at{" "}
                {new Date(attempt.submittedAt ?? attempt.endsAt).toLocaleTimeString()}.
              </p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Correct
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {score.correctCount}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Incorrect
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {score.incorrectCount}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Unanswered
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {score.unansweredCount}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Score
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {score.percentageScore}%
                </dd>
              </div>
            </dl>
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-sm font-semibold text-sky-900">
                Scaled score preview: {score.scaledScorePreview}
              </p>
              <p className="mt-2 text-sm leading-6 text-sky-900">
                {score.previewFormulaLabel}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/exams"
                className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Back to exams
              </Link>
              <Link
                href={`/exams/${exam.slug}/session`}
                className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Retake local mock
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {exam.questions.map((question) => {
            const questionResult = score.questionResults.find(
              (result) => result.questionId === question.id,
            );

            return (
              <section
                key={question.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-950">
                      {question.prompt}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        questionResult?.isCorrect
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {questionResult?.isCorrect ? "Correct" : "Review"}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm leading-7 text-slate-700">
                    <p>
                      <span className="font-semibold text-slate-950">
                        Your answer:
                      </span>{" "}
                      {getOptionText(question, questionResult?.selectedOptionId ?? null)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">
                        Correct answer:
                      </span>{" "}
                      {getOptionText(question, question.correctOptionId)}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-950">
                        Explanation:
                      </span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
