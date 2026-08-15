import type { Metadata } from "next";
import StepLabel from "@/components/ui/StepLabel";

export const metadata: Metadata = {
  title: "Privacy",
  description: "A practical draft privacy policy for the PrepHatch website.",
};

export default function PrivacyPage() {
  return (
    <article className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl border-b border-gray-200 pb-10 dark:border-gray-800">
          <StepLabel number="" label="Site information" />
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Privacy
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            A practical draft for this informational and research website. It is
            not a substitute for legal advice and still needs review before
            adoption.
          </p>
        </header>

        <div className="mt-12 lg:grid lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="" label="Draft / Australian context" />

          <div className="max-w-3xl space-y-10 text-base text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                1. What this covers
              </h2>
              <p className="mt-4">
                This draft describes how PrepHatch may handle personal
                information in connection with this website. It is written with
                the Australian Privacy Principles and OAIC guidance in mind. The
                operator and legal entity responsible for this site are{" "}
                [PLACEHOLDER].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                2. Information you provide
              </h2>
              <p className="mt-4">
                The site does not currently provide a web form. If you contact
                PrepHatch by email, the message may include your name, email
                address, the contents of your message, and any information you
                choose to provide. Please do not send sensitive information
                unless it is needed for the inquiry.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                3. Technical information
              </h2>
              <p className="mt-4">
                A website host or server may record ordinary technical
                information such as an IP address, browser and device details,
                requested pages, timestamps, and error information in server
                logs. The current hosting provider, log settings, and retention
                period need confirmation: [PLACEHOLDER].
              </p>
              <p className="mt-4">
                No analytics service is configured in the current project. No
                advertising cookies, tracking pixels, account system, or
                subscription system are configured. If this changes, this policy
                should be updated before those tools are introduced.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                4. How information is used
              </h2>
              <p className="mt-4">
                Information provided by email may be used to read and respond to
                your inquiry, consider a research or collaboration conversation,
                manage site security, and keep a record where reasonably
                necessary. Information will not be used for unrelated marketing
                without an appropriate basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                5. Disclosure and overseas handling
              </h2>
              <p className="mt-4">
                Email and hosting providers may process information on behalf of
                PrepHatch. The relevant providers, locations, and any overseas
                disclosure need confirmation: [PLACEHOLDER]. No sale of personal
                information is intended.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                6. Retention and security
              </h2>
              <p className="mt-4">
                Information should be kept only for as long as reasonably needed
                for the purpose for which it was collected, legal obligations,
                dispute handling, or security. Email retention, deletion
                practices, and the technical security measures used by the host
                need confirmation: [PLACEHOLDER].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                7. Access, correction, and complaints
              </h2>
              <p className="mt-4">
                You may ask for access to, or correction of, personal information
                held about you, subject to applicable exceptions. You may also
                complain about how information has been handled. Contact:{" "}
                [PLACEHOLDER EMAIL]. PrepHatch will aim to acknowledge and
                investigate a complaint within a reasonable time. If the matter
                is not resolved, you may contact the Office of the Australian
                Information Commissioner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                8. Updates
              </h2>
              <p className="mt-4">
                This policy may be updated when the website, providers, or
                information practices change. The effective date and review
                owner are [PLACEHOLDER].
              </p>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
