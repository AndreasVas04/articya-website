# Quality audit — all four pages

Audited on the production build (`npm run build` → static `out/`, served locally),
at 1440×900 and 390×844. Every runtime check was scripted with a headless
Chromium against the built HTML, not the dev server.

**Headline result:** the site is in strong shape. Console is clean, layout is
stable (CLS 0), nothing overflows, every control is reachable and every text
role clears AA on the rendered composite. The findings that remain are almost
all in metadata and image delivery, not in the page itself.

The auto-fixes listed at the bottom were applied in a single follow-up commit.
Everything above them is a recommendation for you to decide.

---

## Accessibility — clean

| Check | Result |
|---|---|
| Keyboard reachability & order | ✓ All interactive elements reachable in DOM order on every page. Home: nav → hero CTA → closing CTA → footer social. FAQ: nav → 10 accordion summaries → footer. Contact: nav → 3 channel cards → footer. No traps; the hero's scroll-lock has a keyboard escape hatch (ArrowDown/Space/PageDown/End expand in one step). |
| Focus indicator | ✓ Visible on every focused element — 2px `resin` outline at 2px offset plus a `pine-950` box-shadow ring, so it reads on both gold chrome and dark grounds. |
| Heading structure | ✓ Exactly one `h1` per page, no skipped levels. Home `h1→h2→h3→h3→h2`; FAQ `h1→h2→h3…`; Contact `h1→h2`; About `h1` + prose. Offer-panel titles are `h3` (subordinate to the "What we do" `h2`) while carrying the H2 *type size* — correct split of semantics from visual scale. |
| Landmarks | ✓ Exactly one `header`, `main`, `footer`, `nav` per page; About adds one `article`. |
| Accordion roles / state | ✓ Native `<details>/<summary>` — expanded state, role and keyboard operation are built in; the accessible name is the question text. Works with JS disabled. |
| Colour contrast (rendered composite) | ✓ Every text role measured ≥ 4.69 at both viewports (see table below). |
| `prefers-reduced-motion` | ✓ Honoured on every page. Global CSS collapses durations/delays; scroll-linked React components gate their transforms behind `mounted && !reducedMotion` and render the resting state. **About specifically re-verified: zero page errors under reduced motion at both viewports** (the historical crash has not regressed). |

### Measured contrast on the built composite (worst of the two viewports)

Sampled by hiding each element's text, screenshotting its box to capture the
true rendered background (photo + atmosphere + gold), and computing WCAG 2.1.

| Role | Ratio | Threshold |
|---|---|---|
| Wordmark `ink` / chrome | 10.4 | ✓ |
| Nav active `resin-deep` / chrome | 10.7 | ✓ |
| Nav resting `bark` / chrome | 6.6 | ✓ |
| Footer copyright `ink-soft` / chrome | 5.7 | ✓ |
| Section headings `ink` | 8.7–10.2 | ✓ |
| Hero headline / lede `ink` (over photo) | 7.9–9.7 | ✓ |
| Hero hint pill `ink` (over backdrop) | 10.0 | ✓ |
| Stat numeral `ink` | 9.1–9.3 | ✓ |
| Offer-panel body `ink` (over photo) | 9.8 | ✓ |
| Body lead `ink-soft` | 5.1 | ✓ |
| FAQ answer `ink-soft` / card | 5.6 | ✓ |
| Contact channel label `ink-soft` / card | 5.6 | ✓ |
| **Closing headline `resin-deep` / lamp pool** | **4.69** | ✓ (lowest margin on the site) |

