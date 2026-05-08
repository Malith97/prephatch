export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`phx-skeleton-card ${className}`.trim()} aria-hidden="true" />;
}
