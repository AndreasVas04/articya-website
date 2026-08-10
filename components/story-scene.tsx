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
import { cn } from "@/lib/utils";

const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);

// Eased 0→1 over a slice of the pinned scroll. Computed transforms are used
// throughout (rather than useTransform's range form) because the range form
// gets promoted to a native view-timeline animation, which measures element
// visibility instead of pin progress inside a sticky frame.
const stageWindow = (value: number, from: number, to: number) =>
  easeInOutCubic(Math.min(Math.max((value - from) / (to - from), 0), 1));

// Text plays on the clock, never on the scrollbar. Scrubbed by pin progress
// a real flick collapses the whole entrance into a couple of frames and the
// words are gone before they can be read; on a fixed duration a visitor who
// blasts past still finds them settled where they belong. The travel is the
// individual `translate`/`scale` properties, never `transform`, so it
// composes with the inline transforms the pinned layers write alongside it.
const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const RISE: CSSProperties = { translate: "0 40px" };
const FADE: CSSProperties = { opacity: 0 };
const DRAW: CSSProperties = { scale: "0 1" };

interface SceneImage {
  src: string;
  alt: string;
  wide?: boolean;
}

interface StorySceneProps {
  groups: string[];
  image: SceneImage;
  flip?: boolean;
  muted?: boolean;
}

// One scene of the About story: a daylight sibling of the home offer panel.
// The section pins while the photograph rises into its bright mat and
// settles, all of it read off the scroll. The words are the exception — the
// amber bar and the paragraph fire once on the first in-view crossing and
// play on the clock. Scenes alternate between the two golds — chrome and
// anchor bands — and the photo is a framed print, never a full-bleed dark
// panel. Before mount and under reduced motion the scene renders unpinned
// with everything visible, so the exported HTML is the resting state.
export function StoryScene({
  groups,
  image,
  flip = false,
  muted = false,
}: StorySceneProps) {
  const ref = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => setMounted(true), []);

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
  }, [entered]);

  // `travel` spans the whole traversal and drives the photo's arrival, so
  // the print is already rising into view while the previous scene releases
  // — the frame is never empty between scenes. It is the scene's only
  // scroll-linked channel; the words run on their own clock.
  const { scrollYProgress: travel } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoOpacity = useTransform(() =>
    stageWindow(travel.get(), 0.05, 0.28)
  );
  const photoY = useTransform(
    () => 48 * (1 - stageWindow(travel.get(), 0.05, 0.28))
  );
  const imageScale = useTransform(
    () => 1.08 - 0.08 * stageWindow(travel.get(), 0.05, 0.45)
  );
  const imageDrift = useTransform(() => `${-4 + 8 * travel.get()}%`);

  const active = mounted && !reducedMotion;

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

  return (
    <section
      ref={ref}
      className={cn(
        "relative",
        muted ? "bg-gold-anchor" : "bg-gold-chrome",
        active && (groups.length > 1 ? "h-[170svh] md:h-[190svh]" : "h-[150svh] md:h-[160svh]")
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          active ? "sticky top-0 flex h-svh items-center" : "py-16 md:py-24"
        )}
      >
        {/* A soft pool of late sun where the print and its words sit. */}
        <div aria-hidden="true" className="gold-pool absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-12 md:gap-x-0">
          <motion.div
            className={cn(
              "print-shadow bg-plaster-bright p-2 ring-1 ring-amber/55 md:p-3",
              image.wide ? "md:col-span-6" : "md:col-span-5",
              flip
                ? image.wide
                  ? "md:col-start-7"
                  : "md:col-start-8"
                : "md:col-start-1"
            )}
            style={active ? { opacity: photoOpacity, y: photoY } : undefined}
          >
            <div
              className={cn(
                "relative overflow-hidden",
                image.wide
                  ? "h-[32svh] md:h-auto md:aspect-[16/9]"
                  : "h-[36svh] md:h-auto md:aspect-[4/5] md:max-h-[72svh]"
              )}
            >
              <motion.div
                className="absolute -inset-y-[6%] inset-x-0"
                style={active ? { scale: imageScale, y: imageDrift } : undefined}
              >
                <ResponsiveImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          <div
            ref={textRef}
            className={cn(
              image.wide ? "md:col-span-5" : "md:col-span-6",
              flip
                ? "md:col-start-1 md:row-start-1"
                : image.wide
                  ? "md:col-start-8"
                  : "md:col-start-7"
            )}
          >
            <span
              aria-hidden="true"
              className="block h-[1.25px] w-16 origin-left bg-amber"
              style={enter(0, DRAW)}
            />
            {/* The paragraph lifts as one block and its groups light up
                inside it: a transform on a non-replaced inline box does
                nothing, and making the spans inline-block to earn one would
                stop them wrapping across lines. */}
            <p
              className="mt-6 leading-[1.7] text-ink md:mt-8 md:text-xl md:leading-[1.55]"
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
        </div>
      </div>
    </section>
  );
}
