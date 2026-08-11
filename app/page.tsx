import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { StageScene } from "@/components/stage-entrance";
import { OfferPanel } from "@/components/offer-panel";
import { GainTrail } from "@/components/gain-trail";
import { PhotoStage, type StagePlate } from "@/components/photo-stage";
import { ResponsiveImage } from "@/components/responsive-image";
import { EdgeWordmark, SectionIndex } from "@/components/edge-furniture";
import { ButtonLink } from "@/components/ui/button";
import { imagePreload } from "@/lib/images";
import { hero, whatWeDo, gain } from "@/content/home";

const offerIcons = ["globe", "graduation"] as const;

// The photograph "What you gain" is built on, sharp one side and defocused
// under the words on the other.
const gainImage = "/images/pt/IMG_4735.jpg";

// The three photographs the page stands on, and the only grounds below the
// hero. Two of them are hero slides the browser has already fetched, so the
// stage costs one image for the whole page — the offer panels' own two are
// gone. Every plate takes the same darkening; the per-plate floors that used
// to vary it held the middle of each picture down and are gone.
const plates: StagePlate[] = [
  // The clearing: the valley in warm light, the hero's own world carried on
  // below the seam. Cropped to its top 60% — the lower third is fencing and
  // roof tiles.
  { src: "/images/pt/IMG_4619.jpg", position: "50% 42%" },
  // The panels: the road between stone walls, quiet, all but out at 0.18.
  { src: "/images/pt/IMG_4582.jpg", position: "50% 45%" },
  // The village at blue hour, and the page closing on it.
  { src: "/images/pt/IMG_4739.jpg", position: "50% 55%" },
];

