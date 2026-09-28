"use client";

import { useEffect } from "react";
import { watchZoom, zoomTest } from "@/lib/viewport";

// Above this page scale the reader is zoomed in. Below 1 is not a zoom: it is
// the rubber band a fast pinch-out swings through on its way back to 1.
const ZOOMED_IN = 1.01;
// How long the page has to be completely still before the flag comes off: no
// finger on the glass, no scroll, no change of scale.
const SETTLE_OUT_MS = 800;
// A count of fingers this old is not believed. A touch whose end never
// arrived must not hold the flag for the life of the page.
const STALE_TOUCH_MS = 10_000;

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
// `watchZoom` stays subscribed for the one case no event covers: the scale
// coming back to 1 with nothing behind it, which its clock catches.
export function ZoomFlag() {
  useEffect(() => {
    const root = document.documentElement;
    // `?zoomtest=masks,filters` - the switches in globals.css that take one
    // kind of layer off the page at a time, to find which of them a deep zoom
    // cannot afford. A diagnostic: nothing reads it without the parameter.
    const tests = new URLSearchParams(location.search).get("zoomtest");
    if (tests) root.dataset.zoomtest = tests.split(",").join(" ");
    // `noflag`: the page as it was before the flag, for comparison.
    if (zoomTest("noflag")) return;

    const vv = window.visualViewport;
    const scale = () => vv?.scale ?? 1;
    let fingers = 0;
    let touchedAt = 0;
    let on = false;
    let settle = 0;

    // Whether a gesture still holds the page: a finger down, or a scale.
    const holding = () =>
      scale() > ZOOMED_IN || (fingers > 0 && performance.now() - touchedAt < STALE_TOUCH_MS);

    const release = () => {
      settle = 0;
      // Still held: the next sign of the gesture ending sets the clock again.
      if (holding()) return;
      on = false;
      root.removeAttribute("data-zoomed");
    };

    // Every sign of a gesture. Off, it is a read of two numbers and nothing
    // else; on, it puts the end of the rest back by the whole of it.
    const stir = () => {
      if (!on) {
        if (fingers < 2 && scale() <= ZOOMED_IN) return;
        on = true;
        root.setAttribute("data-zoomed", "");
      }
      window.clearTimeout(settle);
      settle = window.setTimeout(release, SETTLE_OUT_MS);
    };

    const onTouch = (event: TouchEvent) => {
      fingers = event.touches.length;
      touchedAt = performance.now();
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
      window.clearTimeout(settle);
      root.removeAttribute("data-zoomed");
    };
  }, []);

  return null;
}
