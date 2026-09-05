"use client";

import { useEffect, useRef, useState } from "react";
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

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryFinaleProps {
  /** The closing paragraph in staged groups; joined with spaces it is the original text. */
  groups: string[];
  /** Up to 7 images; the first ends the zoom filling the viewport. */
  images: GalleryImage[];
}

// Per-tile placement, mobile first with md: overrides. The mosaic is a
// three-row grid around the center tile: the side tiles share the middle
// row's height, the top and bottom rows interlock one long tile with one
// small one, and every edge sits on a uniform gap (2vw/1.5vh mobile,
// 1.5vw/2vh desktop). The center tile is sized so that at full scale it
// finishes slightly past 100vw/100vh and its rounded corners land offscreen.
const TILES = [
  "h-[26vh] w-[52vw] md:h-[26vh] md:w-[26vw]",
  "-top-[22.5vh] -left-[11vw] h-[16vh] w-[74vw] md:-top-[25vh] md:-left-[10.25vw] md:h-[20vh] md:w-[46.5vw]",
  "-left-[38vw] h-[26vh] w-[20vw] md:-left-[24vw] md:h-[26vh] md:w-[19vw]",
  "left-[38vw] h-[26vh] w-[20vw] md:left-[24vw] md:h-[26vh] md:w-[19vw]",
  "top-[22.5vh] left-[11vw] h-[16vh] w-[74vw] md:top-[25vh] md:left-[10.25vw] md:h-[20vh] md:w-[46.5vw]",
  "top-[22.5vh] -left-[38vw] h-[16vh] w-[20vw] md:top-[25vh] md:-left-[24vw] md:h-[20vh] md:w-[19vw]",
  "-top-[22.5vh] left-[38vw] h-[16vh] w-[20vw] md:-top-[25vh] md:left-[24vw] md:h-[20vh] md:w-[19vw]",
];

const TARGET_SCALES = [4, 5, 6, 5, 6, 8, 9];

// The section's own height, in screens, and it is the same number at both
// breakpoints. A sticky frame one screen tall inside it pins for `SECTION_SVH
// - 1`, so 2.2 is 1.2 screens of pin — §2's ceiling exactly — where 3.00 and
// 4.40 were 2.00 and 3.40. The timeline `useScroll` measures is one screen
// longer than the section at each end's own definition: section top at the
// window's foot to section bottom at its head, so 3.2 screens.
const SECTION_SVH = 2.2;

// What the choreography was approved against: 3.00 screens on a phone and 4.40
// on a desktop, keyed on one shared set of numbers because the two pins were
// different lengths and the keys never had to tell them apart.
const APPROVED_SVH = { compact: 3, wide: 4.4 };

// Every key in this file is still the number the composition was approved at.
// `stageKey` is what puts it on the shortened timeline, and it is one affine
// map per breakpoint: read the key as a distance from the moment the pin
// engages, scale that distance by the ratio of the two pins, and read it back
// as a fraction of the new travel. It sends the pin's two ends to the pin's two
// ends, holds the ratio of every interval to every other exactly, and leaves
// each event at the same fraction of the pin it was approved at. In scroll
// rather than in progress the phone's run is played at 0.600 of its old length
// and the desktop's at 0.353 — the ceiling is one number and the two pins were
// not.
const stageKey = (value: number, compact: boolean) => {
  const was = compact ? APPROVED_SVH.compact : APPROVED_SVH.wide;
  const squeeze = (SECTION_SVH - 1) / (was - 1);
  return (squeeze * (value * (was + 1) - 1) + 1) / (SECTION_SVH + 1);
};

// Each tile's slot, in fractions of the viewport, matching TILES above — the
// mobile box first and the md: box second, because this mosaic is the one on
// the site whose bands change at the breakpoint.
//
// `100vw` and `(min-width: 768px) 55vw, 80vw` are two hand-written strings for
// fourteen boxes, and a box is not what a cover-fitted photograph is painted
// at: `object-fit: cover` scales the frame until it covers both axes, so a
// frame proportionally wider than its slot is fitted by its height and painted
// wider than the slot with the sides cropped off. Slot 3 is the clearest case
// — 20vw x 26vh on a phone is 78 x 172.6 CSS px at 390x664, and a 2.14:1 frame
// cover-paints 370 of them against the 312 that `80vw` declares. `coverSizes`
// reads each frame's own aspect out of the variant manifest and returns the
// width it actually paints.
const TILE_BOXES: { wide: SizeBox; compact: SizeBox }[] = [
  { wide: { vw: 0.26, vh: 0.26 }, compact: { vw: 0.52, vh: 0.26 } },
  { wide: { vw: 0.465, vh: 0.2 }, compact: { vw: 0.74, vh: 0.16 } },
  { wide: { vw: 0.19, vh: 0.26 }, compact: { vw: 0.2, vh: 0.26 } },
  { wide: { vw: 0.19, vh: 0.26 }, compact: { vw: 0.2, vh: 0.26 } },
  { wide: { vw: 0.465, vh: 0.2 }, compact: { vw: 0.74, vh: 0.16 } },
  { wide: { vw: 0.19, vh: 0.2 }, compact: { vw: 0.2, vh: 0.16 } },
  { wide: { vw: 0.19, vh: 0.2 }, compact: { vw: 0.2, vh: 0.16 } },
];

