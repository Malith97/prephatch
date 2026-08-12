import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Research notes, technical reports, and resources. The AI Resource Layer is in development.",
};

const researchPosts = [
  {
    title: "[Placeholder Research Post Title 1]",
  },
  {
    title: "[Placeholder Research Post Title 2]",
  },
  {
    title: "[Placeholder Research Post Title 3]",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Resources
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              [Placeholder introduction to the resources index. This will be
              refined with final copy once messaging is settled.]
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">
              Research and notes
            </h2>
            <ul className="flex flex-col space-y-6 sm:space-y-8">
              {researchPosts.map((post) => (
                <li
                  key={post.title}
                  className="border-b border-gray-200 dark:border-gray-800 pb-4 sm:pb-6"
                >
                  <a
                    href="#"
                    className="block group text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <h3 className="text-xl font-medium tracking-tight">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                      Coming soon
                    </p>
                  </a>
                </li>
              ))}
            </ul>
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
              [Placeholder: short note about joining the team. This will be
              refined with final copy once messaging is settled.]
            </p>
            <a
              href="/resources/careers"
              className="inline-flex items-center px-5 py-2.5 text-base font-medium text-gray-900 dark:text-gray-100 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View careers
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
