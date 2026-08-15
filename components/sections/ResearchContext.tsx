import StepLabel from "@/components/ui/StepLabel";

const organizations = ["Atlassian", "Canva", "Telstra", "Commonwealth Bank", "Xero"];

export default function ResearchContext() {
  return (
    <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="" label="Research context" />

          <div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              Part of a wider Australian technology ecosystem.
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Australia has a visible technology and innovation landscape that
              gives this work context. These organizations are referenced as
              part of that broader ecosystem, not as evidence of a relationship
              with PrepHatch.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {organizations.map((organization) => (
                <p
                  key={organization}
                  className="rounded-[var(--radius-md)] border border-gray-200 bg-[var(--surface)] px-4 py-5 text-center text-base font-medium tracking-tight text-gray-500 grayscale transition-all duration-200 hover:text-gray-900 hover:grayscale-0 dark:border-gray-800 dark:text-gray-500 dark:hover:text-gray-100"
                >
                  {organization}
                </p>
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-xs text-gray-500 dark:text-gray-500">
              These organizations are shown as part of the broader Australian
              technology and innovation ecosystem. Their inclusion does not
              imply a partnership or endorsement.
            </p>

            <div className="mt-12 grid gap-6 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Australia
                </p>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                  PrepHatch operates in Australia, within a wider technology
                  and research ecosystem.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Europe
                </p>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                  The organisation also operates in Europe, with an office in
                  Berlin, Germany.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
