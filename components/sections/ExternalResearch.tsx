import StepLabel from "@/components/ui/StepLabel";

const sources = [
  {
    title: "Is Australian science ready for AI?",
    organization: "Australian Academy of Science",
    date: "2025",
    summary:
      "A public research and policy discussion about how artificial intelligence is changing scientific work and what Australian science may need to respond well.",
    href: "https://www.science.org.au/",
  },
  {
    title: "Australia's artificial intelligence ecosystem: growth and opportunities",
    organization: "Australian Government",
    date: "2025",
    summary:
      "A government report examining Australia's artificial intelligence ecosystem, its development, and areas of opportunity.",
    href: "https://www.industry.gov.au/publications/australias-artificial-intelligence-ecosystem-growth-and-opportunities",
  },
];

export default function ExternalResearch() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <div>
            <StepLabel number="" label="External research" />
            <p className="mt-5 max-w-xs text-sm text-gray-500 dark:text-gray-500">
              Selected context from Australian science and technology policy.
              These are not PrepHatch publications.
            </p>
          </div>

          <div className="grid gap-6">
            {sources.map((source) => (
              <article
                key={source.title}
                className="rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-soft)] sm:p-8 dark:border-gray-800 dark:hover:border-blue-900"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-500">
                  <span>Research context</span>
                  <span>/</span>
                  <span>{source.date}</span>
                </div>
                <h2 className="mt-4 max-w-3xl text-2xl font-medium tracking-tight sm:text-3xl">
                  {source.title}
                </h2>
                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {source.organization}
                </p>
                <p className="mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-400">
                  {source.summary}
                </p>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Open original source <span aria-hidden="true" className="ml-2">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
