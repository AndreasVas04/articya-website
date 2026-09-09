"use client";

import { useEffect, useRef } from "react";
import type { EarthHandle } from "@/components/earth-scene";
import { onLayoutResize } from "@/lib/viewport";
import { cn, withBasePath } from "@/lib/utils";

// The skins (scripts/globe-texture.mjs): the day map at two rungs, and the
// packed lights / clouds / water map.
const DAY: [string, string] = ["/globe/earth-day-2k.webp", "/globe/earth-day-4k.webp"];
const PACK = "/globe/earth-pack.webp";
// The globe's vertical drift against the page: background may be
// scroll-linked, and this is the ground's side of the section. The drift is
// bound to 0.06 of the shortest window the device gives (553), so the box
// never travels further toward the ledger than the gaps around it allow.
const PARALLAX = 0.06;
const PARALLAX_BOUND = 33;

// The spinning Earth beside "What we do". Decorative (aria-hidden): the
// marks carry no words, and the countries stat beside them carries the
// meaning. Nothing of the renderer is on the page until the section is
// within a viewport, and a browser without WebGL never shows the box at all.
export function EarthGlobe({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl");
    if (!gl) {
      host.dataset.earth = "off";
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let handle: EarthHandle | null = null;
    let disposed = false;

    // The section's own entrance is the cue for the routes: the scene that
    // wraps this section flips `data-on` once, on the clock. Where there is
    // no armed scene (reduced motion, or no scene at all) the cue is now.
    const entered = new Promise<void>((resolve) => {
      const stage = host.closest<HTMLElement>(".stage");
      if (!stage || !stage.hasAttribute("data-armed") || stage.hasAttribute("data-on")) {
        resolve();
        return;
      }
      const watch = new MutationObserver(() => {
        if (stage.hasAttribute("data-on")) {
          watch.disconnect();
          resolve();
        }
      });
      watch.observe(stage, { attributes: true, attributeFilter: ["data-on"] });
    });

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loader.disconnect();
        import("@/components/earth-scene").then((m) => {
          if (disposed) return;
          const resin =
            getComputedStyle(document.documentElement).getPropertyValue("--color-resin").trim() ||
            "#e19a3c";
          handle = m.mountEarth(host, canvas, {
            day: [withBasePath(DAY[0]), withBasePath(DAY[1])],
            pack: withBasePath(PACK),
            resin,
            reducedMotion,
            entered,
          });
        });
      },
      { rootMargin: "100% 0px 100% 0px" }
    );
    loader.observe(host);

    // Parallax: the box drifts at 0.06 of the scroll, from the position where
    // it sits in the middle of the window. `transform` rather than
    // `translate`, so the entrance's own rise on the latter composes with it
    // instead of being overwritten. The anchor is the box's laid-out row,
    // read off the offset chain so neither the rise nor the drift is in it.
    let anchor = 0;
    let raf = 0;
    const measure = () => {
      let top = 0;
      for (let el: HTMLElement | null = host; el; el = el.offsetParent as HTMLElement | null) {
        top += el.offsetTop;
      }
      anchor = top + host.offsetHeight / 2 - window.innerHeight / 2;
      draw();
    };
    const draw = () => {
      raf = 0;
      const y = Math.min(PARALLAX_BOUND, Math.max(-PARALLAX_BOUND, PARALLAX * (window.scrollY - anchor)));
      host.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    let resizeObserver: ResizeObserver | null = null;
    let offResize: (() => void) | null = null;
    if (!reducedMotion) {
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      offResize = onLayoutResize(measure);
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(document.documentElement);
    }

    return () => {
      disposed = true;
      loader.disconnect();
      handle?.dispose();
      window.removeEventListener("scroll", onScroll);
      offResize?.();
      resizeObserver?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className={cn("earth aspect-square", className)}>
      <canvas ref={canvasRef} className="earth-canvas block h-full w-full" />
      {/* The grab, and it is the disc rather than the box: the circle is
          clipped, and a clip is what hit-tests, so the corners are never this
          element and the page scrolls through them. The engine reads
          `touch-action` off whatever the finger landed on, which is why the
          division is a second element and not a value this component
          rewrites once a gesture has already begun. */}
      <div className="earth-grab" />
    </div>
  );
}
