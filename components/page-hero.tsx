import { Reveal } from "@/components/reveal";

interface PageHeroProps {
  heading: string;
  text: string;
}

// The inner pages open on the photograph full-bleed with the type centred over
// it — and the photograph is not in this component. It is the page's stage: one
// fixed layer behind everything, holding the same frame sharp under the hero
// and out of focus under the reading below it (see `PhotoStage`). That is the
// whole of the fix for the hard cuts. The hero used to paint its own picture
// in a 2.75:1 letterbox band and end it on a ruled line — About dropped 49% of
// its mean row luminance in a single row at y=521, Contact 47% at 492, FAQ 54%
// at 791 — and no fade or mask can do better than soften a junction that does
// not need to exist. The photograph simply never ends now.
//
// Full height, and that is the second thing it buys. A 3:4 frame in a 2.75:1
// band showed 27% of its area, well under the 60% floor; the same frame in the
// whole window shows 47%. The remainder is not a cropping decision — a
// portrait frame in a landscape window cannot do better than the ratio of the
// two — it needs a landscape source.
//
// What carries the type is the plate's own top-to-bottom darkening and nothing
// else; the strength is per page and lives on the plate now, because a shaded
// forest road arrives most of the way down on its own and a sunlit track
// between a hillside and a reservoir arrives blown out.
export function PageHero({ heading, text }: PageHeroProps) {
  return (
    <section
      data-index-section=""
      data-stage-plate="0"
      data-stage-strength="1"
      className="relative flex min-h-svh items-center"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-28 text-center md:pb-20 md:pt-36">
        <Reveal>
          <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
          {/* 11ch of the display face, so the break travels with the size
              across viewports — at register A the measure has to be much
              narrower or the longest heading runs the width of the window. */}
          <h1 className="type-title mx-auto mt-6 max-w-[11ch] text-balance font-display font-semibold tracking-[-0.025em] text-ink">
            {heading}
          </h1>
          <p className="mx-auto mt-8 max-w-[44ch] text-pretty text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink">
            {text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
