import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { Reveal } from "@/components/reveal";
import { StageScene } from "@/components/stage-entrance";
import { OfferPanel } from "@/components/offer-panel";
import { GainTrail } from "@/components/gain-trail";
import { PhotoStage, type StagePlate } from "@/components/photo-stage";
import { SectionIndex } from "@/components/edge-furniture";
import { IntroExit } from "@/components/intro-exit";
import { ButtonLink } from "@/components/ui/button";
import { coverSizes, HERO_VIEWPORT, imagePreload } from "@/lib/images";
import { hero, whatWeDo, gain } from "@/content/home";

// The photograph "What you gain" is built on: the valley under open sky, the
// ridge running the width of it and the village under the ridge. It is the
// stage's own plate for this zone and for the closing that comes out of it.
const gainImage = "/images/pt/IMG_4619-valley.jpg";

// The three photographs the page stands on, and the only grounds below the hero.
// They are listed in the order the reader meets them. Every plate takes the
// same darkening, and none carries a filter: a per-image correction on the way
// to the screen is a second grade, and the grade is the one place tone is
// decided now.
//
// A plate is either the whole photograph or it is nothing: 1.00 or 0.00, and
// no value in between is held anywhere on the page. The ledger reading down
// from the hero is loud, loud, quiet, loud, quiet, loud, quiet, and the only
// numbers between the two are the crossfades themselves. At 0.16–0.18 — or at
// 0.90 — a picture is neither a picture nor a clean ground; it is a haze with
// shapes in it, which is what every zone below used to render.
//
// `IMG_4739-lane` used to stand here as the panels' ground, held at nothing by
// every marker that named it: the browser fetched `IMG_4739-lane-1600.avif` on
// every visit to the home page and never painted a pixel of it. It is gone,
// and it could not have taken the screen it was nearest to. The frame is a
// village street and its two crops fail the same rule from opposite ends — the
// whole plate carries overhead power cable across the sky, and the crop that
// removes the cable lands on railings, a satellite dish, a letterbox and a
// parked car.
const plates: StagePlate[] = [
  // "What we do": the group walking the track above the reservoir, and the
  // only frame available to this screen that breaks none of §2. Uncropped, it
  // shows 84.8% of its own original in a 16:10 window against the 60% floor;
  // the road shows 46.9% before its fencing is even counted, and the lane
  // cannot clear a cable or a railing at any crop.
  //
  // It used to be the hero's second slide as well, one zone above this one,
  // and the two shared a request for it. A photograph does not appear twice on
  // a page and least of all in two zones crossed one after the other, so the
  // slide gave way rather than this: the argument below is for this screen and
  // for no other, where a slide in a rotation of four could be any frame of
  // young people outdoors.
  //
  // It is also the only one that is a picture of the sentence under it. "We
  // work with young people in Cyprus and across Europe" stands on young people
  // walking in Europe, where a landscape would have said nothing about what
  // this organization does — §3's rule about the object beside a programme
  // section, applied to a ground.
  //
  // It carries its own darkening, and it needs to. The stage's shared numbers
  // (52/62/70) were set for an overcast road; this is a sunny frame with open
  // sky above a reservoir, and on the shared shade the lead measured 2.50 and
  // the ledger labels 2.58–3.08 against a 4.5 floor. At 74/82/82, held from
  // 14% to 86% so the ramp covers everything from the heading down to the
  // labels at 71% of the frame, the worst element on either viewport is 5.11.
  // The dark is `sky-anchor` rather than the shared `gold-anchor`: sky and
  // water own this frame's chroma, and a green-black over blue does not lower
  // it, it turns it. At equal strength the two are within 0.01 of each other on
  // contrast, so the choice costs nothing and buys the hue.
  {
    src: "/images/hero-1.jpg",
    position: "50% 50%",
    wipe: true,
    shade: { top: 74, mid: 82, base: 82, from: "14%", to: "86%", color: "var(--color-sky-anchor)" },
  },
  // The join between the two panels: the road between the stone walls under
  // flat overcast light, crossed rather than stopped on. It used to carry a
  // screen of its own, and that is what made its top-left fencing a problem —
  // §8 flagged it because the passage put it in front of the reader longer
  // than anything else on the page. Here it is on full for about a third of a
  // screen of scroll and gone, which is the shortest hold on the page rather
  // than the longest. The pan stays bottom-anchored: a 16:10 window shows 854
  // of this frame's 1020 rows and the fencing crosses rows 107 to 507, so no
  // pan clears it and this one clears the most of it.
  //
  // It carries its own darkening now, and the shared numbers are why it had to.
  // On 52/62/70 this plate is the whole ground under both offer panels' prose,
  // and stepped at 5px across their traversal the Youth Exchanges bullets run
  // to 3.70 at 1440x900 in both engines — the panel's four sentences sitting in
  // the top fifth of the window, where the shared ramp is at its weakest 52%.
  // The Training Courses prose crosses the foot of the window in the same
  // passage and runs to 4.29 there. Nothing moved them onto it; the sampler
  // simply never landed where they fell, and a coarser sweep read the same
  // sentences at 5.09-5.59.
  //
  // 60/70/76 is the smallest step that clears the floor with margin: at
  // 56/66/72 the worst two are still under at 4.23, at 58/68/74 they scrape
  // 4.56, and at 60/70/76 the whole set lands 4.91-6.11 in Chromium and
  // 4.91-6.07 in WebKit. `from`/`to` are declared rather than left to the
  // prop's own defaults, which are 30%/78% — the ramp's geometry is unchanged
  // and only its three strengths move.
  {
    src: "/images/pt/IMG_4582-road.jpg",
    position: "45% 100%",
    wipe: true,
    shade: { top: 60, mid: 70, base: 76, from: "22%", to: "62%" },
  },
  // The gains and the closing: the valley at full strength, and it is the
  // split. On a desktop the plate is clipped to the right of a hard vertical
  // seam at 48% and the words stand on the page's own floor to its left —
  // the Contact page's construction, with the floor where Contact has the
  // defocused half, because nothing may stand on this frame: it is the
  // brightest in the set by 20 L*, and the one place its darkened copy carried
  // words was the one place on the site that never cleared 4.5. On a phone it
  // is a band across the top of the window and the words rise over it on a
  // block of floor. `.gain-plate` in globals.css is both boxes.
  //
  // `50% 100%`: a 16:10 window keeps 61% of this frame's height, and the
  // ridge is the last third of it. Anchored to the foot the plate shows the
  // ridge across the middle of the window with the village under it and the
  // sky over it; at 88% the village went under the fold.
  //
  // The darkening is the top alone, under the chrome, and the picture is
  // released through the whole of the rest: no word stands on it, so there is
  // nothing for a mid or a base to carry, and a plate that carries no text is
  // painted at its own strength.
  //
  // It arrives as the clearing's plate does — a luminance wipe welling up from
  // the foot of the window on the stage's own ease — under the second panel
  // as it leaves, and it withdraws upward the same way under the closing. No
  // frame of either holds the picture at a strength between the two poles,
  // and nothing on the glass moves except the boundary.
  {
    src: gainImage,
    position: "50% 100%",
    className: "gain-plate",
    wipe: true,
    shade: { top: 46, mid: 0, base: 0, from: "20%", to: "100%", color: "var(--color-sky-anchor)" },
  },
];

