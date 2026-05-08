import { Button } from "../ui/button";

export function ExamHeader({ title, onPauseLabel = "Pause" }: { title: string; onPauseLabel?: string }) {
  return (
    <header className="phx-card flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="phx-kicker">Exam Session</p>
        <h1 className="phx-heading-md mt-1">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary">Flag Question</Button>
        <Button>{onPauseLabel}</Button>
      </div>
    </header>
  );
}
