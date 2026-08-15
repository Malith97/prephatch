import StepLabel from "@/components/ui/StepLabel";

const steps = [
  ["Research", "Define the task, context, and question."],
  ["Experiment", "Test a focused hypothesis with a small prototype."],
  ["Build", "Turn a useful pattern into a system that fits the work."],
  ["Measure", "Evaluate quality, failure modes, effort, and uncertainty."],
  ["Improve", "Use the evidence to decide what happens next."],
];

export default function Methodology() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="08" label="Method" />

          <div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              A loop for turning uncertainty into the next useful question.
            </h2>

            <ol className="mt-12 grid gap-4 sm:grid-cols-5">
              {steps.map(([step, description], index) => (
                <li
                  key={step}
                  className="relative flex gap-4 rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-5 sm:block dark:border-gray-800"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="mt-0 text-lg font-medium tracking-tight sm:mt-5">
                      {step}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                  {index < steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-9 hidden h-px w-4 -translate-y-1/2 translate-x-full bg-gray-200 sm:block dark:bg-gray-800"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
