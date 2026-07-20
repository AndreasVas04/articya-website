"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { Award, Compass, HandCoins, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const icons = [Compass, Users, Award, HandCoins];

// The rails dissolve at the top instead of stopping on a cut edge. The
// bottom runs full strength to the container's edge, where the lamp's
// descent thread picks it up, so the amber line crosses the junction into
// the closing section unbroken.
const RAIL_FADE = "linear-gradient(to bottom, transparent, black 7%, black)";

// The four gains as stations along a trail. An amber line draws itself down
// the path as the user scrolls, passing a lit node at each station; stations
// reveal one by one as they enter. Before mount and under reduced motion the
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
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-6 top-0 w-0.5 -translate-x-1/2 rounded-full bg-hairline md:left-1/2"
        style={{ maskImage: RAIL_FADE, WebkitMaskImage: RAIL_FADE }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-6 top-0 w-0.5 origin-top -translate-x-1/2 rounded-full bg-amber shadow-[0_0_18px_3px_color-mix(in_srgb,var(--color-amber-soft)_55%,transparent)] md:left-1/2"
        style={{
          maskImage: RAIL_FADE,
          WebkitMaskImage: RAIL_FADE,
          ...(drawn ? { scaleY: scrollYProgress } : {}),
        }}
      />

      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        const right = i % 2 === 1;
        return (
          <div
            key={item}
            className="relative grid py-10 pl-16 md:grid-cols-2 md:py-16 md:pl-0"
          >
            <span
              aria-hidden="true"
              className="absolute left-6 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-gold-wash)_75%,transparent),0_0_26px_8px_color-mix(in_srgb,var(--color-amber-soft)_55%,transparent)] md:left-1/2"
            />
            <div
              className={cn(
                right ? "md:col-start-2 md:pl-20" : "md:col-start-1 md:pr-20"
              )}
            >
              <Reveal delayMs={i * 80}>
                <div
                  className={cn(
                    "flex items-center gap-5",
                    !right && "md:flex-row-reverse"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full border border-pine/30 text-pine"
                  >
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <span
                    className={cn(
                      "font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold leading-[1.2] text-ink",
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
