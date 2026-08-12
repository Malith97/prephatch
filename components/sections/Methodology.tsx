interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Research",
    description:
      "[Placeholder description exploring the problem space and existing solutions.]",
  },
  {
    number: 2,
    title: "Experiment",
    description:
      "[Placeholder description testing hypotheses with small-scale prototypes.]",
  },
  {
    number: 3,
    title: "Build",
    description:
      "[Placeholder description developing the solution iteratively.]",
  },
  {
    number: 4,
    title: "Measure",
    description:
      "[Placeholder description evaluating real-world effectiveness.]",
  },
  {
    number: 5,
    title: "Improve",
    description:
      "[Placeholder description refining based on results and feedback.]",
  },
];

export default function Methodology() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ol className="sm:flex sm:items-start sm:justify-between sm:space-x-4 lg:space-x-6">
            {steps.map((step) => (
              <li
                key={step.title}
                className="mb-8 last:mb-0 sm:mb-0 sm:flex-1 sm:text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center w-8 h-8 mx-auto mb-3 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-full"
                >
                  {step.number}
                </span>
                <h3 className="text-base font-medium tracking-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
