import { Backpack, Compass, Send, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PhotoStage, type StagePlate } from "@/components/photo-stage";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";
import { meta, hero, arrow, sections } from "@/content/faq";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/faq/",
});

// The page's ground: the reservoir under the ridge, sharp under the hero and
// out of focus under the questions. It replaced the shaded forest road, which
// carried a power cable across its sky, was also the home hero's second slide
// and a finale tile, and as a 3:4 portrait showed 47% of itself in a 16:10
// window; this frame is cut to 0.968:1 and shows 60.5% on a desktop and 60.7%
// at 390x664. It is two stops brighter than the road in its middle third
// (L* 46.7 against 23.6), so the darkening below was re-measured on it rather
// than carried over: the numbers hold.
//
// The sharp plate's mid and base are 79/80 rather than 73/74, and the reason
// is the state no sweep used to reach: with a <details> open, its answer is
// `ink-soft` - the dimmest text on the site - and it crosses this plate low in
// the window while the crossfade to the soft plate is barely under way, so
// this plate is 92-97% of the ground under it. On the forest road the first
// two answers measured 3.94 and 4.16 there against a 4.5 floor at 73/74; on
// this frame, at 79/80, the first answer reads 4.94 at the glyph's own ink at
// 390x664 with every answer open, which is the page's smallest margin and the
// reason neither plate comes down. The soft plate cannot reach them: at those
// scrolls it is carrying three parts in a hundred.
const plates: StagePlate[] = [
  { src: hero.image, position: "50% 50%", priority: true, shade: { top: 85, mid: 79, base: 80, color: "var(--color-land-anchor)" } },
  {
    src: hero.image,
    position: "50% 50%",
    soft: true,
    shade: { top: 52, mid: 62, base: 70, from: "22%", to: "62%", color: "var(--color-land-anchor)" },
  },
];

// One icon per question group, in section order.
const sectionIcons = [Compass, ShieldCheck, Backpack, Send];

// The same questions and answers as structured data, built from the frozen
// content constants so the two can never drift. `<` is escaped so the JSON
// can never close its own script tag.
const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: sections.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))
  ),
}).replace(/</g, "\\u003c");

// Native details/summary keeps every answer in the exported markup and
// working without JS; the open animation lives in globals.css. The whole
// page sits on one gold ground - hierarchy between question groups
// comes from the header rail, hairlines and spacing, not painted zones.
export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <PhotoStage plates={plates} />
      <PageHero heading={hero.heading} text={hero.text} longHeading />

      <section
        data-index-section=""
        data-stage-plate="1"
        data-stage-strength="1"
        className="relative px-4 py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
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
                  <div className="flex items-center gap-4 md:sticky md:top-28">
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center text-pine"
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <h2 className="type-heading font-display font-semibold tracking-[-0.025em] text-ink">
                      {section.heading}
                    </h2>
                  </div>
                </Reveal>
                {/* Six columns, not seven: at seven the answers ran 76–83
                    characters, where every other 16px block on the site sits
                    in 576px or less. The rail takes the column back so the
                    gutter between the two stays one step, not two. */}
                <Reveal delayMs={100} className="md:col-span-6 md:col-start-7">
                  {/* No fills and no boxes: each row is separated from the
                      next by one amber hairline and nothing else. A filled
                      rectangle behind a paragraph is a local shape however
                      quiet its colour, and ten of them stacked read as a stack
                      of cards rather than a list of questions. */}
                  <div>
                    {section.items.map((item, j) => (
                      <details
                        key={item.question}
                        className={cn(
                          "group",
                          j > 0 && "border-t-[1.25px] border-amber/34"
                        )}
                      >
                        {/* The question sits a step above its answer on weight
                            and colour, not on size or family: ten display-face
                            headings in a column read as a shouted list rather
                            than a scannable one. Its own top padding plus the
                            gap to the card above leaves 36px over the question
                            against 12px under it when open, so the pair groups
                            downward. */}
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors duration-200 ease-out-quart group-open:pb-3 [&::-webkit-details-marker]:hidden">
                          <h3 className="type-body font-sans font-semibold leading-[1.45] text-ink">
                            {item.question}
                          </h3>
                          <span
                            aria-hidden="true"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-amber/45 text-[0.625rem] text-ink-soft transition-transform duration-200 ease-out-quart group-open:rotate-180"
                          >
                            {arrow}
                          </span>
                        </summary>
                        <p className="accordion-answer type-body pb-5 text-ink-soft md:pb-6">
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
