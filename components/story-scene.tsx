"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { ResponsiveImage } from "@/components/responsive-image";
import { cn } from "@/lib/utils";

// Text plays on the clock, never on the scrollbar. Scrubbed by scroll a real
// flick collapses the whole entrance into a couple of frames and the words are
// gone before they can be read; on a fixed duration a visitor who blasts past
// still finds them settled where they belong. The travel is the individual
// `translate`/`scale` properties, never `transform`.
const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const RISE: CSSProperties = { translate: "0 40px" };
const FADE: CSSProperties = { opacity: 0 };
const DRAW: CSSProperties = { scale: "0 1" };

// The column plus the outer margin on desktop, the whole screen below that —
// the same measurement the offer panels fetch at.
const PHOTO_SIZES = "(min-width: 768px) 41vw, 100vw";

interface SceneImage {
  src: string;
  alt: string;
}

interface StorySceneProps {
  groups: string[];
  image: SceneImage;
  flip?: boolean;
}

// One scene of the About story, and it is the home offer panel's composition
// exactly: the same five-track grid, the same 3:4 photograph at 29% of the
// viewport, the same -12svh lift, one viewport, never pinned. It shares the
// panels' classes rather than restating their numbers, so the two cannot drift
// apart — see design/REFERENCE-LANGUAGE.md §A.
//
// What it used to be is what this replaces. The photograph sat in a mat —
// `bg-gold-card`, a 1px amber ring and a 24px drop shadow — which is a card
// fill behind a picture, the one treatment §2 rules out and the one the offer
// panels never had. Two languages on one site, and this was the older of them.
// The scenes also alternated their own flat grounds, chrome and anchor, which
// drew a horizontal line across the page wherever two of them met, and each
// pinned for 810px of scroll that changed nothing on the screen.
//
// Before mount and under reduced motion everything renders visible and
// unpinned, so the exported HTML is the resting state.
export function StoryScene({ groups, image, flip = false }: StorySceneProps) {
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

  // The hidden half of a text entrance exists only between mount and the
  // trigger, so the exported HTML carries the words in place; from the trigger
  // they run to their end states on a fixed duration, staggered in reading
  // order. Reduced motion keeps the fade and drops the travel.
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

  const active = mounted && !reducedMotion;

  return (
    // overflow-x clipped, not `overflow-clip`: the photograph now runs to the
    // window's outer edge and a classic scrollbar takes a few pixels of `vw`
    // with it, and the -12svh lift is vertical overflow that has to survive.
    <section data-index-section="" className="relative overflow-x-clip">
      <div className="relative flex min-h-svh w-full items-center px-4 py-16 md:px-0 md:py-0">
        <div
          className={cn(
            "offer-panel-grid relative w-full",
            flip && "offer-panel-grid-flip"
          )}
        >
          <div ref={textRef} className="offer-panel-text relative w-full">
            {/* The rule alone, no numeral: the numeral is sized at 2.6× a
                heading's cap height and these scenes carry no heading, so
                there is nothing for it to be in proportion to. */}
            <span
              aria-hidden="true"
              className="block h-[1.25px] w-12 origin-left bg-amber"
              style={enter(0, DRAW)}
            />
            {/* The paragraph lifts as one block and its groups light up inside
                it: a transform on a non-replaced inline box does nothing, and
                making the spans inline-block to earn one would stop them
                wrapping across lines. */}
            <p
              className="mt-6 max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink md:mt-8"
              style={enter(2, RISE)}
            >
              {groups.map((group, i) => (
                <span key={i} style={enter(2 + i, FADE)}>
                  {group}
                  {i < groups.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>

          {/* The wipe, on the same clock as the panels' — these scenes are the
              offer panel's composition and take its arrival with it. */}
          <div
            className={cn(
              "offer-panel-photo relative",
              active && (entered ? "offer-panel-wipe-in" : "offer-panel-wipe")
            )}
          >
            <ResponsiveImage
              src={image.src}
              alt={image.alt}
              sizes={PHOTO_SIZES}
              className="block aspect-[3/4] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
