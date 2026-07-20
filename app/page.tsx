import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { LivingAtmosphere } from "@/components/living-atmosphere";
import { OfferPanel } from "@/components/offer-panel";
import { GainTrail } from "@/components/gain-trail";
import { DottedGlobe } from "@/components/ui/dotted-globe";
import { LampCta } from "@/components/ui/lamp";
import { ButtonLink } from "@/components/ui/button";
import { hero, whatWeDo, gain } from "@/content/home";

const offerIcons = ["globe", "graduation"] as const;

export default function HomePage() {
  return (
    <>
      {/* Runs during parse, before the hero can paint: opts this page out
          of browser scroll restoration (a reload mid-page would strand the
          visitor in a scroll choreography whose state machine started
          fresh) and flags JS-on so the CSS veil holds the hero intro
          hidden until hydration takes over. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'history.scrollRestoration="manual";window.scrollTo(0,0);document.documentElement.classList.add("hero-js");',
        }}
      />
      {/* The whole page shares one warm ground, hero included: a single
          atmosphere instance spans the wrapper, so the drifting light is one
          continuous field rather than a per-section grid that restarts — and
          restarting it at the hero's lower edge would land two different
          phases of the same tiling on either side of that line. */}
      <div className="relative">
        <LivingAtmosphere />

        <ScrollExpandMedia
          slides={hero.slides}
          bgImageSrc={hero.slides[0]}
          title={hero.heading}
          hintLabel={hero.location}
        >
          <span
            aria-hidden="true"
            className="block h-px w-[82px] translate-y-6 bg-amber/55 opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] motion-reduce:translate-y-0"
          />
          <p className="mt-4 max-w-[30rem] translate-y-6 text-balance text-center font-display text-[1.0625rem] font-medium md:max-w-[46rem] md:text-[1.25rem] leading-[1.35] tracking-[-0.01em] text-ink opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-100 motion-reduce:translate-y-0">
            {hero.text}
          </p>
          <div className="mt-5 translate-y-6 opacity-0 duration-[400ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-300 motion-reduce:translate-y-0">
            <ButtonLink href={hero.cta.href} variant="gold">
              {hero.cta.label}
            </ButtonLink>
          </div>
        </ScrollExpandMedia>

        {/* overflow-clip (not hidden) so the offer panels' sticky frames can
            pin against the viewport. */}
        <section className="gold-field relative overflow-clip text-ink">
          {/* pt is small on mobile by design: the hero card is centered in
              its own screen, so it already leaves ~120px of gold below it
              before this section starts. Desktop keeps the full rhythm. */}
          <div className="relative mx-auto max-w-6xl px-4 pt-6 md:pt-24">
            {/* The globe is the living center of the clearing: text left, the
                lit world right, the stats ledger reading under it — with the
                countries column landing directly beneath the globe, since the
                globe is that number made visible. The reveals stagger down the
                same path the eye takes: title, lead, globe, then the numerals. */}
            <div className="md:grid md:grid-cols-12 md:items-start md:gap-x-12">
              <div className="md:col-span-6 md:self-center">
                <Reveal>
                  <span
                  aria-hidden="true"
                  className="block h-[1.25px] w-16 bg-amber"
                />
                  <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                    {whatWeDo.title}
                  </h2>
                </Reveal>
                <Reveal delayMs={100}>
                  <p className="mt-5 border-l border-hairline pl-5 text-xl leading-[1.55] text-ink-soft md:mt-8">
                    {whatWeDo.lead}
                  </p>
                </Reveal>
              </div>
              <div className="relative mt-8 md:col-span-6 md:mt-0 md:self-center">
                {/* The warm halo the globe's dots sit in — the light of the
                    ground gathered behind it, not a second source. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-soft/25 blur-[100px]"
                />
                <Reveal delayMs={150} className="duration-[700ms]">
                  <DottedGlobe className="mx-auto w-full max-w-[16rem] md:max-w-[24rem]" />
                </Reveal>
              </div>
            </div>

            {/* The ledger carries no rules of its own beyond the desktop
                column dividers: horizontal lines are the one mark this page
                never draws, so the mobile rows structure themselves on the
                numeral/label baseline alone and the grid fades straight
                into the gold below. */}
            <div className="mt-8 grid md:mt-12 md:grid-cols-3 md:divide-x md:divide-hairline">
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
                openTop={i === 0}
              />
            ))}
          </div>
        </section>

        {/* The trail sits on the same warm ground as the sections above it,
            so the walk down the four gains never leaves the clearing. It
            carries no bottom padding: the lamp's descent owns the gap below,
            so the trail's line runs straight on into the thread rather than
            stopping short of a section edge. */}
        <section className="gold-field relative px-4 pt-12 text-ink md:pt-32">
          <div className="relative mx-auto max-w-6xl">
            <Reveal className="text-center">
              <span
                aria-hidden="true"
                className="mx-auto block h-[1.25px] w-16 bg-amber"
              />
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                {gain.title}
              </h2>
            </Reveal>

            <div className="mt-14 md:mt-20">
              <GainTrail items={gain.items} />
            </div>
          </div>
        </section>

        {/* The closing beat, on the same cream as everything above it: the
            trail's thread walks down into the lamp and the light opens on
            the ground it has been lighting all page. The headline is the one
            place the accent carries text, so it takes the text-safe amber
            and leaves the bright one to the glow around it. */}
        <section className="gold-field gold-field-chrome-bottom relative overflow-hidden text-ink">
          <LampCta>
            {/* ink, not ink-soft: this line sits deepest in the pool, where
                the warm wash measures 4.14 against ink-soft — under AA. */}
            <p className="max-w-2xl translate-y-24 text-center text-xl leading-[1.55] text-ink opacity-0 duration-[700ms] ease-out-quart group-data-[lit]:translate-y-0 group-data-[lit]:opacity-100 group-data-[lit]:transition-[opacity,transform] group-data-[lit]:delay-300 motion-reduce:translate-y-0">
              {gain.text}
            </p>
            <p className="mt-8 max-w-3xl translate-y-24 text-center font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-resin-deep opacity-0 duration-[700ms] ease-out-quart [text-shadow:0_0_34px_color-mix(in_srgb,var(--color-amber-soft)_55%,transparent)] group-data-[lit]:translate-y-0 group-data-[lit]:opacity-100 group-data-[lit]:transition-[opacity,transform] group-data-[lit]:delay-[450ms] motion-reduce:translate-y-0">
              {gain.highlight}
            </p>
            <div className="mt-10 translate-y-24 opacity-0 duration-[700ms] ease-out-quart group-data-[lit]:translate-y-0 group-data-[lit]:opacity-100 group-data-[lit]:transition-[opacity,transform] group-data-[lit]:delay-[600ms] motion-reduce:translate-y-0">
              <ButtonLink href={gain.cta.href} variant="gold">
                {gain.cta.label}
              </ButtonLink>
            </div>
          </LampCta>
        </section>
      </div>
    </>
  );
}
