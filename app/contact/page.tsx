import type { Metadata } from "next";
import Image from "next/image";
import { Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { meta, hero, details } from "@/content/contact";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

const photo = {
  src: "/images/AboutImage1.jpg",
  alt: "The ArtiCYa team behind a table of Cypriot food at an intercultural evening",
};

// Brand marks matching the footer's set; lucide dropped its brand icons.
const instagramIcon = (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-none stroke-current stroke-2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const facebookIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

function ChannelCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group flex items-center gap-5 border border-sage/60 bg-plaster-bright p-5 transition-colors duration-200 ease-out-quart hover:border-resin-deep/50"
    >
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-sage/60 text-lichen transition-colors duration-200 ease-out-quart group-hover:border-resin-deep/50 group-hover:text-resin-deep"
      >
        {icon}
      </span>
      <span>
        <span className="block text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-lichen">
          {label}
        </span>
        <span className="mt-1 block font-semibold text-pine-950 transition-colors duration-200 ease-out-quart group-hover:text-resin-deep">
          {value}
        </span>
      </span>
    </a>
  );
}

// The conversion endpoint: one warm scene — the team at the table on the
// left, the three ways to reach them composed beside it.
export default function ContactPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section className="bg-plaster px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-6 md:col-start-7 md:row-start-1">
            <Reveal>
              <span aria-hidden="true" className="block h-1 w-16 bg-resin-deep" />
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-pine-950">
                {details.heading}
              </h2>
            </Reveal>
            <div className="mt-8 space-y-4">
              <Reveal delayMs={100}>
                <ChannelCard
                  icon={<Mail className="size-5" strokeWidth={1.5} />}
                  label={details.email.label}
                  value={details.email.value}
                  href={`mailto:${details.email.value}`}
                />
              </Reveal>
              <Reveal delayMs={150}>
                <ChannelCard
                  icon={instagramIcon}
                  label={details.instagram.label}
                  value={details.instagram.value}
                  href={details.instagram.href}
                  external
                />
              </Reveal>
              <Reveal delayMs={200}>
                <ChannelCard
                  icon={facebookIcon}
                  label={details.facebook.label}
                  value={details.facebook.value}
                  href={details.facebook.href}
                  external
                />
              </Reveal>
            </div>
          </div>

          <Reveal delayMs={150} className="md:col-span-5 md:row-start-1">
            <figure className="print-shadow bg-plaster-bright p-2 ring-1 ring-sage/50 md:p-3">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={withBasePath(photo.src)}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
