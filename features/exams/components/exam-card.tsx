import Link from "next/link";

import type { ExamSummary } from "../../../server/exams/types";

type ExamCardProps = {
  exam: ExamSummary;
};

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
          {exam.certificationCode}
        </p>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-950">{exam.title}</h2>
          <p className="text-sm leading-7 text-slate-600">{exam.description}</p>
        </div>
        <dl className="flex flex-wrap gap-4 text-sm text-slate-600">
          <div>
            <dt className="font-medium text-slate-900">Questions</dt>
            <dd>{exam.questionCount}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">Timer</dt>
            <dd>{exam.durationMinutes} minutes</dd>
          </div>
        </dl>
        <Link
          href={`/exams/${exam.slug}/session`}
          className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Start local mock
        </Link>
      </div>
    </article>
  );
}
