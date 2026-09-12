"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { groundTurn, onGroundTurn } from "@/lib/connection";

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

// The page's own photograph on the glass, which is later than the load event
// on nothing and earlier than it on every slow link: the poster is the last
// file home's load waits on, and an inner route's hero the last file its own
// load waits on, so the two land together at 4 Mbps and a second apart at
// 1.6. What follows the photograph is speculation - the other routes' heroes,
// then the page's own plates - and it is sequenced from here rather than from
// `load` so that on the slow link it starts a second sooner and on no link
// does it start before the reader has their picture.
//
// A route with no high-priority image - the 404 - falls back to the load.
export function afterHeroPaint(fn: () => void): () => void {
  let live = true;
  const once = () => {
    if (!live) return;
    live = false;
    fn();
  };
  const img = document.querySelector<HTMLImageElement>('main img[fetchpriority="high"]');
  if (!img) return afterPageLoad(once);
  // `decode()` waits for the load as well as the decode, and settles either
  // way on a broken file; a miss must not hold the queue for the session.
  img.decode().then(once, once);
  return () => {
    live = false;
  };
}

/** Run `fn` once the document has loaded and the route heroes have had the
 *  wire. The Earth's renderer and its skins are 1MB of a screen the reader has
 *  not reached, so they take their turn with the plates. */
export function afterGroundTurn(fn: () => void): () => void {
  let live = true;
  let offTurn: (() => void) | null = null;
  const run = () => {
    if (!live) return;
    live = false;
    offTurn?.();
    fn();
  };
  const offLoad = afterPageLoad(() => {
    if (groundTurn()) run();
    else offTurn = onGroundTurn(run);
  });
  return () => {
    live = false;
    offLoad();
    offTurn?.();
  };
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

/** True once the page's own speculative files may be asked for: the document
 *  has loaded and the route heroes have had their turn on the wire (see
 *  `groundTurn` in lib/connection.ts). Read during render, so a commit that
 *  registers the queue can never let a plate through beside it. */
export function useGroundTurn(): boolean {
  const loaded = usePageLoaded();
  const turn = useSyncExternalStore(onGroundTurn, groundTurn, () => false);
  // Latched: a route change registers a new queue, and a file this page has
  // already been given must not be taken away from it again.
  const [passed, setPassed] = useState(false);
  if (loaded && turn && !passed) setPassed(true);
  return passed;
}
