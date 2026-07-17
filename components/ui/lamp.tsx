"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The two halves of the light cone. Painted as explicit conic gradients so
// the component never depends on Tailwind's gradient plumbing; the color is
// always the resin token.
const CONE_LEFT =
  "conic-gradient(from 70deg at center top, color-mix(in srgb, var(--color-resin) 85%, transparent), transparent, transparent)";
const CONE_RIGHT =
  "conic-gradient(from 290deg at center top, transparent, transparent, color-mix(in srgb, var(--color-resin) 85%, transparent))";

interface LampCtaProps {
  children: React.ReactNode;
  className?: string;
}

// The page's one light shown at its source: a resin lamp line whose cone
// widens as the section scrolls into view, delivering the closing words
// inside the glow. Ignition is a one-shot IntersectionObserver flip with CSS
// transitions (same pattern as Reveal): the lit state is the default, so
// exported HTML and reduced-motion users get the lamp fully on, and the
// unlit state is only applied after mount. Children opt into the ignition
// via group-data-[lit] classes, exactly like the hero's expanded state.
//
// The cone halves fade to transparency with mask-image instead of the stock
// component's opaque cover bars, so they composite on any ground. The two
// remaining opaque layers (the bar above the line and the soft flattener at
// the cone's base) are pine-950 on the section's flat pine-950 ground, and
// the film grain is painted over them, so neither can read as a box.
export function LampCta({ children, className }: LampCtaProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setLit(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const on = !mounted || lit;

  return (
    <div
      ref={ref}
      data-lit={on ? "" : undefined}
      className={cn("group relative overflow-hidden bg-pine-950", className)}
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-24 pt-28 md:pb-32 md:pt-36">
        {/* The lamp stage: the line sits on the stage's top edge and the
            cone fills it. Layer geometry and z-order follow the stock
            component, re-anchored to the top so the section can size to
            its content instead of a full screen. */}
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
              the element box, and the bloom dies inside the headroom. */}
          <div className="absolute left-1/2 top-10 z-50 -translate-x-1/2 -translate-y-1/2 p-24 [mask-image:linear-gradient(to_bottom,transparent,black_50%)]">
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
              layering. */}
          <div className="absolute bottom-full left-1/2 z-40 h-44 w-[150%] -translate-x-1/2 bg-pine-950" />
        </div>

        <div className="relative z-10 -mt-24 flex w-full flex-col items-center">
          {children}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="film-grain pointer-events-none absolute inset-0"
      />
    </div>
  );
}
