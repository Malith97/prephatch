"use client";

import { useMemo, useState } from "react";

import { SectionHeading } from "../../../components/section-heading";
import { getMarketplaceExamCards } from "../platform-dashboard-data";
import { MarketplaceExamCard } from "./marketplace-exam-card";

export function MarketplacePage() {
  const marketplaceExams = getMarketplaceExamCards();
  const [query, setQuery] = useState("");

  const filteredExams = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return marketplaceExams;
    }

    return marketplaceExams.filter((exam) =>
      [
        exam.title,
        exam.provider,
        exam.certificationCode,
        exam.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [marketplaceExams, query]);

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Marketplace"
          title="Available certification packages you do not own yet."
          description="Preview the package structure, compare scope, and choose which exam to add next."
        />

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xl">
              <label htmlFor="marketplace-search" className="sr-only">
                Search certifications
              </label>
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/75"
              >
                🔎
              </span>
              <input
                id="marketplace-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search certifications, provider, or exam code..."
                className="ph-input pl-11 pr-11"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear certification search"
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-bg/65 text-text-secondary hover:border-primary/35 hover:text-text-primary"
                >
                  ×
                </button>
              ) : null}
            </div>

            <p className="text-sm font-medium text-text-secondary">
              {filteredExams.length} result{filteredExams.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredExams.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredExams.map((exam) => (
                <MarketplaceExamCard key={exam.slug} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-border/70 bg-bg/35 p-6 text-sm leading-7 text-text-secondary shadow-subtle">
              No certifications match that search yet. Try a provider name, exam code,
              or broader keyword.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
