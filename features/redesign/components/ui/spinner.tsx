export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-3" role="status" aria-live="polite" aria-label={label}>
      <span className="phx-spinner" aria-hidden="true" />
      <span className="phx-body-sm">{label}</span>
    </div>
  );
}
