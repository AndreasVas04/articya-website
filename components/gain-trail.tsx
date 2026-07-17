"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Award, Compass, HandCoins, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const icons = [Compass, Users, Award, HandCoins];

// The four gains as stations along a trail. A resin line draws itself down
// the path as the user scrolls, passing a glowing node at each station;
// stations reveal one by one. Before mount and under reduced motion the
// line renders fully drawn, so exported HTML and reduced-motion users get
// the resting state.
export function GainTrail({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });

  const drawn = mounted && !reducedMotion;

  return (
    <div ref={ref} className="relative">
      {/* The line runs to the container's very bottom: the lamp section
          below picks it up at the same x and carries it down to the lamp
          line, so the trail and the lamp read as one thread. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-6 top-0 w-px bg-pine-800 md:left-1/2 md:-translate-x-1/2"
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-6 top-0 w-px origin-top bg-resin shadow-[0_0_40px_2px_color-mix(in_srgb,var(--color-resin)_55%,transparent)] md:left-1/2 md:-translate-x-1/2"
        style={drawn ? { scaleY: scrollYProgress } : undefined}
      />

      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        const right = i % 2 === 1;
        return (
          <div
            key={item}
            className="relative grid py-8 pl-16 md:grid-cols-2 md:py-14 md:pl-0"
          >
            <span
              aria-hidden="true"
              className="absolute left-6 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin shadow-[0_0_40px_6px_color-mix(in_srgb,var(--color-resin)_45%,transparent)] ring-4 ring-pine-950 md:left-1/2"
            />
            <div
              className={cn(
                right ? "md:col-start-2 md:pl-20" : "md:col-start-1 md:pr-20"
              )}
            >
              <Reveal>
                <div
                  className={cn(
                    "flex items-center gap-5",
                    !right && "md:flex-row-reverse"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sage/50 text-sage"
                  >
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <span
                    className={cn(
                      "font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold leading-[1.2] text-plaster-bright",
                      !right && "md:text-right"
                    )}
                  >
                    {item}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        );
      })}
    </div>
  );
}
