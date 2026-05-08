"use client";

import { useState } from "react";

const tabs = ["Overview", "Progress", "Recommendations"] as const;

export function ProgressTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");

  return (
    <section className="phx-card" aria-label="Progress tabs">
      <div className="phx-tab-row" role="tablist" aria-label="Dashboard tab navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            aria-controls={`panel-${tab}`}
            id={`tab-${tab}`}
            className={`phx-tab ${active === tab ? "phx-tab-active" : ""}`.trim()}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="mt-4">
        <p className="phx-body-md">{active} content placeholder connected to live dashboard data.</p>
      </div>
    </section>
  );
}
