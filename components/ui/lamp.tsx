"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

// The light the lamp lays on the ground, anchored to the line and spreading
// down and out. On the dark page this was a pair of conic wedges masked into
// a cone — a shape that only exists because darkness cuts it out. Cream has
// no darkness to cut, so the same masks read as the straight edges of a
// glowing slab. Here the light is a soft ellipse instead: it reaches its
// warmest just under the line and has faded to nothing well inside its own
// box, so it carries no edge from any angle. Painted as an explicit gradient
// rather than a blurred element, so nothing clips the falloff.
const POOL =
  "radial-gradient(ellipse 62% 52% at 50% 0%, color-mix(in srgb, var(--color-amber-soft) 42%, transparent), color-mix(in srgb, var(--color-amber-soft) 15%, transparent) 46%, transparent 78%)";

// The descending thread carries the trail line's glow with it.
const THREAD_GLOW =
  "drop-shadow(0 0 2px color-mix(in srgb, var(--color-amber) 70%, transparent)) drop-shadow(0 0 14px color-mix(in srgb, var(--color-amber-soft) 55%, transparent))";

// The blade is strongest where the node feeds it, decaying toward its ends.
// It holds near-full amber across its middle rather than peaking at a single
// point: against cream a one-point peak washes straight into the pool behind
// it and the lamp loses the bar it hangs from.
const BLADE_HOTSPOT =
  "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-amber) 45%, transparent) 16%, var(--color-amber) 50%, color-mix(in srgb, var(--color-amber) 45%, transparent) 84%, transparent)";

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
// Every layer composites on the living atmosphere: the cone halves fade to
// transparency with mask-image and nothing is painted opaque, so the lamp
// has no ground of its own and the cream runs straight through it from the
// trail above. No overflow clip here — the parent section clips, so the
// halo's spill dies naturally instead of cutting a line at the component's
// edge.
export function LampCta({ children, className }: LampCtaProps) {
  const descentRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [lit, setLit] = useState(false);
  const [threadPath, setThreadPath] = useState<string | null>(null);
  // Progress value at which the thread arrives and the lamp ignites. 0.95
  // when the page has scroll to spare, but clamped to just inside the
  // progress the page can actually deliver at its natural scroll bottom —
  // otherwise a short viewport leaves the arrival stranded past the end of
  // the scrollbar and the lamp never delivers its words.
  const arrivalRef = useRef(0.95);

  // The thread's path is measured, not styled: it must start at the trail
  // line's exact x (24px from the content edge on mobile, center on md+)
  // and end at the lamp line's center, whatever the viewport.
  useEffect(() => {
    setMounted(true);
    const el = descentRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const { width, height } = rect;
      const startX = window.matchMedia("(min-width: 768px)").matches
        ? width / 2
        : 24;
      setThreadPath(
        `M ${startX} 0 C ${startX} ${height * 0.55}, ${width / 2} ${
          height * 0.45
        }, ${width / 2} ${height}`
      );
      // Mirror useScroll's ["start 0.5", "end 0.35"] mapping to find the
      // progress reachable at max scroll, and keep the arrival a hair
      // inside it. The floor guards against a mid-load mis-measure firing
      // the lamp while the trail is still drawing.
      const vh = window.innerHeight;
      const top = rect.top + window.scrollY;
      const rangeStart = top - vh * 0.5;
      const rangeEnd = top + height - vh * 0.35;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const atBottom = (maxScroll - rangeStart) / (rangeEnd - rangeStart);
      arrivalRef.current = Math.min(0.95, Math.max(0.6, atBottom - 0.02));
    };
    measure();
    window.addEventListener("resize", measure);
    // Late-loading images can change the document height, so re-measure
    // once the page settles.
    window.addEventListener("load", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
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
    if (v >= arrivalRef.current) {
      setLit(true);
    } else if (
      v > 0.5 &&
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
    ) {
      // The document end always ignites, even if a layout shift left the
      // measured arrival stale — the words can never strand below the fold.
      setLit(true);
    }
  });
  // Covers loading the page already scrolled past the arrival point.
  useEffect(() => {
    if (mounted && scrollYProgress.get() >= arrivalRef.current) setLit(true);
  }, [mounted, scrollYProgress]);

  const drawn = mounted && !reducedMotion;
  const on = !mounted || lit;

  // Draw and arrival share the ignition's clamp, so the thread completes
  // and its endpoint node lands exactly as the lamp fires, whatever the
  // viewport. The node rides the tip in over the draw's last stretch.
  const threadDraw = useTransform(scrollYProgress, (v) =>
    Math.min(1, Math.max(0, v / arrivalRef.current))
  );
  const nodeArrival = useTransform(scrollYProgress, (v) =>
    Math.min(1, Math.max(0, (v - (arrivalRef.current - 0.2)) / 0.2))
  );

  return (
    <div
      data-lit={on ? "" : undefined}
      className={cn("group relative", className)}
    >
      {/* pb compensates the text pull-up so the page keeps its length —
          the descent's scroll progress must still clear the ignition
          threshold at natural scroll bottom on every viewport. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-32 md:pb-36">
        {/* The descent: the trail's thread crossing from the section above
            down onto the lamp line. It starts flush with the trail's last
            rail pixel — the section above carries no bottom padding — and
            owns the whole gap between the two sections, so the amber line
            is unbroken across the junction. Before the path is measured, a
            plain centered line keeps the exported resting state threaded. */}
        <div
          ref={descentRef}
          aria-hidden="true"
          className="relative z-10 h-28 w-full md:h-36"
        >
          {threadPath ? (
            <svg
              className="absolute inset-0 size-full overflow-visible"
              fill="none"
            >
              <path
                d={threadPath}
                stroke="var(--color-hairline)"
                strokeWidth="2"
              />
              <motion.path
                d={threadPath}
                stroke="var(--color-amber)"
                strokeWidth="2"
                style={
                  drawn
                    ? { pathLength: threadDraw, filter: THREAD_GLOW }
                    : { filter: THREAD_GLOW }
                }
              />
            </svg>
          ) : (
            <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-amber" />
          )}
        </div>

        {/* The lamp stage: the line sits on the stage's top edge — exactly
            where the thread lands — and the light falls from it. Re-anchored
            to the top so the section can size to its content instead of a
            full screen. */}
        <div aria-hidden="true" className="relative isolate h-56 w-full">
          {/* The pool carries the light through the text zone: warmest in
              the short throat above the paragraph, then a long fade the
              paragraph and headline stand inside, gone by the button. The
              wash only warms the cream it sits on — it never darkens it —
              so ink keeps its contrast wherever the words land and needs no
              shading behind the glyphs. Widening it is the ignition: the
              light opens from the point the thread arrived at. */}
          <div
            style={{ backgroundImage: POOL }}
            className={cn(
              "absolute left-1/2 top-0 h-80 -translate-x-1/2",
              lit &&
                "transition-[width,opacity] duration-[700ms] ease-in-out-cubic",
              on
                ? "w-[34rem] max-w-[100vw] opacity-100 md:w-[60rem]"
                : "w-[17rem] max-w-[100vw] opacity-50 md:w-[30rem]"
            )}
          />
          {/* The source's own bloom, sitting tight on the line. The fade
              lives on a padded wrapper so it shades the blur's spill instead
              of clipping it at the element box, and it dies inside the
              headroom on both sides — a whisper above the line, gone before
              the paragraph, where the pool alone carries the warmth. */}
          <div className="absolute left-1/2 top-2 z-30 -translate-x-1/2 -translate-y-1/2 p-20 [mask-image:linear-gradient(to_bottom,transparent_18%,black_46%,black_56%,transparent_84%)]">
            <div
              className={cn(
                "h-20 rounded-full bg-amber-soft opacity-40 blur-2xl",
                lit && "transition-[width] duration-[700ms] ease-in-out-cubic",
                on ? "w-52 md:w-80" : "w-24 md:w-40"
              )}
            />
          </div>
          {/* The lamp line itself, brightest at its center where the node
              feeds it. */}
          <div
            style={{ backgroundImage: BLADE_HOTSPOT }}
            className={cn(
              "absolute left-1/2 top-0 z-50 h-0.5 -translate-x-1/2 -translate-y-1/2",
              lit && "transition-[width] duration-[700ms] ease-in-out-cubic",
              on ? "w-[17rem] md:w-[30rem]" : "w-[8.5rem] md:w-[15rem]"
            )}
          />
          {/* The trail's final stop: a node in the gains' dot vocabulary,
              landing where the thread meets the blade. It arrives as the
              thread's endpoint and kicks once at ignition — the bloom
              visibly leaves it. */}
          <span className="absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-1/2">
            <motion.span
              className="relative block"
              style={drawn ? { opacity: nodeArrival, scale: nodeArrival } : undefined}
            >
              <span
                className={cn(
                  "absolute -inset-2 rounded-full bg-amber opacity-0 blur-md",
                  lit && "animate-[node-flare-glow_400ms_var(--ease-out-quart)]"
                )}
              />
              <span
                className={cn(
                  "relative block size-3.5 rounded-full bg-amber shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-base)_75%,transparent),0_0_26px_8px_color-mix(in_srgb,var(--color-amber-soft)_55%,transparent)]",
                  lit && "animate-[node-flare_400ms_var(--ease-out-quart)]"
                )}
              />
            </motion.span>
          </span>
        </div>

        {/* The words live inside the pool: pulled up so the paragraph sits
            in the pool's upper-to-mid band and the headline in its warm
            middle, with only the button reaching the dying edge. */}
        <div className="relative z-10 -mt-40 flex w-full flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
