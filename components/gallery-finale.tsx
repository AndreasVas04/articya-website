"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
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
// who blasts past still finds it settled. The mosaic stays scroll-linked —
// the tiles are the composition itself, not text — and so does the handoff
// that takes the words back out as the ring closes over them.
const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const RISE: CSSProperties = { translate: "0 40px" };
const FADE: CSSProperties = { opacity: 0 };
const DRAW: CSSProperties = { scale: "0 1" };

interface GalleryImage {
  src: string;
  alt: string;
  /** Where the tile's window sits on the frame. A slot's aspect is fixed by
   *  the wall, so this is the only thing that decides whether the tile holds a
   *  whole subject or a slice of one — centred, the cattle lost their legs to
   *  the bottom edge and the walkers lost theirs. Defaults to centred. */
  position?: string;
}

interface GalleryFinaleProps {
  /** The closing paragraph in staged groups; joined with spaces it is the original text. */
  groups: string[];
  /** Up to 7 images; the first ends the zoom filling the viewport. */
  images: GalleryImage[];
}

// The wall. Seven photographs in three bands that tile the window exactly —
// 100vw across and 100vh down, with no gap between any two of them and no
// ground left showing anywhere.
//
// It used to be a scatter: seven tiles of seven different sizes floating on
// dark with a uniform gap around each and a dark margin around the whole
// group. Seven objects arranged on a field. The complaint that this page is
// "arranged, not composed" is that gap — an object with air around it reads as
// placed, and seven of them read as a pile. Filling the frame is what turns
// them into one thing: there is no ground to be placed on, so the composition
// is not *in* the window, it *is* the window.
//
// Offsets are from the window's centre, which is where each tile's flex parent
// puts it. Reading the three bands:
//   top     60vw + 40vw, 30vh tall, meeting at x = +10vw
//   middle  25vw + 50vw + 25vw, 40vh tall
//   bottom  40vw + 60vw, 30vh tall, meeting at x = -10vw
// The wide tile is on the left at the top and on the right at the bottom, so
// the two long edges cross the frame in opposite directions and the wall has
// the interlock the scatter had. The centre tile is the one the zoom takes
// past full bleed, and it arrives last, in the place the words stood.
//
// The bands are the same at both viewports. A wall does not need a breakpoint:
// it is measured in fractions of the window, and the window is what it fills.
const TILES = [
  "h-[40vh] w-[50vw]",
  "-top-[35vh] -left-[20vw] h-[30vh] w-[60vw]",
  "-left-[37.5vw] h-[40vh] w-[25vw]",
  "left-[37.5vw] h-[40vh] w-[25vw]",
  "top-[35vh] left-[20vw] h-[30vh] w-[60vw]",
  "top-[35vh] -left-[30vw] h-[30vh] w-[40vw]",
  "-top-[35vh] left-[30vw] h-[30vh] w-[40vw]",
];

// The zoom is gone, and nothing in this section is scaled at any frame. It ran
// the seven tiles out to 2.60, 3.13, 3.67, 3.13, 3.67, 4.73 and 5.27 across
// stage 0.77–0.95, and measured against the pixels that exist rather than
// against the rung that was fetched it could not be paid for:
//
//   tile 6 is a 576 × 270 box that reached 3036 CSS px, which is 9107 device
//   px at DPR 3 out of a 6048 px master — 1.51× the source, and 4.74× the
//   1920 rung its resting `sizes` asked for. That is the blur.
//
// No `sizes` string closes it. A declaration made at the peak asks for 9107
// and the ladder stops at 2560, so the gap against the source survives every
// fix available in code, and the rule is the one §2.5 states: reduce the
// amplitude, not the resting size.
//
// The centre tile is the reason the whole move had to go rather than shrink.
// At 2.60 it is a full-bleed placement, and it holds `hero-1` — 2048px, one of
// the three 3.1 MP frames that are disqualified from full bleed permanently.
// Capped at what the source can pay for it reaches 1.42 at DPR 2, which covers
// 71% of the window and nothing at all at DPR 3; a frame that is meant to fill
// the screen and stops short of it is not a quieter version of the move, it is
// a broken one. So the wall itself is the ending — which is what it was built
// to be: seven photographs tiling the window exactly, with no ground left
// showing anywhere.
//
// What the zoom's 0.18 of travel buys instead is the assembly. The ring keeps
// landing to the end of the pin rather than finishing at 0.76 and then
// magnifying for a fifth of the section, and the centre tile arrives last, in
// the place the words stood.

