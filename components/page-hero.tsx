import { Reveal } from "@/components/reveal";
import { withBasePath } from "@/lib/utils";

interface PageHeroProps {
  image: string;
  heading: string;
  text: string;
}

// Inner pages open on a pine-dusk hero over the page's photograph — the same
// hour the home page lives in, with the same resin lamp glowing behind the
// headline — before the body hands over to the daylight plaster ground.
export function PageHero({ image, heading, text }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-pine-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(image)})` }}
      />
      <div className="absolute inset-0 bg-pine-950/70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/25 blur-[100px]"
      />
      <div className="relative mx-auto flex min-h-[55vh] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-28 text-center md:min-h-[65vh] md:pb-20 md:pt-32">
        <Reveal>
          <span aria-hidden="true" className="mx-auto block h-1 w-16 bg-resin" />
          <h1 className="mt-8 font-display text-[clamp(2.75rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-plaster-bright">
            {heading}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-[1.55] text-plaster-muted">
            {text}
          </p>
        </Reveal>
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-sage/40" />
    </section>
  );
}
