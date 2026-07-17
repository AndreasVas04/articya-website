import type { Metadata } from "next";
import { Backpack, Compass, Send, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { meta, hero, arrow, sections } from "@/content/faq";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

// One icon per question group, in section order.
const sectionIcons = [Compass, ShieldCheck, Backpack, Send];

// Native details/summary keeps every answer in the exported markup and
// working without JS; the open animation lives in globals.css. The whole
// page sits on one daylight ground — hierarchy between question groups
// comes from the header rail, hairlines and spacing, not painted zones.
export default function FaqPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section className="bg-plaster px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          {sections.map((section, i) => {
            const Icon = sectionIcons[i] ?? Compass;
            return (
              <div
                key={section.heading}
                className={cn(
                  "grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-12",
                  i > 0 && "mt-12 border-t border-sage/40 pt-12 md:mt-16 md:pt-16"
                )}
              >
                <Reveal className="md:col-span-4">
                  <div className="flex items-center gap-4 md:sticky md:top-28">
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sage/60 bg-plaster-bright text-lichen"
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                    <h2 className="font-display text-2xl font-semibold leading-[1.25] text-pine-950">
                      {section.heading}
                    </h2>
                  </div>
                </Reveal>
                <Reveal delayMs={100} className="md:col-span-7 md:col-start-6">
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <details
                        key={item.question}
                        className="group rounded-lg border border-sage/50 bg-plaster-bright transition-[border-color,box-shadow] duration-200 ease-out-quart open:border-sage open:print-shadow"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg p-5 transition-colors duration-200 ease-out-quart hover:bg-plaster group-open:rounded-b-none md:px-6 [&::-webkit-details-marker]:hidden">
                          <h3 className="font-sans text-base font-semibold leading-[1.4] text-pine-950">
                            {item.question}
                          </h3>
                          <span
                            aria-hidden="true"
                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-sage/60 text-[0.625rem] text-lichen transition-transform duration-200 ease-out-quart group-open:rotate-180"
                          >
                            {arrow}
                          </span>
                        </summary>
                        <p className="accordion-answer px-5 pb-5 leading-[1.7] text-pine-900 md:px-6 md:pb-6">
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
