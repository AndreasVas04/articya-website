"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Page-scoped smooth scrolling for scroll-linked galleries. Mounted by the
// pages that need it, never in the root layout: the home hero drives the
// scroll position itself and must keep native scrolling. Skipped entirely
// under reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis();
    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
