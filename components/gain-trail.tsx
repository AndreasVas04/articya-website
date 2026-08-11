import { Reveal } from "@/components/reveal";

// The four gains, as plain type on the page's own ground.
//
// This was a trail: an amber rail drawing itself down the page on the
// scrollbar, a lit node at each station, a glow under every node and an icon
// medallion beside every line. All of it drew a picture of a light — and the
// lamp that light belonged to was removed, so the thread led nowhere. What the
// section is actually for is four short lines, and they carry themselves.
export function GainTrail({ items }: { items: string[] }) {
  return (
    <div className="relative">
      {items.map((item, i) => (
        <div key={item} className="relative py-6 md:py-10">
          <Reveal delayMs={i * 80}>
            <span className="block text-center font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
              {item}
            </span>
          </Reveal>
        </div>
      ))}
    </div>
  );
}
