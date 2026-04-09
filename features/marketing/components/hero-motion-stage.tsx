"use client";

import { useEffect, useRef } from "react";

export function HeroMotionStage() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const plane = planeRef.current;

    if (!stage || !plane) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      return;
    }

    let frameId: number | null = null;
    let targetRotateX = 0;
    let targetRotateY = 0;

    const applyTransform = () => {
      plane.style.transform = `rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
      frameId = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      targetRotateX = relativeY * -7;
      targetRotateY = relativeX * 10;

      if (frameId === null) {
        frameId = window.requestAnimationFrame(applyTransform);
      }
    };

    const handlePointerLeave = () => {
      targetRotateX = 0;
      targetRotateY = 0;
      if (frameId === null) {
        frameId = window.requestAnimationFrame(applyTransform);
      }
    };

    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative h-[340px] sm:h-[390px]"
      style={{ perspective: "1200px" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl animate-[ph-drift_12s_ease-in-out_infinite]" />
        <div className="absolute left-[58%] top-[56%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/18 blur-3xl animate-[ph-drift_16s_ease-in-out_infinite]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15" />

        <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 animate-[ph-orbit_14s_linear_infinite]">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full border border-border/75 bg-bg/70 px-3 py-1 text-xs font-semibold text-text-secondary">
            Mock Accuracy +11%
          </span>
        </div>

        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 animate-[ph-orbit-reverse_18s_linear_infinite]">
          <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full border border-border/75 bg-bg/70 px-3 py-1 text-xs font-semibold text-text-secondary">
            Readiness Trend Up
          </span>
        </div>
      </div>

      <div
        ref={planeRef}
        className="relative h-full rounded-[30px] border border-border/70 bg-[linear-gradient(165deg,rgba(21,34,64,0.96),rgba(11,22,44,0.94))] p-5 shadow-[0_34px_110px_rgba(2,6,23,0.42)] transition-transform duration-300 ease-out sm:p-6"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_22%_18%,rgba(91,140,255,0.18),transparent_44%),radial-gradient(circle_at_82%_78%,rgba(32,211,194,0.16),transparent_40%)]" />

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Live readiness cockpit
          </p>
          <h3 className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl">
            Structured exam prep with visible momentum
          </h3>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-[18px] border border-border/70 bg-bg/50 p-4 animate-[ph-float_10s_ease-in-out_infinite]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary/75">
              Next session
            </p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              Timed Mock B
            </p>
            <p className="mt-1 text-xs leading-6 text-text-secondary">
              58 questions • blueprint mapped
            </p>
          </article>
          <article className="rounded-[18px] border border-border/70 bg-bg/50 p-4 animate-[ph-float_12s_ease-in-out_infinite] [animation-delay:0.4s]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary/75">
              Weakest domain
            </p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              Security & IAM
            </p>
            <p className="mt-1 text-xs leading-6 text-text-secondary">
              Guided review queued
            </p>
          </article>
        </div>

        <div className="relative z-10 mt-4 rounded-[18px] border border-primary/20 bg-primary/10 p-4 animate-[ph-float_14s_ease-in-out_infinite] [animation-delay:0.8s]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Readiness confidence</span>
            <span className="font-semibold text-text-primary">82%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/70">
            <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,rgba(91,140,255,1),rgba(32,211,194,0.9))]" />
          </div>
        </div>
      </div>
    </div>
  );
}
