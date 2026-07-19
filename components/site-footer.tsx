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

// The lower half of the site's pine chrome: the same pine-950 surface as the
// header, closing every page on the edge it opened with and bracketing the
// warm body between them.
export function SiteFooter() {
  return (
    <footer className="border-t border-pine-800 bg-pine-950 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4">
        <div className="flex gap-4">
          {footer.social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="text-sage transition-colors duration-200 hover:text-resin-light"
            >
              {icons[s.label]}
            </a>
          ))}
        </div>
        <p className="text-sm text-plaster-muted">{footer.copyright}</p>
      </div>
    </footer>
  );
}
