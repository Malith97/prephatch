"use client";

import { useState } from "react";

type AiExplanationPanelProps = {
  examSlug: string;
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
};

type ExplanationResponse = {
  explanation: string;
  cached: boolean;
};

export function AiExplanationPanel({
  examSlug,
  questionId,
  selectedOptionId,
  correctOptionId,
}: Readonly<AiExplanationPanelProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<ExplanationResponse | null>(null);

  async function handleOpen() {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (!nextOpen || payload || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/explanations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          examSlug,
          questionId,
          selectedOptionId,
          correctOptionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Explanation request failed (${response.status}).`);
      }

      const nextPayload = (await response.json()) as ExplanationResponse;
      setPayload(nextPayload);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load AI explanation right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-4 rounded-[20px] border border-border/70 bg-bg/35 p-4">
      <button
        type="button"
        onClick={() => void handleOpen()}
        className="ph-btn ph-btn-sm ph-button-secondary"
        aria-expanded={isOpen}
      >
        {isOpen ? "Hide AI explanation" : "Show AI explanation"}
      </button>

      {isOpen ? (
        <div className="mt-3 space-y-2">
          {isLoading ? (
            <p role="status" className="text-sm text-text-secondary">
              Generating explanation...
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          ) : null}
          {payload ? (
            <div className="space-y-2">
              <p className="text-sm leading-7 text-text-secondary">{payload.explanation}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                {payload.cached ? "Cached" : "Generated"}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
