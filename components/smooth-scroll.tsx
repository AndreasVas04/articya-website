"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Page-scoped smooth scrolling for scroll-linked galleries. Mounted by the
// pages that need it, never in the root layout: the home hero drives the
// scroll position itself and must keep native scrolling. Skipped entirely
// under reduced motion.
//
// It is a wheel device only, and that is not a preference - it is what the
// library does. With `syncTouch` off, which is the default and what this
// mounts, Lenis's own handler returns before it can touch a finger's scroll:
// it smooths the wheel and nothing else. What it does do on a phone is
// register `touchstart`/`touchmove`/`touchend` on the window with
// `{passive: false}`, unconditionally, whatever `syncTouch` says. A
// non-passive touch listener is a promise to the engine that the page may
// cancel the gesture, so WebKit cannot hand the scroll to the compositor and
// every frame of it queues behind the main thread instead - which on `/about/`
// is the frame where seven photographs are being transformed. The reader pays
// for a smoothing they were never going to get.
//
// So a touch device gets the engine's own scrolling. Measured on a phone-sized
// Chromium the two are indistinguishable - 730px of travel and ~850ms to rest
// from the same 200px flick, with Lenis, with its listeners forced passive and
// with them gone - which is the point: the cost is WebKit's and Chromium
// cannot show it, so the listener is simply not registered where it can only
// cost. On a wheel it earns its place: one 120px notch inside the finale's
// zoom is 28 sampled frames of 1-6px against a single 120px jump without it,
// and `/about/` is the only route with a choreography read off the scrollbar
// for the reader to be shown those frames of.
//
// `ontouchstart` as well as the media query, and deliberately the wider net: a
// laptop with a touchscreen reports `pointer: fine` and can still produce the
// listener's cost the moment its owner scrolls with a finger. It loses wheel
// smoothing, which is the smaller loss of the two.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) return;

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
