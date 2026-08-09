"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Globe, GraduationCap } from "lucide-react";
import { ResponsiveImage } from "@/components/responsive-image";
import { GroundLift } from "@/components/ground-parallax";
import { cn } from "@/lib/utils";

// Icons live here because component references can't cross the
// server/client boundary as props.
const icons = { globe: Globe, graduation: GraduationCap };

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
const LIFT: CSSProperties = { opacity: 0, translate: "0 40px" };
const RISE: CSSProperties = { translate: "0 40px" };
const FADE: CSSProperties = { opacity: 0 };
const DRAW: CSSProperties = { scale: "0 1" };

interface OfferPanelProps {
  image: string;
  title: string;
  text: string;
  icon: keyof typeof icons;
  flip?: boolean;
}

// A full-bleed photographic panel staged as a pinned scroll beat. The outer
// section is taller than the viewport and the frame sticks while the user
// scrolls through it: the photo drifts, its scale settles and the cream
// scrim builds, all of it read off the pin. The words are the exception —
// heading, bar and paragraph fire once on the first in-view crossing and
// play on the clock. On mobile the pin is shorter and the paragraph arrives
// in two halves anchored to the bottom wash. Before mount and under reduced
// motion the panel renders unpinned with everything visible, so the exported
// HTML is the resting state.
export function OfferPanel({
  image,
  title,
  text,
  icon,
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

  // Two progress scales: `travel` spans the whole traversal for the slow
  // photo drift; `stage` spans only the pinned stretch and drives the text
  // choreography.
  const { scrollYProgress: travel } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: stage } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const photoY = useTransform(() => `${-6 + 12 * travel.get()}%`);
  const photoScale = useTransform(
    () => 1.05 - 0.05 * stageWindow(stage.get(), 0.05, 0.35)
  );
  const iconOpacity = useTransform(() => stageWindow(stage.get(), 0.07, 0.17));
  const iconY = useTransform(
    () => 24 * (1 - stageWindow(stage.get(), 0.07, 0.17))
  );

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
      className={cn("relative", active && "h-[190svh] md:h-[240svh]")}
    >
      {/* The signed join with the zone above. It rides the outer section,
          which stays in flow, not the frame, which pins — a seam drawn inside
          the sticky frame would hold at the top of the screen for the whole
          pin instead of scrolling past once. */}
      <span aria-hidden="true" className="zone-seam" />
      <div
        className={cn(
          "relative overflow-hidden",
          active ? "sticky top-0 h-svh" : "min-h-[92svh]"
        )}
      >
        {/* The panel is a photographic zone, edge to edge. It used to dissolve
            its picture away at the top and bottom and carry a gold field
            underneath, on the reasoning that the page ground was gold and the
            panel had to arrive out of it. The page ground is a photograph now,
            and a dissolve between two zones has to pass through whatever is
            beneath them — which is the flat gold this pass exists to remove.
            So the picture runs to both edges and the join is signed instead. */}
        <div aria-hidden="true" className="absolute inset-0">
          <motion.div
            className="absolute inset-x-0 -inset-y-[8%]"
            style={active ? { y: photoY, scale: photoScale } : undefined}
          >
            <ResponsiveImage
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover brightness-[1.06] saturate-[1.08]"
            />
          </motion.div>
          <div className="film-grain pointer-events-none absolute inset-0" />
        </div>

        {/* These panels are full-bleed, so their text tracks the viewport
            edge rather than the 72rem content column: inside the column a
            576px block starts 400px in on a 1920 screen and reads as
            floating toward the middle instead of anchored to its side.
            `offer-panel-inset` carries the gutter — see globals.css. */}
        <div
          className={cn(
            "offer-panel-inset relative mx-auto flex w-full items-end pb-10 md:items-center md:pb-0",
            active ? "h-full" : "min-h-[92svh] pt-[46svh] md:py-32"
          )}
        >
          <div
            ref={textRef}
            className={cn("relative max-w-xl", flip && "md:ml-auto")}
          >
            {/* The reading pool, anchored to this block and capped at 0.55 —
                the same primitive the clearing's type stands on. It replaces a
                pair of full-frame gradients that reached full `gold-wash` from
                the text side and were still at 78–82% halfway across the
                picture: measured, that was most of a viewport of flat cream
                laid over a photograph, and it is why the panels read as
                colour with a picture behind them rather than as pictures. */}
            <GroundLift />
            <div className="relative">
            <motion.span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full border border-pine/30 bg-gold-wash/70 text-pine backdrop-blur-sm"
              style={active ? { opacity: iconOpacity, y: iconY } : undefined}
            >
              <Icon className="size-6" strokeWidth={1.5} />
            </motion.span>
            <h3
              className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-ink"
              style={enter(0, LIFT)}
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
              className="mt-5 leading-[1.7] text-ink md:text-xl md:leading-[1.55]"
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
        </div>
      </div>
    </section>
  );
}
