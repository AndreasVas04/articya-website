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
        <div className="bg-white/90 px-4 py-16">
          <div className="mx-auto max-w-2xl rounded-lg border border-neutral-200 bg-white p-8">
            <h3 className="text-xl font-semibold">{details.heading}</h3>
            <div className="mt-6 space-y-3 text-neutral-700">
              <p>
                <strong>{details.email.label}</strong>{" "}
                <span>{details.email.value}</span>
              </p>
              <p>
                <strong>{details.instagram.label}</strong>{" "}
                <a
                  href={details.instagram.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {details.instagram.value}
                </a>
              </p>
              <p>
                <strong>{details.facebook.label}</strong>{" "}
                <a
                  href={details.facebook.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
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
