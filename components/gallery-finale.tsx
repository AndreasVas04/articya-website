"use client";

import { useEffect, useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn, withBasePath } from "@/lib/utils";

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
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);

  // One travel-based timeline (section top at viewport bottom → section
  // bottom at viewport top), so the words are already arriving while the
  // last scene releases and the frame is never empty. The pin engages at
  // ~0.19 desktop / 0.25 mobile and releases at ~0.82 / 0.75; the zoom
  // completes just before release and holds full-bleed for a beat.
  const { scrollYProgress: stage } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  // Text: three groups complete shortly after the pin engages while the
  // outer tiles gather, hold among them, then hand the frame over as the
  // ring closes. On compact screens the words dissolve completely before
  // the ring starts moving, so the closing tiles never cross live text.
  const seg = 0.18 / (groups.length + 0.5);
  const [fadeFrom, fadeTo] = compact ? [0.4, 0.46] : [0.42, 0.5];
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
      <section className="bg-plaster-muted pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
          <span aria-hidden="true" className="block h-1 w-16 bg-resin-deep" />
          <p className="mt-6 max-w-3xl leading-[1.7] text-pine-950 md:mt-8 md:text-xl md:leading-[1.55]">
            {groups.join(" ")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1 md:grid-cols-3 md:gap-2 md:p-2">
          {images.slice(0, TILES.length).map(({ src, alt }, index) => (
            <img
              key={src}
              src={withBasePath(src)}
              alt={alt}
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
      className="relative h-[300vh] bg-plaster-muted md:h-[440vh]"
    >
      <div
        key={compact ? "compact" : "wide"}
        className="sticky top-0 h-svh overflow-hidden"
      >
        {/* The same pool of daylight the scenes sit in, under the gathering
            mosaic. */}
        <div aria-hidden="true" className="plaster-light absolute inset-0" />
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-4"
          style={{ opacity: textOut, y: textDrift }}
        >
          <div className="max-w-2xl text-center">
            <TextBar stage={stage} />
            <p className="mt-8 text-xl leading-[1.55] text-pine-950">
              {groups.map((group, i) => (
                <FinaleGroup key={i} stage={stage} start={0.13 + i * seg} end={0.13 + i * seg + seg * 1.5}>
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

function TextBar({ stage }: { stage: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const scaleX = useTransform(() => stageWindow(stage.get(), 0.08, 0.14));
  return (
    <motion.span
      aria-hidden="true"
      className="mx-auto block h-1 w-16 bg-resin-deep"
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
  const inStart = center
    ? compact
      ? 0.465
      : 0.44
    : 0.1 + (index - 1) * 0.015;
  const inEnd = inStart + (center ? 0.08 : 0.1);
  const [gatherX, gatherY] = (compact ? GATHER_COMPACT : GATHER)[index];
  const [settleFrom, settleTo] = compact ? [0.46, 0.545] : [0.42, 0.54];
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
  const scale = useTransform(
    () =>
      1 + (TARGET_SCALES[index] - 1) * stageWindow(stage.get(), 0.55, 0.745)
  );

  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute top-0 flex h-full w-full items-center justify-center"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl ring-1 ring-sage/40",
          TILES[index]
        )}
      >
        <img
          src={withBasePath(src)}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>
    </motion.div>
  );
}
