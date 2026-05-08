import { PublicShell, SkeletonBlock } from "../../../features/redesign/components";

export default function MarketplaceDetailLoading() {
  return (
    <PublicShell>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]" aria-label="Loading package detail">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
      </div>
    </PublicShell>
  );
}
