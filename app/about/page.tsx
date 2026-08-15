import type { Metadata } from "next";
import StepLabel from "@/components/ui/StepLabel";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: "PrepHatch is an independent research and engineering organisation studying how people work with AI.",
};

const principles = [
  ["Stay close to the question", "Research starts with a specific problem, not a trend to follow."],
  ["Show the uncertainty", "Findings are shared with their limits, not polished past what the evidence supports."],
  ["Build to learn", "Prototypes exist to test a hypothesis, not to ship a claim early."],
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-20 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <StepLabel number="" label="About" className="mb-6" />
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            An independent research and engineering organisation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            PrepHatch studies how people can work with AI more clearly, and
            turns that research into practical tools, starting with the AI
            Resource Layer.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
            <StepLabel number="" label="How we work" />
            <div className="grid gap-6 sm:grid-cols-3">
              {principles.map(([title, text], index) => (
                <article
                  key={title}
                  className="rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)] dark:border-gray-800 dark:hover:border-blue-900"
                >
                  <p className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    0{index + 1}
                  </p>
                  <h2 className="mt-8 text-xl font-medium tracking-tight">{title}</h2>
                  <p className="mt-4 text-base text-gray-600 dark:text-gray-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Where we work */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
            <StepLabel number="" label="Where we work" />
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="border-l-2 border-blue-600 pl-5">
                <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Australia
                </p>
                <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
                  PrepHatch operates in Australia, within a wider technology and
                  research ecosystem.
                </p>
              </div>
              <div className="border-l-2 border-blue-600 pl-5">
                <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Europe
                </p>
                <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
                  The organisation also operates in Europe, with an office in
                  Berlin, Germany.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-t border-gray-200 pt-10 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between sm:pt-12">
            <div>
              <StepLabel number="" label="Learn more" className="mb-4" />
              <h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Read the research or say hello.
              </h2>
            </div>
            <div className="flex w-fit shrink-0 flex-wrap gap-3">
              <Button href="/resources" variant="secondary">
                Read the notes
              </Button>
              <Button href="/contact">
                Contact PrepHatch <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
