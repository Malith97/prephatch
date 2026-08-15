import Link from "next/link";
import StepLabel from "@/components/ui/StepLabel";
import StatusBadge from "@/components/ui/StatusBadge";

export default function ResearchPreview() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="06" label="Featured note" />

          <Link
            href="/resources/research/first-post"
            className="group block max-w-4xl rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-lift)] sm:p-10 dark:border-gray-800 dark:hover:border-blue-900"
          >
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
              <span>Research note</span>
              <span aria-hidden="true">/</span>
              <time dateTime="2025-01-01">2025-01-01</time>
              <StatusBadge status="Draft" variant="draft" />
            </div>

            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              Splitting tasks across AI models
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              An exploratory note on routing different parts of a task to
              different models while measuring cost, quality, and review
              effort.
            </p>

            <span className="mt-8 inline-flex text-base font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
              Read the research note{" "}
              <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
