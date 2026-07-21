"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav } from "@/content/shared";
import { cn, withBasePath } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const normalize = (p: string) => (p === "/" ? p : p.replace(/\/$/, ""));
  return normalize(pathname) === normalize(href);
}

// Chrome, not content: one gold bar on every page, matched by the footer —
// both carry `gold-chrome`, the anchor gold lifted toward paper so the two
// flat bars stay soft where the sections stay rich. The amber hairline on its
// lower edge is a signature, not a seam: it is the accent marks' own weight
// and alpha, so the two chrome bars join the gold-line system that draws the
// heading bars, the card frames and the nav underline.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  // Close paths for the open mobile panel, attached only while it is open:
  // scrolling away (past a small threshold so touch jitter doesn't count),
  // pointing anywhere outside the panel and its toggle, Escape (which also
  // hands focus back to the toggle), and the viewport crossing to desktop —
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
    <header className="fixed inset-x-0 top-0 z-50 border-b-[1.25px] border-amber/50 bg-gold-chrome">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={withBasePath(nav.logo.src)}
            alt={nav.logo.alt}
            width={358}
            height={309}
            className="h-11 w-auto md:h-14"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-[-0.01em] text-ink md:text-xl">
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
            // The open panel is positioned against the header's padding box,
            // so it covers the bar's own hairline — it carries the same one
            // on its lower edge instead, and the chrome still closes on the
            // signature line wherever the menu ends.
            "absolute inset-x-0 top-full flex-col gap-1 border-b-[1.25px] border-amber/50 bg-gold-chrome px-4 pb-6 pt-2 md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0",
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
                  className={cn(
                    "group relative block py-2 text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-bark transition-colors duration-200 hover:text-resin-deep md:py-1",
                    active && "text-resin-deep"
                  )}
                >
                  {item.label}
                  {/* The bright amber lives in the underline, never the label:
                      it measures 2.27 on the chrome, so it is a mark, not text. */}
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
