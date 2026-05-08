import { Card } from "../ui/card";

export function InsightsPanel({
  items,
}: {
  items: Array<{ label: string; value: string; detail?: string }>;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Insights panel">
      {items.map((item) => (
        <Card key={item.label} title={item.label}>
          <p className="phx-heading-lg">{item.value}</p>
          {item.detail ? <p className="phx-body-sm mt-1">{item.detail}</p> : null}
        </Card>
      ))}
    </section>
  );
}
