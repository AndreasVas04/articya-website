"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Globe, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn, withBasePath } from "@/lib/utils";

// Icons live here because component references can't cross the
// server/client boundary as props.
const icons = { globe: Globe, graduation: GraduationCap };

interface OfferPanelProps {
  image: string;
  title: string;
  text: string;
  icon: keyof typeof icons;
  flip?: boolean;
}

// A full-bleed photographic panel inside the home page's dark world. The
// photo drifts slightly against the scroll (disabled under reduced motion
// and before mount, so the exported HTML is the resting state), and pine
// scrims fade it into the sections above and below so the page reads as
// one continuous dusk.
export function OfferPanel({
  image,
  title,
  text,
  icon,
  flip = false,
}: OfferPanelProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const Icon = icons[icon];
  const drift = mounted && !reducedMotion;

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-[8%]"
        style={drift ? { y } : undefined}
      >
        <Image
          src={withBasePath(image)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Scrims: a base dim keeps the photo in the dusk, then a bottom-up
          wash on mobile and a directional wash on desktop carry the text. */}
      <div aria-hidden="true" className="absolute inset-0 bg-pine-950/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-pine-950 from-15% via-pine-950/60 via-50% to-pine-950/5 md:hidden"
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 hidden from-pine-950 from-22% via-pine-950/55 via-50% to-transparent md:block",
          flip ? "bg-gradient-to-l" : "bg-gradient-to-r"
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-pine-950 to-transparent md:h-32"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pine-950 to-transparent md:h-32"
      />

      <div className="relative mx-auto flex min-h-[92svh] w-full max-w-6xl items-end px-4 pb-16 pt-[46svh] md:items-center md:py-32 md:pt-32">
        <div className={cn("max-w-xl", flip && "md:ml-auto")}>
          <Reveal>
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-full border border-sage/50 bg-pine-950/60 text-sage backdrop-blur-sm"
            >
              <Icon className="size-6" strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-plaster-bright">
              {title}
            </h3>
          </Reveal>
          <Reveal delayMs={100}>
            <p className="mt-5 leading-[1.7] text-plaster-bright">{text}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
