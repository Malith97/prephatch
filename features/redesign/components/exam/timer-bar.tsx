"use client";

import { useEffect, useMemo, useState } from "react";

export function TimerBar({ durationSeconds, initialElapsed = 0 }: { durationSeconds: number; initialElapsed?: number }) {
  const [elapsed, setElapsed] = useState(initialElapsed);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((value) => Math.min(value + 1, durationSeconds));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [durationSeconds]);

  const remaining = Math.max(durationSeconds - elapsed, 0);

  const progress = useMemo(() => {
    if (!durationSeconds) return 0;
    return Math.round((elapsed / durationSeconds) * 100);
  }, [elapsed, durationSeconds]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <section className="phx-card" aria-label="Exam timer" aria-live="polite">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="phx-heading-sm">Time Remaining</h2>
        <p className="phx-heading-sm tabular-nums">{minutes}:{seconds}</p>
      </div>
      <div className="phx-timer-track">
        <div className="phx-timer-fill" style={{ width: `${progress}%` }} aria-hidden="true" />
      </div>
    </section>
  );
}
