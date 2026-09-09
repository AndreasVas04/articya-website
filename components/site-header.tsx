"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/shared";
import { prefetchHero } from "@/lib/hero-prefetch";
import { cn, withBasePath } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const normalize = (p: string) => (p === "/" ? p : p.replace(/\/$/, ""));
  return normalize(pathname) === normalize(href);
}

// The home logo when already on home. Next does not remount a route you are
// already on, so the hero keeps its expansion state and manual
// scrollRestoration leaves the scroll where it is - the click reads as dead.
// Reset to the fresh-load view instead: scroll to the top (instant, so it
// never fights the hero's own scroll pin) and fire the event the hero resets
// on. preventDefault drops the no-op navigation, adding no history entry, so
// back/forward keep pointing where the visitor actually came from. The logo
// stays a link; focus rests on it, which is where a returning visitor expects
// to be.
const HOME_RESET_EVENT = "home:reset";

// The route's photograph starts downloading on the intent, not on the tap.
// Next already prefetches the route's own JavaScript this way; its hero is the
// larger half of the wait and had nothing arranging for it. On a phone the
// intent is the finger landing - `pointerdown` and `touchstart`, whichever the
// engine gives first - which is a whole press-and-release ahead of the
// navigation; on a pointer device it is the cursor arriving on the label,
// which is usually longer still. `prefetchHero` is once-per-route, so the
// three handlers firing for one gesture cost one request between them.
const DESKTOP = "(min-width: 768px)";
function intentPrefetch(href: string) {
  return {
    onPointerDown: () => prefetchHero(href, true),
    onTouchStart: () => prefetchHero(href, true),
    onPointerEnter: () => {
      if (window.matchMedia(DESKTOP).matches) prefetchHero(href);
    },
  };
}

// The chrome is not a bar. There is no fill behind it, no blur, no rule under
// it: the nav sits directly on the photograph, in cream, with amber on the
// item you are on. What carries the labels is the picture's own darkening - 
// the stage plates and the hero plate each hold flat gold for the bar's height
// at the top of the window, so a label never lands on open picture whatever
// the scroll position. A bar would have been a panel behind text, which is the
// one thing this page no longer has anywhere.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  // Close paths for the open mobile panel, attached only while it is open:
  // scrolling away (past a small threshold so touch jitter doesn't count),
  // pointing anywhere outside the panel and its toggle, Escape (which also
  // hands focus back to the toggle), and the viewport crossing to desktop - 
  // where the panel becomes static nav and an orphaned open state would
  // reappear on the next narrow resize.
  useEffect(() => {
    if (!open) return;

    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 8) setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      {/* The darkening the labels are carried by - see `.chrome-shade`. It is
          a layer of the window, not a background of this element: the header
          itself has none, and this ramp reaches nothing at its lower end. */}
      <div
        aria-hidden="true"
        className={cn(
          "chrome-shade pointer-events-none absolute inset-x-0 top-0",
          open && "chrome-shade-open"
        )}
      />
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
        <Link
          href="/"
          onClick={(event) => {
            if (!isActive(pathname, "/")) return;
            event.preventDefault();
            setOpen(false);
            window.scrollTo(0, 0);
            window.dispatchEvent(new Event(HOME_RESET_EVENT));
          }}
          className="flex shrink-0 items-center gap-2.5"
        >
          {/* WebP with the PNG behind it, same pixels (lossless), 49KB against
              63; the box and the rendered size are unchanged. */}
          <picture>
            <source
              srcSet={withBasePath(nav.logo.src.replace(/\.png$/, ".webp"))}
              type="image/webp"
            />
            <img
              src={withBasePath(nav.logo.src)}
              alt={nav.logo.alt}
              width={358}
              height={309}
              fetchPriority="high"
              decoding="async"
              className="h-11 w-auto md:h-14"
            />
          </picture>
          <span className="font-display text-lg font-semibold tracking-[-0.025em] text-ink md:text-xl">
            ArtiCYa
          </span>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          aria-label={nav.menuToggleLabel}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-0.5 w-6 bg-ink" />
          ))}
        </button>

        <ul
          ref={panelRef}
          className={cn(
            // The open panel carries no surface either - it is the same cream
            // type, one step further down the same photograph.
            "absolute inset-x-0 top-full flex-col gap-1 px-4 pb-6 pt-2 md:static md:flex md:flex-row md:items-center md:gap-8 md:p-0",
            open ? "flex" : "hidden"
          )}
        >
          {nav.items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  {...intentPrefetch(item.href)}
                  // The active and hovered label is `resin-light`, not
                  // `amber`. Amber is a mark on this site and never text, and
                  // over a photograph it could not carry the state anyway: at
                  // 13px it measured 3.53 on home and 2.95 on About against a
                  // 4.5 floor. Cream with the underline alone was the other
                  // way out, but the underline is desktop-only, so a phone
                  // would show no active state at all. `resin-light` is the
                  // palette's own accent-text-on-dark and clears the floor at
                  // both viewports with the warm note intact.
                  className={cn(
                    "group relative block py-2 text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-ink transition-colors duration-200 hover:text-resin-light md:py-1",
                    active && "text-resin-light"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-px left-0 hidden h-[1.5px] w-full origin-left bg-amber transition-transform duration-200 ease-out-quart md:block",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
