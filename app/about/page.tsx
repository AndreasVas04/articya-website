import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { meta, hero, background, rows } from "@/content/about";
import { cn, withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

export default function AboutPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <article
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(background)})` }}
      >
        <div className="bg-white/90 px-4 py-16">
          <div className="mx-auto flex max-w-5xl flex-col gap-12">
            {rows.map((row) => (
              <div
                key={row.image.src}
                className={cn(
                  "flex flex-col gap-8 md:flex-row md:items-center",
                  row.reverse && "md:flex-row-reverse"
                )}
              >
                <div className="space-y-4 text-neutral-700 md:w-1/2">
                  {row.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
                <div className="md:w-1/2">
                  <Image
                    src={withBasePath(row.image.src)}
                    alt={row.image.alt}
                    width={1200}
                    height={900}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
