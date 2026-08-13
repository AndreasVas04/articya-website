"use client";

import { useEffect, useRef } from "react";
import { cubicBezier } from "framer-motion";
import { ResponsiveImage } from "@/components/responsive-image";

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

// How far a plate is over-scaled before it arrives. Small enough that the
// image never reads as moving on its own — it settles as it takes the stage.
const ARRIVE_SCALE = 0.07;

export interface StagePlate {
  /** Content image path, e.g. "/images/hero-2.jpg". */
  src: string;
  /** object-position for the cover crop. */
  position?: string;
  /** Held below 1 where a plate's own colour runs hotter than the ground. */
  saturation?: number;
  /** Held below 1 where a plate is brighter than the text on it can carry. */
  brightness?: number;
}

interface StageFrame {
  scroll: number;
  values: number[];
}

// A plate's own correction, applied to the picture rather than to the layer, so
// the shade and the arrival scale are untouched by it. Only a plate that needs
// one declares it: the road under flat overcast light is the brightest and the
// coolest picture on the page, and at full strength its white road carries no
// text at all.
function plateFilter(plate: StagePlate): string | undefined {
  const parts = [];
  if (plate.saturation !== undefined) parts.push(`saturate(${plate.saturation})`);
  if (plate.brightness !== undefined) parts.push(`brightness(${plate.brightness})`);
  return parts.length > 0 ? parts.join(" ") : undefined;
}

// The photographic ground the whole page below the hero stands on: one fixed
// full-viewport layer holding every plate, crossfading as the reader scrolls.
// Sections paint no ground of their own, so there is no edge anywhere for a
// seam to fall on — what changes is which photograph is showing, not what
// surface a band of the page is made of, and a crossfade has no boundary.
//
// Opacity is read off the scrollbar, which every text entrance on this page is
// forbidden to do. That rule is about text: an entrance scrubbed by scroll
// elapses inside a flick and reads as nothing. This is background — the reader
// is meant to feel the ground turning under them at exactly their own rate,
// and a clock here would put the wrong photograph behind the words whenever
// the scroll speed and the clock disagreed.
//
// The zones are marked in the markup with `data-stage-plate` and
// `data-stage-strength`, so the page decides what stands on what and this
// component only measures and blends.
export function PhotoStage({ plates }: { plates: StagePlate[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-plate-layer]")
    );
    const images = Array.from(
      root.querySelectorAll<HTMLElement>("[data-plate-image]")
    );
    if (layers.length !== plates.length) return;

    // Under reduced motion the crossfade stays — it is the ground telling the
    // reader where they are, and a fade carries no travel to be sensitive to.
    // The arrival scale is motion and does not.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let frames: StageFrame[] = [];
    // Where each plate ramps up for the first time, so the settle plays on
    // arrival only and holds at rest afterwards rather than swelling again
    // every time the plate fades back out.
    let arrivals: ({ from: number; to: number } | null)[] = [];

    const draw = () => {
      raf = 0;
      if (frames.length === 0) return;
      const scroll = window.scrollY;

      let index = 0;
      while (index < frames.length - 2 && frames[index + 1].scroll <= scroll) {
        index += 1;
      }
      const a = frames[index];
      const b = frames[index + 1] ?? a;
      const span = b.scroll - a.scroll;
      const t =
        span > 0
          ? easeInOutCubic(Math.min(Math.max((scroll - a.scroll) / span, 0), 1))
          : 1;

      for (let i = 0; i < layers.length; i += 1) {
        const value = a.values[i] + (b.values[i] - a.values[i]) * t;
        layers[i].style.opacity = value.toFixed(4);

        if (still) continue;
        const arrival = arrivals[i];
        if (!arrival) continue;
        const reach = arrival.to - arrival.from;
        const settled =
          reach > 0
            ? easeInOutCubic(
                Math.min(Math.max((scroll - arrival.from) / reach, 0), 1)
              )
            : 1;
        images[i].style.transform = `scale(${(
          1 + ARRIVE_SCALE * (1 - settled)
        ).toFixed(4)})`;
      }
    };

    // Layout is read here and on resize, never per frame: a rect inside the
    // scroll handler forces a layout on every event, and nothing under this
    // layer moves as the page scrolls.
    const measure = () => {
      const zones = Array.from(
        document.querySelectorAll<HTMLElement>("[data-stage-plate]")
      )
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top + window.scrollY,
            height: rect.height,
            plate: Number(el.dataset.stagePlate),
            strength: Number(el.dataset.stageStrength),
          };
        })
        .filter((z) => Number.isFinite(z.plate) && z.plate < plates.length);

      if (zones.length === 0) {
        frames = [];
        return;
      }

      // A zone owns the stage when its own middle is at the middle of the
      // window — the one scroll position where the reader is unambiguously
      // inside it, whether it is a short band or a pinned panel.
      const keyed = zones
        .map((z) => ({
          scroll: z.top + z.height / 2 - window.innerHeight / 2,
          plate: z.plate,
          strength: z.strength,
        }))
        .sort((x, y) => x.scroll - y.scroll);

      const zero = plates.map(() => 0);
      frames = [
        // The stage is nothing until the first zone starts arriving, so the
        // hero hands over to the dark ground and the ground brings the first
        // photograph up under it.
        {
          scroll: Math.max(0, Math.min(...zones.map((z) => z.top)) - window.innerHeight),
          values: zero,
        },
        ...keyed.map((k) => ({
          scroll: k.scroll,
          values: plates.map((_, i) => (i === k.plate ? k.strength : 0)),
        })),
      ];
      // A lead-in that lands past its own first zone would invert the ramp.
      if (frames.length > 1 && frames[0].scroll >= frames[1].scroll) {
        frames[0].scroll = Math.max(0, frames[1].scroll - window.innerHeight);
      }

      arrivals = plates.map((_, i) => {
        const at = frames.findIndex((f) => f.values[i] > 0);
        if (at <= 0) return null;
        return { from: frames[at - 1].scroll, to: frames[at].scroll };
      });

      draw();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // The pinned offer panels take their full height only once they mount, so
    // the zone geometry moves under this layer after its first read. Watching
    // the document rather than guessing a delay also covers a font swap or a
    // late image reflowing anything above a zone.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [plates]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="photo-stage pointer-events-none fixed inset-0"
    >
      {plates.map((plate) => (
        <div
          key={plate.src}
          data-plate-layer=""
          className="stage-plate absolute inset-0"
          style={{ opacity: 0 }}
        >
          <div
            data-plate-image=""
            className="stage-plate-frame absolute inset-0"
          >
            <ResponsiveImage
              src={plate.src}
              alt=""
              fill
              sizes="100vw"
              style={{
                objectPosition: plate.position,
                filter: plateFilter(plate),
              }}
            />
          </div>
          {/* The plate's own darkening, and the whole of it: one shape on
              every plate, carrying the picture where the chrome crosses it and
              releasing it through the whole middle. Because it rides inside
              the plate it fades with it — there is no scrim, veil or wash
              anywhere else on the page. */}
          <div className="stage-plate-shade absolute inset-0" />
        </div>
      ))}
    </div>
  );
}
