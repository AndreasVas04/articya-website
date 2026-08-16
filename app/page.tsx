import { Fragment } from "react";
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

// The photograph "What you gain" is built on, sharp at one end and defocused
// under the words at the other: the valley under open sky, the ridge running
// the width of it. It is also the plate this section and the closing stand on,
// so the frame's two masked ends dissolve into their own picture rather than
// into a different one.
const gainImage = "/images/pt/IMG_4619-valley.jpg";

// The three photographs the page stands on, and the only grounds below the
// hero. Every plate takes the same darkening, and none carries a filter: a
// per-image correction on the way to the screen is a second grade, and the
// grade is the one place tone is decided now.
//
// A plate is either a photograph or it is nothing — there is no strength
// between 0.04 and 0.75 anywhere on the site. At 0.16–0.18 a picture is
// neither: it is a haze with shapes in it, which is what every quiet zone
// below used to render.
const plates: StagePlate[] = [
  // The clearing, and the loud passage between the two offer panels: the road
  // between the stone walls under flat overcast light. The clearing holds it
  // at nothing and the passage is the one place it comes up to full strength.
  { src: "/images/pt/IMG_4582-road.jpg", position: "45% 100%" },
  // The panels' ground. They now carry their own photographs as objects, so
  // this plate is held at nothing under them.
  { src: "/images/pt/IMG_4739-lane.jpg", position: "50% 50%" },
  // The gains and the closing: the valley, the same frame the gains section
  // lays edge to edge over it — so the finale is that picture arriving at full
  // strength out of its own defocused copy.
  { src: gainImage, position: "50% 70%" },
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

        {/* overflow-clip (not hidden) so the offer panels' ghosted numerals,
            which overflow their own row by design, cannot open a horizontal
            scrollbar on a narrow desktop window. */}
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
          {/* The clearing stands on the page's stage: the road between the
              stone walls, so the world the hero opened on carries on under the
              heading instead of ending at a seam. The plate's own darkening is
              what makes the type readable — the pools that used to sit under
              each block are gone. */}
          <div className="relative" data-index-section="">
            {/* The clearing takes a whole screen and stands its words in the
                middle of it. It used to open flush against the hero's foot,
                which put the heading and the ledger in the bottom quarter of
                the screen the reader lands on with three empty quarters of
                photograph above them — the block read as having fallen to the
                bottom of the frame rather than as standing in it. */}
            <StageScene
              fireMargin="-30%"
              className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-4 xl:max-w-[min(84rem,92vw)]"
            >
              <div
                data-stage-plate="0"
                data-stage-strength="0"
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
                data-stage-strength="0"
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

          {/* The breathing zone that used to swell here is held at nothing, and
              the page's geometry is why. A zone is keyed at its own middle, so
              the window this marker has to work in runs from the ledger's key
              to the point where the first panel's words are on screen: 416px
              at 1440×900, 444px at 390×844 — under half a screen either side
              of a peak. A picture that arrives and leaves inside a quarter of
              a viewport is a flash, not a breath, and the only way to buy the
              room is to open an empty stretch of page. The stage is a fixed
              layer, so scrolling an empty stretch moves nothing on screen at
              all: that is the stall this phase exists to avoid, and it costs
              more than the swell is worth. The marker stays, at nothing, so
              the ground is held down through the whole reading passage rather
              than drifting up toward the panels. */}
          <div
            aria-hidden="true"
            data-stage-plate="0"
            data-stage-strength="0"
            className="h-0"
          />

          {/* The panels open onto the same ground the stats close on — the
              stage simply goes quiet under them — so this margin is a beat of
              breathing, not a gap between two surfaces. */}
          <div className="mt-10 md:mt-24">
            {whatWeDo.cards.map((card, i) => (
              <Fragment key={card.title}>
                {/* The loud passage between the two panels. Two quiet zones in
                    a row is the one thing the rhythm forbids, and the panels
                    were the second and third of four: the road between the
                    stone walls comes up to full strength here, carrying no
                    text at all, so the reader crosses a photograph between the
                    two readings instead of one long dark stretch. It is the
                    plate the page already fetches for the clearing and has
                    never actually shown.

                    What the reader crosses with nothing to read is not this
                    block's height — it is the gap between the last row of one
                    panel's prose leaving the top of the window and the first
                    row of the next one's entering the bottom, and the panels
                    are pinned, so each of those costs most of a screen on top
                    of the pin. That gap is 0.98 of a viewport on desktop and
                    0.93 on a phone, which is the ceiling: a longer one is a
                    passage where only the background changes.

                    The four markers are why the block is taller than the gap.
                    A zone is keyed half a window above its own middle, so left
                    to the defaults the crossfade would start under the words
                    still leaving and finish under the words already arriving —
                    measured that way, the second panel's title came in over a
                    0.8 plate at 2.45 against a 3.0 floor. These put the two
                    ramps and the plateau between them inside the gap instead:
                    quiet, up, hold, down, quiet. The plate is at full strength
                    for 0.81 of a viewport on both, and every ramp crosses its
                    own half-way point with the words off the screen. The two
                    viewports carry different numbers because their prose sits
                    at different heights inside the frame. */}
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    data-stage-plate="0"
                    data-stage-strength="0.9"
                    className="relative h-[130svh] md:h-[145svh]"
                  >
                    <span
                      data-stage-plate="0"
                      data-stage-strength="0"
                      className="absolute inset-x-0 top-0 h-0 md:top-[18svh]"
                    />
                    <span
                      data-stage-plate="0"
                      data-stage-strength="0.9"
                      className="absolute inset-x-0 top-[14svh] h-0 md:top-[48svh]"
                    />
                    <span
                      data-stage-plate="0"
                      data-stage-strength="0.9"
                      className="absolute inset-x-0 top-[85svh] h-0 md:top-[108svh]"
                    />
                    <span
                      data-stage-plate="0"
                      data-stage-strength="0"
                      className="absolute inset-x-0 top-[99svh] h-0 md:top-[138svh]"
                    />
                  </div>
                )}
                <OfferPanel
                  title={card.title}
                  text={card.text}
                  image={card.image}
                  index={i}
                  flip={i % 2 === 1}
                />
              </Fragment>
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
          data-stage-strength="0"
          className="h-0"
        />

        <section
          data-index-section=""
          data-stage-plate="2"
          data-stage-strength="0.9"
          className="gain-frame relative isolate flex min-h-svh items-center overflow-hidden text-ink"
        >
          {/* One photograph, edge to edge, and it goes out of focus across
              itself: the sharp frame with four softer copies of the same frame
              masked over its left, each fading into the next. There is no
              second picture, no divider and no box — what the words stand on
              is the far end of a gradient, so the ground under them can only
              ever read as this photograph, defocused. */}
          <div aria-hidden="true" className="gain-ground absolute inset-0 -z-10">
            <ResponsiveImage
              src={gainImage}
              alt=""
              fill
              sizes="100vw"
              className="gain-photo"
            />
            {/* Softest last, and that is load-bearing. Each copy is opaque out
                to its own hold and only then fades, so the last one painted is
                the one the reader sees over that whole stretch: in DOM order
                1→4 the gentlest step covered the other three and the left of
                the frame rendered at blur 6px / brightness 0.86 instead of
                30px / 0.42 — the ramp existed in the stylesheet and nowhere on
                the page. It was invisible while this section stood on a
                blue-hour lane, which was dark enough to carry the words on its
                own; under an open sky it measured 1.22. */}
            <div className="gain-defocus">
              {[4, 3, 2, 1].map((step) => (
                <div key={step} className={`gain-soft gain-soft-${step}`}>
                  <ResponsiveImage
                    src={gainImage}
                    alt=""
                    fill
                    sizes="100vw"
                    className="gain-photo"
                  />
                </div>
              ))}
            </div>
            {/* The frame's own darkening, and the whole of it. Full width, so
                it has no horizontal extent to read as a shape behind anything;
                it carries the picture where the chrome crosses it and releases
                it through the middle, and it rides inside the masked layer so
                it dissolves at the two ends along with the photograph.

                The middle held 6%, which is what a blue-hour lane needed. This
                frame is a valley under open sky and the words stand on the sky
                end of the defocus ramp: the trail items measured 1.60–2.64
                against a 3.0 floor. The release is now 44%, and it darkens
                toward `sky-anchor` — the sky owns this frame's chroma (its own
                hue is −109.5°/−98.4°, the green-black's is 152.5°), so the
                default took it 28° off its hue at this strength where the
                sky's own dark takes it 4.4°. */}
            <div className="plate-shade pointer-events-none absolute inset-0 [--shade-bottom:70%] [--shade-color:var(--color-sky-anchor)] [--shade-mid:44%] [--shade-mid-from:20%] [--shade-mid-to:60%] [--shade-top:70%]" />
          </div>

          <div className="relative w-full px-6 py-20 md:w-[46%] md:px-12 md:py-24">
            <Reveal className="text-center">
              <span
                aria-hidden="true"
                className="mx-auto block h-[1.25px] w-16 bg-amber"
              />
              <h2 className="mt-3 font-display text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.025em]">
                {gain.title}
              </h2>
            </Reveal>

            <div className="mt-6 md:mt-10">
              <GainTrail items={gain.items} />
            </div>
          </div>
        </section>

        {/* The closing beat, and the page's one loud ground: the lane at blue
            hour, at 0.90, rising out of the dark the gains frame dissolves
            into. The lamp is gone — its line, cone, node and ignition were a
            light fixture drawn on the page, and what the section is actually
            for is three pieces of type. They stand on the plate itself,
            carried by the plate's own darkening, and the closing line keeps
            the one place the accent carries text.

            It is the lane rather than the valley the gains stand on, and the
            picture decided that. The valley is the brightest frame in the set
            by 20 L*, and at 0.90 the closing line measured 1.00 against a 3.0
            floor on it — the only way to carry the words on that frame is to
            darken it back to the haze this phase exists to remove. The lane is
            the darkest, so it can be a photograph and carry type at the same
            time. It also gives the page the alternation the ground is for:
            photograph, clean dark, photograph. */}
        {/* The breathing marker that stood here is gone, and taking it out is
            what buys the finale its dissolve. Keyed half a viewport above
            itself it sat 450px below the gains, so the climb into the closing
            ran in two steps with the steep one first. Without it the ramp is
            one run from the gains zone to the closing — 0.81 viewports at
            1440×900, 0.74 at 390×844. */}

        <section
          data-index-section=""
          data-stage-plate="1"
          data-stage-strength="0"
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
