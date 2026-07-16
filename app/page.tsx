import { Globe, GraduationCap } from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { StatCounter } from "@/components/stat-counter";
import { ButtonLink } from "@/components/ui/button";
import { hero, whatWeDo, gain } from "@/content/home";
import { withBasePath } from "@/lib/utils";

const cardIcons = [Globe, GraduationCap];

export default function HomePage() {
  return (
    <>
      <ScrollExpandMedia
        slides={hero.slides}
        bgImageSrc={hero.slides[0]}
        title={hero.heading}
        hintLabel={hero.location}
      >
        <p className="max-w-2xl text-center text-xl leading-[1.55] text-plaster-bright">
          {hero.text}
        </p>
        <div className="mt-8">
          <ButtonLink
            href={hero.cta.href}
            className="bg-resin text-pine-950 hover:bg-resin-light"
          >
            {hero.cta.label}
          </ButtonLink>
        </div>
      </ScrollExpandMedia>

      <section className="bg-plaster px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="md:flex md:items-end md:justify-between md:gap-8">
            <div className="max-w-xl">
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                {whatWeDo.title}
              </h2>
              <p className="mt-4 text-xl leading-[1.55] text-pine-900">
                {whatWeDo.lead}
              </p>
            </div>
            <div className="mt-10 flex gap-10 md:mt-0">
              {whatWeDo.stats.map((stat) => (
                <StatCounter key={stat.label} num={stat.num} label={stat.label} />
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {whatWeDo.cards.map((card, i) => {
              const Icon = cardIcons[i] ?? Globe;
              return (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-lg border border-sage bg-plaster-bright"
                >
                  <div
                    className="relative h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${withBasePath(card.image)})`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-plaster-bright/90 text-lichen"
                    >
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-semibold leading-[1.25]">
                      {card.title}
                    </h3>
                    <p className="mt-3 leading-[1.7] text-pine-900">
                      {card.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-plaster-muted px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
            {gain.title}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {gain.items.map((item) => (
              <div
                key={item}
                className="rounded-md border border-sage bg-plaster-bright px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-10 leading-[1.7] text-pine-900">{gain.text}</p>
          <div className="mt-4 font-display text-2xl font-semibold leading-[1.25] text-resin-deep">
            {gain.highlight}
          </div>
          <div className="mt-10">
            <ButtonLink
              href={gain.cta.href}
              className="bg-resin-deep text-plaster-bright hover:bg-pine-900"
            >
              {gain.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
