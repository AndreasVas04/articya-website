# ArtiCYa Website

Website for **ArtiCYa**, a Cyprus-based Erasmus+ youth organization focused on non-formal education and social inclusion.

Built with Next.js 15 (App Router, static export), TypeScript and Tailwind CSS v4.

## Live Demo
🔗 https://andreasvas04.github.io/articya-website/

## Pages
- **Home** (`/`) — Landing page with organization overview
- **About** (`/about`) — Mission, values, and impact
- **Opportunities** (`/opportunities`) — Current Erasmus+ programs
- **FAQ** (`/faq`) — Common questions about programs
- **Contact** (`/contact`) — Contact details and social links

## Project Structure
```
articya-website/
├── app/                  # Next.js App Router pages
├── components/           # Shared components (header, footer, hero)
│   └── ui/               # Reusable UI primitives
├── content/              # All site copy as typed constants (frozen)
├── lib/                  # Utilities (cn, withBasePath)
├── public/images/        # Site images
└── scripts/
    └── verify-text-parity.mjs
```

All visible text lives in `/content` as typed constants; pages render only from those. The legacy static pages (`*.html`, `css/`, `images/`) are kept in place while the current GitHub Pages deployment still serves them.

## Development
```bash
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Build

Static export for any static host (also what Vercel serves):

```bash
npm run build
```

Build for GitHub Pages (adds the `/articya-website` base path to routes and image URLs):

```bash
npm run build:pages
```

Both output to `out/`.

### Text parity check

Verifies that the visible text of the exported pages matches the legacy HTML pages character for character:

```bash
npm run verify:text
```

## Deployment

### GitHub Pages
```bash
npm run build:pages
```
Publish the `out/` directory to GitHub Pages (e.g. push it to a `gh-pages` branch or upload it as the Pages artifact in a workflow). The site is served at https://andreasvas04.github.io/articya-website/.

### Vercel (alternative)
Import the repository on [vercel.com](https://vercel.com) — the Next.js preset works as is (`npm run build`, no `GITHUB_PAGES` flag). The static export is served from the domain root.

## Contact
**ArtiCYa - Erasmus+ Youth**
- Facebook: https://www.facebook.com/p/Articya-61560558245829/
- Instagram: https://www.instagram.com/articya4youth/
- Location: Nicosia, Cyprus

## License
No license specified.
