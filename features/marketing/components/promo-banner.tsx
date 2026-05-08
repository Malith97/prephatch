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
    window.setTimeout(() => setIsVisible(false), 240);
  };

  if (!isVisible) {
    return null;
  }

  const countdown = formatCountdown((targetTs ?? nowTs) - nowTs);

  return (
    <section className="sticky top-0 z-50 w-full">
      <div
        className={[
          "w-full transform transition-all duration-500 ease-out",
          isEntered ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        ].join(" ")}
      >
        <div className="relative overflow-hidden border-b border-primary/30 bg-[linear-gradient(90deg,rgba(42,124,255,0.26),rgba(20,184,166,0.2),rgba(248,113,113,0.16))] px-4 py-2 sm:px-6">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-secondary/35 bg-secondary/12 text-base animate-[ph-gift-bounce_1.45s_ease-in-out_infinite]">
                🎁
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary">Launch offer</p>
                <p className="truncate text-xs font-medium text-text-primary sm:text-sm">
                  Lock early access pricing and open the full exam workspace toolkit.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-lg border border-border/75 bg-bg/55 px-3 py-1 text-sm font-semibold text-text-primary sm:text-base">
                <span>{countdown.days}d</span>
                <span>{countdown.hours}h</span>
                <span>{countdown.minutes}m</span>
                <span>{countdown.seconds}s</span>
              </div>
              <Link href="/register" className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift">
                Claim offer
              </Link>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Dismiss promo banner"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-bg/65 text-text-secondary hover:border-primary/35 hover:text-text-primary"
              >
                <span aria-hidden>×</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