// The first hero slide is the LCP; the backdrop reuses the same variant, so
// this one preload covers both.
const heroPreload = imagePreload(hero.slides[0], "100vw");

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
      {heroPreload && (
        <link
          rel="preload"
          as="image"
          href={heroPreload.href}
          imageSrcSet={heroPreload.imageSrcSet}
          imageSizes={heroPreload.imageSizes}
          type={heroPreload.type}
          fetchPriority="high"
        />
      )}
      <div className="relative">
        {/* One fixed photographic ground for the whole page below the hero.
            No section under it paints anything, so there is no edge anywhere
            for a seam to fall on: what changes down the page is which
            photograph is showing, and it changes by crossfade. It sits here,
            before every section in the markup, so paint order alone keeps it
            behind the content and the hero's own stacking is untouched. */}
        <PhotoStage plates={plates} />
        <EdgeWordmark />
        <SectionIndex />

        <ScrollExpandMedia
          slides={hero.slides}
          bgImageSrc={hero.slides[0]}
          title={hero.heading}
          hintLabel={hero.location}
        >
          {/* The intro rises 56px, not 24: it now arrives out of the card's
              dissolving foot rather than off a fixed lower edge, and at 24 the
              travel finished before the eye had picked up that anything was
              moving. The band is clipped to the card, so the first part of each
              rise plays inside the dissolve and the words surface out of it. */}
          <span
            aria-hidden="true"
            className="block h-px w-[82px] translate-y-14 bg-amber/55 opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] motion-reduce:translate-y-0"
          />
          {/* The statement is body copy now, on the body step and in the body
              face: the display-face "hero statement" was its own size, its own
              family and its own weight for a single sentence, which is a step
              the ramp does not need. */}
          <p className="mt-5 max-w-[44ch] translate-y-14 text-balance text-center text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-100 motion-reduce:translate-y-0">
            {hero.text}
          </p>
          <div className="mt-5 translate-y-14 opacity-0 duration-[700ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-300 motion-reduce:translate-y-0">
            <ButtonLink href={hero.cta.href} variant="gold">
              {hero.cta.label}
            </ButtonLink>
          </div>
        </ScrollExpandMedia>

        {/* overflow-clip (not hidden) so the offer panels' sticky frames can
            pin against the viewport. */}
        <section className="relative overflow-clip text-ink">
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
          {/* The whole clearing arrives as one event: a single scene wraps the
              text and the stats ledger, fires once at -30% — deep enough that
              a real share of the composition is on screen — and plays a single
              rising wave with internal order on the clock: the rule draws and
              the text column lifts, the heading surfaces out of its clipped
              line a beat in, and the ledger rows land last, left to right. */}
          {/* The clearing stands on the page's stage: hero-2 is the plate
              behind it, so the world the hero opened on carries on under the
              heading instead of ending at a seam. The plate's own darkening is
              what makes the type readable — the pools that used to sit under
              each block are gone. */}
          <div className="relative" data-index-section="">
            <StageScene
              fireMargin="-30%"
              className="relative mx-auto max-w-6xl px-4 xl:max-w-[min(84rem,92vw)]"
            >
              <div
                data-stage-plate="0"
                data-stage-strength="0.26"
                className="relative md:grid md:grid-cols-12 md:items-start md:gap-x-12 xl:gap-x-20"
              >
                <div className="relative md:col-span-6 md:self-center">
                  <div className="stage-lift relative">
                    <span
                      aria-hidden="true"
                      className="stage-rule block h-[1.25px] w-16 bg-amber"
                    />
                    <div className="stage-mask mt-2">
                      <h2
                        className="stage-mask-rise font-display text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.025em]"
                        style={{ transitionDelay: "80ms" }}
                      >
                        {whatWeDo.title}
                      </h2>
                    </div>
                    <div
                      className="stage-rise"
                      style={{ transitionDelay: "250ms" }}
                    >
                      <p className="mt-2 max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink-soft md:mt-8">
                        {whatWeDo.lead}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* The ledger carries no rules of its own beyond the desktop
                  column dividers: horizontal lines are the one mark this page
                  never draws, so the mobile rows structure themselves on the
                  numeral/label baseline alone. The rows are the wave's last
                  beats, and each counter still starts its 700ms count only
                  when it crosses into view — the ledger writes itself. */}
              <div
                data-stage-plate="0"
                data-stage-strength="0.22"
                className="relative mt-2 md:mt-12"
              >
                <div className="relative grid md:grid-cols-3 md:divide-x md:divide-hairline">
                  {whatWeDo.stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className="stage-rise"
                      style={{ transitionDelay: `${550 + i * 130}ms` }}
                    >
                      <StatCounter num={stat.num} label={stat.label} />
                    </div>
                  ))}
                </div>
              </div>
            </StageScene>
          </div>

          {/* A breathing zone: no text stands here, so the photograph comes
              all the way up between two reading passages. It is a measurement
              marker and nothing else — zero height, so it moves no layout and
              only tells the stage where the ground is allowed to be loud. */}
          <div
            aria-hidden="true"
            data-stage-plate="0"
            data-stage-strength="0.92"
            className="h-0"
          />

          {/* The panels open onto the same ground the stats close on — the
              stage simply goes quiet under them — so this margin is a beat of
              breathing, not a gap between two surfaces. */}
          <div className="mt-10 md:mt-24">
            {whatWeDo.cards.map((card, i) => (
              <OfferPanel
                key={card.title}
                title={card.title}
                text={card.text}
                image={card.image}
                index={i}
                icon={offerIcons[i] ?? "globe"}
                flip={i % 2 === 1}
              />
            ))}
          </div>
        </section>

        {/* The trail walks out of the clearing: the stage crossfades here to
            the reservoir vista at half strength — the picture the page opened
            on — and holds it under the four gains. The section carries no
            bottom padding: the lamp's descent owns the gap below, so the
            trail's line runs straight on into the thread rather than stopping
            short of a section edge. */}
        {/* No top padding on mobile, like "What we do": the panel above closes
            on its own `pb-10`, so the section's own padding stacked a second
            beat on top of a gap the panel had already opened — 113px from the
            last line of the panel to this heading. The accent rule sits on the
            section's top edge instead and the join reads as one beat. */}
        {/* Holds the ground quiet until the last panel has actually finished.
            A zone is keyed at its own middle, so without this the climb toward
            the next zone starts at the panel's midpoint and runs across the
            back half of its pin — which put the second panel's prose back on a
            bright picture. */}
        <div
          aria-hidden="true"
          data-stage-plate="1"
          data-stage-strength="0.18"
          className="h-0"
        />

        <section
          data-index-section=""
          data-stage-plate="2"
          data-stage-strength="0.3"
          className="relative px-4 text-ink md:pt-32"
        >
          {/* One photograph doing both jobs: sharp on the right, thrown out of
              focus on the left where the words stand. The text ground is the
              picture itself defocused — never a flat colour over it. */}
          <div className="gain-split relative mx-auto grid max-w-6xl overflow-hidden md:grid-cols-2">
            <div className="relative isolate overflow-hidden px-6 py-16 md:px-10 md:py-20">
              <div aria-hidden="true" className="gain-split-blur -z-10">
                <ResponsiveImage
                  src={gainImage}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <Reveal className="text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto block h-[1.25px] w-16 bg-amber"
                />
                <h2
                  className="ghost-numeral relative mt-3 font-display text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.025em]"
                  style={{ "--ghost-num": '"03"' } as React.CSSProperties}
                >
                  {gain.title}
                </h2>
              </Reveal>

              <div className="mt-6 md:mt-10">
                <GainTrail items={gain.items} />
              </div>
            </div>

            <div className="relative min-h-[52svh] md:min-h-0">
              <ResponsiveImage
                src={gainImage}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* The closing beat, on the same plate the trail walked in on and now
            at nearly full strength. The lamp is gone — its line, cone, node
            and ignition were a light fixture drawn on the page, and what the
            section is actually for is three pieces of type. They stand on the
            plate itself, and the closing line keeps the one place the accent
            carries text. */}
        {/* The second breathing zone, and it lands here because "What you
            gain" carries its own ground: its words stand on the defocused half
            of their own photograph inside the outline, not on the stage. So
            the stage is free to come all the way up between that box and the
            closing line without costing either of them a point of contrast. */}
        <div
          aria-hidden="true"
          data-stage-plate="2"
          data-stage-strength="0.92"
          className="h-0"
        />

        <section
          data-index-section=""
          data-stage-plate="2"
          data-stage-strength="0.28"
          className="relative overflow-hidden px-4 pb-24 pt-16 text-ink md:pb-32 md:pt-24"
        >
          <Reveal className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <p className="max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink">
              {gain.text}
            </p>
            <p className="mt-8 max-w-[18ch] font-display text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.025em] text-resin-deep">
              {gain.highlight}
            </p>
            <div className="mt-10">
              <ButtonLink href={gain.cta.href} variant="gold">
                {gain.cta.label}
              </ButtonLink>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
