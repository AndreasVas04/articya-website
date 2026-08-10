"use client";

import { useEffect, useRef } from "react";
import { ResponsiveImage } from "@/components/responsive-image";
import { cn } from "@/lib/utils";

// The gold a block of type stands on once there is a photograph under it.
// Two nested boxes because the pool's falloff is the product of a fade across
// and a fade down — nesting multiplies them without relying on
// `mask-composite`. Both layers are static: the ground moves, the light the
// words read by does not.
export function GroundLift({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("ground-lift pointer-events-none", className)}
    >
      <div className="ground-lift-pool absolute inset-0" />
    </div>
  );
}

// How much slower than the page the ground travels. A phone shows a shorter
// block through a shorter window, so the same fraction there reads as the
// layer sliding rather than as depth.
const DEPTH_DESKTOP = 0.3;
const DEPTH_MOBILE = 0.18;

// The photographic ground under the "What we do" clearing: the page's own
// scroll moves this layer at a fraction of the content's rate, so the gold
// the section stands on reads as the hero's world continuing downward rather
// than as colour starting where the picture stopped.
//
// Nothing here captures, delays, pins or redirects the scroll. The layer is a
// pure function of `window.scrollY` — the listener is passive, it only ever
// coalesces into one rAF, and that frame writes a single transform. If the
// visitor never scrolls, nothing runs.
export function GroundParallax({ src }: { src: string }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const plate = plateRef.current;
    if (!scene || !plate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let top = 0;
    let height = 0;
    let depth = DEPTH_DESKTOP;

    const draw = () => {
      raf = 0;
      const span = height + window.innerHeight;
      if (span <= 0) return;
      // 0 as the block's top meets the viewport bottom, 1 as its bottom
      // leaves the top — the block's own traversal, not the document's.
      const progress = Math.min(
        Math.max((window.scrollY + window.innerHeight - top) / span, 0),
        1
      );
      // Centred on that traversal, so the plate's travel is symmetric about
      // the block and its over-size covers the same distance either way.
      const shift = (progress - 0.5) * height * depth;
      plate.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };

    // Layout is read here and on resize, never per frame: the panels below
    // this block are pinned, so nothing under it moves as the page scrolls,
    // and a rect read inside the scroll handler would force a layout on
    // every event.
    const measure = () => {
      const rect = scene.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height;
      depth = window.innerWidth < 768 ? DEPTH_MOBILE : DEPTH_DESKTOP;
      draw();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The scene reaches past the stage into the gap above the first offer
  // panel, so the ground has somewhere to fade out that carries no text and
  // meets the panel exactly where its own top edge dissolves in.
  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-10 top-0 z-0 md:-bottom-24"
    >
      {/* The mask is fixed to the block while the plate moves inside it, so
          the photograph's own edge can never travel into view — what fades is
          always the same two rows of the section. */}
      <div className="ground-parallax absolute inset-0 overflow-hidden">
        {/* The blur lives on the inner box, which is a quarter of the plate
            and scaled back up — see the class, it is what keeps this layer off
            the frame budget. Sizing stays in CSS so a utility and the rule can
            never disagree about it. */}
        <div ref={plateRef} className="ground-plate absolute">
          <div className="ground-plate-blur absolute">
            <ResponsiveImage src={src} alt="" fill sizes="100vw" />
          </div>
        </div>
      </div>
    </div>
  );
}
