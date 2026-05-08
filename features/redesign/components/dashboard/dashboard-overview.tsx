import type { Metric } from "../../types";
import { Alert } from "../ui/alert";
import { MetricCards } from "./metric-cards";
import { ProgressTabs } from "./progress-tabs";

export async function DashboardOverview({ metricsPromise }: { metricsPromise: Promise<Metric[]> }) {
  try {
    const metrics = await metricsPromise;

    return (
      <div className="space-y-4">
        <MetricCards items={metrics} />
        <ProgressTabs />
      </div>
    );
  } catch {
    return <Alert tone="warning" title="Dashboard unavailable" message="Please retry loading your metrics." />;
  }
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="phx-skeleton-card" />
        ))}
      </div>
      <div className="phx-skeleton-card h-48" />
    </div>
  );
}
