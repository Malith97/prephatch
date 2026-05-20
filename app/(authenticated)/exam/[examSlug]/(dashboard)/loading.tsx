export default function LoadingExamDashboardRoute() {
  return (
    <main
      className="space-y-5"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <p className="ph-eyebrow">Loading certification workspace</p>
        <div className="mt-4 h-10 w-2/3 animate-pulse rounded-2xl bg-border/55" />
        <div className="mt-4 h-5 w-full animate-pulse rounded-xl bg-border/45" />
        <div className="mt-3 h-5 w-5/6 animate-pulse rounded-xl bg-border/45" />
      </section>
    </main>
  );
}
