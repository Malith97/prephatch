import StepLabel from "@/components/ui/StepLabel";
import FAQAccordion from "@/components/ui/FAQAccordion";

const faqs = [
  {
    question: "Is the AI Resource Layer available to use yet?",
    answer:
      "No. It is a research project in active development, not a shipped product. The site describes the direction and the questions driving it rather than an available service.",
  },
  {
    question: "What kind of research does PrepHatch publish?",
    answer:
      "Exploratory notes on AI tools, workflows, and evaluation. Notes describe questions and methods under development, not finished or verified claims unless stated.",
  },
  {
    question: "Where is PrepHatch based?",
    answer:
      "The work spans Australia and Europe, with an office in Berlin, Germany, alongside Australia-based research and engineering.",
  },
  {
    question: "How can I get involved or ask a question?",
    answer:
      "Reach out through the contact page with a specific question or interest — research collaboration, partnership, careers, or media are all good starting points.",
  },
];

export default function FAQ() {
  return (
    <section className="border-b border-gray-200 py-16 sm:py-24 lg:py-28 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <StepLabel number="" label="Frequently asked" />
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-tight">
              Common questions about the work.
            </h2>
            <div className="mt-10 max-w-3xl">
              <FAQAccordion items={faqs} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
