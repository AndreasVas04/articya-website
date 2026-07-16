import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { meta, hero, background, details } from "@/content/contact";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

export default function ContactPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(background)})` }}
      >
        <div className="bg-plaster/95 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl bg-plaster-bright p-8 ring-1 ring-sage/50">
            <span aria-hidden="true" className="block h-1 w-16 bg-resin-deep" />
            <h3 className="mt-6 font-display text-2xl font-semibold leading-[1.25] text-pine-950">
              {details.heading}
            </h3>
            <div className="mt-6 space-y-3 text-pine-900">
              <p>
                <strong className="font-semibold text-pine-950">
                  {details.email.label}
                </strong>{" "}
                <span>{details.email.value}</span>
              </p>
              <p>
                <strong className="font-semibold text-pine-950">
                  {details.instagram.label}
                </strong>{" "}
                <a
                  href={details.instagram.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-resin-deep underline underline-offset-2 transition-colors duration-200 hover:text-pine-950"
                >
                  {details.instagram.value}
                </a>
              </p>
              <p>
                <strong className="font-semibold text-pine-950">
                  {details.facebook.label}
                </strong>{" "}
                <a
                  href={details.facebook.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-resin-deep underline underline-offset-2 transition-colors duration-200 hover:text-pine-950"
                >
                  {details.facebook.value}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