Non-text UI (card borders in `amber/45–55`, medallion rings in `pine/30`, the
chrome's `amber/50` hairline) is decorative by role — the interactive target is
the whole card/link, not a 3:1 boundary — so the 3.0 graphical threshold is not
load-bearing here. The focus ring, which *is* load-bearing, clears it easily.

### Alt-text inventory

| Image | Current alt | Assessment |
|---|---|---|
| Header `logo.png` | "ArtiCYa logo" | ✓ Good |
| Home hero backdrop + card slides (`hero-1/2/3`) | `""` | ✓ Decorative — washed atmosphere behind the gold veil; the headline carries the meaning |
| Home offer photos (`home-youth`, `FAQ.jpg`) | `""` | Acceptable — full-bleed photography behind a reading wash; the heading + paragraph carry the content. Defensible as decorative. |
| Inner-page hero backgrounds (`About/FAQ/Contact.jpg`) | CSS background, `aria-hidden` | ✓ Decorative by construction |
| About story scenes (5) | Descriptive, e.g. "Participants talking on mossy rocks in the forest" | ✓ Good |
| About gallery — `AboutImage1.jpg` | "ArtiCYa team activities" | ⚠ Generic — describes the subject only loosely (see finding A1) |
| About gallery — `AboutImage2.jpg` | "Youth exchange activities" | ⚠ Generic — same (finding A1) |
| About gallery — other 5 | Descriptive (reused scene alts) | ✓ Good |

---

## Performance

**Lighthouse could not be run in this environment** — it is not installed and
there is no network access to fetch it offline. I measured Core Web Vitals and
the underlying signals directly instead; those are reported below. Re-run
Lighthouse in CI or locally for the four scores per page.

| Signal | Result |
|---|---|
| CLS | **0** on all four pages, both viewports. `next/font` size-adjusted fallbacks absorb the font swap; `fill` images are absolutely positioned so they reserve no layout box to shift. |
| LCP element | Home → header `logo.png`; About/FAQ/Contact → the hero background `div`. Local timings 48–180 ms, but those are cache-warm on localhost — on a real connection the inner-page LCP is gated by a 2.4–2.5 MB hero JPEG (see P1). |
| Fonts | ✓ `next/font` (self-hosted, `display: swap`, preloaded, metric-matched fallback). No FOIT; the swap is invisible thanks to the fallback metrics. Preload is correct and automatic. |
| Render-blocking | One small Tailwind stylesheet; the only head script is Next's `noModule` polyfill (legacy browsers only). Acceptable. |

---

## SEO & metadata

| Check | Result |
|---|---|
| `<title>` per page | ✓ Present, distinct, accurate: `ArtiCYa \| Erasmus Youth+`, `About \| ArtiCYa`, `FAQ \| ArtiCYa`, `Contact \| ArtiCYa`. |
| Meta description per page | ✓ Present, distinct, accurate. |
| `lang` | ✓ `en` on every page. |
| Viewport | ✓ Present. |
| OG / Twitter tags | Present, but **title + description are the home values on every page** (see S1 — auto-fixed). No `og:image` / `twitter:image` on any page (see S2). |
| Canonical | **Missing on all pages** (see S3 — auto-fixed). |
| Favicon | **Missing entirely** (see S4 — auto-fixed). |
| Structured data | None. FAQPage schema would suit the FAQ (see S5 — recommended, not implemented). |

---

## Robustness — clean

| Check | Result |
|---|---|
| Console | ✓ Zero errors/warnings on all four pages, both viewports — including during full-page scroll and interaction (accordion open/close, card hover), not just on load. |
| Horizontal overflow | ✓ None at 320, 390, 768, 1024, 1440, 1920. `scrollWidth == clientWidth` at every width on every page. |
| Links | ✓ Every `href` resolves — internal routes and the two external social URLs. No `#` placeholders, no dead hrefs. |
| Stuck hover on touch | ✓ Not possible — Tailwind v4 gates every `hover:` utility behind `@media (hover: hover)`. |
| JavaScript disabled | ✓ Full content renders (static export). All nav + footer links are real `<a>`s; FAQ answers sit in native `<details>` and expand without JS; the hero renders its resting state. |

---

## Findings — ordered by cost to the site

### P1 — Images are delivered at full resolution to every device *(highest cost)*
**Impact:** The static export sets `images.unoptimized: true` (required by
`output: export`), so `next/image` ships each source file as-is — no resizing,
no `srcset`, no WebP/AVIF. The inner-page hero backgrounds are raw JPEGs
(`About.jpg` 2.5 MB, `Contact.jpg` 2.4 MB, `AboutBack`/`AboutImage1` ~2 MB) and
they are the LCP resource on those pages. Gallery originals reach 3024×4032 and
render at ~440 px. Total `/public/images` is **33 MB**. On a mid-tier phone over
4G this is seconds of LCP that CLS-0 and clean code cannot buy back — it is the
single largest thing standing between this build and a green Lighthouse
performance score.
**Recommendation:** Pre-generate sized, modern-format variants at build time
(`sharp` is already a dependency — the same one `grade:photos` uses) and emit a
`srcset`/`<picture>`, or add a custom `next/image` loader that points at those
variants. Target: hero backgrounds ≤ ~250 KB at 1600px-wide WebP, gallery tiles
sized to their rendered box. This is an asset-pipeline change, so I've left it
for you rather than auto-fixing it.

### S1 — OG/Twitter cards show the home title & description on every page *(auto-fixed)*
**Impact:** `about`, `faq` and `contact` inherited the root layout's
`openGraph`, so sharing any inner page previewed as "ArtiCYa | Erasmus Youth+"
with the home description. The document `<title>`/description were already
correct per page — only the social cards were wrong.
**Fix applied:** a single `pageMetadata()` helper now drives title, description,
canonical, OG and Twitter from each page's own strings. No visible text
changed. *(Listed here because it was auto-fixable; see auto-fix list.)*

### P2 — About eagerly loads 7 gallery images below the fold *(auto-fixed)*
**Impact:** The gallery-finale `<img>` tags (both the reduced-motion grid and
the animated tiles) are plain `<img>` with no `loading` attribute, so they
default to eager and fetch ~2–4 MB at page load despite sitting 3–4 screens
down.
**Fix applied:** `loading="lazy"` on both. *(Auto-fix.)*

### S2 — No social share image
**Impact:** OG/Twitter cards render text-only; `twitter:card` is `summary` with
no image, so shared links look bare.
**Recommendation:** Add one 1200×630 `og:image` (a hero photo with the wordmark,
or the logo on a gold card) and switch Twitter to `summary_large_image`.
Choosing/producing the asset is a design call, so I've left it to you; the
`pageMetadata()` helper already has the slot to wire it in.

### S5 — FAQ has no FAQPage structured data
**Impact:** The FAQ is a textbook candidate for `FAQPage` schema, which can earn
expandable rich results in search. None is present anywhere on the site.
**Recommendation (not implemented, per brief):** Emit a `FAQPage` JSON-LD block
on `/faq` built from the existing `content/faq.ts` questions/answers (zero new
copy), and consider a site-wide `Organization` block in the layout. Both are
invisible and derive from frozen content, so they're safe to add when you want
them.

### A1 — Two generic gallery alt strings
**Impact:** `AboutImage1.jpg` ("ArtiCYa team activities") and `AboutImage2.jpg`
("Youth exchange activities") describe their subject only loosely, where the
other gallery images are specific. Not failures — alt is present and not a
filename — but weaker than the set around them.
**Recommendation:** Enrich to match the neighbours (e.g. what the group is
doing, where). These live in `content/about.ts`; alt is not visible text, but
since it sits in `/content` I'm flagging rather than editing so you can confirm
that's in bounds.

### P3 — `framer-motion` ships to FAQ and Contact for a fade only *(low)*
**Impact:** Both pages pull the full animation runtime (~112 KB shared First
Load JS) solely for the `Reveal` entrance fade; they have no scroll
choreography of their own.
**Recommendation:** Swap `Reveal` for a CSS/IntersectionObserver fade on those
two routes to drop framer-motion from their bundle. Small win, and it touches a
shared component, so it's your call.

---

## Auto-fixes applied (separate commit)

1. **S1 — Per-page OG/Twitter + canonical.** New `lib/metadata.ts` `pageMetadata()`
   helper; layout and all three inner pages now emit their own title, description,
   canonical URL, OpenGraph and Twitter card. No visible copy changed.
2. **S3 — Canonical URLs.** Every page now has `<link rel="canonical">` pointing at
   its `https://andreasvas04.github.io/articya-website/…` address, plus a
   `metadataBase` so future absolute URLs resolve.
3. **S4 — Favicon.** Added `app/icon.png` (square, generated from the logo); Next
   emits the icon link with the correct base path.
4. **P2 — Lazy gallery images.** `loading="lazy"` on the About gallery-finale
   images (resting grid and animated tiles).

All four verified on a fresh build: `verify:text` passes on all four pages, head
tags re-extracted to confirm per-page canonical/OG/favicon, and the gallery
images confirmed `loading=lazy`.
