"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { cn } from "@/lib/utils";

// The two halves of the light cone. Painted as explicit conic gradients so
// the component never depends on Tailwind's gradient plumbing; the color is
// always the resin token.
const CONE_LEFT =
  "conic-gradient(from 70deg at center top, color-mix(in srgb, var(--color-resin) 85%, transparent), transparent, transparent)";
const CONE_RIGHT =
  "conic-gradient(from 290deg at center top, transparent, transparent, color-mix(in srgb, var(--color-resin) 85%, transparent))";

// The descending thread carries the trail line's glow with it.
const THREAD_GLOW =
  "drop-shadow(0 0 2px color-mix(in srgb, var(--color-resin) 80%, transparent)) drop-shadow(0 0 18px color-mix(in srgb, var(--color-resin) 55%, transparent))";

interface LampCtaProps {
  children: React.ReactNode;
  className?: string;
}

// The page's one light shown at its source. The gains trail's line does not
// stop at the trail: a scroll-drawn thread continues down from the trail's
// end — the left rail on mobile, curving in to center; already centered on
// desktop — and lands exactly on the lamp line, wire meeting light source.
// Ignition is keyed to that arrival: when the thread's draw progress
// completes, a one-shot lit flip fires the CSS transitions — the cone blooms
// open from the meeting point (narrow and dim to wide and bright) and the
// words rise from below into the glow. The flip never reverts, so scrolling
// back up undraws the thread without re-firing the bloom. The lit state is
// the default, so exported HTML and reduced-motion users get the lamp fully
// on with the thread fully drawn; the unlit state is only applied after
// mount. Children opt into the ignition via group-data-[lit] classes.
//
// The cone halves fade to transparency with mask-image instead of the stock
// component's opaque cover bars, so they composite on any ground. The two
// remaining opaque layers (the bar above the line and the soft flattener at
// the cone's base) are pine-950 on the section's flat pine-950 ground, and
// the section's film grain is painted over them, so neither can read as a
// box. No overflow clip here — the parent section clips, so the halo's
// spill dies naturally instead of cutting a line at the component's edge.
export function LampCta({ children, className }: LampCtaProps) {
  const descentRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [lit, setLit] = useState(false);
  const [threadPath, setThreadPath] = useState<string | null>(null);

  // The thread's path is measured, not styled: it must start at the trail
  // line's exact x (24px from the content edge on mobile, center on md+)
  // and end at the lamp line's center, whatever the viewport.
  useEffect(() => {
    setMounted(true);
    const el = descentRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const startX = window.matchMedia("(min-width: 768px)").matches
        ? width / 2
        : 24;
      setThreadPath(
        `M ${startX} 0 C ${startX} ${height * 0.55}, ${width / 2} ${
          height * 0.45
        }, ${width / 2} ${height}`
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (reducedMotion) setLit(true);
  }, [reducedMotion]);

  // Drawing picks up at the offset where the trail's line finishes (its
  // bottom crossing mid-viewport) and completes with the lamp line high
  // enough that the bloom and the rising words play out in view.
  const { scrollYProgress } = useScroll({
    target: descentRef,
    offset: ["start 0.5", "end 0.35"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.95) setLit(true);
  });
  // Covers loading the page already scrolled past the arrival point.
  useEffect(() => {
    if (mounted && scrollYProgress.get() >= 0.95) setLit(true);
  }, [mounted, scrollYProgress]);

  const drawn = mounted && !reducedMotion;
  const on = !mounted || lit;

  return (
    <div
      data-lit={on ? "" : undefined}
      className={cn("group relative bg-pine-950", className)}
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-24 md:pb-32">
        {/* The descent: the trail's thread crossing from the section above
            down onto the lamp line. z-10 lifts it over the stage's spill
            bar. Before the path is measured, a plain centered line keeps
            the exported resting state threaded. */}
        <div
          ref={descentRef}
          aria-hidden="true"
          className="relative z-10 h-32 w-full md:h-40"
        >
          {threadPath ? (
            <svg
              className="absolute inset-0 size-full overflow-visible"
              fill="none"
            >
              <path
                d={threadPath}
                stroke="var(--color-pine-800)"
                strokeWidth="1"
              />
              <motion.path
                d={threadPath}
                stroke="var(--color-resin)"
                strokeWidth="1"
                style={
                  drawn
                    ? { pathLength: scrollYProgress, filter: THREAD_GLOW }
                    : { filter: THREAD_GLOW }
                }
              />
            </svg>
          ) : (
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-resin" />
          )}
        </div>

        {/* The lamp stage: the line sits on the stage's top edge — exactly
            where the thread lands — and the cone fills it. Layer geometry
            and z-order follow the stock component, re-anchored to the top
            so the section can size to its content instead of a full
            screen. */}
        <div aria-hidden="true" className="relative isolate h-56 w-full">
          <div
            style={{ backgroundImage: CONE_LEFT }}
            className={cn(
              "absolute right-1/2 top-0 h-56 [mask-composite:intersect] [mask-image:linear-gradient(to_top,transparent,black_71%),linear-gradient(to_right,transparent,black_33%)]",
              lit &&
                "transition-[width,opacity] duration-[700ms] ease-in-out-cubic",
              on
                ? "w-[17rem] opacity-100 md:w-[30rem]"
                : "w-[8.5rem] opacity-50 md:w-[15rem]"
            )}
          />
          <div
            style={{ backgroundImage: CONE_RIGHT }}
            className={cn(
              "absolute left-1/2 top-0 h-56 [mask-composite:intersect] [mask-image:linear-gradient(to_top,transparent,black_71%),linear-gradient(to_left,transparent,black_33%)]",
              lit &&
                "transition-[width,opacity] duration-[700ms] ease-in-out-cubic",
              on
                ? "w-[17rem] opacity-100 md:w-[30rem]"
                : "w-[8.5rem] opacity-50 md:w-[15rem]"
            )}
          />
          {/* Soft pine shadow across the cone's base, easing the light into
              the ground before the text reads. */}
          <div className="absolute left-1/2 top-36 h-56 w-full -translate-x-1/2 scale-x-150 bg-pine-950 blur-2xl" />
          {/* Ambient halo sitting on the line. The fade lives on a padded
              wrapper so it shades the blur's spill instead of clipping it at
              the element box, and the bloom dies inside the headroom — on
              both sides: the lower fade keeps the halo's spill off the text
              zone, where the composite must hold the plaster-muted minimum
              (the cone carries the light down instead). */}
          <div className="absolute left-1/2 top-10 z-50 -translate-x-1/2 -translate-y-1/2 p-24 [mask-image:linear-gradient(to_bottom,transparent,black_50%,black_65%,transparent_95%)]">
            <div className="h-36 w-[18rem] rounded-full bg-resin opacity-40 blur-3xl md:w-[28rem]" />
          </div>
          {/* Bright core just under the line. */}
          <div
            className={cn(
              "absolute left-1/2 top-4 z-30 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin-light blur-2xl",
              lit && "transition-[width] duration-[700ms] ease-in-out-cubic",
              on ? "w-40 md:w-64" : "w-20 md:w-32"
            )}
          />
          {/* The lamp line itself. */}
          <div
            className={cn(
              "absolute left-1/2 top-0 z-50 h-0.5 -translate-x-1/2 -translate-y-1/2 bg-resin-light",
              lit && "transition-[width] duration-[700ms] ease-in-out-cubic",
              on ? "w-[17rem] md:w-[30rem]" : "w-[8.5rem] md:w-[15rem]"
            )}
          />
          {/* Swallows the halo's spill above the line; the line (z-50) and
              a whisper of the ambient halo stay above it, as in the stock
              layering. The descent thread rides over it at z-10. */}
          <div className="absolute bottom-full left-1/2 z-40 h-44 w-[150%] -translate-x-1/2 bg-pine-950" />
        </div>

        <div className="relative z-10 -mt-24 flex w-full flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
