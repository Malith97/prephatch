export function ExamProgressIndicator({ answered, total }: { answered: number; total: number }) {
  const value = total > 0 ? Math.min(Math.round((answered / total) * 100), 100) : 0;

  return (
    <section className="phx-card" aria-label="Exam progress">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 className="phx-heading-sm">Progress</h2>
        <p className="phx-body-sm tabular-nums">{answered}/{total}</p>
      </div>
      <div className="phx-timer-track" aria-hidden="true">
        <div className="phx-timer-fill" style={{ width: `${value}%` }} />
      </div>
    </section>
  );
}
