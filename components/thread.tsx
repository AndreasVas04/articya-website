"use client";

import { useEffect } from "react";

// One amber mark, from the hero's own eyebrow to the clearing's.
//
// The page draws an amber rule on both sides of this handover and, until now,
// deleted one and drew the other. This is the refusal to delete it: the mark
// arrives on the intro's clock at the release, holds its row in the frame
// while the page travels under it, crosses from the centre to the left margin,
// and comes to rest as the clearing's own rule. Past its arrival nothing
// changes opacity anywhere.
//
// Both stations are laid out in the markup where they have always been. Only
// one of them paints: the clearing's rule is the object that travels, and the
// hero band's rule is left as a spacer holding its own row. Without JS, and
// under reduced motion, `thread-live` never lands and each station paints
// where it stands.
//
// The hold — the stretch where the mark stays put while the document moves —
// is `station 3 − station 2`, which is a hold and therefore the one place a
// span is allowed to carry px rather than a share of the window.

// The mark's own width. Length cannot do what weight does — a longer hairline
// is a longer hairline — so this is picked for footprint: 96 × 2 is three
// times the shipped mark's area, an eighth of the heading's own ink, and it
// sits inside the family the page already draws (the hero's strike is 88 and
// the chrome's marks run 48–88).
const MARK_WIDTH = 96;

// The hero's block leaves at one and a half times the document's own rate.
// That is the smallest rate that clears it before the clearing's lead has
// settled, at every window height, and it is the largest one that leaves the
// page's fewest-glyphs frame where it already stands: past it the screen falls
// to the heading alone.
const EXIT_RATE = 0.5;

// Where an element sits in the document with every transform on the way
// discounted — the entrance translate on the clearing's column, and the mark's
// own travel, are both transforms, and neither belongs in the number they are
// measured against.
const offsetIn = (el: HTMLElement) => {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
};

export function Thread() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mark = document.querySelector<HTMLElement>("[data-thread-mark]");
    const block = document.querySelector<HTMLElement>(".hero-intro");
    if (!mark || !block) return;

    const root = document.documentElement;
    root.classList.add("thread-live");

    let stationTwo = 0;
    let stationThree = 0;
    let travel = 0;
    let hold = 0;
    let exitStop = 0;
    let raf = 0;

    const draw = () => {
      raf = 0;
      if (hold <= 0) return;
      // Until the card is the window there is no block for the mark to have
      // left, and the clearing's rule is a screen below the fold where it
      // stands. Both stay where they are.
      if (!root.classList.contains("hero-open")) {
        mark.style.translate = "";
        block.style.translate = "";
        return;
      }
      const y = window.scrollY;
      // How far the rule still is above the row it holds. It falls to zero
      // exactly as the document brings the rule to that row, so the mark comes
      // to rest as itself rather than handing over to a second object.
      const above = Math.max(stationThree - y - stationTwo, 0);
      mark.style.translate = `${((travel * above) / hold).toFixed(2)}px ${(-above).toFixed(2)}px`;
      // Clamped where the block's own foot clears the top of the window: past
      // that it is gone, and an unbounded offset only grows.
      block.style.translate = `0 ${(-EXIT_RATE * Math.min(y, exitStop)).toFixed(2)}px`;
    };

    // Layout is read here and on resize, never per frame.
    const measure = () => {
      const declared = parseFloat(
        getComputedStyle(root).getPropertyValue("--hero-station-2")
      );
      if (!Number.isFinite(declared)) return;
      const at = offsetIn(mark);
      stationTwo = declared;
      stationThree = at.y;
      // The hero band centres its rule on the window; the clearing's sits at
      // its column's left margin.
      travel = (window.innerWidth - MARK_WIDTH) / 2 - at.x;
      hold = stationThree - stationTwo;
      exitStop = window.innerHeight / (1 + EXIT_RATE);
      draw();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // The clearing's row moves when anything above it reflows, and the hero
    // publishes its own station a frame after this mounts.
    const sizes = new ResizeObserver(measure);
    sizes.observe(document.documentElement);
    // `hero-open` is the hero's own flag, so the gate above has to be told
    // when it lands rather than polling for it.
    const flags = new MutationObserver(draw);
    flags.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      sizes.disconnect();
      flags.disconnect();
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("thread-live");
      mark.style.translate = "";
      block.style.translate = "";
    };
  }, []);

  return null;
}
