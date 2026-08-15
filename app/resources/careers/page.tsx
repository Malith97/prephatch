import type { Metadata } from "next";
import StepLabel from "@/components/ui/StepLabel";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Careers", description: "How researchers, engineers, and collaborators can take part in the work." };

const fits = [
  "You start with a concrete question.",
  "You can move between research and implementation.",
  "You document uncertainty instead of hiding it.",
  "You care about making systems understandable.",
];

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-20 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Working with PrepHatch
          </p>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Small teams make the work visible.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            We are building a research organization for people who want to stay
            close to the question, the prototype, and the evidence.
          </p>
        </div>
      </section>

      {/* A good fit */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
            <StepLabel number="" label="A good fit" />
            <div className="grid gap-4 sm:grid-cols-2">
              {fits.map((fit, index) => (
                <p
                  key={fit}
                  className="flex gap-4 rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-soft)] dark:border-gray-800 dark:hover:border-blue-900"
                >
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    0{index + 1}
                  </span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {fit}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research culture */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Research culture
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                Read carefully. Test small. Share what changed.
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Research starts with a specific question and stays close to the
              evidence. We make room for findings that change the direction and
              for work that is not yet ready to become a claim.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-t border-gray-200 pt-10 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between sm:pt-12">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                No listed openings
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Start with a conversation.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400">
                If the questions sound relevant, send a short note about your
                interests and the kinds of work you like to work on.
              </p>
            </div>
            <Button href="mailto:[PLACEHOLDER EMAIL]" size="lg" className="w-fit shrink-0">
              [PLACEHOLDER EMAIL]
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
