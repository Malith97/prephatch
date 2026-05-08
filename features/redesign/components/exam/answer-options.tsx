"use client";

import { useState } from "react";
import type { QuestionOption } from "../../types";

export function AnswerOptions({ options, onSelect }: { options: QuestionOption[]; onSelect?: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <fieldset className="phx-card" aria-label="Answer options">
      <legend className="sr-only">Choose an answer</legend>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = selected === option.id;
          return (
            <label key={option.id} className={`phx-option ${isChecked ? "phx-option-active" : ""}`.trim()}>
              <input
                type="radio"
                name="answer"
                value={option.id}
                checked={isChecked}
                onChange={() => {
                  setSelected(option.id);
                  onSelect?.(option.id);
                }}
              />
              <span className="phx-option-badge" aria-hidden="true">
                {option.label}
              </span>
              <span className="phx-body-md">{option.text}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
