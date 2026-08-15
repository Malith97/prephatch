import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact", description: "Contact PrepHatch about research, collaboration, careers, and media." };

const contacts = [
  ["General inquiry", "Questions about PrepHatch, the research, or the AI Resource Layer."],
  ["Research collaboration", "A specific question, shared context, or a possible study to discuss."],
  ["Partnership", "A practical collaboration connected to a clear research or product problem."],
  ["Careers", "Your interests and the kinds of work you would like to contribute to."],
  ["Media", "The topic, publication or project, and relevant timing."],
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-20 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Contact
          </p>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            A clear question is a good place to start.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Choose the kind of conversation below. Include enough context for a
            useful first reply.
          </p>
        </div>
      </section>

      {/* Contact categories */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {contacts.map(([title, text], index) => (
              <article
                key={title}
                className="rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-soft)] sm:p-8 dark:border-gray-800 dark:hover:border-blue-900"
              >
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  0{index + 1}
                </p>
                <h2 className="mt-8 text-2xl font-medium tracking-tight">
                  {title}
                </h2>
                <p className="mt-4 max-w-md text-base text-gray-700 dark:text-gray-300">
                  {text}
                </p>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                  Email:{" "}
                  <a
                    href="mailto:[PLACEHOLDER EMAIL]"
                    className="font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                  >
                    [PLACEHOLDER EMAIL]
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="border-l-2 border-blue-600 pl-5">
              <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Australia
              </p>
              <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
                For Australia-based research, engineering, and career
                conversations, contact the organisation through the address
                below.
              </p>
            </div>
            <div className="border-l-2 border-blue-600 pl-5">
              <p className="text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Berlin, Germany
              </p>
              <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
                For Europe-based conversations, the organisation&apos;s office is in
                Berlin. No street address is published here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
