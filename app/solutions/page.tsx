import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "The AI Resource Layer is in development. Learn about the problem we are solving and our approach.",
};

export default function SolutionsPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Solutions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder introduction describing the problem space and why we
              are working on a solution. This will be refined with final copy
              once messaging is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-medium tracking-tight">
                  [Placeholder Solution Title]
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  In Development
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                [Placeholder description of the AI Resource Layer concept,
                including the problem it addresses and the approach. This is
                currently in development and not yet available.]
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-6 border-t border-gray-200 dark:border-gray-800">
              <details className="mt-6 border-b border-gray-200 dark:border-gray-800">
                <summary className="text-lg font-medium text-gray-900 dark:text-gray-100 cursor-pointer list-none">
                  <span className="flex justify-between items-center">
                    <span>[Placeholder question one]</span>
                    <span className="text-gray-500 dark:text-gray-500">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  [Placeholder answer one. This will be refined with final copy
                  once messaging is settled.]
                </p>
              </details>
              <details className="mt-6 border-b border-gray-200 dark:border-gray-800">
                <summary className="text-lg font-medium text-gray-900 dark:text-gray-100 cursor-pointer list-none">
                  <span className="flex justify-between items-center">
                    <span>[Placeholder question two]</span>
                    <span className="text-gray-500 dark:text-gray-500">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  [Placeholder answer two. This will be refined with final copy
                  once messaging is settled.]
                </p>
              </details>
              <details className="mt-6">
                <summary className="text-lg font-medium text-gray-900 dark:text-gray-100 cursor-pointer list-none">
                  <span className="flex justify-between items-center">
                    <span>[Placeholder question three]</span>
                    <span className="text-gray-500 dark:text-gray-500">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  [Placeholder answer three. This will be refined with final copy
                  once messaging is settled.]
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
