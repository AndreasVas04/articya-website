import Image from "next/image";
import { withBasePath } from "@/lib/utils";

interface GoldPageHeroProps {
  image: string;
  heading: string;
  text: string;
}

// An inner page's threshold into the golden world: the page photograph sunk
// to glass under the gold veil — the home hero's own treatment — with the
// headline rising on the clock. The choreography reuses the home hero's
// first-load classes, keyed off the same `hero-load` flag the page sets
// before this section parses; without JS the flag never lands and the hero
// renders at rest. The backdrop dissolves inside its own layer at both ends,
// so the chrome seam above and the section seam below stay pure gold.
export function GoldPageHero({ image, heading, text }: GoldPageHeroProps) {
  return (
    <section className="gold-field gold-field-chrome-top relative overflow-hidden text-ink">
      <div aria-hidden="true" className="hero-backdrop-fade absolute inset-0">
        <div className="photo-edge-dissolve absolute inset-0">
          <Image
            src={withBasePath(image)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-110 object-cover opacity-[0.18] blur-[28px] saturate-[1.2]"
          />
          <div
            aria-hidden="true"
            className="hero-glass-veil pointer-events-none absolute inset-0"
          />
        </div>
      </div>
      <div className="relative mx-auto flex min-h-[55vh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:min-h-[65vh] md:pb-20 md:pt-32">
        <span
          aria-hidden="true"
          className="hero-strike mx-auto block h-[1.25px] w-16 bg-amber"
        />
        <div className="hero-mask mt-4">
          <h1 className="hero-word block font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            {heading}
          </h1>
        </div>
        {/* ink, not ink-soft: the lead sits inside the veil's warm pool,
            where ink-soft measures 4.51 on the composite — passing with no
            margin. Same call as the home lamp's deepest line. */}
        <p className="hero-pill mx-auto mt-6 max-w-2xl text-xl leading-[1.55] text-ink">
          {text}
        </p>
      </div>
    </section>
  );
}
