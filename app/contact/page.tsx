import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { meta, hero, details } from "@/content/contact";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
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
      className="group flex h-full items-center gap-5 rounded-lg border border-amber/55 bg-gold-card p-5 transition duration-200 ease-out-quart hover:-translate-y-0.5 hover:border-amber/80 hover:print-shadow md:flex-col md:px-6 md:py-10 md:text-center"
    >
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-pine/30 text-pine transition-colors duration-200 ease-out-quart group-hover:border-resin-deep/50 group-hover:text-resin-deep md:size-14"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-ink-soft md:mt-6">
          {label}
        </span>
        <span className="mt-1 block break-words font-semibold text-ink transition-colors duration-200 ease-out-quart group-hover:text-resin-deep md:mt-2">
          {value}
        </span>
      </span>
    </a>
  );
}

// The conversion endpoint: the invitation at full voice and the three ways
// to reach the team, composed to hold the viewport on their own.
export default function ContactPage() {
  return (
    <>
      <PageHero image={hero.image} heading={hero.heading} text={hero.text} />

      <section className="gold-field gold-field-chrome-bottom gold-floor px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
            <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-ink">
              {details.heading}
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
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
      </section>
    </>
  );
}
