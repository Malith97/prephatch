import type { Metric } from "../../types";
import { Card } from "../ui/card";

export function MetricCards({ items }: { items: Metric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((metric) => (
        <Card key={metric.id}>
          <p className="phx-label">{metric.label}</p>
          <p className="phx-heading-lg mt-2">{metric.value}</p>
          {metric.delta ? <p className="phx-body-sm mt-1">{metric.delta}</p> : null}
        </Card>
      ))}
    </div>
  );
}
