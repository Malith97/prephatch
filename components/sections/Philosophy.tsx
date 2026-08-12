interface PrincipleCard {
  title: string;
  description: string;
}

const principles: PrincipleCard[] = [
  {
    title: "[Placeholder Principle 1]",
    description:
      "[Placeholder description for the first guiding principle. This will be replaced with final copy during the content pass.]",
  },
  {
    title: "[Placeholder Principle 2]",
    description:
      "[Placeholder description for the second guiding principle. This will be replaced with final copy during the content pass.]",
  },
  {
    title: "[Placeholder Principle 3]",
    description:
      "[Placeholder description for the third guiding principle. This will be replaced with final copy during the content pass.]",
  },
];

export default function Philosophy() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className="flex flex-col items-center text-center p-6 sm:p-8 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <span
                aria-hidden="true"
                className="flex items-center justify-center w-8 h-8 mb-4 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-full"
              >
                {index + 1}
              </span>
              <h3 className="text-xl font-medium tracking-tight mb-3">
                {principle.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
