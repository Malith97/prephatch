"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PROMO_BANNER_DISMISSED_KEY = "prephatch_home_promo_hidden";
const COUNTDOWN_HOURS = 72;

function formatCountdown(msRemaining: number) {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEntered, setIsEntered] = useState(false);
  const [targetTs, setTargetTs] = useState<number | null>(null);
  const [nowTs, setNowTs] = useState<number>(() => Date.now());

  useEffect(() => {
    const isDismissed =
      typeof window !== "undefined" &&
      window.localStorage.getItem(PROMO_BANNER_DISMISSED_KEY) === "1";

    if (!isDismissed) {
      setTargetTs(Date.now() + COUNTDOWN_HOURS * 60 * 60 * 1000);
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsEntered(true));
      });
    }
  }, []);

  useEffect(() => {
    if (!isVisible || !targetTs) {
      return;
    }

    const timer = window.setInterval(() => {
      setNowTs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isVisible, targetTs]);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROMO_BANNER_DISMISSED_KEY, "1");
    }
    setIsEntered(false);
    window.setTimeout(() => setIsVisible(false), 260);
  };

  if (!isVisible) {
    return null;
  }

  const countdown = formatCountdown((targetTs ?? nowTs) - nowTs);

  return (
    <section className="sticky top-0 z-50 w-full px-0 pt-0">
      <div
        className={[
          "w-full transform transition-all duration-500 ease-out",
          isEntered ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        ].join(" ")}
      >
        <div className="group relative overflow-hidden border-y border-primary/30 bg-[linear-gradient(120deg,rgba(91,140,255,0.34),rgba(124,92,255,0.3),rgba(32,211,194,0.24))] p-[1px] shadow-[0_0_0_1px_rgba(91,140,255,0.1)] transition duration-300 hover:shadow-[0_0_0_1px_rgba(124,92,255,0.42),0_0_32px_rgba(91,140,255,0.3)]">
          <div className="relative overflow-hidden bg-bg/92 px-4 py-2">
            <div className="pointer-events-none absolute -inset-20 bg-[conic-gradient(from_140deg,rgba(91,140,255,0.16),rgba(124,92,255,0.08),rgba(32,211,194,0.14),rgba(91,140,255,0.16))] opacity-70 blur-2xl animate-[spin_14s_linear_infinite]" />
            <div className="pointer-events-none absolute inset-0 bg-[length:220%_220%] bg-[linear-gradient(100deg,rgba(91,140,255,0.14),rgba(124,92,255,0.08),rgba(32,211,194,0.14),rgba(91,140,255,0.14))] animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/28 to-transparent animate-[ph-shimmer_3.6s_ease-in-out_infinite]" />
            <span className="pointer-events-none absolute left-[16%] top-[32%] h-1.5 w-1.5 rounded-full bg-white/80 animate-[ph-sparkle_3.4s_ease-in-out_infinite]" />
            <span className="pointer-events-none absolute left-[43%] top-[20%] h-1 w-1 rounded-full bg-accent/90 animate-[ph-sparkle_4.1s_ease-in-out_infinite] [animation-delay:0.5s]" />
            <span className="pointer-events-none absolute right-[26%] bottom-[28%] h-1.5 w-1.5 rounded-full bg-primary/90 animate-[ph-sparkle_3.8s_ease-in-out_infinite] [animation-delay:0.9s]" />
            <span className="pointer-events-none absolute right-[10%] top-[38%] h-1 w-1 rounded-full bg-white/75 animate-[ph-sparkle_4.3s_ease-in-out_infinite] [animation-delay:1.3s]" />

            <div className="relative flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-base animate-[ph-gift-bounce_1.45s_ease-in-out_infinite]">
                  🎁
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                    Limited Offer
                  </p>
                  <p className="truncate text-xs font-medium text-text-primary sm:text-sm">
                    Launch discount is live. Claim early access and lock your prep package pricing.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-white/10 px-3 py-1 text-xl font-semibold tracking-wide text-text-primary animate-[pulse_2s_ease-in-out_infinite] sm:text-2xl">
                  <span>{countdown.days}d</span>
                  <span>{countdown.hours}h</span>
                  <span>{countdown.minutes}m</span>
                  <span>{countdown.seconds}s</span>
                </div>
                <Link
                  href="/register"
                  className="inline-flex h-8 items-center justify-center rounded-full border border-primary/40 bg-[linear-gradient(180deg,rgba(91,140,255,1),rgba(63,109,241,1))] px-3 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(91,140,255,0.38)] transition hover:brightness-110"
                >
                  Claim offer
                </Link>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Dismiss promo banner"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-bg/60 text-text-secondary hover:border-primary/30 hover:bg-surface-elevated/80 hover:text-text-primary"
                >
                  <span aria-hidden>×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
