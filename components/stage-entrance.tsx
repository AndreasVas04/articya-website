"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// A time-based, once-per-load section entrance. The scene arms after mount
// (never under reduced motion, so those visitors keep everything in place)
// and fires the first time it crosses into view; from that moment the
// choreography plays on the clock, not the scrollbar — a flick and a slow
// scroll get the same performance, and a scroller who blasts past still
// finds every element settled where it belongs, because the transitions run
// to their end states regardless of where the viewport went. Layer styling
// lives in globals.css under `.stage`: hidden states exist only between
// arming and the trigger, so the exported HTML and no-JS visitors always
// carry the content at rest.
export function StageScene({
  className,
  children,
  /** How far the scene must rise above the viewport bottom before it fires. */
  fireMargin = "-14%",
}: {
  className?: string;
  children: ReactNode;
  fireMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setOn(true);
      },
      { rootMargin: `0px 0px ${fireMargin} 0px` }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fireMargin]);

  return (
    <div
      ref={ref}
      className={cn("stage", className)}
      data-armed={armed ? "" : undefined}
      data-on={on ? "" : undefined}
    >
      {children}
    </div>
  );
}
