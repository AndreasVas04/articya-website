import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { meta, hero, background, arrow, sections } from "@/content/faq";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

export default function FaqPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <div
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(background)})` }}
      >
        <div className="bg-plaster/95 px-4 py-16 md:py-24">
          <div className="mx-auto flex max-w-2xl flex-col gap-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <span
                  aria-hidden="true"
                  className="block h-1 w-16 bg-resin-deep"
                />
                <h3 className="mt-4 font-display text-2xl font-semibold leading-[1.25] text-pine-950">
                  {section.heading}
                </h3>
                <div className="mt-4 divide-y divide-sage/50 bg-plaster-bright ring-1 ring-sage/50">
                  {section.items.map((item) => (
                    <details key={item.question} className="group p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <h4 className="font-semibold text-pine-950">
                          {item.question}
                        </h4>
                        <span
                          aria-hidden="true"
                          className="text-xs text-lichen transition-transform duration-200 ease-out-quart group-open:rotate-180"
                        >
                          {arrow}
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-[1.5] text-pine-900">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
