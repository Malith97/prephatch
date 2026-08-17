"use client";

import { useMemo, useState } from "react";

type FilterPanelProps = {
  providers: string[];
  levels: string[];
  onChange?: (filters: { provider: string; level: string }) => void;
};

export function FilterPanel({ providers, levels, onChange }: FilterPanelProps) {
  const [provider, setProvider] = useState("all");
  const [level, setLevel] = useState("all");

  const selected = useMemo(() => ({ provider, level }), [provider, level]);

  return (
    <aside className="phx-card" aria-label="Package filters">
      <h2 className="phx-heading-sm mb-4">Filters</h2>

      <label className="phx-field">
        <span className="phx-label">Provider</span>
        <select
          className="phx-input"
          value={provider}
          onChange={(event) => {
            const next = event.target.value;
            setProvider(next);
            onChange?.({ ...selected, provider: next });
          }}
        >
          <option value="all">All providers</option>
          {providers.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label className="phx-field mt-4">
        <span className="phx-label">Difficulty</span>
        <select
          className="phx-input"
          value={level}
          onChange={(event) => {
            const next = event.target.value;
            setLevel(next);
            onChange?.({ ...selected, level: next });
          }}
        >
          <option value="all">All levels</option>
          {levels.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );
}
