import Link from "next/link";

import { ExamSession } from "../../../../../features/exams/components/exam-session";
import { getExamWorkspaceMock } from "../../../../../features/exams/mock-exam-workspace";
import { getExamBySlug } from "../../../../../server/exams/mock-repository";

type MockPlayerPageProps = {
  params: {
    examSlug: string;
    mockId: string;
  };
};

export default function MockPlayerPage({ params }: MockPlayerPageProps) {
  const exam = getExamBySlug(params.examSlug);
  const mock = getExamWorkspaceMock(params.examSlug, params.mockId);

  if (!exam || !mock) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Mock not found
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">
            This mock exam is not available.
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Return to the certification page and choose one of the available
            mock exams.
          </p>
        </div>
      </main>
    );
  }

  if (!mock.isLive) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Mock coming soon
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">
            {mock.title} is not live yet.
          </h1>
          <p className="text-sm leading-7 text-slate-600">{mock.note}</p>
          <Link
            href={`/exams/${params.examSlug}`}
            className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to exam details
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ExamSession
      exam={exam}
      mockId={mock.id}
      mockTitle={mock.title}
      backHref={`/exams/${exam.slug}`}
      resultsHref={`/exams/${exam.slug}/results`}
    />
  );
}
