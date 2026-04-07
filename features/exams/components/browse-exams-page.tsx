import { AuthenticatedShell } from "../../app-shell/components/authenticated-shell";
import { listMockExamCatalog } from "../mock-exam-catalog";
import { ExamCard } from "./exam-card";

const catalogHighlights = [
  { value: "4", label: "certification packages modeled" },
  { value: "3", label: "cloud providers represented" },
  { value: "1", label: "live working mock path today" },
];

export function BrowseExamsPage() {
  const exams = listMockExamCatalog();

  return (
    <AuthenticatedShell>
      <main className="space-y-5">
        <section className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
            Browse exams
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                Choose the certification path that matches your next exam goal.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                The catalog is modeled to scale across providers and package
                types while still keeping the learner experience clear. Each
                package shows access state, price, progress, and a direct route
                into more detail.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {catalogHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
                >
                  <p className="text-3xl font-semibold text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Certification catalog
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">
              Provider-aware, progress-aware exam packages.
            </h2>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      </main>
    </AuthenticatedShell>
  );
}
