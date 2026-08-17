import { footer } from "@/content/shared";

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

// The lower half of the site's chrome, and like the header it is no longer a
// bar: no fill, no rule on the edge it shares with the body. The page simply
// runs out under it. On home the stage plates hold flat gold for the footer's
// height at the bottom of the window, so the cream type here always closes on
// one value; on the inner pages the body's own dark floor does the same job.
//
// `relative` is not layout — it is paint order. The home page's photographic
// stage is a fixed layer, and a fixed layer paints after every static block on
// the page, so without a position here the footer renders under the picture.
export function SiteFooter() {
  return (
    <footer className="relative py-8">
      {/* What carries the footer's line where a photograph runs under it, and
          it is the same construction the header uses at the other end: one
          full-width ramp, no edge, no surface, reaching above the footer so it
          has already started before the words. A ground of its own would be a
          horizontal line where one background meets the next, which is the one
          thing the page does not draw. */}
      <div
        aria-hidden="true"
        className="foot-shade pointer-events-none absolute inset-x-0 bottom-0 -top-24"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-5 px-4">
        <div className="flex gap-4">
          {footer.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              // Outlined circle in the Contact cards' language, so the footer
              // reads as the same family. The circle is exactly 44px so the
              // touch target meets the minimum with the drawn ring itself.
              className="flex size-11 items-center justify-center rounded-full border border-pine/30 text-ink-soft transition-colors duration-200 ease-out-quart hover:border-resin-deep/50 hover:text-resin-deep"
            >
              {icons[s.label]}
            </a>
          ))}
        </div>
        <p className="text-sm text-ink-soft">{footer.copyright}</p>
      </div>
    </footer>
  );
}
