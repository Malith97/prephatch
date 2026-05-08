export default function LoadingExamSessionRoute() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16" aria-busy="true" aria-live="polite">
      <div className="ph-surface w-full space-y-4 rounded-3xl p-8">
        <p className="ph-eyebrow">Loading exam runtime</p>
        <div className="h-8 w-2/3 animate-pulse rounded-xl bg-border/60" />
        <div className="h-5 w-full animate-pulse rounded-xl bg-border/50" />
        <div className="h-5 w-5/6 animate-pulse rounded-xl bg-border/50" />
      </div>
    </main>
  );
}
