import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { OfferPanel } from "@/components/offer-panel";
import { GainTrail } from "@/components/gain-trail";
import { ButtonLink } from "@/components/ui/button";
import { hero, whatWeDo, gain } from "@/content/home";

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
          pin against the viewport. */}
      <section className="relative overflow-clip bg-pine-950 text-plaster-bright">
        {/* Mirrors the lower half of the hero's halo, which the hero clips
            at the seam — together they read as one light. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[42rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/45 blur-[80px]"
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-16 md:pt-28">
          <div className="md:grid md:grid-cols-12 md:gap-x-16">
            <Reveal className="md:col-span-5">
              <span aria-hidden="true" className="block h-1 w-16 bg-resin" />
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                {whatWeDo.title}
              </h2>
            </Reveal>
            <Reveal delayMs={100} className="md:col-span-7 md:pt-3">
              <p className="mt-6 max-w-2xl border-l border-sage/40 pl-5 text-xl leading-[1.55] text-plaster-muted md:mt-0 md:ml-auto md:pl-6">
                {whatWeDo.lead}
              </p>
            </Reveal>
          </div>

          <div className="mt-10 grid border-y border-pine-800 md:mt-24 md:grid-cols-3 md:divide-x md:divide-pine-800 max-md:divide-y max-md:divide-pine-800">
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
        <div className="mx-auto max-w-6xl">
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-resin/25 blur-[100px]"
            />
            <Reveal className="relative">
              <p className="text-xl leading-[1.55] text-plaster-muted">
                {gain.text}
              </p>
              <p className="mt-5 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-resin [text-shadow:0_0_40px_color-mix(in_srgb,var(--color-resin)_40%,transparent)]">
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
