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

export default function ResearchPreview() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <ul className="flex flex-col space-y-6 sm:space-y-8">
            {researchPosts.map((post) => (
              <li
                key={post.title}
                className="border-b border-gray-200 dark:border-gray-800 pb-4 sm:pb-6"
              >
                <a href="#" className="block group">
                  <h3 className="text-xl font-medium tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
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
  );
}