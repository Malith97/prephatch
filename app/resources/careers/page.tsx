import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Who we want, our research culture, and engineering culture. The AI Resource Layer is in development.",
};

export default function CareersPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Who we want
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: description of the kind of people we look for,
              without naming specific roles or openings. This will be refined
              with final copy once messaging is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Research culture
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: description of how research work is conducted and
              supported. This will be refined with final copy once messaging is
              settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Engineering culture
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: description of how engineering work is conducted and
              supported. This will be refined with final copy once messaging is
              settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Reach out
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: general invitation for interested people to get in
              touch. This will be refined with final copy once messaging is
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
    </>
  );
}
