import { Card } from "../ui/card";

export function ResultsSummary({
  score,
  percentile,
  timeSpent,
}: {
  score: number;
  percentile: number;
  timeSpent: string;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <Card title="Score">
        <p className="phx-heading-xl">{score}</p>
      </Card>
      <Card title="Percentile">
        <p className="phx-heading-xl">{percentile}%</p>
      </Card>
      <Card title="Time Spent">
        <p className="phx-heading-xl">{timeSpent}</p>
      </Card>
    </section>
  );
}
