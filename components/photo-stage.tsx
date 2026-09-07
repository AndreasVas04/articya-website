"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cubicBezier } from "framer-motion";
import { ResponsiveImage } from "@/components/responsive-image";
import { coverSizes, FULL_VIEWPORT, imagePreload } from "@/lib/images";
import { cn } from "@/lib/utils";

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

// How far a plate is over-scaled before it arrives. Small enough that the
// image never reads as moving on its own — it settles as it takes the stage.
const ARRIVE_SCALE = 0.07;

// The other half of that arrival, and it is free. At 1.07 the frame overhangs
// the window by half the over-scale on each side, so the picture can rise by
// exactly that much on its way in without uncovering an edge, and it returns
// to nothing as the scale returns to 1.000 — the placement ladder reads what
// it read before. It is 19-26 CSS px of ground over 334-433px of scroll:
// 0.056 px of picture per px of finger, which is the arrival settling rather
// than a second plane, and it is the only travel this page has room for.
const ARRIVE_RISE = ARRIVE_SCALE / 2;

// How deep the wipe's ramp is, as a fraction of the window. A photograph that
// has to get from being the whole ground to being no ground at all cannot do
// it by fading: at 0.5 the frame is a picture at half strength over the floor,
// which is the grey-green haze with shapes in it that the polarised ledger
// exists to forbid, and it is forbidden at every intermediate frame of a
// transition and not only at the ends.
//
// A full-bleed luminance wipe is the one move that gets between the two
// without ever painting it. Every row of the window is either the photograph
// or the floor; what travels is the boundary, and at 40% of the window the
// boundary is a gradient deep enough that there is no line anywhere in it to
// trace. At the midpoint the frame reads 30% picture, 40% ramp, 30% floor.
const WIPE_FEATHER = 0.4;

// The incoming state always enters from the foot of the window, because that
// is the edge the reader is scrolling new page in from. For a plate on its way
// up the incoming state is the photograph, so the picture wells up from the
// bottom; for one on its way out the incoming state is what stands behind it,
// so the picture withdraws upward and leaves through the top. Same ramp, same
// direction of travel, opposite gradients.
const wipeMask = (strength: number, rising: boolean) => {
  const front = strength * (1 + WIPE_FEATHER);
  const solid = ((front - WIPE_FEATHER) * 100).toFixed(2);
  const clear = (front * 100).toFixed(2);
  return `linear-gradient(to ${rising ? "top" : "bottom"}, #000 ${solid}%, transparent ${clear}%)`;
};

// A plate carries no per-image correction. The saturation and brightness
// hooks that used to sit here were a second grade running on every paint, and
// a filter chain has only saturation, hue and level to give — it cannot reach
// what a tone error actually is. Tone is decided once, in the pixels, by the
// grade.
export interface StagePlate {
  /** Content image path, e.g. "/images/hero-2.jpg". */
  src: string;
  /** object-position for the cover crop. */
  position?: string;
  /** The same frame again, out of focus — the ground a reading page stands on. */
  soft?: boolean;
  /** The split: one photograph, two treatments, a hard vertical seam at this
   *  percent of the width. Defocused to the left of it, sharp to the right,
   *  and the picture runs straight through — the clip is on a full-size copy,
   *  so the two sides cannot fall out of register. */
  split?: number;
  /** Where the seam stands below `md`, if not at `split`. A phone has no
   *  column beside the picture: the text runs the full width, so the seam has
   *  to stand to the right of every row or the rows cross it. */
  splitCompact?: number;
  /** This plate is the page's LCP: preloaded, eager, never lazy. */
  priority?: boolean;
  /** Arrive and leave as a full-bleed luminance wipe rather than as a fade,
   *  so no frame of the transition holds the picture at a strength between
   *  0.05 and 0.74. A plate wants this wherever its own ramp is the thing the
   *  reader is looking at. `"in"` wipes the arrival and fades the departure:
   *  the gains plate arrives under the second panel's tail, where a fade is
   *  a haze behind the panel's floor, and leaves under the closing, whose
   *  words were measured on the fade. Assumes one rise and one fall, which is
   *  what every plate on this page has. */
  wipe?: boolean | "in";
  /** Overrides the shared stage darkening, in percent, and the dark it is
   *  made of. One number cannot serve three photographs, and one *colour*
   *  cannot either: a darkening only darkens what shares its hue, so a
   *  yellow-green frame takes `land-anchor` where a sky takes `sky-anchor`. */
  shade?: {
    top: number;
    mid: number;
    base: number;
    from?: string;
    to?: string;
    color?: string;
  };
}

