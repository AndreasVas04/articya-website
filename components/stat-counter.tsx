"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_DURATION_MS = 700;

interface StatCounterProps {
  num: string;
  label: string;
}

// The final number is rendered directly so the exported HTML always carries
// it; the count-up only runs client-side, once, when the stat scrolls into
// view, and not under reduced motion.
export function StatCounter({ num, label }: StatCounterProps) {
  const [display, setDisplay] = useState(num);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const match = num.match(/^(\d+)(.*)$/);
    const el = ref.current;
    if (!match || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(match[1]);
    const suffix = match[2];
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / COUNT_DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(`${Math.round(eased * target)}${suffix}`);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [num]);

  return (
    <div ref={ref} className="relative px-4 py-10 text-center md:py-12">
      {/* A soft pool of lamp light behind the numeral — an ellipse reads
          cleaner than a text-shadow, which lumps around glyph outlines. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/15 blur-[60px]"
      />
      <div className="relative font-display text-[clamp(3.25rem,8vw,6.5rem)] font-semibold leading-none text-resin">
        {display}
      </div>
      <div className="relative mt-3 text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-plaster-muted">
        {label}
      </div>
    </div>
  );
}
