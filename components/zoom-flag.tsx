"use client";

import { useEffect } from "react";
import { watchZoom, zoomTest } from "@/lib/viewport";

// Above this page scale the reader is zoomed in. Below 1 is not a zoom: it is
// the rubber band a fast pinch-out swings through on its way back to 1.
const ZOOMED_IN = 1.01;
// How long the scale has to stay at 1 before the flag comes off.
const SETTLE_OUT_MS = 800;

// `data-zoomed` on the document while the reader holds a page scale, so a
// stylesheet can stand down what a zoom makes expensive. Under a pinch iOS
// re-rasters every composited layer at the new scale - the memory goes with
// the square of it - and on a phone a page that asks for more than the
// compositor can hold is killed. `watchZoom` decides when a scale is held,
// on a clock as well as on an event, so the flag cannot outlive the zoom.
//
// It goes on at once and comes off late. The way out of a deep zoom is where
// the phone was dying: Safari is rebuilding every layer it drew at 5x, and a
// fast pinch swings the scale below 1 and back, through the band `watchZoom`
// calls held on both sides of 1. Following it frame by frame took the dither
// layers off and put them back several times inside that swing. The layers
// return once, 800 ms after the scale has come to rest at 1.
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

    let settle = 0;
    const update = () => {
      if ((window.visualViewport?.scale ?? 1) > ZOOMED_IN) {
        window.clearTimeout(settle);
        settle = 0;
        root.setAttribute("data-zoomed", "");
        return;
      }
      if (settle || !root.hasAttribute("data-zoomed")) return;
      settle = window.setTimeout(() => {
        settle = 0;
        if ((window.visualViewport?.scale ?? 1) <= ZOOMED_IN) root.removeAttribute("data-zoomed");
      }, SETTLE_OUT_MS);
    };
    // `watchZoom` tells a new subscriber only about a change, and a page can
    // arrive already zoomed, so the first state is read here.
    update();
    const off = watchZoom(update);
    return () => {
      off();
      window.clearTimeout(settle);
      root.removeAttribute("data-zoomed");
    };
  }, []);

  return null;
}