// The first hero slide is the LCP; the backdrop reuses the same variant, so
// this one preload covers both — which only holds while the preload and the
// markup declare the same `sizes`, so both read it from the same box. That box
// is the window plus the hero's own push, not the window: the section breathes
// 3% forward and back as the card opens, and a declaration made at the window
// would land under the width the frame is painted at through the middle of it.
const heroSizes = coverSizes(hero.slides[0], HERO_VIEWPORT);
const heroPreload = imagePreload(hero.slides[0], heroSizes);

// The panel's last sentence used to be lifted out of its paragraph and stood
// on a screen of its own between the two panels. It is back where it was
// written. On its own it read as a fragment that had lost its paragraph — one
// sentence spending a screen and a half of scroll, with a wordless screen at
// either end of it — and the paragraph it left behind was a sentence short.
// Nothing moved in the document either time: the split was a re-wrapping of
// the same characters in the same order, which is the only kind of move the
// parity check allows, and undoing it is the same operation backwards.
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
        <SectionIndex />
        {/* The intro block's exit below the release. It renders nothing of
            its own: it drives the block the markup already carries. */}
        <IntroExit />

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
              rise plays inside the dissolve and the words surface out of it.

              400ms, staggered 0 / 60 / 150, not 700 and 0 / 100 / 300. The
              entrance is a clock and the exit is the scrollbar: at a real
              flick the block was still arriving while the same gesture was
              already carrying it off at 1.5x, and the statement completed 180px
              up the screen. Faster in, the words are standing while the
              crossing's last rows finish, and the release reads as one move. */}
          {/* The band's own rule. It arrives with the statement on the
              band's clock and leaves with the band at its exit rate: it is
              part of this block and belongs to nothing below it. The hero
              measures the band's row by it, which is what the attribute is
              for. */}
          <span
            aria-hidden="true"
            data-hero-rule=""
            className="block h-0.5 w-24 translate-y-14 bg-amber opacity-0 duration-[400ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] motion-reduce:translate-y-0"
          />
          {/* The statement is body copy now, on the body step and in the body
              face: the display-face "hero statement" was its own size, its own
              family and its own weight for a single sentence, which is a step
              the ramp does not need. */}
          {/* `mt-[19px]`, not `mt-5`: the rule above gained a pixel of box
              when it went to 2px, and the band is anchored to the foot of the
              window, so the pixel would have moved the rule's own row rather
              than the statement's. Given back here, the row stands exactly
              where it stood. */}
          <p className="mt-[19px] max-w-[44ch] translate-y-14 text-balance text-center text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink opacity-0 duration-[400ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-[60ms] motion-reduce:translate-y-0">
            {hero.text}
          </p>
          <div className="mt-5 translate-y-14 opacity-0 duration-[400ms] ease-out-quart group-data-[expanded]:translate-y-0 group-data-[expanded]:opacity-100 group-data-[expanded]:transition-[opacity,transform] group-data-[expanded]:delay-150 motion-reduce:translate-y-0">
            <ButtonLink href={hero.cta.href} variant="gold">
              {hero.cta.label}
            </ButtonLink>
          </div>
        </ScrollExpandMedia>

        {/* Clipped on one axis, not both. `overflow-clip` (not hidden) is
            what stops the offer panels' ghosted numerals, which overflow their
            own row by design, opening a horizontal scrollbar on a narrow
            desktop window. */}
        <section className="relative overflow-x-clip text-ink">
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
          {/* The clearing stands on a photograph now, and that is the whole of
              this zone's change. It was the one screen on the site made of flat
              colour with no image on it — the page opened on strong pictures
              and then dropped into a plain one, which broke the run at the
              first place the reader stops to read. The mechanism was never the
              problem: the rule draws, the heading surfaces out of its clipped
              line, the lead rises under it and the ledger lands last, all on
              the clock. It was a mechanism with nothing behind it.

              The village at blue hour comes up under all of it. The three
              markers below are the ramp: nothing while the hero is leaving,
              full by the time the heading is read, and held there through the
              whole zone. The rise lands under the hero card's own dissolving
              foot, so the two pictures hand over the way that foot was built to
              let them. The plate's own darkening is what makes the type
              readable — the pools that used to sit under each block are gone,
              and this plate carries its own numbers because one darkening
              cannot serve an overcast road and a blue hour. */}
          <div className="relative" data-index-section="">
            {/* The picture rises as the floor appears, not half a screen after
                it. A zone is keyed half a viewport above its own middle, so
                these two put the plate at nothing on the frame where the hero
                still fills the window and full 0.62 of a viewport later — the
                rise runs from scroll 0 to 558px at 1440x900 and to 523px at
                390x844.

                It used to start at 10svh of this section and finish at 32svh,
                which keys at 540 and 738: the hero's foot clears the bottom of
                the window at scroll 0, so 540px of scroll — 0.60 of a viewport
                at both sizes — passed with the incoming ground bare, and the
                clearing's own clock entrance fired and finished inside it. The
                complaint is that exact stretch.

                Starting at zero is only possible because the plate wipes: it
                wells up from the foot of the window rather than fading up
                across the whole of it, so the strip the hero has uncovered is
                photograph from the first pixel of it, and the frame is never
                the picture at half strength. */}
            <span
              aria-hidden="true"
              data-stage-plate="0"
              data-stage-strength="0"
              className="absolute inset-x-0 -top-[50svh] h-0"
            />
            <span
              aria-hidden="true"
              data-stage-plate="0"
              data-stage-strength="1"
              className="absolute inset-x-0 top-[12svh] h-0"
            />
            {/* `top-[100svh]`, not `bottom-0`. The two resolve to the same row
                while this block is exactly a screen tall — measured, it is, at
                553, 664, 750 and 844 — but one of them says so and the other
                inherits it from whatever the content happens to measure. Every
                key on this page is declared now. */}
            <span
              aria-hidden="true"
              data-stage-plate="0"
              data-stage-strength="1"
              className="absolute inset-x-0 top-[100svh] h-0"
            />
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
              <div className="relative md:grid md:grid-cols-12 md:items-start md:gap-x-12 xl:gap-x-20">
                <div className="relative md:col-span-6 md:self-center">
                  <div className="relative">
                    <div className="stage-lift">
                      {/* The clearing's own rule, at its own row. It used to
                          be the hero band's rule travelling down to this row
                          on the reader's scroll; a mark seen crossing from one
                          section into the next is the one thing this handover
                          must not show, so the two are two marks now, each
                          laid out in its block. Same 96 x 2 as the band's, and
                          it rises with the column on the scene's clock. */}
                      <span
                        aria-hidden="true"
                        className="block h-0.5 w-24 bg-amber"
                      />
                      {/* `mt-[7.25px]`, not `mt-2`, and for the same reason
                          the hero band's statement carries 19: the rule above
                          went from 1.25px to 2, and this column is centred in
                          its own screen, so three quarters of a pixel there
                          moves every row of the clearing by half of it. */}
                      <div className="stage-mask mt-[7.25px]">
                        <h2
                          className="stage-mask-rise type-heading font-display font-semibold tracking-[-0.025em]"
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
              </div>

              {/* The ledger carries no rules of its own beyond the desktop
                  column dividers: horizontal lines are the one mark this page
                  never draws, so the mobile rows structure themselves on the
                  numeral/label baseline alone. The rows are the wave's last
                  beats, and each counter still starts its 700ms count only
                  when it crosses into view — the ledger writes itself. */}
              <div className="relative mt-2 md:mt-12">
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

          {/* The marker that used to stand here is gone, and it was a bug
              rather than a decision. It declared plate 0 at nothing and sat at
              document row 1800 — the same row as the clearing's own last
              marker, which declares it full. A zone is keyed at its middle less
              half a viewport, so both keyed at 1350 at 1440x900 and at 1266 at
              390x844, and `PhotoStage` computes the blend as
              `(scroll - a) / (b - a)`: with the two keys equal the span is
              zero, the ratio is forced to 1 and the layer changes in a single
              frame. Measured across that one 20px step, 81.3% of the window's
              pixels changed on a desktop and 87.9% on a phone — the largest
              step anywhere on the site, and the whole of why entering the
              panels read as the photograph being switched off.

              With it deleted the fall runs from the clearing's own full key to
              the first panel's quiet key: 1350 to 1896, which is 546px and
              0.607 of a viewport; 1266 to 1753 on a phone, 487px and 0.577.
              And it runs the right way round. The ledger's last row leaves the
              top of the window at 1640 / 1511, so the ground is still a
              photograph for 256px / 242px after the numerals have gone —
              where before it went out 290px / 245px while they were still
              being read.

              It goes out as a wipe, so the picture withdraws upward through
              the frame and the panels' dark comes up from the foot of the
              window to meet them, rather than the whole photograph dimming to
              a haze across the middle of the fall. */}

          {/* The panels open onto the dark the stats hand over to — the stage
              goes quiet under them — so this margin is a beat of breathing,
              not a gap between two surfaces.

              It is the first term of the handover below it, which is why it is
              a share of the window rather than 40px. `mt-10` measured 40 at
              every height, so the handover it opens was 6.0% of a 664 screen
              and 4.7% of an 844 one; at `6svh` it is 6.0% of both. Desktop
              takes 10svh — 90px against the 96 it replaces, inside a head the
              panel's own centring already makes 250px deep. */}
          <div className="mt-[6svh] md:mt-[10svh]">
            {whatWeDo.cards.map((card, i) => (
              <div key={card.title} className="relative">
                {/* A panel's four keys, and every one of them is a share of
                    the window measured from the panel's own top row. They used
                    to be a mixture: the panel's `takes the frame` key was the
                    section's own middle and its `quiet` key was 60% of the
                    section, both of which are the panel's height — and a
                    stacked panel's height is a stack of px. The road's two keys
                    were the only ones written in `svh`, and they were anchored
                    to the join, which is that same px height measured from the
                    top of the panel above.

                    So of the eleven spans on this page, six changed length as a
                    share of the screen and the worst of them changed by 0.31 of
                    a viewport between 553 and 844. The handover into the panels
                    ran 0.892 / 0.733 / 0.649 / 0.577 — one distance of 487px,
                    doing a different amount of work at every height a phone can
                    actually be.

                    Anchoring every key to the panel's top in `svh` fixes nine
                    of the eleven outright. The two it cannot fix are the ones
                    that start inside one panel and end inside the next, because
                    the distance between those two points *is* the panel's own
                    height — and while a panel is taller than the screen there
                    is no expression that makes it a share of one. What can be
                    chosen is which two spans carry it, and both of them are
                    holds: the road's full hold, and the quiet run from the
                    second panel to the gains. A hold is a still frame, so its
                    length changing with the window is not a change of pace; a
                    ramp's length is exactly what pace means.

                    The road still crosses the join. Its rise starts at 96% of
                    the first panel and its fall ends at 50% of the second, so
                    it is full from just before the boundary to a sixth of a
                    screen after it, and at the peak the panel above is still
                    leaving the top of the window while the panel below is
                    entering the foot. Full strength, not 0.9: the ground on
                    this page is either a photograph or it is nothing.

                    **The two panels' first key is not the same number, and it
                    was the mistake worth catching.** It reads like one key —
                    "the panel takes the frame" — but the two are the ends of
                    two different withdrawals. The first panel's is where the
                    *clearing's* photograph finishes leaving, and it has to
                    outlast the ledger's last numeral, so it is late: 66%. The
                    second's is where the *road* finishes leaving, and it has to
                    be gone before the panel's own prose is read, so it is
                    early: 50%. Putting both at 66 cost the second panel's prose
                    0.26 to 0.63 of contrast on a desktop, measured at a 6px
                    step across the whole traversal — the eight-stop sweep never
                    saw it, because the element does not move and only the
                    ground's schedule under it does. */}
                <span
                  aria-hidden="true"
                  data-stage-plate="1"
                  data-stage-strength="0"
                  className={
                    i === 0
                      ? "absolute inset-x-0 top-[66svh] h-0"
                      : "absolute inset-x-0 top-[50svh] h-0"
                  }
                />
                <span
                  aria-hidden="true"
                  data-stage-plate="1"
                  data-stage-strength="0"
                  className="absolute inset-x-0 top-[72svh] h-0"
                />
                <span
                  aria-hidden="true"
                  data-stage-plate="1"
                  data-stage-strength="1"
                  className={
                    i === 0
                      ? "absolute inset-x-0 top-[96svh] h-0"
                      : "absolute inset-x-0 top-[15svh] h-0"
                  }
                />
                <OfferPanel
                  title={card.title}
                  text={card.text}
                  image={card.image}
                  index={i}
                  flip={i % 2 === 1}
                />
              </div>
            ))}
          </div>
        </section>

        {/* "What you gain" is the split: the valley at full strength on one
            side of a hard seam and the four gains on the page's own floor on
            the other. The photograph is the stage's plate and this section
            paints nothing over it on a desktop — the plate is clipped to the
            right of 48% and the floor shows through to its left, so the words
            never stand on the picture and the seam is the plate's own edge,
            with no line drawn on it.

            Below `md` the split stacks. The plate is a band across the top of
            the window, fixed with the stage, and the words rise over it on a
            block of floor whose top dissolves into the picture — so at rest
            the ridge and the village hold the upper register and the four
            lines the lower, and as the reader scrolls the block slides up
            over the picture rather than the picture ending on a row. The
            section is exactly one screen at every height: the band takes what
            the block's 332px leaves, floored at 40svh.

            No line crosses the seam. On a desktop the column stops at 42%;
            on a phone every word is below the block's 80px dissolve. */}
        <section
          data-index-section=""
          className="gain-frame relative flex min-h-svh flex-col overflow-hidden text-ink md:flex-row md:items-center"
        >
          {/* The arrival's two keys. The valley wells up from the foot of the
              window over 0.62 of a viewport of scroll — from the moment this
              section's top is 0.62 of the window above the foot until it is at
              the top — which is the range the clearing's own plate was
              approved with (its keys are −50svh and 12svh of a section that
              stands a screen below the hero: 0 to 0.62H). The first key held
              the ground quiet until the last panel had finished; it did, from
              a marker at the section's own top, so the rise ran 0.50 of a
              viewport and the boundary crossed the window a quarter faster
              than the one the reader had already seen. The second panel's
              prose is above the window before the first key at both widths,
              so the boundary never passes under a word of it.

              Declared rather than inherited, like every other key on the page:
              the section measures exactly a screen at all four heights, so the
              second lands where the section's own middle did — but it says
              so. */}
          <span
            aria-hidden="true"
            data-stage-plate="1"
            data-stage-strength="0"
            className="absolute inset-x-0 -top-[12svh] h-0"
          />
          <span
            aria-hidden="true"
            data-stage-plate="2"
            data-stage-strength="1"
            className="absolute inset-x-0 top-[50svh] h-0"
          />
          {/* The upper register on a phone: a window onto the band. */}
          <div aria-hidden="true" className="gain-window w-full shrink-0 md:hidden" />

          {/* The words, on the floor. One scene, fired once at -14%: the rule
              and the column lift together, the heading surfaces out of its
              clipped line, the hairline follows and the four rows land last,
              90ms apart — the last at 1.2s. */}
          <StageScene className="gain-copy relative flex w-full flex-1 flex-col justify-center px-6 pb-2 pt-[84px] md:w-[48%] md:flex-none md:px-[6%] md:py-24">
            <div className="stage-lift">
              <span aria-hidden="true" className="block h-0.5 w-16 bg-amber" />
              <div className="stage-mask mt-2 md:mt-3">
                <h2
                  className="stage-mask-rise type-heading font-display font-semibold tracking-[-0.025em]"
                  style={{ transitionDelay: "80ms" }}
                >
                  {gain.title}
                </h2>
              </div>
            </div>
            {/* The rule under the heading, at 62% of the text column — the
                one mark Grand Canyon puts between a heading and what hangs
                off it. It is a rule, not a divider: it stops well short of
                the column's edge so it reads as underlining the words rather
                than as a border. */}
            <span
              aria-hidden="true"
              className="stage-rise mt-3 block h-px w-[62%] bg-hairline md:mt-6"
              style={{ transitionDelay: "160ms" }}
            />
            <div className="mt-1 md:mt-4">
              <GainTrail items={gain.items} />
            </div>
          </StageScene>
        </section>

        {/* The closing beat, on clean dark: the page's last quiet zone, coming
            out of the valley as the plate leaves. The lamp is gone — its line,
            cone, node and ignition were a light fixture drawn on the page, and
            what the section is actually for is three pieces of type. They
            stand on the floor itself and the closing line keeps the one place
            the accent carries text.

            On a desktop the three stand in the split's own floor column,
            left-aligned under the gains, and the valley withdraws on the other
            side of the seam while they are read: centred, the statement
            crossed the seam and stood on the picture. On a phone the column is
            the whole width and centred, as it was. */}
        {/* The breathing marker that stood here is gone, and taking it out is
            what buys the finale its dissolve. Keyed half a viewport above
            itself it sat 450px below the gains, so the climb into the closing
            ran in two steps with the steep one first. Without it the ramp is
            one run from the gains zone to the closing — 0.81 viewports at
            1440×900, 0.74 at 390×844. */}

        <section
          data-index-section=""
          className="relative overflow-hidden px-4 pb-24 pt-16 text-ink md:px-0 md:pb-32 md:pt-24"
        >
          {/* The ground's last key. The section's own middle put it half its
              height in, and that height is 395px of padding and three blocks of
              type — so the ground left over 0.857 of a screen at 553 and 0.735
              at 844. At 25svh the run out of the valley is 0.750 of the window
              at every height, which is the figure the move was signed off at on
              a phone. */}
          <span
            aria-hidden="true"
            data-stage-plate="1"
            data-stage-strength="0"
            className="absolute inset-x-0 top-[25svh] h-0"
          />
          <Reveal className="mx-auto flex max-w-6xl flex-col items-center text-center md:mx-0 md:w-[48%] md:max-w-none md:items-start md:px-[6%] md:text-left">
            <p className="max-w-[44ch] text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink">
              {gain.text}
            </p>
            <p className="mt-8 max-w-[18ch] type-heading font-display font-semibold tracking-[-0.025em] text-resin-deep">
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
