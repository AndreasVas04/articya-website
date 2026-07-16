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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="shrink-0">
          <Image
            src={withBasePath(nav.logo.src)}
            alt={nav.logo.alt}
            width={358}
            height={309}
            className="h-12 w-auto"
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
          <span className="h-0.5 w-6 bg-neutral-800" />
          <span className="h-0.5 w-6 bg-neutral-800" />
          <span className="h-0.5 w-6 bg-neutral-800" />
        </button>

        <ul
          className={cn(
            "absolute left-0 right-0 top-16 z-10 flex-col gap-2 border-b border-neutral-200 bg-white p-4 md:static md:flex md:flex-row md:gap-6 md:border-0 md:p-0",
            open ? "flex" : "hidden"
          )}
        >
          {nav.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm text-neutral-700 hover:text-neutral-950",
                  isActive(pathname, item.href) && "font-semibold text-neutral-950"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
