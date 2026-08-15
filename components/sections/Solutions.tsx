import StepLabel from "@/components/ui/StepLabel";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import ProductMockup from "@/components/ui/ProductMockup";

const pillars = ["Map resources by purpose", "Make limits easier to see", "Support deliberate choices"];

export default function Solutions() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="05" label="What we are building" />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
                  AI Resource Layer
                </h2>
                <StatusBadge status="In Development" variant="development" />
              </div>
              <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                A developing system for organizing AI resources, clarifying
                how they work, and helping people choose the right one for a
                task.
              </p>

              <ul className="mt-8 space-y-4">
                {pillars.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      ✓
                    </span>
                    <span className="text-base text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <Button href="/solutions" variant="secondary" size="md" className="mt-9">
                See the project brief <span aria-hidden="true">→</span>
              </Button>
            </div>

            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
