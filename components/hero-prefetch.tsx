"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { holdPipe, savingData, startPipeWork, tooSlowToSpeculate } from "@/lib/connection";
import { afterHeroPaint } from "@/lib/page-load";
import {
  claimHero,
  loadHero,
  PREFETCH_ORDER,
  queueHero,
  stopHero,
  type HeroLoad,
} from "@/lib/hero-prefetch";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The route this document is showing, in the map's own keys.
function currentRoute(pathname: string): string {
  let p = pathname || "/";
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  return p.endsWith("/") ? p : `${p}/`;
}

// The intent prefetch buys the press-and-release - 300 ms of finger, and on
// 4G that is most but not all of the wait. This buys the rest of it, out of
// the time the reader spends on the page they are on: once that page's own
// photograph is on the glass, the other three routes' heroes are fetched into
// the cache, in the order above.
//
// **After the page's own LCP, and before the page's own speculation.** It used
// to start at the document's `load` and race everything else that starts
// there. Measured at 390x664 over a 4.2 Mbps shared pipe on the build before
// this one: home's poster decoded at 2.43 s, and the three plates, the two
// later slides and the Earth's two skins went on the wire beside the route
// heroes - the About hero completed at 9.9 s and the FAQ hero at 14.6 s, so a
// tap inside the reader's first ten seconds was always cold and the
// destination stood on its ground colour for a second. The heroes now take
// the wire first and the page's own files wait for `groundTurn()`.
//
// Strictly one at a time, and at `low`. Three photographs in parallel is the
// reader's own pipe spent on pages nobody has asked for yet, and the file that
// matters - the first in the queue - lands three times later for it.
//
// A `<picture>` rather than a `fetch`, and the selection is why: the device is
// handed the destination's own sources and its own `sizes` and picks the
// format and the rung itself, in the window it is actually in, so the file
// this queue warms is the file the plate asks for by construction. Its load
// sequences the queue and dropping its sources stops it. Each one is decoded
// as it lands and held until its plate arrives - see lib/hero-prefetch.ts for
// why the bitmap matters.
export function HeroPrefetch() {
  const pathname = usePathname();

  useEffect(() => {
    if (savingData() || tooSlowToSpeculate()) return;
    const here = currentRoute(pathname);
    const routes = PREFETCH_ORDER.filter((href) => href !== here);

    let current: string | null = null;
    let live: HeroLoad | null = null;
    let stopped = false;
    let release: (() => void) | null = null;

    const next = (i: number) => {
      if (stopped) return;
      if (i >= routes.length) {
        release?.();
        release = null;
        return;
      }
      const href = routes[i];
      const c = claimHero(href);
      if (!c) return next(i + 1);
      current = href;
      live = loadHero(
        c,
        "low",
        () => {
          live = null;
          current = null;
          // A miss is not worth a retry, and the next route is not its fault.
          next(i + 1);
        },
        href
      );
      if (!live) next(i + 1);
    };

    // Stop, and hand back whatever is in flight for the page the reader has
    // just asked for.
    const stop = (keep: string | null) => {
      stopped = true;
      if (live && current !== keep) {
        stopHero(live, current ?? undefined);
        live = null;
      }
    };
    release = holdPipe({ stop });
    routes.forEach((href, i) => queueHero(href, i + 1));

    const off = afterHeroPaint(() => {
      if (stopped) return;
      startPipeWork();
      next(0);
    });

    return () => {
      off();
      release?.();
      // The backstop, for a route change that never went through a nav link -
      // the browser's own back button, a typed URL, a link in the page.
      stop(location.pathname);
    };
  }, [pathname]);

  return null;
}
