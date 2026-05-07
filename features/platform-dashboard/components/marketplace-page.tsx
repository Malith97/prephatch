"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SectionHeading } from "../../../components/section-heading";
import { MarketplaceExamCard } from "./marketplace-exam-card";
import type { MarketplaceExamCardData } from "../platform-dashboard-data";

type CatalogPackage = {
  slug: string;
  provider: string;
  certificationCode: string;
  title: string;
  description: string;
  priceLabel: string;
  ownershipTone: "owned" | "active" | "neutral" | "comingSoon";
  mockCountLabel: string;
  formatLabel: string;
};

type CatalogPackagesResponse = {
  data: CatalogPackage[];
};

function buildMarketplaceCards(
  catalogPackages: CatalogPackage[],
): MarketplaceExamCardData[] {
  return catalogPackages
    .filter((catalogPackage) => catalogPackage.ownershipTone !== "owned")
    .map((catalogPackage) => ({
      slug: catalogPackage.slug,
      provider: catalogPackage.provider,
      certificationCode: catalogPackage.certificationCode,
      title: catalogPackage.title,
      description: catalogPackage.description,
      priceLabel: catalogPackage.priceLabel,
      buyHref: `/dashboard/marketplace/${catalogPackage.slug}`,
      previewHref: `/dashboard/marketplace/${catalogPackage.slug}`,
      featureList: [
        {
          label: "Mock exams",
          value: catalogPackage.mockCountLabel,
        },
        {
          label: "Format",
          value: catalogPackage.formatLabel,
        },
        {
          label: "Explanations",
          value: "Detailed review",
        },
        {
          label: "Analytics",
          value: "Weak area tracking",
        },
      ],
    }));
}

function MarketplaceCardSkeleton() {
  return (
    <article
      aria-hidden
      className="rounded-[30px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
    >
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-16 rounded-full bg-surface-elevated/70" />
        <div className="h-7 w-2/3 rounded-full bg-surface-elevated/70" />
        <div className="h-5 w-full rounded-full bg-surface-elevated/70" />
        <div className="h-5 w-5/6 rounded-full bg-surface-elevated/70" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-16 rounded-[22px] bg-surface-elevated/70" />
          <div className="h-16 rounded-[22px] bg-surface-elevated/70" />
        </div>
      </div>
    </article>
  );
}

export function MarketplacePage() {
  const [marketplaceExams, setMarketplaceExams] = useState<
    MarketplaceExamCardData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadMarketplaceExams = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await fetch("/api/packages", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Unable to load packages (${response.status})`);
      }

      const payload = (await response.json()) as CatalogPackagesResponse;

      if (!Array.isArray(payload.data)) {
        throw new Error("Invalid package payload.");
      }

      setMarketplaceExams(buildMarketplaceCards(payload.data));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load certification packages.";
      setFetchError(errorMessage);
      setMarketplaceExams([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMarketplaceExams();
  }, [loadMarketplaceExams]);

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
              {isLoading
                ? "Loading packages..."
                : `${filteredExams.length} result${filteredExams.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <MarketplaceCardSkeleton />
              <MarketplaceCardSkeleton />
            </div>
          ) : fetchError ? (
            <div
              role="alert"
              className="rounded-[24px] border border-border/70 bg-bg/35 p-6 text-sm leading-7 text-text-secondary shadow-subtle"
            >
              <p>Could not load certification packages right now.</p>
              <p className="mt-1 text-xs text-text-secondary/80">{fetchError}</p>
              <button
                type="button"
                onClick={() => void loadMarketplaceExams()}
                className="ph-btn ph-btn-sm ph-button-secondary mt-4"
              >
                Retry
              </button>
            </div>
          ) : filteredExams.length ? (
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
