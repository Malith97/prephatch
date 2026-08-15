import type { Metadata } from "next";
import StepLabel from "@/components/ui/StepLabel";
import StatusBadge from "@/components/ui/StatusBadge";
import ProductMockup from "@/components/ui/ProductMockup";

export const metadata: Metadata = { title: "Solutions", description: "The AI Resource Layer is in development. Explore the problem, questions, and intended direction." };

const explorations = [
  "How resources are described and compared",
  "How limits and uncertainty are surfaced",
  "How a person chooses a tool for a specific task",
  "How evidence can travel with a recommendation",
];

export default function SolutionsPage() {
  return (
    <>
      <section className="border-b border-gray-200 dark:border-gray-800 py-20 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Project brief / 01
          </p>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The AI Resource Layer is a research project before it is a product.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            AI tools are easier to access than they are to compare. This project
            explores what a useful layer of context, organization, and
            evaluation might look like.
          </p>
        </div>
      </section>

      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-[var(--radius-xl)] border border-gray-200 bg-[var(--surface)] p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:p-10 dark:border-gray-800">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Current status
                </p>
                <StatusBadge status="In Development" variant="development" />
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                AI Resource Layer
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                A developing system for organizing AI resources, clarifying how
                they work, and helping people choose the right one for a task.
              </p>
            </div>
            <ProductMockup />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
            <StepLabel number="" label="What it explores" />
            <div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
                Context is part of the tool.
              </h2>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {explorations.map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-soft)] dark:border-gray-800 dark:hover:border-blue-900"
                  >
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      0{index + 1}
                    </span>
                    <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
              What it is not
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              Not a claim that the hard parts are solved.
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              The project is still being shaped through research and
              prototypes. Its purpose, scope, and usefulness should be tested in
              the open rather than assumed in advance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
