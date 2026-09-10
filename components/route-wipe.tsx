"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { holdRoute } from "@/lib/route-wipe";

// How long the wipe waits for the destination's photograph before it goes
// over the ground instead - and what it waits for is the 24px placeholder,
// which is inline in the document and decodes inside a frame. It used to wait
// for the rung: a 700-900KB download, up to 300 ms of the reader held on the
// page they were leaving, and four rounds of prefetch could not move it,
// because the hold was never on the file. The rung lands under the wipe
// whenever it lands. This is the guard for an engine that has not decoded a
// kilobyte of AVIF by the next frame, not a budget.
const GROUND_WAIT_MS = 100;
// How long the new route has to commit before the wipe is abandoned and the
// change lands the plain way. The route's own chunk and payload are
// prefetched on intent, so this is a guard and not a budget.
const ARRIVE_WAIT_MS = 1500;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// The app-relative path of an internal link, or null for anything the router
// should not take: another origin, a new tab, a download, the route we are on.
function routeOf(a: HTMLAnchorElement): string | null {
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return null;
  if (!/^https?:$/.test(url.protocol)) return null;
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download")) return null;
  if (url.pathname === location.pathname) return null;
  let path = url.pathname;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || "/";
  return path + url.search + url.hash;
}

// The destination's own ground: the photograph at 24px that every route paints
// under its hero from its first frame. Resolves when it is decoded, or after
// GROUND_WAIT_MS, whichever is first. A route that carries no placeholder -
// the 404 - has nothing to wait for and the wipe starts at once.
async function heroGrounded() {
  const img = document.querySelector<HTMLImageElement>(
    "main [data-photo-placeholder] img"
  );
  if (!img) return;
  await Promise.race([img.decode().catch(() => undefined), sleep(GROUND_WAIT_MS)]);
}

// Resolved by the layout effect below on the commit that changes the path.
let arrive: (() => void) | null = null;

// Route changes in the site's own language. Where the View Transitions API
// exists and motion is not reduced, an internal link is taken through
// `document.startViewTransition`: the old page is held on the glass while
// the new route commits and its photograph decodes, then the new page wipes
// over it top to bottom - the mask and its clock are in globals.css - with
// the header carried across as its own snapshot so it never moves. Where the
// API is missing, or motion is reduced, nothing here runs and the link is
// Next's as before.
//
// It listens on the document in the capture phase so it runs before Next's
// own click handler, which steps aside on a prevented event; the navigation
// is then the router's, inside the transition's update callback.
export function RouteWipe() {
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    arrive?.();
    arrive = null;
  }, [pathname]);

  useEffect(() => {
    if (!("startViewTransition" in document)) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = routeOf(a);
      if (!href) return;
      e.preventDefault();

      let late = false;
      const transition = document.startViewTransition(async () => {
        const arrived = new Promise<void>((resolve) => {
          arrive = resolve;
        });
        router.push(href);
        await Promise.race([arrived, sleep(ARRIVE_WAIT_MS).then(() => { late = true; })]);
        arrive = null;
        if (late) {
          transition.skipTransition();
          return;
        }
        await heroGrounded();
      });
      holdRoute(transition.finished);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
