"use client";

import { useEffect, useLayoutEffect, useState } from "react";

// Whether the document's own load has finished, and a way to wait for it.
//
// The home page asked for everything at once. The poster is the page's first
// picture, and beside it on the wire from the first frame were the three stage
// plates a screen and more below, the two slides that follow the poster in the
// card, and the Earth's renderer with its skins - 3.3MB of files the reader
// cannot see for seconds, sharing the one connection with the 350KB they are
// looking at. Every one of them is wanted, and none of them before the poster
// has landed; `load` is the frame on which it has, along with the fonts, the
// styles and the scripts the page cannot paint without.
//
// A route reached through the router has long since loaded, and everything
// gated here runs at once, as it did before.
const loaded = () => typeof document !== "undefined" && document.readyState === "complete";

/** Run `fn` once the document has loaded - now, if it already has. Returns the
 *  teardown, which is a no-op once `fn` has run. */
export function afterPageLoad(fn: () => void): () => void {
  if (loaded()) {
    fn();
    return () => {};
  }
  const once = () => fn();
  window.addEventListener("load", once, { once: true });
  return () => window.removeEventListener("load", once);
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** True once the document has loaded. False on the server and on the first
 *  client render, so the markup hydrates as it was exported; flips before the
 *  paint on a document that has already loaded. */
export function usePageLoaded(): boolean {
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => afterPageLoad(() => setReady(true)), []);
  return ready;
}
