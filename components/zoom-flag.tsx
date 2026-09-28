"use client";

import { useEffect } from "react";
import { watchZoom } from "@/lib/viewport";

// Above this page scale the reader is zoomed in. Below 1 is not a zoom: it is
// the rubber band a fast pinch-out swings through on its way back to 1.
const ZOOMED_IN = 1.01;
// How long the page has to be completely still before the flag comes off: no
// finger on the glass, no scroll, no change of scale.
const SETTLE_OUT_MS = 800;
// How long the page has to have been still for a new one-finger touch to be
// taken as an ordinary scroll on a page at rest, rather than as the same
// gesture going on.
const REST_MS = 500;
// A count of fingers this old is not believed. A touch whose end never
// arrived must not hold the flag for the life of the page.
const STALE_TOUCH_MS = 10_000;

// The top of the box the stage is laid out in, in the document: its nearest
// positioned ancestor, or the page itself.
function containerTop(stage: HTMLElement): number {
  let box = stage.parentElement;
  while (box && box !== document.body && getComputedStyle(box).position === "static") {
    box = box.parentElement;
  }
  if (!box || box === document.body) return 0;
  let top = 0;
  for (let el: HTMLElement | null = box; el; el = el.offsetParent as HTMLElement | null) {
    top += el.offsetTop;
  }
  return top;
}

// `data-zoomed` on the document for the whole of a pinch, so a stylesheet can
// stand down what a zoom makes expensive. On a phone a page that asks the
// compositor for more than it can hold is killed, and a zoom is where a page
// asks for the most.
//
// What it costs is set by WebKit, not by the scale. The page is not drawn at
// a new scale until the gesture is over and the page is at rest; until then
// every layer is drawn at the scale the gesture *started* from. On the way out
// of a full zoom that is 5x - 15 device pixels to the CSS pixel - over a
// window growing back to the whole screen, about 230 MB for each full-window
// layer in view. So the flag has two edges to get right, and both are about
// the gesture rather than about the scale:
//
// - **On before the scale moves.** It goes on at the second finger, before a
//   pinch has changed anything, so the layers leave while the page is still
//   drawn at 1x, where leaving is cheap. A scale above 1 with no pinch behind
//   it - a double tap - puts it on as well.
// - **Off only at rest.** It comes off 800 ms after the last sign of a
//   gesture - a finger landing, moving or lifting, the page scrolling, the
//   scale changing - and only with no finger down and the scale back at 1.
//   It used to come off 800 ms after the scale first read 1. A fast pinch
//   crosses 1 into the rubber band with the fingers still down, and the band
//   is still springing back when they lift, so the page could still be drawn
//   at 5x when the flag came off - and then every layer the flag had taken
//   away came back at 5x at once.
//
// One thing takes it off sooner: a single finger landing on a page that has
// been still for half a second at 1. That is an ordinary scroll starting on a
// page at rest, and it gets the fixed stage back - the stage the flag lays out
// in the page scrolls with it until it is placed again, which reads as a
// picture swimming under the words.
//
// `watchZoom` stays subscribed for the one case no event covers: the scale
// coming back to 1 with nothing behind it, which its clock catches.
export function ZoomFlag() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;
    const scale = () => vv?.scale ?? 1;
    let fingers = 0;
    let touchedAt = 0;
    let lastSign = 0;
    let on = false;
    let settle = 0;
    let frame = 0;
    let base = 0;
    let baseOf: HTMLElement | null = null;

    // Where the stage stands while it is out of the fixed layer: the top of the
    // layout viewport, which is what a fixed box is laid out against, measured
    // in the box the stage is placed in. A route can change under a zoom, so
    // the stage is looked up each time and its box measured once per stage.
    const place = () => {
      frame = 0;
      if (!on) return;
      const stage = document.querySelector<HTMLElement>(".photo-stage");
      if (!stage) return;
      if (stage !== baseOf) {
        base = containerTop(stage);
        baseOf = stage;
      }
      const layoutTop = vv ? vv.pageTop - vv.offsetTop : window.scrollY;
      root.style.setProperty("--zoom-stage-top", `${(layoutTop - base).toFixed(2)}px`);
    };

    // Whether a gesture still holds the page: a finger down, or a scale.
    const holding = () =>
      scale() > ZOOMED_IN || (fingers > 0 && performance.now() - touchedAt < STALE_TOUCH_MS);

    const release = () => {
      on = false;
      window.clearTimeout(settle);
      settle = 0;
      root.removeAttribute("data-zoomed");
      root.style.removeProperty("--zoom-stage-top");
      baseOf = null;
    };

    // Every sign of a gesture. Off, it is a read of two numbers and nothing
    // else; on, it places the stage again and puts the end of the rest back by
    // the whole of it.
    const stir = () => {
      lastSign = performance.now();
      if (!on) {
        if (fingers < 2 && scale() <= ZOOMED_IN) return;
        on = true;
        // Placed before the flag, so the first frame of it is already right.
        place();
        root.setAttribute("data-zoomed", "");
      } else if (!frame) {
        frame = requestAnimationFrame(place);
      }
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        settle = 0;
        // Still held: the next sign of the gesture ending sets the clock again.
        if (!holding()) release();
      }, SETTLE_OUT_MS);
    };

    const onTouch = (event: TouchEvent) => {
      const before = fingers;
      fingers = event.touches.length;
      touchedAt = performance.now();
      if (
        on &&
        event.type === "touchstart" &&
        before === 0 &&
        fingers === 1 &&
        scale() <= ZOOMED_IN &&
        touchedAt - lastSign >= REST_MS
      ) {
        lastSign = touchedAt;
        release();
        return;
      }
      stir();
    };

    // A page can arrive already zoomed, and `watchZoom` tells a new
    // subscriber only about a change, so the first state is read here.
    stir();
    const off = watchZoom(stir);
    const touch = { capture: true, passive: true } as const;
    window.addEventListener("touchstart", onTouch, touch);
    window.addEventListener("touchmove", onTouch, touch);
    window.addEventListener("touchend", onTouch, touch);
    window.addEventListener("touchcancel", onTouch, touch);
    window.addEventListener("scroll", stir, { passive: true });
    vv?.addEventListener("resize", stir);
    vv?.addEventListener("scroll", stir);
    return () => {
      off();
      window.removeEventListener("touchstart", onTouch, touch);
      window.removeEventListener("touchmove", onTouch, touch);
      window.removeEventListener("touchend", onTouch, touch);
      window.removeEventListener("touchcancel", onTouch, touch);
      window.removeEventListener("scroll", stir);
      vv?.removeEventListener("resize", stir);
      vv?.removeEventListener("scroll", stir);
      if (frame) cancelAnimationFrame(frame);
      release();
    };
  }, []);

  return null;
}
