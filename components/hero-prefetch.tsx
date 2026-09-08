"use client";

import { useEffect } from "react";
import { holdPipe, savingData, tooSlowToSpeculate } from "@/lib/connection";
import { claimHero } from "@/lib/hero-prefetch";

// The order the three are fetched in.
const ROUTES = ["/about/", "/faq/", "/contact/"];

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
// `fetch` rather than a link element, for the two things a link cannot do:
// the promise is what sequences the queue, and the signal is what stops it.
// The response is cacheable (`max-age=600` from Pages), so the plate's own
// request on arrival is a cache hit and not a second download.
export function HeroPrefetch() {
  useEffect(() => {
    if (savingData() || tooSlowToSpeculate()) return;

    const controller = new AbortController();
    let current: string | null = null;
    let stopped = false;

    const next = async (i: number) => {
      if (stopped || i >= ROUTES.length) return;
      const href = ROUTES[i];
      const url = claimHero(href);
      if (!url) return next(i + 1);
      current = href;
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          priority: "low",
        } as RequestInit);
        // `fetch` settles on the headers, so awaiting it alone queues all
        // three inside 80 ms and they finish together - measured, three
        // overlapping streams rather than the one this is meant to be. The
        // body is what has to be waited on, and it is read and dropped a
        // chunk at a time: the file is wanted in the cache, never in memory.
        const reader = res.body?.getReader();
        while (reader) {
          const { done } = await reader.read();
          if (done) break;
        }
      } catch {
        // An abort or a miss ends the queue; neither is worth a retry.
        return;
      }
      current = null;
      next(i + 1);
    };

    // Stop, and hand back whatever is in flight for the page the reader has
    // just asked for.
    const stop = (keep: string | null) => {
      stopped = true;
      if (current !== keep) controller.abort();
    };
    const release = holdPipe({ stop });

    const start = () => {
      if (stopped) return;
      const idle = window.requestIdleCallback;
      if (idle) idle(() => next(0), { timeout: 3000 });
      else window.setTimeout(() => next(0), 200);
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
