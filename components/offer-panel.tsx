"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { Globe, GraduationCap } from "lucide-react";
import { ResponsiveImage } from "@/components/responsive-image";
import { cn } from "@/lib/utils";

// Icons live here because component references can't cross the
// server/client boundary as props.
const icons = { globe: Globe, graduation: GraduationCap };

// Text plays on the clock, never on the scrollbar. Scrubbed by pin progress
// a real flick collapses the whole entrance into a couple of frames and the
// words are gone before they can be read; on a fixed duration a visitor who
// blasts past still finds them settled where they belong. The travel is the
// individual `translate`/`scale` properties, never `transform`, so it
// composes with the inline transforms the pinned layers write alongside it.
const ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const LIFT: CSSProperties = { opacity: 0, translate: "0 40px" };
const RISE: CSSProperties = { translate: "0 40px" };
const FADE: CSSProperties = { opacity: 0 };
const DRAW: CSSProperties = { scale: "0 1" };

// How wide the photograph renders, so the browser fetches that width and no
// more: 42% of the container up to 520px on desktop, a stacked block below it.
const PHOTO_SIZES = "(min-width: 768px) min(42vw, 520px), 72vw";

interface OfferPanelProps {
  title: string;
  text: string;
  image: string;
  index: number;
  icon: keyof typeof icons;
  flip?: boolean;
  /** Per-frame colour correction, where one photograph sits off the set. */
  photoClass?: string;
}

// A panel staged as a pinned scroll beat: text on one side, a floating
// photograph on the other, and the two sides swap between the two panels.
//
// The photograph used to be the whole panel — full-bleed, edge to edge, with
// the words laid over it. It is an object now, sized and framed, standing on
// the page's own quiet ground with empty floor all around it. That emptiness
// is the point: the stage drops to 0.18 through the pin, so what the reader
// sees is a dark room with one lit picture in it. The frame sticks while the
// reader scrolls through it; the words fire once on the first in-view
// crossing and play on the clock. Before mount and under reduced motion the
// panel renders unpinned with everything visible, so the exported HTML is the
// resting state.
export function OfferPanel({
  title,
  text,
  image,
  index,
  icon,
  flip = false,
  photoClass,
}: OfferPanelProps) {
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

  const Icon = icons[icon];
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

  // The paragraph lights up sentence by sentence. Splitting it by viewport
  // was a pacing fix for the old scroll scrub, where five drips outlasted
  // the shorter mobile pin; on a 90ms stagger both viewports carry all five.
  const groups = text.split(/(?<=\.) /);

  return (
    <section
      ref={ref}
      data-index-section=""
      data-stage-plate="1"
      data-stage-strength="0.18"
      className={cn("relative", active && "h-[190svh] md:h-[240svh]")}
    >
      <div
        className={cn(
          "relative",
          active ? "sticky top-0 h-svh" : "min-h-[92svh]"
        )}
      >
        {/* The inset keeps the block off the viewport edge at every width —
            the photograph is an object on the ground, so it must never run
            out to the screen's own border. */}
        <div
          className={cn(
            "offer-panel-inset relative mx-auto flex w-full items-center",
            active ? "h-full" : "min-h-[92svh] py-24 md:py-32"
          )}
        >
          <div
            className={cn(
              "relative flex w-full flex-col items-center gap-12 md:flex-row md:items-center md:gap-[8vw]",
              flip && "md:flex-row-reverse"
            )}
          >
            <div ref={textRef} className="relative w-full md:flex-1">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-full border border-pine/30 text-pine"
                  style={enter(0, FADE)}
                >
                  <Icon className="size-6" strokeWidth={1.5} />
                </span>
                {/* The ghosted numeral rides the heading as pseudo-content,
                    so no character of it enters the DOM. */}
                <h3
                  className="ghost-numeral relative mt-6 font-display text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.025em] text-ink"
                  style={{ ...enter(0, LIFT), "--ghost-num": `"0${index + 1}"` } as CSSProperties}
                >
                  {title}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-[1.25px] w-16 origin-left bg-amber"
                  style={enter(1, DRAW)}
                />
                {/* The paragraph lifts as one block and its sentences light up
                    inside it: a transform on a non-replaced inline box does
                    nothing, and making the spans inline-block to earn one would
                    stop them wrapping across lines. */}
                <p
                  className="mt-5 max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink"
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
            </div>

            {/* The photograph: an object with ground around it, not a
                background. 42% of the container to a 520px cap, 3/4 portrait,
                a 1.25px amber outline drawn inset so it sits on the picture's
                own edge, and a long soft shadow seating it on the floor. */}
            <div
              className="offer-panel-photo relative w-[72%] max-w-[320px] shrink-0 md:w-[42%] md:max-w-[520px]"
              style={enter(1, LIFT)}
            >
              <ResponsiveImage
                src={image}
                alt=""
                sizes={PHOTO_SIZES}
                className={cn(
                  "block aspect-[3/4] w-full object-cover",
                  photoClass
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
