"use client";

import { useEffect } from "react";

// The hero's intro block leaves at one and a half times the document's own
// rate once the card is the window. That is the smallest rate that clears it
// before the clearing's lead has settled, at every window height, and the
// largest one that leaves the page's fewest-glyphs frame where it already
// stands: past it the screen falls to the heading alone.
//
// The band's rule goes with it. It is laid out in the band, arrives on the
// band's clock and leaves at the band's rate, and nothing below the hero
// inherits it: the clearing draws a rule of its own where it stands.
const EXIT_RATE = 0.5;

export function IntroExit() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const block = document.querySelector<HTMLElement>(".hero-intro");
    if (!block) return;

    const root = document.documentElement;
    let exitStop = 0;
    let raf = 0;

    const draw = () => {
      raf = 0;
      // Until the card is the window there is no block to have left.
      if (!root.classList.contains("hero-open")) {
        block.style.translate = "";
        return;
      }
      // Clamped where the block's own foot clears the top of the window: past
      // that it is gone, and an unbounded offset only grows.
      block.style.translate = `0 ${(-EXIT_RATE * Math.min(window.scrollY, exitStop)).toFixed(2)}px`;
    };

    const measure = () => {
      exitStop = window.innerHeight / (1 + EXIT_RATE);
      draw();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // `hero-open` is the hero's own flag, so the gate above has to be told
    // when it lands rather than polling for it.
    const flags = new MutationObserver(draw);
    flags.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      flags.disconnect();
      if (raf) cancelAnimationFrame(raf);
      block.style.translate = "";
    };
  }, []);

  return null;
}
