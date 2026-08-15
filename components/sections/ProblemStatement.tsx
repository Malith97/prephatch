import StepLabel from "@/components/ui/StepLabel";

const questions = [
  "How should people choose an AI tool for a specific task?",
  "What information makes a model's output easier to inspect?",
  "When does splitting work across models improve the process?",
  "How can evaluation stay close to the work it is meant to improve?",
];

export default function ProblemStatement() {
  return (
    <section id="questions" className="border-b border-gray-200 dark:border-gray-800 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="01" label="The questions" />

          <div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              The useful questions are usually about the work around the model.
            </h2>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {questions.map((question, index) => (
                <div
                  key={question}
                  className="group flex gap-4 rounded-[var(--radius-lg)] border border-gray-200 bg-[var(--surface)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-soft)] dark:border-gray-800 dark:hover:border-blue-900"
                >
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    0{index + 1}
                  </span>
                  <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
