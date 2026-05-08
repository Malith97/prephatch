import type { WeakArea } from "../../types";
import { Card } from "../ui/card";

export function WeakAreasList({ areas }: { areas: WeakArea[] }) {
  return (
    <Card title="Weak Areas" description="Prioritize these topics in your next revision loop.">
      <ul className="space-y-3">
        {areas.map((area) => (
          <li key={area.id} className="phx-weak-item">
            <div className="flex items-center justify-between gap-3">
              <h3 className="phx-heading-sm">{area.topic}</h3>
              <span className="phx-label">{area.accuracy}% accuracy</span>
            </div>
            <p className="phx-body-sm mt-1">{area.recommendation}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
