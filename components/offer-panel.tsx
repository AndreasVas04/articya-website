"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { PANEL_ANCHOR, PHOTO_SIZES } from "@/components/panel-photo";
import { ResponsiveImage } from "@/components/responsive-image";
import { cn } from "@/lib/utils";

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

// The eyebrow label, one per panel, in the order the panels appear. Like the
// numerals it is pseudo-content and never enters the DOM - the site's visible
// text is frozen, and both of these are marks rather than strings. CSS
// uppercases them.
//
// Both are held to eight characters, and that is a measurement rather than a
// preference: the numeral leads the row at 2.6× the heading's cap height, so
// on a narrow desktop it takes most of the 32% column on its own. Measured
// across every width from 768 up, eight characters keep the label inside the
// column plus its gap and clear of the photograph; "Development" reached the
// picture's edge at 768.
const EYEBROWS = ["Mobility", "Practice"];

interface OfferPanelProps {
  title: string;
  text: string;
  image: string;
  index: number;
  flip?: boolean;
}

// A panel composed to section A of design/REFERENCE-LANGUAGE.md: text on one
// side, a photograph on the other entering the section 12% higher than the
// words, and the two sides swap between the two panels.
//
// One viewport, scrolled through, never pinned. The panel used to hold the
// frame stuck for a full viewport of scroll inside a 200svh section, which
// bought nothing the composition was not already doing - the photograph's
// -12svh lift and the numeral's overlap are what break the horizontal band - 
// and cost two screens of scrolling in which the picture did not move. The
// reference sections are 1.0 viewport and pass straight through.
//
// The photograph is an object, sized and framed by nothing at all, standing on
// clean dark ground with empty floor around it. That emptiness is the point:
// the stage is held at nothing under the panel, so what the reader sees is a
// dark room with one lit picture in it, and the picture is the brightest thing
// in the section by design - no plate behind it, no dimming, no filter. The
// words fire once on the first in-view crossing and play on the clock; before
// mount and under reduced motion everything is visible, so the exported HTML
// is the resting state.
export function OfferPanel({
  title,
  text,
  image,
  index,
  flip = false,
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
    <section ref={ref} data-index-section="" className="relative">
      {/* The panel carries no stage key of its own. It used to carry two - the
          section itself, which keys at its own middle, and a marker at 60% of
          it - and both of those are the panel's height, which on a phone is a
          stack of px. The page places all four keys for this stretch instead,
          in `svh` off the panel's top row, so the spans they bound are shares
          of the window rather than shares of a photograph's aspect ratio. */}
      <div className="relative">
        {/* The foot is the last px band to go. At 64 it was 9.6% of a 664
            screen and 11.6% of a 553 one; at 3svh it is 3% of both, and it
            matches the head and the gap. `min-h-svh` now binds on a phone at
            664, 750 and 844 - the content is 636px at 664 - so the panel is
            one screen and the block centres in it, which is what the head was
            originally written to correct for. */}
        <div className="relative flex min-h-svh w-full items-center px-4 pb-[3svh] md:px-0 md:py-0">
          <div
            className={cn(
              "offer-panel-grid relative w-full",
              flip && "offer-panel-grid-flip"
            )}
          >
            <div ref={textRef} className="offer-panel-text relative w-full">
              {/* Reading left to right: the numeral, a 48px amber rule, the
                  label. The numeral's vertical centre is this row, so its
                  lower half falls across the heading's first word. */}
              <span
                aria-hidden="true"
                className="offer-eyebrow"
                style={
                  {
                    ...enter(0, FADE),
                    "--ghost-num": `"0${index + 1}"`,
                    "--eyebrow": `"${EYEBROWS[index] ?? ""}"`,
                  } as CSSProperties
                }
              >
                <span className="offer-numeral" />
                <span className="offer-eyebrow-rule" style={enter(0, DRAW)} />
                <span className="offer-eyebrow-text" />
              </span>
              <h3
                className="offer-panel-title mt-6 font-display font-semibold tracking-[-0.025em] text-ink"
                style={enter(0, LIFT)}
              >
                {title}
              </h3>
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

            <div className="offer-panel-photo relative" style={enter(1, LIFT)}>
              <ResponsiveImage
                src={image}
                alt=""
                sizes={PHOTO_SIZES}
                className="block h-full w-full object-cover md:h-auto md:aspect-[3/4]"
                style={{ objectPosition: PANEL_ANCHOR[image] }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
