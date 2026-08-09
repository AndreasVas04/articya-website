import { Backpack, Compass, Send, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { GroundLift, PhotoGround } from "@/components/ground-parallax";
import { pageMetadata } from "@/lib/metadata";
import { meta, hero, arrow, sections } from "@/content/faq";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/faq/",
});

// One icon per question group, in section order.
const sectionIcons = [Compass, ShieldCheck, Backpack, Send];

// Native details/summary keeps every answer in the exported markup and
// working without JS; the open animation lives in globals.css. The page stands
// on one photograph, framed on its middle distance — the village and the
// terraced fields. Higher in the frame is open sky, which measures beautifully
// and reads as a blue gradient; lower is the path and the ferns, which read as
// a photograph and swallow ten cards' worth of 16px answers. The middle band is
// the one that is both. Hierarchy between question groups comes from the header
// rail, hairlines and spacing, not painted zones.
export default function FaqPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <PhotoGround src="/images/pt/IMG_4585.jpg" framing={{ y: 34, ySm: 40 }} />
        <div className="relative mx-auto max-w-6xl">
          {sections.map((section, i) => {
            const Icon = sectionIcons[i] ?? Compass;
            return (
              <div
                key={section.heading}
                className={cn(
                  "grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-12",
                  i > 0 && "mt-12 border-t border-hairline pt-12 md:mt-16 md:pt-16"
                )}
              >
                <Reveal className="md:col-span-5">
                  <div className="relative flex items-center gap-4 md:sticky md:top-28">
                    <GroundLift />
                    <span
                      aria-hidden="true"
                      className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-pine/30 bg-gold-chrome text-pine"
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <h2 className="relative font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] text-ink">
                      {section.heading}
                    </h2>
                  </div>
                </Reveal>
                {/* Six columns, not seven: at seven the answers ran 76–83
                    characters, where every other 16px block on the site sits
                    in 576px or less. The rail takes the column back so the
                    gutter between the two stays one step, not two. */}
                <Reveal delayMs={100} className="md:col-span-6 md:col-start-7">
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <details
                        key={item.question}
                        className="group relative rounded-lg border border-amber/45 transition-[border-color,box-shadow] duration-200 ease-out-quart open:border-amber/70 open:print-shadow"
                      >
                        {/* The card carries no fill. `gold-card` was a flat
                            552px panel of gold, which is a painted zone at any
                            radius; the frame stays, and this soft-edged pool
                            inside it carries the words over the photograph. */}
                        <div
                          aria-hidden="true"
                          className="ground-lift card-lift pointer-events-none rounded-lg"
                        >
                          <div className="ground-lift-pool absolute inset-0" />
                        </div>
                        {/* The question sits a step above its answer on weight
                            and colour, not on size or family: ten display-face
                            headings in a column read as a shouted list rather
                            than a scannable one. Its own top padding plus the
                            gap to the card above leaves 36px over the question
                            against 12px under it when open, so the pair groups
                            downward. */}
                        <summary className="relative flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg p-5 transition-colors duration-200 ease-out-quart hover:bg-amber-soft/20 group-open:rounded-b-none group-open:pb-3 md:px-8 [&::-webkit-details-marker]:hidden">
                          <h3 className="font-sans text-[1.0625rem] font-semibold leading-[1.45] text-ink">
                            {item.question}
                          </h3>
                          <span
                            aria-hidden="true"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-amber/45 text-[0.625rem] text-resin-deep transition-transform duration-200 ease-out-quart group-open:rotate-180"
                          >
                            {arrow}
                          </span>
                        </summary>
                        {/* `ink`, not `ink-soft`: over a photograph under a
                            0.55 pool, `ink-soft` needs open sky to reach 4.5
                            and an answer cannot be guaranteed one. */}
                        <p className="accordion-answer relative px-5 pb-5 leading-[1.7] text-ink md:px-8 md:pb-6">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
