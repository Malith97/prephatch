"use client";

import { useState } from "react";

type CheckoutButtonProps = {
  packageSlug: string;
};

type CheckoutResponse = {
  checkoutUrl: string;
  mode: "sandbox" | "live";
};

export function CheckoutButton({ packageSlug }: Readonly<CheckoutButtonProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ packageSlug }),
      });

      if (!response.ok) {
        throw new Error(`Checkout request failed (${response.status}).`);
      }

      const payload = (await response.json()) as CheckoutResponse;
      if (!payload.checkoutUrl) {
        throw new Error("Checkout session did not return a destination URL.");
      }

      window.location.assign(payload.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void handleCheckout()}
        disabled={isLoading}
        className="ph-btn ph-button-primary ph-hover-lift w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {isLoading ? "Starting checkout..." : "Buy access"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
