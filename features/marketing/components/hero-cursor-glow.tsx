"use client";

import { useEffect, useRef } from "react";

type HeroCursorGlowProps = {
  targetId: string;
};

export function HeroCursorGlow({ targetId }: Readonly<HeroCursorGlowProps>) {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const target = document.getElementById(targetId);

    if (!glow || !target) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotionQuery.matches) {
      return;
    }

    let frameId: number | null = null;
    let offsetX = 0;
    let offsetY = 0;

    const applyTransform = () => {
      glow.style.transform = `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), 0)`;
      frameId = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      const pointerY = (event.clientY - rect.top) / rect.height - 0.5;

      offsetX = pointerX * 26;
      offsetY = pointerY * 18;

      if (frameId === null) {
        frameId = window.requestAnimationFrame(applyTransform);
      }
    };

    const handlePointerLeave = () => {
      offsetX = 0;
      offsetY = 0;
      if (frameId === null) {
        frameId = window.requestAnimationFrame(applyTransform);
      }
    };

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [targetId]);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/24 blur-[84px] transition-transform duration-300 ease-out"
    />
  );
}