// Each tile's box, in fractions of the viewport, matching TILES above. It is
// what `coverSizes` measures the painted width against: the box scales with
// the window, and object-cover scales the picture again wherever the frame's
// aspect and the box's disagree, so the two together decide how many pixels
// the tile actually paints.
//
// It used to be two hand-computed strings for fourteen frames — one for the
// centre tile, one for all six of the ring — carrying the overscale of the
// widest frame in the widest slot so the worst case was covered and every
// other tile over-fetched. Per tile and per frame, each one asks for the width
// it paints and no more.
const TILE_BOXES: SizeBox[] = [
  { vw: 0.5, vh: 0.4 },
  { vw: 0.6, vh: 0.3 },
  { vw: 0.25, vh: 0.4 },
  { vw: 0.25, vh: 0.4 },
  { vw: 0.6, vh: 0.3 },
  { vw: 0.4, vh: 0.3 },
  { vw: 0.4, vh: 0.3 },
];

// Declared at the largest size the tile ever reaches, which is now its own
// slot: nothing here is scaled at any frame of the entrance. The centre tile
// used to carry a 2.6 factor here because the zoom took it there, and the
// other six were declared at their resting boxes while the same zoom took them
// to between 3.1 and 5.3 — which is the error `coverSizes()` closed for the
// full-bleed frames in 1.2, made again on a transient instead of on a fit.
const tileSizes = (src: string, index: number) =>
  coverSizes(src, TILE_BOXES[index]);

// While the words are on screen each outer tile holds this offset from its
// mosaic slot (x in vw, y in vh) — gathered loosely around the paragraph,
// clear of the text block — then settles into the slot as the words hand
// off. The center tile has no offset; it arrives last, where the words
// stood.
const GATHER: [number, number][] = [
  [0, 0],
  [0, -8],
  [-14, 0],
  [14, 0],
  [0, 9],
  [-6, 8],
  [6, -8],
];

// Below md the paragraph runs nearly full-width and full-height, so the ring
// stages vertically instead: the wide and small tiles hold as two aligned
// bands above and below the words — mirrored pairs on the mosaic's 2vw side
// margins, inset 11.5vh from the viewport edges so the top band clears the
// fixed header — and the tall middle-row tiles wait just offscreen (their
// slots sit beside the text) and sweep in as the ring closes.
const GATHER_COMPACT: [number, number][] = [
  [0, 0],
  [0, -8],
  [-24, 0],
  [24, 0],
  [0, 8],
  [0, 8],
  [0, -8],
];

