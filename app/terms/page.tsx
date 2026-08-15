import type { Metadata } from "next";
import StepLabel from "@/components/ui/StepLabel";

export const metadata: Metadata = {
  title: "Terms",
  description: "A practical draft of the PrepHatch website terms of use.",
};

export default function TermsPage() {
  return (
    <article className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl border-b border-gray-200 pb-10 dark:border-gray-800">
          <StepLabel number="" label="Site information" />
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Terms of use
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            A practical draft for an informational and research website. It is
            not presented as a complete contract and still needs review before
            adoption.
          </p>
        </header>

        <div className="mt-12 lg:grid lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="" label="Draft / Current scope" />

          <div className="max-w-3xl space-y-10 text-base text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                1. Using this website
              </h2>
              <p className="mt-4">
                You may use this website to read information about PrepHatch,
                its research direction, its research notes, and the AI Resource
                Layer. The AI Resource Layer is in development and is not
                represented as an available service through this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                2. Research and content disclaimer
              </h2>
              <p className="mt-4">
                Research notes and other content are provided for general
                information and discussion. They may describe questions,
                hypotheses, prototypes, or work in progress. They are not
                professional, legal, financial, medical, safety, or operational
                advice, and they should not be treated as verified results
                unless expressly stated and supported.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                3. Intellectual property
              </h2>
              <p className="mt-4">
                Unless stated otherwise, website text, diagrams, code,
                branding, and other materials are owned by or used by PrepHatch
                and may not be copied, modified, or republished commercially
                without permission. Third-party names and linked materials
                remain the property of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                4. External links
              </h2>
              <p className="mt-4">
                The website may link to external research, organizations, or
                services for context. A link does not imply endorsement,
                partnership, sponsorship, or responsibility for that external
                material. External sites have their own terms and privacy
                practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                5. Acceptable use
              </h2>
              <p className="mt-4">
                You must not use the website to interfere with its operation,
                probe or bypass security, introduce malicious code, scrape
                content in a way that harms the service, impersonate another
                person, or use the site for unlawful purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                6. Availability and liability
              </h2>
              <p className="mt-4">
                The website is provided on an evolving basis. PrepHatch does not
                promise that it will always be available, error-free, complete,
                or suitable for a particular purpose. To the extent permitted by
                law, PrepHatch is not liable for loss arising from reliance on
                general website content or external links. Nothing in these
                terms excludes rights or remedies that cannot legally be
                excluded.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                7. Changes and contact
              </h2>
              <p className="mt-4">
                The website, its content, and these terms may change as the
                organization and project develop. The effective date and review
                owner are [PLACEHOLDER]. Questions about these terms can be sent
                to [PLACEHOLDER EMAIL]. The applicable legal entity and
                jurisdiction are [PLACEHOLDER] and must be confirmed before this
                draft is adopted.
              </p>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
