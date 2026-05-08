import { Card } from "../ui/card";

const testimonials = [
  { name: "Aditi S.", text: "The exam workspace feels calm and structured. My accuracy improved in 3 weeks." },
  { name: "Nolan P.", text: "The weak-area breakdown told me exactly what to revise before test day." },
  { name: "Maya R.", text: "Marketplace filtering made it easy to find the right package for my certification." },
];

export function TestimonialList() {
  return (
    <section className="space-y-4">
      <h2 className="phx-heading-lg">What learners say</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((entry) => (
          <Card key={entry.name} className="h-full" title={entry.name}>
            <p className="phx-body-sm">{entry.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
