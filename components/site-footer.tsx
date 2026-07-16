"use client";

import { usePathname } from "next/navigation";
import { footer } from "@/content/shared";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ReactNode> = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
};

// The footer sits on whichever ground the page ends on: the home page stays
// inside its dark pine world, the inner pages close on plaster.
export function SiteFooter() {
  const dark = usePathname() === "/";

  return (
    <footer
      className={cn(
        "border-t py-8",
        dark ? "border-pine-800 bg-pine-950" : "border-sage/60 bg-plaster"
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4">
        <div className="flex gap-4">
          {footer.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className={cn(
                "transition-colors duration-200",
                dark
                  ? "text-sage hover:text-resin-light"
                  : "text-lichen hover:text-resin-deep"
              )}
            >
              {icons[s.label]}
            </a>
          ))}
        </div>
        <p
          className={cn(
            "text-sm",
            dark ? "text-plaster-muted" : "text-lichen"
          )}
        >
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
