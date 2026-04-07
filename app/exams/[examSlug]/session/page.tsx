import { ExamSession } from "../../../../features/exams/components/exam-session";
import { getExamBySlug } from "../../../../server/exams/mock-repository";

type SessionPageProps = {
  params: {
    examSlug: string;
  };
};

export default function SessionPage({ params }: SessionPageProps) {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Exam not found
          </p>
          <h1 className="text-3xl font-semibold text-slate-950">
            This local mock does not exist.
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            Check the exam selection page and start one of the available local
            mocks.
          </p>
        </div>
      </main>
    );
  }

  return <ExamSession exam={exam} />;
}
