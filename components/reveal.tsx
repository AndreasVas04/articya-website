"use client";

import { useEffect, useRef, useState } from "react";
import { routeSettled } from "@/lib/route-wipe";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

// Rises 24px into place the first time it scrolls into view. The hidden
// state is only applied after mount so the exported HTML stays visible,
// and reduced motion skips the effect entirely.
export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
      },
      { threshold: 0.2 }
    );
    // On a route change the block enters after the wipe has uncovered it,
    // not underneath the old page's snapshot.
    let gone = false;
    routeSettled().then(() => {
      if (!gone) observer.observe(el);
    });
    return () => {
      gone = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={cn(
        "duration-[400ms] ease-out-quart",
        shown && "transition-[opacity,transform]",
        mounted && !shown && "translate-y-6 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
