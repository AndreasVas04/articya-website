"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ResponsiveImage } from "@/components/responsive-image";
import { cn, framingVars, type Framing } from "@/lib/utils";

// The photographic ground a zone stands on. Opaque, full-bleed, edge to edge:
// it is the substrate, not a texture over one, so it carries no opacity cap
// and no blur — only the same whisper grain every other photographic surface
// on the site carries.
//
// `position` is the whole art direction. These frames are portrait and the
// zones they fill are wider than they are tall on a desktop, so `object-cover`
// keeps the full width and chooses which band of the picture survives. That
// choice is not decorative: it decides what falls under the type, and the
// reading pool is capped at 0.55, so a block of body copy is legible only over
// the calm light band of a frame — sky, an overcast road, a valley at
// distance. Every value here was set by measuring the composite at the glyphs,
// not by eye.
//
// `rise` fades the ground in over its first 72/150px. Exactly one edge on the
// site needs it: the one under the frozen home hero, whose card dissolves its
// foot into gold.
export function PhotoGround({
  src,
  framing,
  rise = false,
  className,
  style,
  priority = false,
}: {
  src: string;
  framing?: Framing;
  rise?: boolean;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("photo-ground", rise && "photo-ground-rise", className)}
      style={style}
    >
      <ResponsiveImage
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="photo-frame object-cover"
        style={framingVars(framing)}
      />
      <div className="film-grain absolute inset-0 mix-blend-multiply" />
    </div>
  );
}

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
export function GroundParallax({
  src,
  framing,
}: {
  src: string;
  framing?: Framing;
}) {
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
          always the first rows of the section, where the hero's gold ends. */}
      <div className="ground-parallax absolute inset-0 overflow-hidden">
        {/* No blur box any more: with the blur gone there is nothing for a
            quarter-size raster to save, and magnifying one by four would only
            throw the resolution away. The plate is the picture at full size. */}
        <div ref={plateRef} className="ground-plate absolute">
          <ResponsiveImage
            src={src}
            alt=""
            fill
            sizes="100vw"
            className="photo-frame object-cover"
            style={framingVars(framing)}
          />
          <div className="film-grain absolute inset-0 mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
}
