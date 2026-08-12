import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "General inquiries, partnerships, research collaboration, careers, and media contact.",
};

export default function ContactPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Contact
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder introduction to contacting us. This will be refined
              with final copy once messaging is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              General inquiry
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder description of what kinds of general inquiries we
              handle. This will be refined with final copy once messaging is
              settled.]
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              Email:{" "}
              <a
                href="mailto:[PLACEHOLDER EMAIL]"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                [PLACEHOLDER EMAIL]
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Partnership
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder description of the kinds of partnerships we consider.
              This will be refined with final copy once messaging is settled.]
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              Email:{" "}
              <a
                href="mailto:[PLACEHOLDER EMAIL]"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                [PLACEHOLDER EMAIL]
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Research collaboration
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder description of how we approach research
              collaborations. This will be refined with final copy once
              messaging is settled.]
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              Email:{" "}
              <a
                href="mailto:[PLACEHOLDER EMAIL]"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                [PLACEHOLDER EMAIL]
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Careers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder note about career-related inquiries. This will be
              refined with final copy once messaging is settled.]
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              Email:{" "}
              <a
                href="mailto:[PLACEHOLDER EMAIL]"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                [PLACEHOLDER EMAIL]
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Media
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder note about media and press inquiries. This will be
              refined with final copy once messaging is settled.]
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
              Email:{" "}
              <a
                href="mailto:[PLACEHOLDER EMAIL]"
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                [PLACEHOLDER EMAIL]
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
