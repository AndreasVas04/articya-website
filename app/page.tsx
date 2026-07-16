import { ButtonLink } from "@/components/ui/button";
import { hero, whatWeDo, gain } from "@/content/home";
import { withBasePath } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <section className="relative">
        {hero.slides.map((slide, i) => (
          <div
            key={slide}
            className={
              i === 0 ? "absolute inset-0 bg-cover bg-center" : "hidden"
            }
            style={{ backgroundImage: `url(${withBasePath(slide)})` }}
          />
        ))}
        <div className="relative bg-black/50 px-4 py-32 text-center text-white">
          <div className="mx-auto max-w-2xl">
            <span className="text-sm uppercase tracking-wide">
              {hero.location}
            </span>
            <h1 className="mt-2 text-5xl font-bold">{hero.heading}</h1>
            <p className="mt-4 text-lg">{hero.text}</p>
            <div className="mt-8">
              <ButtonLink
                href={hero.cta.href}
                className="bg-white text-neutral-900 hover:bg-neutral-200"
              >
                {hero.cta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${withBasePath(whatWeDo.background)})` }}
      >
        <div className="bg-white/90 px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="md:flex md:items-start md:justify-between md:gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold">{whatWeDo.title}</h2>
                <p className="mt-4 text-neutral-700">{whatWeDo.lead}</p>
              </div>
              <div className="mt-8 flex gap-6 md:mt-0">
                {whatWeDo.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold">{stat.num}</div>
                    <div className="text-xs tracking-wide text-neutral-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {whatWeDo.cards.map((card) => (
                <article
                  key={card.title}
                  className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
                >
                  <div
                    className="h-48 bg-cover bg-center p-4"
                    style={{
                      backgroundImage: `url(${withBasePath(card.image)})`,
                    }}
                  >
                    <span aria-hidden="true" className="text-2xl">
                      {card.badge}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="mt-3 text-sm text-neutral-700">{card.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold">{gain.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {gain.items.map((item) => (
              <div
                key={item}
                className="rounded-md border border-neutral-700 px-4 py-3"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-8 text-neutral-300">{gain.text}</p>
          <div className="mt-4 text-xl font-semibold">{gain.highlight}</div>
          <div className="mt-8">
            <ButtonLink
              href={gain.cta.href}
              className="bg-white text-neutral-900 hover:bg-neutral-200"
            >
              {gain.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
