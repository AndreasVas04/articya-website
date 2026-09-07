import type { CSSProperties } from "react";

// The four gains, as plain type on the page's own ground — and as an ordered
// list rather than four identical lines.
//
// This was a trail: an amber rail drawing itself down the page on the
// scrollbar, a lit node at each station, a glow under every node and an icon
// medallion beside every line. All of it drew a picture of a light — and the
// lamp that light belonged to was removed, so the thread led nowhere. What
// replaced it was four lines at one size, centred, with nothing to say which
// came first.
//
// Grand Canyon's §C answer, and it is rules and numerals with no ornament in
// it: each line is numbered, the numerals sit on their own column so the lines
// hang off one left edge, and a hairline runs between them. The numerals are
// pseudo-content — the site's visible text is frozen and these are marks, not
// strings.
//
// The rows enter on the section's scene, not on observers of their own: the
// numeral of row i lifts at 250 + 120·i ms and its line 80ms behind it, each
// rising 56px over 700ms. The numeral's delay travels to its ::before through
// the custom property; the line's is its own transition-delay.
export function GainTrail({ items }: { items: string[] }) {
  return (
    <ol className="gain-list relative">
      {items.map((item, i) => (
        <li
          key={item}
          className="gain-row relative py-5 md:py-7"
          style={{ "--gain-delay": `${250 + i * 120}ms` } as CSSProperties}
        >
          <div
            className="stage-rise"
            style={{ "--stage-rise": "56px", transitionDelay: `${330 + i * 120}ms` } as CSSProperties}
          >
            <span className="block font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-ink">
              {item}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