// The story's finale: the photographs from the scenes above rise around the
// closing paragraph while it completes — words and tiles share every frame —
// then the words dissolve, the loose ring closes into a mosaic over the
// point where they stood, and the mosaic zooms until the community fills
// the screen. Before mount and under reduced motion it renders unpinned —
// the full paragraph followed by a static grid — so the exported HTML is
// the resting state.
export function GalleryFinale({ groups, images }: GalleryFinaleProps) {
  const container = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [entered, setEntered] = useState(false);

  // One travel-based timeline, and it now ends where the held frame does. It
  // used to run to "end start" — the section's bottom edge reaching the top of
  // the window — which is a scroll position this document cannot reach: only
  // the footer stands below the finale, so the page ran out at 0.739 of the
  // declared 2880px at 1440×900 (0.725 of 2532 on a phone) and the last
  // quarter of the choreography was unreachable at every viewport. "end end"
  // ends on the section's bottom edge reaching the *bottom* of the window,
  // which is the exact frame the sticky child unpins on. Every value from 0 to
  // 1 is reachable now, 1 is the release, and the ~148px of footer under it is
  // the exit.
  //
  // The section still opens at the bottom of the window, so the words are
  // already arriving while the last scene releases and the frame is never
  // empty. The pin engages at 0.455 desktop / 0.500 mobile — one viewport of
  // travel over a 220svh / 200svh section — and releases at 1.0. Everything
  // below is written against that split: the ring assembles while the section
  // rises, and the handover, the settle and the zoom all play inside the pin.
  const { scrollYProgress: stage } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });

  // Text: the groups complete on their own clock shortly after the words
  // arrive, hold among the gathering tiles, then hand the frame over as the
  // ring closes. That handoff stays scroll-linked — it is the mosaic's beat,
  // not the words' — and on compact screens the words dissolve completely
  // before the ring starts moving, so the closing tiles never cross live text.
  const [fadeFrom, fadeTo] = compact ? [0.6, 0.68] : [0.62, 0.7];
  const textOut = useTransform(
    () => 1 - stageWindow(stage.get(), fadeFrom, fadeTo)
  );
  const textDrift = useTransform(
    () => -24 * stageWindow(stage.get(), fadeFrom, fadeTo)
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setCompact(!query.matches);
    update();
    setMounted(true);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Fires once, the first time a quarter of the text block has risen clear of
  // the bottom 15% of the viewport. The block is only in the tree once the
  // component has mounted, and a viewport change re-keys the sticky frame
  // out from under it, so both are cues to look for the element again.
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

  // The hidden half of a text entrance exists only between mount and the
  // trigger, so the exported HTML carries the words in place; from the
  // trigger they run to their end states on a fixed duration, staggered in
  // reading order. Reduced motion keeps the fade and drops the travel.
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

  // Resting state: the paragraph in full, then the same photos as a plain
  // grid. No pinning, no scroll-linked transforms.
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
        {/* The resting state is the wall too: no gap, no padding, the frame
            filled. It used to carry a 4px gutter and a 4px surround, which is
            the scatter's own reading at rest. */}
        <div className="grid grid-cols-2 md:grid-cols-3">
          {images.slice(0, TILES.length).map(({ src, alt, position }, index) => (
            <ResponsiveImage
              key={src}
              src={src}
              alt={alt}
              style={{ objectPosition: position }}
              // The same `sizes` the pinned tiles below declare, not the ones
              // this grid's own layout implies. The server renders this grid
              // and the mounted component swaps to the pinned tiles, so a
              // narrower value here picks a smaller variant that is replaced
              // before it is ever displayed — one download of each photo
              // instead of two.
              sizes={tileSizes(src, index)}
              className={cn(
                "h-full w-full object-cover",
                index === 0
                  ? "col-span-2 aspect-[16/9] md:col-span-3 md:aspect-[21/9]"
                  : "aspect-[4/3]"
              )}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={container}
      // The sticky child pins for this height less one viewport: 1.2 viewports
      // of held frame on desktop, 1.0 on a phone, against §G's 1.2 ceiling. At
      // 300/440 it was 2.0 and 3.4, and the last third carried no words at all.
      className="relative h-[200vh] md:h-[220vh]"
    >
      <div
        key={compact ? "compact" : "wide"}
        className="sticky top-0 h-svh overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-4"
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

        {images.slice(0, TILES.length).map(({ src, alt, position }, index) => (
          <FinaleTile
            key={src}
            stage={stage}
            index={index}
            src={src}
            alt={alt}
            position={position}
            compact={compact}
          />
        ))}
      </div>
    </section>
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
  // The ring arrives at its gathered offsets while the words complete, then
  // closes into the mosaic one tile at a time, and the centre tile lands last
  // in the place the words stood. Every window below is stated as a fraction
  // of the section's own travel; nothing is scaled at any of them.
  //
  // The six ring tiles used to be in place by 0.39 and settled by 0.76, which
  // left 0.455–0.616 with nothing moving at all — 320px of pin on a desktop
  // and 168px on a phone where the reader scrolled and the glass did not
  // change. Staggering the arrivals 0.07 apart runs them to 0.65 and closes
  // that; spreading the settle to 0.92 spends the travel the zoom used to.
  //
  // Compact screens keep the strict sequence they had: the ring does not begin
  // to close until the words have fully dissolved at 0.68, so a moving tile
  // never crosses live text on the viewport that has no room to spare.
  const center = index === 0;
  const inStart = center ? (compact ? 0.84 : 0.82) : 0.14 + (index - 1) * 0.07;
  const inEnd = inStart + (center ? 0.12 : 0.16);
  const [gatherX, gatherY] = (compact ? GATHER_COMPACT : GATHER)[index];
  // Staggered per tile, so the ring closes as a sequence rather than as one
  // move. The last of the six lands at 0.92 desktop / 0.94 mobile, which
  // leaves the completed wall standing for 99px and 67px before the pin
  // releases — the same held frame the zoom used to end on, and the footer's
  // 148px after it.
  const settleFrom = (compact ? 0.68 : 0.6) + (index - 1) * (compact ? 0.028 : 0.036);
  const settleTo = settleFrom + (compact ? 0.12 : 0.14);
  const riseDirection = compact && gatherY < 0 ? -1 : 1;

  const opacity = useTransform(() => stageWindow(stage.get(), inStart, inEnd));
  const x = useTransform(
    () =>
      `${gatherX * (1 - stageWindow(stage.get(), settleFrom, settleTo))}vw`
  );
  const y = useTransform(() => {
    const rise =
      riseDirection * 6 * (1 - stageWindow(stage.get(), inStart, inEnd));
    const settle = 1 - stageWindow(stage.get(), settleFrom, settleTo);
    return `${gatherY * settle + rise}vh`;
  });

  return (
    <motion.div
      style={{ x, y, opacity }}
      className="absolute top-0 flex h-full w-full items-center justify-center"
    >
      <div
        // No ring, no radius, no shadow: the reference frame is the picture
        // and nothing else, which is what the offer panels already do.
        className={cn("relative overflow-hidden", TILES[index])}
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
