import StepLabel from "@/components/ui/StepLabel";
import Button from "@/components/ui/Button";
import ProductMockup from "@/components/ui/ProductMockup";

const stats = [
  { value: "5", label: "connected research themes" },
  { value: "2", label: "regions: Australia & Europe" },
  { value: "01", label: "project in active development" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 py-16 sm:py-24 lg:py-28 dark:border-gray-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-2xl animate-fade-in-up">
            <StepLabel number="00" label="Independent research and engineering" className="mb-8" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              We study how people can work with AI more clearly.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
              PrepHatch investigates the tools, decisions, and working habits
              that shape AI-supported work. We turn questions into experiments,
              prototypes, and research notes.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="#questions" size="lg">
                Explore the questions <span aria-hidden="true">→</span>
              </Button>
              <Button href="/resources" variant="secondary" size="lg">
                Read the notes
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-gray-200 pt-8 dark:border-gray-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-in-up [animation-delay:150ms]">
            <ProductMockup />
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              A concept view of the AI Resource Layer: questions, tools, and
              evidence connected around a task.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
