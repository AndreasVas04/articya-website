"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav } from "@/content/shared";
import { cn, withBasePath } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const normalize = (p: string) => (p === "/" ? p : p.replace(/\/$/, ""));
  return normalize(pathname) === normalize(href);
}

// Chrome, not content: one cream bar a shade deeper than the body ground on
// every page, matched by the footer. A hairline does the separating, so the
// chrome is set apart from the warm body without contrasting against it.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-cream-warm">
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
          className={cn(
            "absolute inset-x-0 top-full flex-col gap-1 border-b border-hairline bg-cream-warm px-4 pb-6 pt-2 md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0",
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
                      "absolute -bottom-px left-0 hidden h-0.5 w-full origin-left bg-amber transition-transform duration-200 ease-out-quart md:block",
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
