"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ResponsiveImage } from "@/components/responsive-image";
import { coverSizes, type SizeBox } from "@/lib/images";
import { cn } from "@/lib/utils";

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

const stageWindow = (value: number, from: number, to: number) =>
  easeInOutCubic(Math.min(Math.max((value - from) / (to - from), 0), 1));

// The words play on the clock, never on the scrollbar. Scrubbed by scroll a
// real flick collapses the whole entrance into a couple of frames and the
// closing line is gone before it can be read; on a fixed duration a visitor
// who blasts past still finds it settled. The wall stays scroll-linked — the
// frames are the composition itself, not text — and so does the handoff that
// takes the words back out as the wall closes over them.
const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const RISE: CSSProperties = { translate: "0 40px" };
const FADE: CSSProperties = { opacity: 0 };
const DRAW: CSSProperties = { scale: "0 1" };

interface GalleryImage {
  src: string;
  alt: string;
  /** Where the tile's window sits on the frame at 768 and up. A slot's aspect
   *  is fixed by the wall, so this is the only thing that decides whether the
   *  tile holds a whole subject or a slice of one. Defaults to centred. */
  position?: string;
  /** The same, below 768. The wall is a different arrangement there — four
   *  bands instead of four quadrants — so a frame that is fitted by its width
   *  in one is fitted by its height in the other, and the axis the position
   *  actually bites on swaps with it. */
  positionCompact?: string;
}

interface GalleryFinaleProps {
  /** The closing paragraph in staged groups; joined with spaces it is the original text. */
  groups: string[];
  /** Five frames; the first is the keystone and carries the closing zoom. */
  images: GalleryImage[];
}

/** A slot rectangle, in percent of the pinned frame. */
interface Rect {
  l: number;
  t: number;
  w: number;
  h: number;
}

interface Slot {
  wide: Rect;
  compact: Rect;
  /** Where the frame holds while the words are up, as an offset from its own
   *  slot in percent of the pinned frame. */
  gatherWide: [number, number];
  gatherCompact: [number, number];
}

// The wall — A1 Keystone, from design/refs/wall/A1-keystone.html.
//
// Four frames divide the window between them and the fifth is set into the
// junction where all four meet. On a desktop the four are quadrants split at
// x=44 and at two different heights — y=46 on the left, y=56 on the right — so
// the two horizontal joins are offset from one another and neither runs across
// the frame; the keystone then covers the middle 48% of both. The longest
// horizontal edge *between two outer frames* is 26.0% of the window, which is
// what the arrangement buys and what the old three-band wall could not: that
// wall's bands ran the full width, and every one of them was a line.
//
// On a phone the same idea lies down: two frames across the top, two across the
// foot, the keystone full width between them. No horizontal edge between two
// outer frames exists there at all.
//
// Five, not seven. The seven-tile wall needed eleven distinct photographs on
// this page and the set holds ten, which is what put `hero-2` at a third
// placement and kept `IMG_4599` on the wall re-cut rather than replaced. At
// five both debts close: `hero-2` drops to two placements and `IMG_4599`
// leaves the site.
//
// Reading order below is the keystone, then the four outer frames as they read
// on a desktop — top left, bottom left, top right, bottom right.
const SLOTS: Slot[] = [
  {
    wide: { l: 26, t: 8, w: 48, h: 64 },
    compact: { l: 0, t: 13, w: 100, h: 72 },
    gatherWide: [0, 0],
    gatherCompact: [0, 0],
  },
  {
    wide: { l: 0, t: 0, w: 44, h: 46 },
    compact: { l: 0, t: 85, w: 52, h: 15 },
    gatherWide: [-7.198, -4.859],
    gatherCompact: [0, 5.225],
  },
  {
    wide: { l: 0, t: 46, w: 44, h: 54 },
    compact: { l: 52, t: 85, w: 48, h: 15 },
    gatherWide: [-7.727, 4.443],
    gatherCompact: [0, 5.118],
  },
  {
    wide: { l: 44, t: 0, w: 56, h: 56 },
    compact: { l: 58, t: 0, w: 42, h: 13 },
    gatherWide: [7.071, -4.95],
    gatherCompact: [0, -4.992],
  },
  {
    wide: { l: 44, t: 56, w: 56, h: 44 },
    compact: { l: 0, t: 0, w: 58, h: 13 },
    gatherWide: [6.178, 5.504],
    gatherCompact: [0, -5.403],
  },
];