interface StageFrame {
  scroll: number;
  values: number[];
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

    // The key basis, and it is deliberately not `innerHeight`. A zone is keyed
    // at `zoneTop + zoneHeight/2 - basis/2`; everything else in that expression
    // is now `svh` and therefore the same at both of a phone's chrome states,
    // so a basis that tracked the visible viewport would put the toolbar back
    // into every key on its own — the whole document would hold still and the
    // twelve keys would still slide 43px as the bar animated under the
    // reader's finger. The small viewport is the one height the device
    // guarantees at every moment, so it is what the page is keyed by. The cost
    // is that with the bar collapsed a zone's middle sits half the toolbar
    // above the window's middle at its own key: 43px out of a 500px ramp,
    // constant, and unnoticeable beside a key that moves.
    const basisProbe = document.createElement("div");
    basisProbe.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    root.appendChild(basisProbe);
    // `svh` on a browser that does not know it leaves the declaration dropped
    // and the box at nothing, so the old basis is the fallback.
    const keyBasis = () =>
      basisProbe.getBoundingClientRect().height || window.innerHeight;

    let raf = 0;
    let frames: StageFrame[] = [];
    // The layer's own height, read with the rest of the layout: the rise is a
    // share of the window and a rect inside the scroll handler is a layout on
    // every frame.
    let stageHeight = 0;
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
        const arrival = arrivals[i];

        // Under reduced motion the wipe gives way to the fade it replaced. The
        // crossfade stays because it carries no travel to be sensitive to; a
        // moving boundary is travel, and this is the one place on the page
        // where the haze is the cheaper of the two costs.
        const rising = !arrival || scroll <= arrival.to;
        const wipe = plates[i].wipe === "in" ? rising : Boolean(plates[i].wipe);
        if (wipe && !still) {
          layers[i].style.opacity = value > 0.0001 ? "1" : "0";
          const mask = wipeMask(value, rising);
          layers[i].style.maskImage = mask;
          layers[i].style.setProperty("-webkit-mask-image", mask);
        } else {
          layers[i].style.opacity = value.toFixed(4);
          layers[i].style.maskImage = "";
          layers[i].style.removeProperty("-webkit-mask-image");
        }

