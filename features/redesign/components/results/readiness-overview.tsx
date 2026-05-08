import { Card } from "../ui/card";

export function ReadinessOverview({
  readinessScore,
  confidence,
  recommendation,
}: {
  readinessScore: number;
  confidence: string;
  recommendation: string;
}) {
  return (
    <Card title="Readiness Overview" description={`Confidence: ${confidence}`}>
      <p className="phx-heading-xl">{readinessScore}/100</p>
      <p className="phx-body-sm mt-2">{recommendation}</p>
    </Card>
  );
}
