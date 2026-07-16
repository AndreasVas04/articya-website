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
    <div ref={ref} className="flex items-baseline justify-between gap-6 py-5">
      <div className="font-display text-[clamp(2.75rem,5vw,4rem)] font-semibold leading-none text-resin-deep">
        {display}
      </div>
      <div className="text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-lichen">
        {label}
      </div>
    </div>
  );
}
