import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { StageScene } from "@/components/stage-entrance";
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
          hidden until hydration takes over. `hero-load` arms the hero's
          first-load title-card choreography from the first paint; unlike
          `hero-js` it is never removed, so the finished animations hold
          their resting fill instead of snapping when hydration lands. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            'history.scrollRestoration="manual";window.scrollTo(0,0);document.documentElement.classList.add("hero-js","hero-load");',
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
          {/* 15px on mobile, against 17px before: at 17 the statement broke
              to four ragged lines inside the card's width and the tagline
              stopped reading as one calm sentence. 15px with `text-balance`
              settles it to three even lines, and 15 is the floor — below it
              the line stops being comfortable at arm's length. */}
          <p className="mt-4 max-w-[30rem] translate-y-6 text-balance text-center font-display text-[0.9375rem] font-medium md:max-w-[46rem] md:text-[1.25rem] leading-[1.35] tracking-[-0.01em] text-ink opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-100 motion-reduce:translate-y-0">
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
          {/* No top padding on either viewport. Mobile spends the lever on
              the fold decision — the accent rule sits on the section's own
              top edge, exactly at the fold. Desktop used to keep pt-24, but
              the hero already leaves 68px under its card and the left
              column's self-centering adds ~90px more: with the padding on
              top, a full empty gold band separated the card from the
              heading, and the entrance below played out where nobody was
              looking. Dropping it lands the heading area ~155px under the
              card block, so the entrance starts while the card is still
              leaving the viewport and the two moments overlap. */}
          <div className="relative mx-auto max-w-6xl px-4">
            {/* The globe is the living center of the clearing: text left, the
                lit world right, the stats ledger reading under it — with the
                countries column landing directly beneath the globe, since the
                globe is that number made visible. The section takes the stage
                on the clock, once per load, the moment it enters view: the
                rule draws, the heading rises out of a clipped line, the lead
                follows a beat later, and the globe surfaces from below —
                smaller and tilted, settling upright while a warm flash crests
                behind it and dies away. Text and globe are separate scenes,
                so on a phone, where the globe sits a screen below the
                heading, each moment plays where the visitor is looking. */}
            <div className="relative md:grid md:grid-cols-12 md:items-start md:gap-x-12">
              <StageScene className="md:col-span-6 md:self-center">
                <span
                  aria-hidden="true"
                  className="stage-rule block h-[1.25px] w-16 bg-amber"
                />
                <div className="stage-mask mt-2">
                  <h2 className="stage-mask-rise font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                    {whatWeDo.title}
                  </h2>
                </div>
                <div
                  className="stage-rise"
                  style={{ transitionDelay: "250ms" }}
                >
                  <p className="mt-5 border-l border-hairline pl-5 text-xl leading-[1.55] text-ink-soft md:mt-8">
                    {whatWeDo.lead}
                  </p>
                </div>
              </StageScene>
              {/* The globe fires later than the text (-30% against -14%), so
                  it surfaces once a real share of it is on screen rather
                  than while its lower half is still under the fold. The
                  flash rides inside the globe's own rising layer — dawn
                  light traveling up with the sun, always exactly where the
                  globe is — and dies to nothing as it settles. */}
              <StageScene
                fireMargin="-30%"
                className="relative mt-8 md:col-span-6 md:mt-0 md:self-center"
              >
                <div
                  className="stage-globe relative isolate"
                  style={{ transitionDelay: "120ms" }}
                >
                  <div
                    aria-hidden="true"
                    className="stage-flash absolute left-1/2 top-[40%] -z-10 aspect-square w-[110%]"
                  />
                  <DottedGlobe className="mx-auto w-full max-w-[16rem] md:max-w-[24rem]" />
                </div>
              </StageScene>
            </div>

            {/* The ledger carries no rules of its own beyond the desktop
                column dividers: horizontal lines are the one mark this page
                never draws, so the mobile rows structure themselves on the
                numeral/label baseline alone and the grid fades straight
                into the gold below. The rows rise as their own staggered
                scene, and each counter starts its 700ms count when it
                crosses into view — the ledger writes itself. */}
            <StageScene className="mt-8 grid md:mt-12 md:grid-cols-3 md:divide-x md:divide-hairline">
              {whatWeDo.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="stage-rise"
                  style={{ transitionDelay: `${i * 130}ms` }}
                >
                  <StatCounter num={stat.num} label={stat.label} />
                </div>
              ))}
            </StageScene>
          </div>

          {/* The first panel opens on a photograph that dissolves in over its
              own top edge, so the join already reads as a fade rather than a
              cut. On mobile the full `mt-16` on top of that dissolve left the
              stats hanging over ~120px of bare gold. */}
          <div className="mt-10 md:mt-24">
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
        {/* No top padding on mobile, like "What we do": the panel above closes
            on its own `pb-10`, so the section's own padding stacked a second
            beat on top of a gap the panel had already opened — 113px from the
            last line of the panel to this heading. The accent rule sits on the
            section's top edge instead and the join reads as one beat. */}
        <section className="gold-field relative px-4 text-ink md:pt-32">
          <div className="relative mx-auto max-w-6xl">
            <Reveal className="text-center">
              <span
                aria-hidden="true"
                className="mx-auto block h-[1.25px] w-16 bg-amber"
              />
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                {gain.title}
              </h2>
            </Reveal>

            {/* The first station carries its own `py-10` before the node, so
                on mobile this margin was the second half of a 106px gap
                between the heading and the first gain. */}
            <div className="mt-6 md:mt-20">
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
