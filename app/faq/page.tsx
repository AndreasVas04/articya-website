import { Backpack, Compass, Send, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
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
// working without JS; the open animation lives in globals.css. The whole
// page sits on one gold ground — hierarchy between question groups
// comes from the header rail, hairlines and spacing, not painted zones.
export default function FaqPage() {
  return (
    <>
      {/* The shaded forest road. Dark already through the trees, but the
          longest headline on the site crosses the whole frame, including the
          gap of open sky the road runs toward. */}
      <PageHero
        image={hero.image}
        heading={hero.heading}
        text={hero.text}
        shade={{ top: 81, mid: 64, base: 67 }}
      />

      <section className="gold-field gold-field-chrome-bottom gold-floor px-4 py-16 md:py-24">
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
                    <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink">
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
                          <h3 className="font-sans text-[clamp(1rem,1.3vw,1.16rem)] font-semibold leading-[1.45] text-ink">
                            {item.question}
                          </h3>
                          <span
                            aria-hidden="true"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-amber/45 text-[0.625rem] text-resin-deep transition-transform duration-200 ease-out-quart group-open:rotate-180"
                          >
                            {arrow}
                          </span>
                        </summary>
                        <p className="accordion-answer max-w-[44ch] pb-5 text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink-soft md:pb-6">
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