// Declared at rest, which is the slot and not the peak. The fan-out takes the
// tiles to between 4x and 9x and no rung on the ladder reaches that — the worst
// slot asks 8036 device px against a 2880 cap — so a declaration made at the
// peak would fetch the widest variant that exists for every tile and still not
// close it, while costing every visitor the download. The rest is what the
// reader looks at for the whole of the gather, the hold and the settle.
//
// The centre tile is the exception, and it declares the window. It is the one
// tile that ends alone on the screen: the fan-out carries it past full bleed
// and holds it there, so its peak is the one growth on the wall a reader
// actually stops on, and at rest it is 26vw. Declared at rest it would be
// fetched at 749 device px and painted at 2995 on a 1440x900 desktop. `100vw`
// is not a declaration at the peak either — the peak is 104vw — it is the
// widest rung the ladder carries, and it is what b256c30 declared here.
const tileSizes = (src: string, index: number) =>
  index === 0
    ? "100vw"
    : coverSizes(src, TILE_BOXES[index].wide, TILE_BOXES[index].compact);

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
// margins — and the tall middle-row tiles wait just offscreen (their slots sit
// beside the text) and sweep in as the ring closes.
//
// The top band's inset was a bare fraction and the header it has to clear is a
// fixed number of pixels, so the two could never be compared. At -8vh the
// band's top edge lands at 0.115 x H, and its clearance is 0.115 x H minus the
// header — which crosses zero at H = 565 against the 65px header of the build
// this composition comes from and at H = 557 against today's 64px. Either way
// it is negative at 553, a height this phone produces: measured on that build,
// the topmost settled tile clears by -1.4px and is under the header.
//
// Written as a fraction plus a pixel constant the inset is 0.07 x H + 38, and
// the same measurement returns 12.7 / 20.5 / 26.5 / 33.1px of clearance at
// 553 / 664 / 750 / 844. It lands on the old value to within 0.02px at 844, so
// the height the composition was approved at is where it moves least. Only the
// two tiles of the top band carry it; GATHER above is the desktop ring and no
// header crosses it.
const GATHER_COMPACT: [number, number][] = [
  [0, 0],
  [0, -12.5],
  [-24, 0],
  [24, 0],
  [0, 8],
  [0, 8],
  [0, -12.5],
];

// The pixel half of the two top-band offsets above, in the same tile order.
const GATHER_COMPACT_PX = [0, 38, 0, 0, 0, 0, 38];

