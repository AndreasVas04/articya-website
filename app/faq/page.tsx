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
        <div className="bg-white/90 px-4 py-16">
          <div className="mx-auto flex max-w-2xl flex-col gap-12">
            {sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-xl font-semibold">{section.heading}</h3>
                <div className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
                  {section.items.map((item) => (
                    <details key={item.question} className="group p-4">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <h4 className="font-medium">{item.question}</h4>
                        <span
                          aria-hidden="true"
                          className="text-xs text-neutral-400 transition-transform group-open:rotate-180"
                        >
                          {arrow}
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-neutral-700">
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
