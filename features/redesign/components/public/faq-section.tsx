const faqs = [
  {
    q: "Can I switch between mock packages?",
    a: "Yes. Your dashboard keeps progress separated by package and exam type.",
  },
  {
    q: "Does PrepHatch support timed and untimed sessions?",
    a: "Yes. Runtime supports both modes with per-section timer controls.",
  },
  {
    q: "Will I get topic-level feedback?",
    a: "Yes. Results and weak-area views provide topic mastery guidance and next actions.",
  },
];

export function FAQSection() {
  return (
    <section className="space-y-4">
      <h2 className="phx-heading-lg">FAQ</h2>
      <div className="space-y-3">
        {faqs.map((entry) => (
          <details key={entry.q} className="phx-accordion">
            <summary className="phx-accordion-summary">{entry.q}</summary>
            <p className="phx-body-sm mt-2">{entry.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