// The story's finale: the photographs from the scenes above rise around the
// closing paragraph while it completes — words and tiles share every frame —
// then the words dissolve, the loose ring closes into a mosaic over the
// point where they stood, and the mosaic zooms until the community fills
// the screen. Before mount and under reduced motion it renders unpinned —
// the full paragraph followed by a static grid — so the exported HTML is
// the resting state.
export function GalleryFinale({ groups, images }: GalleryFinaleProps) {
  const container = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);

  // One travel-based timeline (section top at viewport bottom → section
  // bottom at viewport top), so the words are already arriving while the
  // last scene releases and the frame is never empty. The section is 2.2
  // screens at both breakpoints now, so the pin engages at 0.3125 and
  // releases at 0.6875 on either — the zoom completes just before release and
  // holds full-bleed for a beat, as it did at 0.745 against 0.75.
  const { scrollYProgress: stage } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const key = (value: number) => stageKey(value, compact);

  // Text: three groups complete shortly after the pin engages while the
  // outer tiles gather, hold among them, then hand the frame over as the
  // ring closes. On compact screens the words dissolve completely before
  // the ring starts moving, so the closing tiles never cross live text.
  const seg = 0.18 / (groups.length + 0.5);
  const [fadeFrom, fadeTo] = compact
    ? [key(0.4), key(0.46)]
    : [key(0.42), key(0.5)];
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

  // Resting state: the paragraph in full, then the same photos as a plain
  // grid. No pinning, no scroll-linked transforms.
  if (!mounted || reducedMotion) {
    return (
      <section ref={container} className="pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <span aria-hidden="true" className="block h-[1.25px] w-16 bg-amber" />
          <p className="mt-6 max-w-3xl leading-[1.7] text-ink md:mt-8 md:text-xl md:leading-[1.55]">
            {groups.join(" ")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1 md:grid-cols-3 md:gap-2 md:p-2">
          {images.slice(0, TILES.length).map(({ src, alt }, index) => (
            <ResponsiveImage
              key={src}
              src={src}
              alt={alt}
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
    <section ref={container} className="relative h-[220svh]">
      {/* The pinned frame's job is to cover the window, so it names `dvh` — the
          same correction 2.19 made to the stage, recorded there and made here.
          At `svh` it was sized to the smallest viewport while the tiles inside
          it are laid out in bare `vh`, which is `lvh`: a wall measured against
          750 inside a frame that is 664, leaving a band of ground under it as
          soon as the URL bar collapses. It is sticky inside a fixed-height
          section, so it sets no document height and moves no key. */}
      <div
        key={compact ? "compact" : "wide"}
        className="sticky top-0 h-[100dvh] overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ opacity: textOut, y: textDrift }}
        >
          <div className="max-w-2xl text-center">
            <TextBar stage={stage} start={key(0.08)} end={key(0.14)} />
            <p className="mt-8 text-xl leading-[1.55] text-ink">
              {groups.map((group, i) => (
                <FinaleGroup
                  key={i}
                  stage={stage}
                  start={key(0.13 + i * seg)}
                  end={key(0.13 + i * seg + seg * 1.5)}
                >
                  {group}
                  {i < groups.length - 1 ? " " : ""}
                </FinaleGroup>
              ))}
            </p>
          </div>
        </motion.div>

        {images.slice(0, TILES.length).map(({ src, alt }, index) => (
          <FinaleTile
            key={src}
            stage={stage}
            index={index}
            src={src}
            alt={alt}
            compact={compact}
          />
        ))}
      </div>
    </section>
  );
}

function TextBar({
  stage,
  start,
  end,
}: {
  stage: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const scaleX = useTransform(() => stageWindow(stage.get(), start, end));
  return (
    <motion.span
      aria-hidden="true"
      className="mx-auto block h-[1.25px] w-16 bg-amber"
      style={{ scaleX }}
    />
  );
}

function FinaleGroup({
  stage,
  start,
  end,
  children,
}: {
  stage: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
  children: React.ReactNode;
}) {
  const opacity = useTransform(() => stageWindow(stage.get(), start, end));
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function FinaleTile({
  stage,
  index,
  src,
  alt,
  compact,
}: {
  stage: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  src: string;
  alt: string;
  compact: boolean;
}) {
  // Outer tiles rise staggered into their gathered offsets while the words
  // complete; the ring settles into the mosaic as the words hand over, the
  // center tile arrives where they stood, and the zoom takes the center
  // tile past full-bleed. Compact screens sequence the handoff strictly —
  // the ring holds until the words have fully dissolved and the center tile
  // waits for the settle — and the band tiles above the words rise in from
  // above so their entrance also stays clear of the text.
  const center = index === 0;
  const key = (value: number) => stageKey(value, compact);
  const approachStart = center
    ? compact
      ? 0.465
      : 0.44
    : 0.1 + (index - 1) * 0.015;
  const inStart = key(approachStart);
  const inEnd = key(approachStart + (center ? 0.08 : 0.1));
  const [gatherX, gatherY] = (compact ? GATHER_COMPACT : GATHER)[index];
  const gatherPx = compact ? GATHER_COMPACT_PX[index] : 0;
  const [settleFrom, settleTo] = compact
    ? [key(0.46), key(0.545)]
    : [key(0.42), key(0.54)];
  const zoomFrom = key(0.55);
  const zoomTo = key(0.745);
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
    return `calc(${gatherY * settle + rise}vh + ${gatherPx * settle}px)`;
  });
  const scale = useTransform(
    () =>
      1 + (TARGET_SCALES[index] - 1) * stageWindow(stage.get(), zoomFrom, zoomTo)
  );

  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute top-0 flex h-full w-full items-center justify-center"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl ring-1 ring-amber/55",
          TILES[index]
        )}
      >
        <ResponsiveImage
          src={src}
          alt={alt}
          fill
          sizes={tileSizes(src, index)}
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
