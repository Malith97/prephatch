"use client";

export default function ErrorExamSessionRoute({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
      <div className="ph-surface w-full space-y-4 rounded-3xl p-8">
        <p className="ph-eyebrow">Exam runtime unavailable</p>
        <h1 className="text-3xl font-semibold text-text-primary">Something went wrong while loading this mock.</h1>
        <p className="text-sm leading-7 text-text-secondary">{error.message || "Unexpected runtime error."}</p>
        <button type="button" onClick={reset} className="ph-btn ph-button-primary ph-hover-lift">
          Retry
        </button>
      </div>
    </main>
  );
}
