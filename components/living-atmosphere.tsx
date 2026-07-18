"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// How far the whole atmosphere leans toward the pointer, at the edges of
// the viewport.
const PARALLAX_PX = 20;

// The warm ground the home page's light lives in: two tiled radial layers
// drifting against each other under a fine grain, leaning gently toward the
// pointer. Absolute, never fixed — a fixed layer is out of flow, so the page
// can no longer measure its own height around it.
export function LivingAtmosphere({ className }: { className?: string }) {
  const driftRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = driftRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handlePointerMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth - 0.5) * 2 * PARALLAX_PX;
      y = (event.clientY / window.innerHeight - 0.5) * 2 * PARALLAX_PX;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-base",
        className
      )}
    >
      {/* Overhangs the frame so the parallax lean never drags an empty edge
          into view. The two light layers drift inside it. */}
      <div ref={driftRef} className="absolute -inset-8 will-change-transform">
        <div className="atmosphere-glow-a absolute inset-0" />
        <div className="atmosphere-glow-b absolute inset-0" />
      </div>
      <div className="film-grain absolute inset-0 mix-blend-multiply" />
    </div>
  );
}
