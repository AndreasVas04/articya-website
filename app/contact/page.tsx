import { Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { GroundLift, PhotoGround } from "@/components/ground-parallax";
import { pageMetadata } from "@/lib/metadata";
import { meta, hero, details } from "@/content/contact";

export const metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/contact/",
});

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
      className="group relative flex h-full items-center gap-5 rounded-lg border border-amber/55 p-5 transition duration-200 ease-out-quart hover:-translate-y-0.5 hover:border-amber/80 hover:print-shadow md:flex-col md:px-6 md:py-10 md:text-center"
    >
      {/* No fill: `gold-card` was a 282px panel of flat gold on a photographic
          ground. The amber frame stays and this soft-edged pool inside it
          carries the words — one wash, at the 0.55 ceiling, never stacked. */}
      <div
        aria-hidden="true"
        className="ground-lift card-lift pointer-events-none rounded-lg"
      >
        <div className="ground-lift-pool absolute inset-0" />
      </div>
      <span
        aria-hidden="true"
        className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-pine/30 text-pine transition-colors duration-200 ease-out-quart group-hover:border-resin-deep/50 group-hover:text-resin-deep md:size-14"
      >
        {icon}
      </span>
      <span className="relative min-w-0">
        <span className="block text-[0.8125rem] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-ink md:mt-6">
          {label}
        </span>
        {/* Body weight, not semibold: at 16/600 the value sat 3px from its
            own 13/600 label and the two read as one clump. The label keeps
            the weight and the uppercase tracking, the value reads as text —
            the same eyebrow-and-value pairing the stats ledger uses. */}
        <span className="mt-1 block break-words leading-[1.5] text-ink transition-colors duration-200 ease-out-quart group-hover:text-resin-deep md:mt-2">
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

      <section className="relative overflow-hidden px-4 py-20 md:py-28">
        <PhotoGround src="/images/pt/IMG_4585.jpg" framing={{ y: 55, ySm: 46 }} />
        <div className="relative mx-auto max-w-4xl">
          <Reveal className="relative text-center">
            <GroundLift />
            <span aria-hidden="true" className="relative mx-auto block h-[1.25px] w-16 bg-amber" />
            <h2 className="relative mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-ink">
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
