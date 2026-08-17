import { Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PhotoStage, type StagePlate } from "@/components/photo-stage";
import { Reveal } from "@/components/reveal";
import { pageMetadata } from "@/lib/metadata";
import { meta, hero, details } from "@/content/contact";

export const metadata = pageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/contact/",
});

// The page's ground: the walk out to the reservoir under a midday sun, sharp
// under the hero and out of focus under the channels. A white track and pale
// water run straight through the middle of the frame, both clipped at 255
// before any darkening reaches them, so it takes the most of the three and has
// the least colour to lose.
const plates: StagePlate[] = [
  { src: hero.image, position: "50% 50%", priority: true, shade: { top: 84, mid: 69, base: 71, color: "var(--color-land-anchor)" } },
  {
    src: hero.image,
    position: "50% 50%",
    soft: true,
    shade: { top: 52, mid: 62, base: 70, from: "22%", to: "62%", color: "var(--color-land-anchor)" },
  },
];

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
      className="group flex h-full items-center gap-5 py-6 transition-colors duration-200 ease-out-quart md:flex-col md:py-10 md:text-center"
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
        {/* Body weight, not semibold: at 16/600 the value sat 3px from its
            own 13/600 label and the two read as one clump. The label keeps
            the weight and the uppercase tracking, the value reads as text —
            the same eyebrow-and-value pairing the stats ledger uses. */}
        <span className="mt-1 block max-w-[44ch] break-words text-[clamp(1rem,1.3vw,1.16rem)] leading-[1.66] text-ink transition-colors duration-200 ease-out-quart group-hover:text-resin-deep md:mt-2">
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
      <PhotoStage plates={plates} />
      <PageHero heading={hero.heading} text={hero.text} />

      <section
        data-index-section=""
        data-stage-plate="1"
        data-stage-strength="1"
        className="relative px-4 py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <span aria-hidden="true" className="mx-auto block h-[1.25px] w-16 bg-amber" />
            <h2 className="mt-4 font-display text-[clamp(2.3rem,6vw,5rem)] font-semibold leading-[0.94] tracking-[-0.025em] text-ink">
              {details.heading}
            </h2>
          </Reveal>
          {/* No fills: the three channels are separated by one amber
              hairline — horizontal between the stacked rows on mobile,
              vertical between the columns on desktop. */}
          <div className="mt-12 grid grid-cols-1 divide-y-[1.25px] divide-amber/34 md:mt-16 md:grid-cols-3 md:divide-x-[1.25px] md:divide-y-0">
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
