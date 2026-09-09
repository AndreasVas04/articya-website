"use client";

import { useEffect } from "react";
import { holdPipe, savingData, tooSlowToSpeculate } from "@/lib/connection";
import { claimHero, loadHero, stopHero, type HeroLoad } from "@/lib/hero-prefetch";

// The order the three are fetched in.
const ROUTES = ["/about/", "/faq/", "/contact/"];

// `requestIdleCallback` does not exist in WebKit - measured `undefined` on
// WebKit 26.6, the engine behind current Safari and every iOS browser - so on
// the phone this queue has always run off the timeout below. It is 200 ms and
// not longer on purpose: what the reader is waiting for is the photograph, and
// the request is `low` priority behind whatever home is still painting.
const IDLE_FALLBACK_MS = 200;

// The intent prefetch buys the press-and-release - 300 ms of finger, and on
// 4G that is most but not all of the wait. This buys the rest of it, out of
// the time the reader spends on home before they touch anything: once home has
// finished loading and the main thread is idle, the three inner heroes are
// fetched into the cache, in the order the nav lists them.
//
// Strictly one at a time, and at `low`. Three photographs in parallel is the
// home page's own pipe spent on pages nobody has asked for yet - and the page
// they are on is still painting slides and stage plates. Sequenced, each one
// is a single low-priority stream that yields to anything the reader can see.
//
// A `<picture>` rather than a `fetch`, and the selection is why: the device is
// handed the destination's own sources and its own `sizes` and picks the
// format and the rung itself, so the file this queue warms is the file the
// plate asks for by construction. Its load sequences the queue and dropping
// its sources stops it. Each one is decoded as it lands and held until its
// plate arrives - see lib/hero-prefetch.ts for why the bitmap matters.
export function HeroPrefetch() {
  useEffect(() => {
    if (savingData() || tooSlowToSpeculate()) return;

    let current: string | null = null;
    let live: HeroLoad | null = null;
    let stopped = false;

    const next = (i: number) => {
      if (stopped || i >= ROUTES.length) return;
      const href = ROUTES[i];
      const c = claimHero(href);
      if (!c) return next(i + 1);
      current = href;
      live = loadHero(c, "low", () => {
        live = null;
        current = null;
        // A miss is not worth a retry, and the next route is not its fault.
        next(i + 1);
      });
      if (!live) next(i + 1);
    };

    // Stop, and hand back whatever is in flight for the page the reader has
    // just asked for.
    const stop = (keep: string | null) => {
      stopped = true;
      if (live && current !== keep) {
        stopHero(live);
        live = null;
      }
    };
    const release = holdPipe({ stop });

    const start = () => {
      if (stopped) return;
      const idle = window.requestIdleCallback;
      if (idle) idle(() => next(0), { timeout: 3000 });
      else window.setTimeout(() => next(0), IDLE_FALLBACK_MS);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      release();
      // The backstop, for a route change that never went through a nav link -
      // the browser's own back button, a typed URL, a link in the page.
      stop(location.pathname);
    };
  }, []);

  return null;
}
