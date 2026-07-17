import Image from "next/image";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { OfferPanel } from "@/components/offer-panel";
import { GainTrail } from "@/components/gain-trail";
import { DottedGlobe } from "@/components/ui/dotted-globe";
import { ButtonLink } from "@/components/ui/button";
import { hero, whatWeDo, gain } from "@/content/home";
import { withBasePath } from "@/lib/utils";

const offerIcons = ["globe", "graduation"] as const;

export default function HomePage() {
  return (
    <>
      <ScrollExpandMedia
        slides={hero.slides}
        bgImageSrc={hero.slides[0]}
        title={hero.heading}
        hintLabel={hero.location}
      >
        <p className="max-w-2xl translate-y-6 text-center text-base leading-[1.55] text-plaster-bright opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] motion-reduce:translate-y-0 md:text-xl">
          {hero.text}
        </p>
        <div className="mt-6 translate-y-6 opacity-0 duration-[400ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-200 motion-reduce:translate-y-0">
          <ButtonLink
            href={hero.cta.href}
            className="bg-resin text-pine-950 hover:bg-resin-light"
          >
            {hero.cta.label}
          </ButtonLink>
        </div>
      </ScrollExpandMedia>

      {/* overflow-clip (not hidden) so the offer panels' sticky frames can
          pin against the viewport. The transform rides the hero's handoff:
          for the last scroll segment the whole section travels up over the
          receding hero, then the shift returns to zero and the section rests
          in normal flow (see scroll-expansion-hero). */}
      <section
        className="relative overflow-clip bg-pine-950 text-plaster-bright"
        style={{ transform: "translateY(var(--hero-handoff-shift, 0px))" }}
      >
        {/* The environment behind the clearing: our own canopy photograph
            sunk under the pine scrim — felt more than seen, strongest behind
            the heading and numerals, gone before the panels. The top fade
            keeps it out of the hero seam so the two grounds meet as one
            surface. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[120vh] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_16rem),radial-gradient(ellipse_90%_75%_at_50%_28%,black_25%,transparent_92%)]"
        >
          <Image
            src={withBasePath("/images/hero-2.jpg")}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover object-[50%_30%] opacity-20 blur-2xl brightness-50 saturate-[0.6]"
          />
        </div>
        {/* The lamp's light falls down the section from the seam, shading
            the ground from lit to deep instead of leaving it flat. Painted
            before the halo so the layers stack in the same order as the
            hero's side of the seam and the two halves composite identically. */}
        <div
          aria-hidden="true"
          className="lamp-falloff pointer-events-none absolute inset-x-0 top-0 h-[80vh]"
        />
        {/* Mirrors the lower half of the hero's halo, which the hero clips
            at the seam — together they read as one light. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[42rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/30 blur-[80px]"
        />
        <div
          aria-hidden="true"
          className="film-grain pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-10 md:pt-16">
          {/* The globe is the living center of the clearing: text left, the
              lit world right, the stats ledger reading under it — with the
              countries column landing directly beneath the globe, since the
              globe is that number made visible. The reveals stagger down the
              same path the eye takes: title, lead, globe, then the numerals. */}
          <div className="md:grid md:grid-cols-12 md:items-center md:gap-x-12">
            <div className="md:col-span-5">
              <Reveal>
                <span aria-hidden="true" className="block h-1 w-16 bg-resin" />
                <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                  {whatWeDo.title}
                </h2>
              </Reveal>
              <Reveal delayMs={100}>
                <p className="mt-5 border-l border-sage/40 pl-5 text-xl leading-[1.55] text-plaster-muted md:mt-8">
                  {whatWeDo.lead}
                </p>
              </Reveal>
            </div>
            <div className="relative mt-8 md:col-span-7 md:mt-0">
              {/* The globe's share of the one lamp — a soft resin pool the
                  dots appear to be lit by. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/10 blur-[100px]"
              />
              <Reveal delayMs={150} className="duration-[700ms]">
                <DottedGlobe className="mx-auto w-full max-w-[16rem] md:max-w-[34rem]" />
              </Reveal>
            </div>
          </div>

          <div className="mt-8 grid border-y border-pine-800 md:mt-12 md:grid-cols-3 md:divide-x md:divide-pine-800 max-md:divide-y max-md:divide-pine-800">
            {whatWeDo.stats.map((stat, i) => (
              <Reveal key={stat.label} delayMs={i * 150}>
                <StatCounter num={stat.num} label={stat.label} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          {whatWeDo.cards.map((card, i) => (
            <OfferPanel
              key={card.title}
              image={card.image}
              title={card.title}
              text={card.text}
              icon={offerIcons[i] ?? "globe"}
              flip={i % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-pine-950 px-4 py-16 text-plaster-bright md:py-24">
        {/* A pocket of ambient dusk light around the trail, so the closing
            stretch sits in a clearing rather than on a flat ground. */}
        <div
          aria-hidden="true"
          className="dusk-ambient pointer-events-none absolute inset-0"
        />
        {/* Faint distance behind the trail: mountains over water from our
            own hikes, blurred into the dusk and faded out well before the
            closing line so the glow zone keeps its measured contrast. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[6%] h-[52%] [mask-image:radial-gradient(ellipse_95%_75%_at_50%_50%,black_20%,transparent_78%)]"
        >
          <Image
            src={withBasePath("/images/hero-1.jpg")}
            alt=""
            fill
            sizes="100vw"
            className="scale-110 object-cover object-[70%_45%] opacity-20 blur-[14px] brightness-50 saturate-[0.6]"
          />
        </div>
        <div
          aria-hidden="true"
          className="film-grain pointer-events-none absolute inset-0"
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span
              aria-hidden="true"
              className="mx-auto block h-1 w-16 bg-resin"
            />
            <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
              {gain.title}
            </h2>
          </Reveal>

          <div className="mt-12 md:mt-16">
            <GainTrail items={gain.items} />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            {/* The glow belongs to the showpiece line, not the whole block:
                centered behind the highlight so the supporting paragraph
                above stays out of its bright core. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[62%] h-48 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/20 blur-[100px]"
            />
            <Reveal className="relative">
              <p className="text-xl leading-[1.55] text-plaster-muted">
                {gain.text}
              </p>
              <p className="mt-8 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-resin [text-shadow:0_0_30px_color-mix(in_srgb,var(--color-resin)_30%,transparent)]">
                {gain.highlight}
              </p>
            </Reveal>
            <Reveal delayMs={200} className="relative">
              <div className="mt-10">
                <ButtonLink
                  href={gain.cta.href}
                  className="bg-resin text-pine-950 hover:bg-resin-light"
                >
                  {gain.cta.label}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
