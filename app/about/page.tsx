import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we exist, what we believe, what we're building, and our long-term direction.",
};

export default function About() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Why we exist
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: the founding motivation and the problem this company
              addresses. This will be refined with final copy once messaging is
              settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              What we believe
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: core principles and guiding beliefs. This will be
              refined with final copy once messaging is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              What we're building
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: description of the AI Resource Layer, currently in
              development. This will be refined with final copy once messaging
              is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Long-term direction
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder: the long-term roadmap and direction. This will be
              refined with final copy once messaging is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              The team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [PLACEHOLDER: Short founder note to be written once team details
              are confirmed. Names, roles, and bios will be filled in here.]
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
