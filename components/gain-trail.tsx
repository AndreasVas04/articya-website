// The four gains as an ordered list rather than four identical lines.
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
// The rows are the last beats of the section's own scene: each rises 72px on
// the clock, 90ms after the one above it, and the last one settles at 1.2s.
export function GainTrail({ items }: { items: string[] }) {
  return (
    <ol className="gain-list relative">
      {items.map((item, i) => (
        <li
          key={item}
          className="gain-row stage-rise relative py-2 md:py-7"
          style={{ transitionDelay: `${250 + i * 90}ms` }}
        >
          <span className="block font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-ink">
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
