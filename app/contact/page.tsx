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

// The page's ground: the two cattle on the road into the village at blue hour,
// sharp under the hero and out of focus under the channels. It replaces the
// walk out to the reservoir, which was this page's hero and also the ground
// under "What we do" and the finale's centre tile — three zones on one
// photograph.
//
// Both numbers moved with the frame and both were measured. The darkening was
// 84/69/71, set for a sunlit track whose highlights clip at 255; a blue-hour
// frame arrives most of the way down on its own, and on those numbers the lede
// measured 7.26 desktop / 7.31 mobile against a 4.5 floor — a full stop of
// darkening spent on nothing. At 68/55/57 it measures 5.01 / 5.04 and the
// picture keeps 54% more luminance and 31% more chroma.
//
// The dark is `sky-anchor` rather than `land-anchor`, and that is the larger of
// the two. This frame's own hue is −142.5°; the warm anchor took the composite
// to +80.3° — it does not darken a blue hour, it turns it — where the sky's own
// dark lands at −146.6°, 4.1° off, and leaves 11.56 of chroma against 6.57.
const plates: StagePlate[] = [
  // The mid is 58 and not 55, and the ladder's new rung is why. This ground is
  // `IMG_4735-road` full-bleed, so it moved from the 2560 variant to the 2880
  // one, and a sharper frame has brighter specks in it for a glyph stem to
  // land on: the invitation's worst glyph-core pixel went 4.50 -> 4.40, under
  // its floor. Three points of plate strength put it at 4.75. Nothing else on
  // this page changed.
  //
  // 58 was the mid until the sampler was fixed. The invitation crosses this
  // plate's middle band at every height, and stepped at 5px it reads 4.08 at
  // 390x844 in WebKit and 4.38 at 1440x900 in Chromium — under floor in seven
  // of the ten configurations, where the coarse sweep saw it under in one. The
  // reading below that set 58 was taken at whatever positions that sampler
  // happened to land on, so it was never the invitation's worst.
  //
  // 71/64/63 clears it: 5.04 at 390x844 and 5.01 at 390x750 in WebKit, the two
  // worst heights, against 4.67/4.95 at 70/62/61. That is six points of mid
  // handed back out of the sixteen this frame won when it replaced the sunlit
  // track, and the frame keeps the rest.
  { src: hero.image, position: "50% 50%", priority: true, shade: { top: 71, mid: 64, base: 63, color: "var(--color-sky-anchor)" } },
  // The split: the same frame, defocused to the left of a hard seam at 48%
  // and sharp to its right, with the invitation and the three channels
  // standing on the soft side. One frame of the reference set's density, on
  // the text the page already had.
  //
  // The mid is 66 for the same reason the hero plate's is 64, and it is the
  // email address that asks for it: on the three shortest phones it stands in
  // this plate's middle band and reads 4.21 at 390x553 in WebKit. Raising the
  // hero plate alone does not touch it — measured with this one left at 62 the
  // address stays at 4.21 / 4.40 / 4.47 — because by the time it is on screen
  // the crossfade has finished and this plate is the whole ground. At 54/66/72
  // it reads 4.87 and 5.06 at the two heights that failed.
  {
    src: hero.image,
    position: "50% 50%",
    split: 48,
    shade: { top: 54, mid: 66, base: 72, from: "22%", to: "62%", color: "var(--color-sky-anchor)" },
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
      className="group flex h-full items-center gap-5 py-6 transition-colors duration-200 ease-out-quart md:py-7"
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
      <PageHero heading={hero.heading} text={hero.text} compactTitle />

      <section
        data-index-section=""
        data-stage-plate="1"
        data-stage-strength="1"
        className="relative flex min-h-svh items-center px-4 py-20 md:py-28"
      >
        {/* The soft side of the seam, and nothing crosses it: the block is
            capped at 48% of the viewport on desktop with the page's own
            margin inside that, so every word stands on the defocused half and
            the sharp half is left to be a photograph. */}
        <div className="contact-split w-full">
          <Reveal>
            <span aria-hidden="true" className="block h-[1.25px] w-16 bg-amber" />
            <h2 className="mt-4 type-heading font-display font-semibold tracking-[-0.025em] text-ink">
              {details.heading}
            </h2>
            {/* The rule under the heading at 62% of the text column — the same
                mark the gains carry, from the same reference frame. */}
            <span aria-hidden="true" className="mt-6 block h-px w-[62%] bg-hairline" />
          </Reveal>
          {/* No fills: the three channels are separated by one amber
              hairline — horizontal between the stacked rows on mobile,
              vertical between the columns on desktop. */}
          {/* No fills, and one hairline between the rows: the three channels
              stack down the soft column rather than sitting in three cells. */}
          <div className="mt-4 grid grid-cols-1 divide-y-[1.25px] divide-amber/34 md:mt-6">
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
