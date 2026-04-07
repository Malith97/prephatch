import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            PrepHatch
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Local-first exam flow for AWS certification readiness.
          </h1>
          <p className="text-lg leading-8 text-slate-700">
            Start the first end-to-end PrepHatch slice with mock data only:
            choose an exam, answer timed questions, submit, and review a scaled
            score preview that is clearly marked as non-official.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/exams"
            className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse local mock exams
          </Link>
          <span className="inline-flex rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600">
            No auth, no payments, no cloud services
          </span>
        </div>
      </div>
    </main>
  );
}
