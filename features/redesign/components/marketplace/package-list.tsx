import type { PackageItem } from "../../types";
import { Alert } from "../ui/alert";
import { PackageCard } from "./package-card";

export async function PackageList({ packagesPromise }: { packagesPromise: Promise<PackageItem[]> }) {
  try {
    const packages = await packagesPromise;

    if (!packages.length) {
      return <Alert title="No packages found" message="Try adjusting filters to discover more content." />;
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {packages.map((item) => (
          <PackageCard key={item.id} item={item} />
        ))}
      </div>
    );
  } catch {
    return <Alert tone="warning" title="Could not load packages" message="Please try refreshing this page." />;
  }
}

export function PackageListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading packages">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="phx-skeleton-card" />
      ))}
    </div>
  );
}
