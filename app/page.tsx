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

// The photograph "What you gain" is built on, sharp at one end and defocused
// under the words at the other. The lane crop, not the whole frame: above it
// the pole and its cables cross the sky from side to side, and no heading can
// be set over that.
const gainImage = "/images/pt/IMG_4739-lane.jpg";

// The three photographs the page stands on, and the only grounds below the
// hero. Every plate takes the same darkening; the per-plate floors that used
// to vary it held the middle of each picture down and are gone.
const plates: StagePlate[] = [
  // The clearing: the road between the stone walls under flat overcast light.
  // Cropped below the cable that crosses the whole of its sky, and held a
  // little off full saturation so the green either side of the road stays a
  // ground rather than a colour.
  {
    src: "/images/pt/IMG_4582-road.jpg",
    position: "50% 40%",
    saturation: 0.88,
    brightness: 0.78,
  },
  // The panels: the valley in warm light, quiet, all but out at 0.18. Cropped
  // above the four lines that cross its lower right — faint at 0.18, but a
  // cable is the one thing on these frames that reads as clutter however faint
  // it is.
  { src: "/images/pt/IMG_4619-valley.jpg", position: "50% 50%" },
  // The village at blue hour, and the page closing on it. The same lane crop
  // the gains stand on: the whole frame above it is the pole and its cables,
  // and this plate shows through the masked ends of that photograph, so an
  // uncropped one would have put them straight back into the top of it.
  { src: "/images/pt/IMG_4739-lane.jpg", position: "50% 30%" },
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

          {/* A breathing zone: the photograph swells between two reading
              passages. It is a measurement marker and nothing else — zero
              height, so it moves no layout and only tells the stage where the
              ground is allowed to be loud. It is 0.42 rather than the 0.92 it
              carried, and the difference is the half screen between it and the
              ledger: a marker with no height is keyed half a viewport above
              itself, so at 0.92 the ground reached full strength while the
              stats were still being read, and the labels measured 1.3 against
              a 4.5 floor. The swell is what a reading passage can survive
              beside it, not what the empty stretch could take. */}
          <div
            aria-hidden="true"
            data-stage-plate="0"
            data-stage-strength="0.42"
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
            <div className="gain-defocus">
              {[1, 2, 3, 4].map((step) => (
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
                it dissolves at the two ends along with the photograph. */}
            <div className="plate-shade pointer-events-none absolute inset-0 [--shade-bottom:70%] [--shade-mid:6%] [--shade-mid-from:20%] [--shade-mid-to:60%] [--shade-top:70%]" />
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

        {/* The closing beat, on the same plate the trail walked in on and now
            at nearly full strength. The lamp is gone — its line, cone, node
            and ignition were a light fixture drawn on the page, and what the
            section is actually for is three pieces of type. They stand on the
            plate itself, and the closing line keeps the one place the accent
            carries text. */}
        {/* The second breathing zone. It used to take the ground all the way
            up here, on the reasoning that "What you gain" stood inside its own
            outlined box and could not be touched by it. There is no box now:
            the gains are a full-bleed photograph, so a loud stage immediately
            under its foot draws the one thing that frame exists not to have —
            a horizontal line under a picture — and the same swell was carrying
            the closing lede and line at 2.2 and 1.3 against their floors. Both
            answer to one number, and it is the swell either side of a reading
            passage rather than a spike between two of them. */}
        <div
          aria-hidden="true"
          data-stage-plate="2"
          data-stage-strength="0.36"
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