        if (still) continue;
        if (!arrival) continue;
        const reach = arrival.to - arrival.from;
        const settled =
          reach > 0
            ? easeInOutCubic(
                Math.min(Math.max((scroll - arrival.from) / reach, 0), 1)
              )
            : 1;
        const rise = stageHeight * ARRIVE_RISE * (1 - settled);
        images[i].style.transform = `translate3d(0, ${rise.toFixed(2)}px, 0) scale(${(
          1 + ARRIVE_SCALE * (1 - settled)
        ).toFixed(4)})`;
      }
    };

    // Layout is read here and on resize, never per frame: a rect inside the
    // scroll handler forces a layout on every event, and nothing under this
    // layer moves as the page scrolls.
    const measure = () => {
      stageHeight = root.getBoundingClientRect().height || window.innerHeight;
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
      const basis = keyBasis();
      const keyed = zones
        .map((z) => ({
          scroll: z.top + z.height / 2 - basis / 2,
          plate: z.plate,
          strength: z.strength,
        }))
        .sort((x, y) => x.scroll - y.scroll);

      frames = keyed.map((k) => ({
        scroll: k.scroll,
        values: plates.map((_, i) => (i === k.plate ? k.strength : 0)),
      }));

      // The run-up: the stage is nothing until the first zone starts arriving,
      // so the hero hands over to the dark ground and the ground brings the
      // first photograph up under it. It only exists where there is room for
      // it. A page whose first zone is its own first screen — every inner
      // page, where the zone is the hero — has nothing above it to run up
      // from, and its photograph is the first thing the page paints rather
      // than something that arrives.
      //
      // Clamping the run-up to 0 instead is what kept the FAQ hero blank until
      // the reader scrolled. A zone is keyed at its own middle, so a first zone
      // one pixel taller than the window keys *below* 0; the run-up clamped to
      // 0 then sat above that key with the plate at nothing, and scroll 0
      // landed on the bottom of the ramp. FAQ's heading wrapped to a third line
      // and pushed its hero to 911px in a 900px window, which was the whole of
      // it — 11px of overflow, and the page opened on bare floor.
      const runUp = Math.min(...zones.map((z) => z.top)) - basis;
      if (runUp > 0 && runUp < frames[0].scroll) {
        frames.unshift({ scroll: runUp, values: plates.map(() => 0) });
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
      basisProbe.remove();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [plates]);

  // The LCP plate is preloaded: the scanner cannot see an image inside a
  // component, and this layer is the first photograph the page paints. The
  // preload has to carry the same `sizes` the layer declares, or the two
  // resolve to different rungs of the ladder and the page downloads the
  // photograph twice.
  const lcp = plates.find((p) => p.priority);
  const preload = lcp
    ? imagePreload(lcp.src, coverSizes(lcp.src, FULL_VIEWPORT))
    : null;

  // `h-[100dvh]` rather than `inset-0`, and the unit is the whole of it. A
  // fixed box with no height of its own resolves against the initial
  // containing block, and a phone browser holds that at the *large* viewport
  // while the visible one shrinks under the URL bar — so this layer, which is
  // every photograph below the hero, was painted 86px taller than the screen
  // at 390 wide whenever the bar was showing, 13% of its height below the fold,
  // and the shade's bottom hold went off the bottom with it. `svh` would fix
  // that and break the other state, leaving a band of floor under the picture
  // once the bar collapsed. `dvh` is the viewport as it currently is, which is
  // what a ground has to be; it is also what the hero already uses, so the two
  // layers that have to cover the window now name the same thing while the
  // content sections keep `svh` and go on fitting inside the smallest of them.
  //
  // No emulator can show the difference — headless has no browser chrome, so
  // `svh`, `lvh`, `dvh` and the fixed box all resolve to `innerHeight` — which
  // is why this is a change no measurement moves.
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="photo-stage pointer-events-none fixed inset-x-0 top-0 h-[100dvh]"
    >
      {preload && (
        <link
          rel="preload"
          as="image"
          href={preload.href}
          imageSrcSet={preload.imageSrcSet}
          imageSizes={preload.imageSizes}
          type={preload.type}
          fetchPriority="high"
        />
      )}
      {plates.map((plate, i) => {
        // One declaration per plate, shared by every copy of it. A soft copy
        // is rasterized at a quarter of the frame and would fetch a quarter
        // rung on its own — but it is the same photograph at the same crop, so
        // asking for the sharp one's width costs nothing (one URL, one
        // download) where asking for its own costs a second request.
        const sizes = coverSizes(plate.src, FULL_VIEWPORT);
        return (
        <div
          key={`${plate.src}-${i}`}
          data-plate-layer=""
          className="stage-plate absolute inset-0"
          style={
            {
              opacity: 0,
              ...(plate.split !== undefined
                ? {
                    "--split-wide": `${plate.split}%`,
                    "--split-compact": `${plate.splitCompact ?? plate.split}%`,
                  }
                : null),
            } as CSSProperties
          }
        >
          <div
            data-plate-image=""
            className="stage-plate-frame absolute inset-0"
          >
            {/* A soft plate is rasterized at a quarter of the frame and
                magnified back: a blur is priced by the area it rasterizes and
                not by its radius, so the radius is quartered with it. */}
            <div className={cn(plate.soft && "stage-plate-soft")}>
              <ResponsiveImage
                src={plate.src}
                alt=""
                fill
                priority={plate.priority}
                sizes={sizes}
                style={{ objectPosition: plate.position }}
              />
            </div>
            {plate.split !== undefined && (
              <>
                <div className="stage-plate-split absolute inset-0">
                  <div className="stage-plate-soft">
                    <ResponsiveImage
                      src={plate.src}
                      alt=""
                      fill
                      sizes={sizes}
                      style={{ objectPosition: plate.position }}
                    />
                  </div>
                </div>
                {/* A visible line, deliberately: the reference's seam is a
                    mark, not a feather. */}
                <div className="stage-plate-seam" />
              </>
            )}
          </div>
          {/* The plate's own darkening, and the whole of it: one shape on
              every plate, carrying the picture where the chrome crosses it and
              releasing it through the whole middle. Because it rides inside
              the plate it fades with it — there is no scrim, veil or wash
              anywhere else on the page. */}
          <div
            className="plate-shade stage-plate-shade absolute inset-0"
            style={
              plate.shade
                ? ({
                    ...(plate.shade.color
                      ? { "--shade-color": plate.shade.color }
                      : null),
                    "--shade-top": `${plate.shade.top}%`,
                    "--shade-mid": `${plate.shade.mid}%`,
                    "--shade-bottom": `${plate.shade.base}%`,
                    "--shade-mid-from": plate.shade.from ?? "30%",
                    "--shade-mid-to": plate.shade.to ?? "78%",
                  } as CSSProperties)
                : undefined
            }
          />
        </div>
        );
      })}
    </div>
  );
}
