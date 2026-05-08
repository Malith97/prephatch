"use client";

import { useState } from "react";
import { Button } from "../ui/button";

const goals = ["Pass upcoming exam", "Improve weak topics", "Build daily habit"];

export function OnboardingForm() {
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);

  return (
    <form className="space-y-4" aria-label="Onboarding form">
      <label className="phx-field">
        <span className="phx-label">Target exam date</span>
        <input className="phx-input" type="date" name="targetDate" required />
      </label>

      <fieldset className="phx-field">
        <legend className="phx-label">Primary goal</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {goals.map((goal) => {
            const active = goal === selectedGoal;
            return (
              <label key={goal} className={`phx-option ${active ? "phx-option-active" : ""}`.trim()}>
                <input
                  type="radio"
                  name="goal"
                  className="sr-only"
                  value={goal}
                  checked={active}
                  onChange={() => setSelectedGoal(goal)}
                />
                <span className="phx-body-sm">{goal}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="phx-field">
        <span className="phx-label">Study hours / week</span>
        <input className="phx-input" type="number" name="hoursPerWeek" min={1} max={40} defaultValue={8} required />
      </label>

      <Button type="submit" className="w-full">Continue to Dashboard</Button>
    </form>
  );
}