const CENTER = 0;

// The keystone is the only frame that scales, and the only question its
// amplitude answers is whether the window ends up covered. **A scaling frame
// either reaches full window coverage or does not scale at all** — see
// DESIGN-SYSTEM.md. The slot decides the number and the tighter axis sets it:
// 48 × 2.0834 = 100 on a desktop, 72 × 1.3889 = 100 on a phone. 2.60 clears
// both and clears them early — coverage is crossed at stage 0.900 and 0.843
// and then *held* for the last 197px and 265px of the pin, where a factor at
// the threshold itself would touch coverage on one frame and lose it on the
// next.
//
// What it costs is one rung, and the rung already exists: at 2.60 the frame is
// painted 1797 CSS px wide at 1440×900 — 3594 device px at DPR 2 — against the
// 3840 `scripts/responsive-images.mjs` publishes for this one key. Measured at
// full coverage: 0.936 against the fetched variant and 0.594 against the
// source at 1440×900 DPR 2, 0.926 and 0.588 at 390×844 DPR 3.
const CENTER_PEAK = 2.6;

// A travel of 1.6 needs a rise to spend it on. This one runs **455px at
// 1440×900 and 439px at 390×844 — 0.506 and 0.520 of a viewport**, against the
// half a viewport an overlapping move has to have. None of it is new pin: the
// rise starts while the outer frames are still landing (the last settles at
// 0.92 / 0.94) and the growing keystone covers them as they arrive, which is
// the only place the travel could have come from. The stall inside the pin
// stays where §2.5 left it.
const zoomWindow = (compact: boolean): [number, number] =>
  compact ? [0.74, 1] : [0.77, 1];

// The words' handover, and with it the frame the keystone is allowed to start
// on. It arrives in the place the words stood, so its fade begins exactly
// where theirs ends: a photograph rising under live text would take the
// contrast with it.
const textWindow = (compact: boolean): [number, number] =>
  compact ? [0.6, 0.68] : [0.62, 0.7];

// Where the sticky frame stops travelling and starts holding the window: one
// viewport of the section's own 200svh / 220svh. Everything above the pin is
// the section arriving; everything below it is the assembly.
const pinAt = (compact: boolean) => (compact ? 1 / 2 : 1 / 2.2);

// How deep the ground's top ramp is at its deepest, as a fraction of the
// window — PhotoStage's own figure, and here for the same reason. The pinned
// frame's top edge travels the whole window before it pins, and an opaque
// ground inside it would draw a horizontal line between two backgrounds across
// the full width for a viewport of scroll. What travels instead is a boundary
// with no line in it to trace, and it closes to nothing exactly as the frame
// pins — so from the pin onward the ground is opaque edge to edge and there is
// no page ground anywhere behind the assembly.
const WIPE_FEATHER = 0.4;

// Each frame's box, in fractions of the viewport, derived from its own slot
// rather than restated beside it. It is what `coverSizes` measures the painted
// width against: the box scales with the window, and object-cover scales the
// picture again wherever the frame's aspect and the box's disagree, so the two
// together decide how many pixels the frame actually paints.
//
// The keystone's box is its *peak*, not its slot, because that is the widest
// it is ever painted. Scaling both axes by one factor leaves the box's aspect
// alone, so the frame's overscale is unchanged and only the declared width
// moves — 48vw → 124.8vw on a desktop, 100 → 260 on a phone.
const boxes = (index: number): [SizeBox, SizeBox] => {
  const slot = SLOTS[index];
  const k = index === CENTER ? CENTER_PEAK : 1;
  return [
    { vw: (slot.wide.w / 100) * k, vh: (slot.wide.h / 100) * k },
    { vw: (slot.compact.w / 100) * k, vh: (slot.compact.h / 100) * k },
  ];
};

