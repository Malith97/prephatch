import type { Metadata } from "next";
import Link from "next/link";
import StepLabel from "@/components/ui/StepLabel";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import ExternalResearch from "@/components/sections/ExternalResearch";

export const metadata: Metadata = { title: "Resources", description: "Research notes and working observations from PrepHatch." };

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-20 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Research archive
          </p>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Notes from questions still being worked through.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            An early archive of exploratory writing on AI tools, workflows,
            evaluation, and the decisions around using them.
          </p>
        </div>
      </section>

      {/* Featured research */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Featured research / PrepHatch note
          </p>

          <article className="grid gap-10 rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.6fr)] lg:gap-14 lg:p-10 dark:border-gray-800">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                <span>Research notes</span>
                <span>/</span>
                <time dateTime="2025-01-01">2025-01-01</time>
                <span>/</span>
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

              <Link
                href="/resources/research/first-post"
                className="mt-8 inline-flex text-base font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Open the note <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-6 dark:border-gray-800 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-500">
                Technical notes
              </p>
              <p className="mt-5 text-base text-gray-600 dark:text-gray-400">
                The current archive begins with exploratory research. Technical
                notes will be added when there is work that can be described
                accurately and separately.
              </p>
            </div>
          </article>
        </div>
      </section>

      <ExternalResearch />

      {/* CTA */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <StepLabel number="" label="Field notes" className="mb-4" />
          <div className="flex flex-col gap-8 border-t border-gray-200 pt-10 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between sm:pt-12">
            <div>
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
                The archive will grow with the work.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400">
                PrepHatch notes remain separate from external research: they
                record questions and methods under development rather than
                claiming finished results.
              </p>
            </div>
            <Button href="/resources/careers" variant="secondary" className="w-fit shrink-0">
              About the work
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
