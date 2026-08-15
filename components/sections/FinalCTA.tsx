import StepLabel from "@/components/ui/StepLabel";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-gray-200 bg-[var(--surface-muted)] px-6 py-14 sm:px-14 sm:py-16 dark:border-gray-800">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <StepLabel number="09" label="Collaborate" className="mb-5" />
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
                Bring a question worth examining.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400">
                We are interested in thoughtful conversations about research,
                engineering, and the practical work around AI.
              </p>
            </div>
            <Button href="/contact" size="lg" className="w-fit shrink-0">
              Contact PrepHatch <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
