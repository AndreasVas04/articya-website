import { Reveal } from "@/components/reveal";
import { withBasePath } from "@/lib/utils";

interface PageHeroProps {
  image: string;
  heading: string;
  text: string;
}

// Inner pages open on the same golden world as home: the page's photograph
// glowing through a warm cream-to-amber veil, with a pool of light behind
// the headline — one gold field from the header on down.
export function PageHero({ image, heading, text }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gold-wash">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(image)})` }}
      />
      {/* Graded veil instead of a flat one: a calm pool of cream where the
          headline sits, deepening toward amber at the edges and base, so the
          photograph glows through the gold rather than sitting under
          uniform paint. */}
      <div aria-hidden="true" className="gold-scrim absolute inset-0" />
      {/* Soft top light and an edge vignette keep the golden photograph
          luminous: the chrome hands over gently below the header, the
          corners lift toward the frame. */}
      <div aria-hidden="true" className="gold-light absolute inset-x-0 top-0 h-48" />
      <div aria-hidden="true" className="photo-vignette-warm absolute inset-0" />
      <div aria-hidden="true" className="film-grain absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-chrome/60 blur-[100px]"
      />
      <div className="relative mx-auto flex min-h-[55vh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:min-h-[65vh] md:pb-20 md:pt-32">
        <Reveal>
          <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
          <h1 className="mt-4 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            {heading}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-[1.55] text-ink">
            {text}
          </p>
        </Reveal>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-amber/50" />
    </section>
  );
}
