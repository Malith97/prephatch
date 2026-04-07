import Link from "next/link";

import { ExamCard } from "../../features/exams/components/exam-card";
import { listExamSummaries } from "../../server/exams/mock-repository";

export default function ExamSelectionPage() {
  const exams = listExamSummaries();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="space-y-8">
        <div className="space-y-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            ← Back to landing
          </Link>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Local exam selection
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Choose the first local-only PrepHatch mock.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">
              This slice uses mock TypeScript data only. No auth, cloud
              services, or payments are involved.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </main>
  );
}
