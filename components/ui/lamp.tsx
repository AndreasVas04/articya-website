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

// The blade is brightest where the node feeds it, decaying toward its ends.
const BLADE_HOTSPOT =
  "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-plaster-bright) 85%, transparent) 50%, transparent)";

// Local attenuation behind the text lines only: soft pine bands where the
// glyphs sit, easing off in the gap between paragraph and headline so the
// pool visibly threads through the words. The band positions track each
// breakpoint's line layout, so the profile comes in a mobile and a desktop
// variant; a horizontal mask fades both out sideways well inside the
// pool's width — never a box, never total darkness.
const shadeStop = (pct: number) =>
  `color-mix(in srgb, var(--color-pine-950) ${pct}%, transparent)`;
const TEXT_SHADE_MOBILE = `linear-gradient(to bottom, transparent 2%, ${shadeStop(
  66
)} 10%, ${shadeStop(70)} 41%, ${shadeStop(26)} 49%, ${shadeStop(
  34
)} 60%, ${shadeStop(34)} 90%, transparent 98%)`;
const TEXT_SHADE_DESKTOP = `linear-gradient(to bottom, transparent 2%, ${shadeStop(
  66
)} 9.5%, ${shadeStop(70)} 24%, ${shadeStop(26)} 30%, ${shadeStop(
  34
)} 40%, ${shadeStop(34)} 92%, transparent 100%)`;

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
// component's opaque cover bars, so they composite on any ground. The one
// remaining opaque layer (the bar above the line) is pine-950 on the
// section's flat pine-950 ground, and the section's film grain is painted
// over it, so it can never read as a box. No overflow clip here — the
// parent section clips, so the halo's spill dies naturally instead of
// cutting a line at the component's edge.
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
      className={cn("group relative bg-pine-950", className)}
    >
      {/* pb compensates the text pull-up so the page keeps its length —
          the descent's scroll progress must still clear the ignition
          threshold at natural scroll bottom on every viewport. */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-32 md:pb-36">
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
                    ? { pathLength: threadDraw, filter: THREAD_GLOW }
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
          {/* The cone halves carry the pool through the text zone: full
              strength in the short throat above the paragraph, then a long
              mid-band the paragraph and headline sit inside, dying at the
              button — the words are in the light, and the TEXT_SHADE layer
              plus this curve hold the composite floors behind the glyphs. */}
          <div
            style={{ backgroundImage: CONE_LEFT }}
            className={cn(
              "absolute right-1/2 top-0 h-80 [mask-composite:intersect] [mask-image:linear-gradient(to_top,transparent_5%,rgb(0_0_0/0.1)_22%,rgb(0_0_0/0.3)_60%,rgb(0_0_0/0.38)_82%,black_90%),linear-gradient(to_right,transparent,black_33%)]",
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
              "absolute left-1/2 top-0 h-80 [mask-composite:intersect] [mask-image:linear-gradient(to_top,transparent_5%,rgb(0_0_0/0.1)_22%,rgb(0_0_0/0.3)_60%,rgb(0_0_0/0.38)_82%,black_90%),linear-gradient(to_left,transparent,black_33%)]",
              lit &&
                "transition-[width,opacity] duration-[700ms] ease-in-out-cubic",
              on
                ? "w-[17rem] opacity-100 md:w-[30rem]"
                : "w-[8.5rem] opacity-50 md:w-[15rem]"
            )}
          />
          {/* Ambient halo sitting on the line. The fade lives on a padded
              wrapper so it shades the blur's spill instead of clipping it at
              the element box, and the bloom dies inside the headroom — on
              both sides: the lower fade lets the halo reach the paragraph
              (the pool wraps the words now) but be gone before the
              headline's lower lines, where the cone alone carries the
              warmth. */}
          <div className="absolute left-1/2 top-10 z-50 -translate-x-1/2 -translate-y-1/2 p-24 [mask-image:linear-gradient(to_bottom,transparent,black_48%,black_54%,transparent_76%)]">
            <div className="h-36 w-[18rem] rounded-full bg-resin opacity-40 blur-3xl md:w-[28rem]" />
          </div>
          {/* Bright core just under the line — kept short so its blur
              spill dies above the paragraph band. */}
          <div
            className={cn(
              "absolute left-1/2 top-3 z-30 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin-light blur-2xl",
              lit && "transition-[width] duration-[700ms] ease-in-out-cubic",
              on ? "w-40 md:w-64" : "w-20 md:w-32"
            )}
          />
          {/* The lamp line itself, brightest at its center where the node
              feeds it. */}
          <div
            style={{ backgroundImage: BLADE_HOTSPOT }}
            className={cn(
              "absolute left-1/2 top-0 z-50 h-0.5 -translate-x-1/2 -translate-y-1/2 bg-resin-light",
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
                  "absolute -inset-2 rounded-full bg-resin opacity-0 blur-md",
                  lit && "animate-[node-flare-glow_400ms_var(--ease-out-quart)]"
                )}
              />
              <span
                className={cn(
                  "relative block size-3 rounded-full bg-resin shadow-[0_0_40px_6px_color-mix(in_srgb,var(--color-resin)_45%,transparent)] ring-4 ring-pine-950",
                  lit && "animate-[node-flare_400ms_var(--ease-out-quart)]"
                )}
              />
            </motion.span>
          </span>
          {/* Swallows the halo's spill above the line; the line (z-50) and
              a whisper of the ambient halo stay above it, as in the stock
              layering. The descent thread rides over it at z-10. */}
          <div className="absolute bottom-full left-1/2 z-40 h-44 w-[150%] -translate-x-1/2 bg-pine-950" />
        </div>

        {/* The words live inside the pool: pulled up so the paragraph sits
            in the pool's upper-to-mid band and the headline in its warm
            middle, with only the button reaching the dying edge. The shade
            layer sits under the text (-z-10 inside this stacking context,
            above the whole stage) to hold the contrast floors. */}
        <div className="relative z-10 -mt-40 flex w-full flex-col items-center">
          <div
            aria-hidden="true"
            style={{ backgroundImage: TEXT_SHADE_MOBILE }}
            className="absolute -top-6 left-1/2 -z-10 h-[13rem] w-[26rem] max-w-full -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] md:hidden"
          />
          <div
            aria-hidden="true"
            style={{ backgroundImage: TEXT_SHADE_DESKTOP }}
            className="absolute -top-6 left-1/2 -z-10 hidden h-[15rem] w-[46rem] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)] md:block"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
