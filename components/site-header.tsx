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

  const solid = scrolled || open;
  // The header takes the register of the ground it opens on. The home page
  // is the warm living atmosphere from its hero down, so there it is cream
  // and ink; the inner pages still open on a pine-dusk hero, so there it
  // keeps the dark strip that follows the visitor into their daylight body.
  const warm = isActive(pathname, "/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ease-out-quart",
        !solid && "border-transparent bg-transparent",
        solid && warm && "border-hairline bg-base/90 backdrop-blur-sm",
        solid && !warm && "border-pine-800 bg-pine-950/90 backdrop-blur-sm"
      )}
    >
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
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-[-0.01em] md:text-xl",
              warm ? "text-ink" : "text-plaster-bright"
            )}
          >
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
            <span
              key={i}
              className={cn("h-0.5 w-6", warm ? "bg-ink" : "bg-plaster-bright")}
            />
          ))}
        </button>

        <ul
          className={cn(
            "absolute inset-x-0 top-full flex-col gap-1 border-b px-4 pb-6 pt-2 backdrop-blur-sm md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
            warm ? "border-hairline bg-base/95" : "border-pine-800 bg-pine-950/90",
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
                    warm
                      ? "text-ink hover:text-resin-deep"
                      : "text-plaster-bright hover:text-resin-light",
                    active && (warm ? "text-resin-deep" : "text-resin-light")
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 hidden h-0.5 w-full origin-left transition-transform duration-200 ease-out-quart md:block",
                      warm ? "bg-amber" : "bg-resin-light",
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
