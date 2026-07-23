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
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

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
                      className="flex size-12 shrink-0 items-center justify-center rounded-full border border-pine/30 bg-gold-chrome text-pine"
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <h2 className="font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.01em] text-ink">
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
                        className="group rounded-lg border border-amber/45 bg-gold-card transition-[border-color,box-shadow] duration-200 ease-out-quart open:border-amber/70 open:print-shadow"
                      >
                        {/* The question sits a step above its answer on weight
                            and colour, not on size or family: ten display-face
                            headings in a column read as a shouted list rather
                            than a scannable one. Its own top padding plus the
                            gap to the card above leaves 36px over the question
                            against 12px under it when open, so the pair groups
                            downward. */}
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg p-5 transition-colors duration-200 ease-out-quart hover:bg-amber-soft/20 group-open:rounded-b-none group-open:pb-3 md:px-8 [&::-webkit-details-marker]:hidden">
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
                        <p className="accordion-answer px-5 pb-5 leading-[1.7] text-ink-soft md:px-8 md:pb-6">
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
