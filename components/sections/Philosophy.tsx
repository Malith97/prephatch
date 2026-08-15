import StepLabel from "@/components/ui/StepLabel";

const areas = [
  { number: "02", title: "Human-AI workflows", description: "How tools change the sequence, judgment, and review involved in everyday work." },
  { number: "03", title: "Resource evaluation", description: "How people can compare AI resources by purpose, limits, and evidence rather than novelty." },
  { number: "04", title: "Responsible use", description: "How transparency, careful handoffs, and explicit uncertainty support better decisions." },
];

export default function Philosophy() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <StepLabel number="02" label="Research areas" className="mb-4" />
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              A small set of connected themes.
            </h2>
          </div>
          <p className="max-w-sm text-base text-gray-600 dark:text-gray-400">
            We stay close to questions that can be examined through practice,
            prototypes, and careful comparison.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {areas.map((area) => (
            <article
              key={area.number}
              className="group rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)] dark:border-gray-800 dark:hover:border-blue-900"
            >
              <p className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                {area.number}
              </p>
              <h3 className="mt-8 text-2xl font-medium tracking-tight">{area.title}</h3>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                {area.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