const tileSizes = (src: string, index: number) =>
  coverSizes(src, ...boxes(index));

const rect = (slot: Slot, compact: boolean) => (compact ? slot.compact : slot.wide);

const rectStyle = (r: Rect): CSSProperties => ({
  left: `${r.l}%`,
  top: `${r.t}%`,
  width: `${r.w}%`,
  height: `${r.h}%`,
});

// The story's finale: the photographs from the scenes above gather around the
// closing paragraph while it completes — words and frames share every frame of
// it — then the words dissolve, the four outer frames settle into the window
// they divide, and the keystone comes forward out of the junction as the pin
// releases. Before mount and under reduced motion it renders unpinned — the
// full paragraph followed by the wall at rest — so the exported HTML is the
// resting state.
export function GalleryFinale({ groups, images }: GalleryFinaleProps) {
  const container = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [entered, setEntered] = useState(false);

  const wall = images.slice(0, SLOTS.length);

  // One travel-based timeline, ending where the held frame does. "end end" is
  // the section's bottom edge reaching the bottom of the window, which is the
  // exact frame the sticky child unpins on: every value from 0 to 1 is
  // reachable, 1 is the release, and the ~148px of footer under it is the exit.
  //
  // The section opens at the bottom of the window, so the words are already
  // arriving while the last scene releases and the frame is never empty. The
  // pin engages at 0.455 desktop / 0.500 mobile — one viewport of travel over
  // a 220svh / 200svh section — and releases at 1.0.
  const { scrollYProgress: stage } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  const [fadeFrom, fadeTo] = textWindow(compact);
  const textOut = useTransform(
    () => 1 - stageWindow(stage.get(), fadeFrom, fadeTo)
  );
  const textDrift = useTransform(
    () => -24 * stageWindow(stage.get(), fadeFrom, fadeTo)
  );

  // The ground's top ramp, closing as the frame pins. At the pin and below it
  // the stop pair collapses to `transparent 0%, #000 0%`, which is opaque
  // everywhere.
  const groundMask = useTransform(() => {
    const edge = 100 * (1 - Math.min(1, stage.get() / pinAt(compact)));
    const depth = Math.min(WIPE_FEATHER * 100, edge);
    return `linear-gradient(to bottom, transparent 0%, #000 ${depth.toFixed(2)}%)`;
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setCompact(!query.matches);
    update();
    setMounted(true);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Fires once, the first time a quarter of the text block has risen clear of
  // the bottom 15% of the viewport.
  useEffect(() => {
    if (entered) return;
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setEntered(true);
      },
      { threshold: 0.25, rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [entered, mounted, compact]);

  const enter = (slot: number, hidden: CSSProperties) => {
    if (!mounted) return undefined;
    if (entered)
      return {
        transitionProperty: reducedMotion ? "opacity" : "opacity, translate, scale",
        transitionDuration: reducedMotion ? "0.3s" : "1.4s",
        transitionTimingFunction: ENTER_EASE,
        transitionDelay: `${slot * 90}ms`,
      };
    if (reducedMotion) return "opacity" in hidden ? FADE : undefined;
    return hidden;
  };

  // Resting state: the paragraph in full, then the wall standing. No pinning,
  // no scroll-linked transforms — the same five rectangles the pinned frame
  // settles into, so what the export holds is the composition and not a
  // stand-in for it.
  if (!mounted || reducedMotion) {
    return (
      <section ref={container} className="pt-16 md:pt-24">
        <div ref={textRef} className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <span
            aria-hidden="true"
            className="block h-[1.25px] w-16 origin-left bg-amber"
            style={enter(0, DRAW)}
          />
          <p
            className="mt-6 max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink md:mt-8"
            style={enter(1, FADE)}
          >
            {groups.join(" ")}
          </p>
        </div>
        <div className="relative h-[100svh] overflow-hidden">
          <WallGround src={wall[CENTER].src} compact={compact} />
          {wall.map(({ src, alt, position, positionCompact }, index) => (
            <div
              key={src}
              className="absolute overflow-hidden"
              style={{
                ...rectStyle(rect(SLOTS[index], compact)),
                zIndex: index === CENTER ? 20 : 10,
              }}
            >
              <ResponsiveImage
                src={src}
                alt={alt}
                fill
                sizes={tileSizes(src, index)}
                style={{
                  objectPosition: compact ? positionCompact ?? position : position,
                }}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={container}
      // The sticky child pins for this height less one viewport: 1.2 viewports
      // of held frame on desktop, 1.0 on a phone, against §G's 1.2 ceiling.
      className="relative h-[200vh] md:h-[220vh]"
    >
      {/* The pinned frame's job is to cover the window, so it names `dvh`. At
          `svh` it was sized to the smallest viewport and left a band of floor
          under the wall as soon as the URL bar collapsed. It is sticky inside a
          fixed-height section, so it sets no document height and moves no key;
          only what it covers changes. */}
      <div
        key={compact ? "compact" : "wide"}
        className="sticky top-0 h-[100dvh] overflow-hidden"
      >
        <WallGround
          src={wall[CENTER].src}
          compact={compact}
          mask={groundMask}
        />

        {wall.map(({ src, alt, position, positionCompact }, index) => (
          <FinaleTile
            key={src}
            stage={stage}
            index={index}
            src={src}
            alt={alt}
            position={compact ? positionCompact ?? position : position}
            compact={compact}
          />
        ))}

        {/* The words' ground, and it leaves with them. A full-bleed top-to-
            bottom ramp over the defocused copy of the keystone's own frame —
            the one device §2 allows between a photograph and the words on it,
            with nothing local drawn behind the type and no mask boundary
            anywhere inside the layer the type is in. It rides above the four
            outer frames and below the keystone, so the frames gathering around
            the paragraph are carried by it while it is up and stand clear of it
            once the words are gone: by 0.70 desktop / 0.68 mobile it is at
            nothing, and the wall settles from 0.60 to 0.92 undarkened. */}
        <motion.div
          aria-hidden="true"
          className="plate-shade wall-shade absolute inset-0 z-[15]"
          style={{ opacity: textOut }}
        />

        <motion.div
          className="absolute inset-0 z-[16] flex items-center justify-center px-4"
          style={{ opacity: textOut, y: textDrift }}
        >
          <div ref={textRef} className="max-w-2xl text-center">
            <span
              aria-hidden="true"
              className="mx-auto block h-[1.25px] w-16 bg-amber"
              style={enter(0, DRAW)}
            />
            {/* The paragraph lifts as one block and its groups light up
                inside it: a transform on a non-replaced inline box does
                nothing, and making the spans inline-block to earn one would
                stop them wrapping across lines. */}
            <p
              className="mx-auto mt-8 max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink"
              style={enter(1, RISE)}
            >
              {groups.map((group, i) => (
                <span key={i} style={enter(1 + i, FADE)}>
                  {group}
                  {i < groups.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// The wall's own ground: the keystone's frame again, out of focus, edge to
// edge. It is what carries the words and what takes page ground to zero at
// every frame of the assembly — without it the gathered state shows 22.7% of
// the window on a desktop and 82.4% on a phone.
//
// It declares the keystone's `sizes` rather than its own. A full-bleed box
// would resolve to the 2880 rung and the keystone to 3840, and the page would
// download the same photograph twice; asking for the wider of the two costs
// one URL and one decode for both. It is the same reasoning `PhotoStage` uses
// for a soft plate standing beside its own sharp copy.
//
// Rasterized at a quarter of the frame and magnified back, like the gains ramp
// and the soft plates: a blur is priced by the area it rasterizes and not by
// its radius, so 7px here is 28px on the screen at a sixteenth of the cost. The
// overhang that hides the blur's own edge fade is a length and lives in
// `.wall-ground-soft`, not a scale on this image — see globals.css.
function WallGround({
  src,
  compact,
  mask,
}: {
  src: string;
  compact: boolean;
  mask?: MotionValue<string>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="wall-ground absolute inset-0 z-0 overflow-hidden"
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      <div className="wall-ground-soft">
        <ResponsiveImage
          src={src}
          alt=""
          fill
          sizes={tileSizes(src, CENTER)}
          style={{ objectPosition: "50% 76%" }}
        />
      </div>
    </motion.div>
  );
}

function FinaleTile({
  stage,
  index,
  src,
  alt,
  position,
  compact,
}: {
  stage: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  src: string;
  alt: string;
  position?: string;
  compact: boolean;
}) {
  // The four outer frames arrive at their gathered offsets while the words
  // complete, then settle into the window one at a time, and the keystone
  // lands last in the place the words stood. Every window below is stated as a
  // fraction of the section's own travel; nothing but the keystone is scaled
  // at any of them.
  //
  // The arrivals still run 0.14 to 0.65 and the settles still end at 0.92
  // desktop / 0.94 mobile — the two spans the seven-tile wall was tuned to,
  // and the reason it has no frame where the reader scrolls and nothing moves.
  // Four frames over the same spans means a wider stagger, not a shorter
  // sequence: 0.117 between arrivals against 0.07, and 0.060 / 0.047 between
  // settles against 0.036 / 0.028.
  //
  // Compact screens keep the strict sequence they had: the wall does not begin
  // to close until the words have fully dissolved at 0.68, so a moving frame
  // never crosses live text on the viewport that has no room to spare.
  const slot = SLOTS[index];
  const center = index === CENTER;
  const outers = SLOTS.length - 1;
  const [zoomFrom, zoomTo] = zoomWindow(compact);
  const inStart = center
    ? textWindow(compact)[1]
    : 0.14 + ((index - 1) * 0.35) / (outers - 1);
  const inEnd = center ? zoomFrom : inStart + 0.16;
  const [gatherX, gatherY] = center
    ? [0, 0]
    : compact
      ? slot.gatherCompact
      : slot.gatherWide;
  const settleFrom =
    (compact ? 0.68 : 0.6) + ((index - 1) * (compact ? 0.14 : 0.18)) / (outers - 1);
  const settleTo = settleFrom + (compact ? 0.12 : 0.14);
  const riseDirection = compact && gatherY < 0 ? -1 : 1;

  const opacity = useTransform(() => stageWindow(stage.get(), inStart, inEnd));
  const x = useTransform(
    () => `${gatherX * (1 - stageWindow(stage.get(), settleFrom, settleTo))}%`
  );
  const y = useTransform(() => {
    const rise =
      riseDirection * 6 * (1 - stageWindow(stage.get(), inStart, inEnd));
    const settle = 1 - stageWindow(stage.get(), settleFrom, settleTo);
    return `${gatherY * settle + rise}%`;
  });
  // The wrapper is the window, so a translate on it is a percentage of the
  // window and lands the frame exactly where the preview's own offsets put it.
  // The scale is the keystone's and is taken about the tile's own middle
  // rather than the window's, which is what `transformOrigin` below states —
  // the slot is centred horizontally but sits high in the frame, and scaling
  // about the window would slide it down as it grew.
  const scale = useTransform(() =>
    center
      ? 1 + (CENTER_PEAK - 1) * stageWindow(stage.get(), zoomFrom, zoomTo)
      : 1
  );

  const r = rect(slot, compact);

  return (
    <motion.div
      style={{
        x,
        y,
        opacity,
        scale,
        transformOrigin: `${r.l + r.w / 2}% ${r.t + r.h / 2}%`,
      }}
      // The keystone is painted last of the five so that it comes forward over
      // the outer frames rather than behind them. Before the rise the wall
      // tiles the window exactly and nothing overlaps, so this changes no frame
      // there; and it is transparent until the words are gone, so it crosses
      // nothing live either.
      className={cn("absolute inset-0", center ? "z-20" : "z-10")}
    >
      <div
        // No ring, no radius, no shadow: the reference frame is the picture and
        // nothing else, which is what the offer panels already do.
        className="absolute overflow-hidden"
        style={rectStyle(r)}
      >
        <ResponsiveImage
          src={src}
          alt={alt}
          fill
          sizes={tileSizes(src, index)}
          style={{ objectPosition: position }}
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
