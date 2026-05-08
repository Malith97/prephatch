import { Card } from "../ui/card";

const features = [
  { title: "Adaptive Practice", description: "Question sets adapt to your performance bands and confidence levels." },
  { title: "Session Workspace", description: "Distraction-free runtime with timer, palette navigation, and review mode." },
  { title: "Deep Analytics", description: "Track topic accuracy, score trends, and revision priorities in one dashboard." },
  { title: "Marketplace", description: "Explore exam packages by provider, domain, and difficulty." },
];

export function FeaturesGrid() {
  return (
    <section className="space-y-4">
      <h2 className="phx-heading-lg">Why learners choose PrepHatch</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  );
}
