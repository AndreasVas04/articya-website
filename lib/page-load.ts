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

/** Run `fn` once the hero's opening is over - at once on a page whose hero is
 *  already open, and at once on a page that has no hero.
 *
 *  The Earth's renderer is the one thing the wire hands over that costs the
 *  main thread rather than the connection: evaluating three.js and linking its
 *  shader program are 24ms and 46ms of blocked renderer, and the second of
 *  them holds the thread through a synchronous flush to the GPU process. On a
 *  hard load of home both land 100-200ms after hydration, which is the reader's
 *  first notch, and the opening drops a frame there. Nothing is bought by
 *  spending them then: the Earth is a screen below a hero that holds the page
 *  at scroll 0 and answers End and PageDown with more opening, so until the
 *  release the reader cannot reach it.
 *
 *  `hero-open` is the hero's own flag, set on the frame the card becomes the
 *  window. It falls again if the reader closes the hero, so the wait latches on
 *  the first one. */
export function afterHeroOpen(fn: () => void): () => void {
  const root = document.documentElement;
  const open = () => root.classList.contains("hero-open") || !document.querySelector(".hero-plate");
  if (open()) {
    fn();
    return () => {};
  }
  let live = true;
  const watch = new MutationObserver(() => {
    if (!live || !open()) return;
    live = false;
    watch.disconnect();
    fn();
  });
  watch.observe(root, { attributes: true, attributeFilter: ["class"] });
  return () => {
    live = false;
    watch.disconnect();
  };
}

/** Run `fn` once no scroll event has arrived for `ms`. */
export function afterScrollQuiet(fn: () => void, ms: number): () => void {
  let live = true;
  let timer = 0;
  const done = () => {
    if (!live) return;
    stop();
    fn();
  };
  const restart = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(done, ms);
  };
  const stop = () => {
    live = false;
    window.clearTimeout(timer);
    window.removeEventListener("scroll", restart);
  };
  window.addEventListener("scroll", restart, { passive: true });
  restart();
  return stop;
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
