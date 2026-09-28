"use client";

import { useEffect } from "react";
import { pageZoomed, watchZoom } from "@/lib/viewport";

// `data-zoomed` on the document while the reader holds a page scale, so a
// stylesheet can stand down what a zoom makes expensive. Under a pinch iOS
// re-rasters every composited layer at the new scale - the memory goes with
// the square of it - and on a phone a page that asks for more than the
// compositor can hold goes black. `watchZoom` decides when a scale is held,
// on a clock as well as on an event, so the flag cannot outlive the zoom.
export function ZoomFlag() {
  useEffect(() => {
    const root = document.documentElement;
    const flag = (held: boolean) => root.toggleAttribute("data-zoomed", held);
    // `watchZoom` tells a new subscriber only about a change, and a page can
    // arrive already zoomed, so the first state is read here.
    flag(pageZoomed());
    const off = watchZoom(flag);
    return () => {
      off();
      root.removeAttribute("data-zoomed");
    };
  }, []);

  return null;
}
