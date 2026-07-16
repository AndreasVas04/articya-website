"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav } from "@/content/shared";
import { cn, withBasePath } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const normalize = (p: string) => (p === "/" ? p : p.replace(/\/$/, ""));
  return normalize(pathname) === normalize(href);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every page opens on a dark hero, so the header starts transparent with
  // light text. Once scrolled it gains the surface of the page it sits on:
  // pine on the home page (a continuous dark world), plaster on the light
  // inner pages. The open mobile menu always needs the solid surface.
  const solid = scrolled || open;
  const dark = pathname === "/";
  const lightText = !solid || dark;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ease-out-quart",
        solid
          ? dark
            ? "border-pine-800 bg-pine-950/90 backdrop-blur-sm"
            : "border-sage/60 bg-plaster/95 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20">
        <Link href="/" className="shrink-0">
          <Image
            src={withBasePath(nav.logo.src)}
            alt={nav.logo.alt}
            width={358}
            height={309}
            className="h-11 w-auto md:h-14"
            priority
          />
        </Link>

        <button
          type="button"
          aria-label={nav.menuToggleLabel}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-2 md:hidden"
        >
          <span
            className={cn(
              "h-0.5 w-6 transition-colors duration-200",
              lightText ? "bg-plaster-bright" : "bg-pine-950"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 transition-colors duration-200",
              lightText ? "bg-plaster-bright" : "bg-pine-950"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-6 transition-colors duration-200",
              lightText ? "bg-plaster-bright" : "bg-pine-950"
            )}
          />
        </button>

        <ul
          className={cn(
            "absolute inset-x-0 top-full flex-col gap-1 border-b px-4 pb-6 pt-2 backdrop-blur-sm md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
            dark
              ? "border-pine-800 bg-pine-950/90"
              : "border-sage/60 bg-plaster/95",
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
                    "group relative block py-2 text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] transition-colors duration-200 md:py-1",
                    lightText
                      ? "text-plaster-bright hover:text-resin-light"
                      : "text-pine-950 hover:text-resin-deep",
                    active &&
                      (lightText ? "text-resin-light" : "text-resin-deep")
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 hidden h-0.5 w-full origin-left transition-transform duration-200 ease-out-quart md:block",
                      lightText ? "bg-resin-light" : "bg-resin-deep",
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
