# Portfolio Redesign — Spec

Living reference for the `redesign-nextjs` rebuild. Update this file whenever a
requirement changes — it's the source of truth for what we're building and
why, not just a one-time brief.

## 1. Goal

Rebuild the portfolio from a grad-school-application site (CS/DS, academic,
al-folio/Jekyll) into a **Product Manager job-search site** targeting US
big tech / big startups. The bar: grab attention in the first ~3 seconds,
then back it up with substance. Not a generic portfolio template.

Context: currently pursuing a Design master's degree, applying for PM roles.
The site should read as visually confident and intentional — not the "hard,
technical" feel of the old academic site.

## 2. The two things the site must communicate

1. **"Heal the World"** — genuine interest in tech for social good, specifically
   healthcare and education. This is a personal value, not a slogan; it should
   come through as authentic.
2. **Competence, stated briefly** — someone who ships measurable business
   impact: 0→1 product building, startup experience, user research, A/B
   testing, cross-functional collaboration, systems thinking. Short and
   concrete, not a wall of text.

## 3. Design references

- **[hongbeepark.com](https://hongbeepark.com/)** — overall structure and pacing
  of the landing page (see section order below).
- **[tushar.work](https://www.tushar.work/)** — card design language for the
  Selected Works grid (thumbnail + tag + hover interaction).
- Light mode, but **not pure white** (`#ffffff`) — a warm ivory/off-white
  background. Current tokens live in `src/app/globals.css`
  (`--color-paper: #f7f3ec`).
- Interactive, not static — motion should feel intentional, not decorative.

## 4. Tech stack (decided)

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Framer Motion** for scroll-linked and reveal animations
- Everything is a single landing page (`src/app/page.tsx`) — Work / Research /
  Resume are in-page anchors, not separate routes.
- The old Jekyll (al-folio) site is fully retired and archived under
  `legacy-jekyll/` for content reference only (see that folder's own
  README). It is not built or deployed.

## 5. Landing page structure (in order)

1. **Hero** (`#hero`, `src/components/Hero.tsx`)
   - Full-bleed video background (Michael Jackson "Heal the World" clip —
     to be supplied by the site owner; placeholder path is
     `public/video/heal-the-world.mp4`).
   - Giant white "Heal the World" headline centered over the video.
   - On scroll: headline characters disintegrate (fade/scatter/blur, staggered
     per character) while the video simultaneously shrinks from full-bleed
     into a small pill — landing in the nav bar as the right-most item.
   - The docked pill becomes a play/pause control with a circular progress
     ring, and stays fixed there for the rest of the scroll.
2. **About** (`#about`) — short summary intro, not the full academic bio.
3. **Selected Works** (`#work`, targeted by the nav's "Work" link) — card grid,
   tushar.work-style. Two sector groups, 3 cards each:
   - Healthcare / Education
   - AI / Business
   (Content is currently placeholder — see §7.)
4. **Experience** — role history (Kurly, Asleep, KAIST).
5. **Research** (`#research`, targeted by the nav's "Research" link) — CMU
   visiting scholar work, KAIST HSS research assistantship.
6. **Awards / Honors** — currently placeholder, real entries pending.
7. **Resume** (`#resume`, targeted by the nav's "Resume" link) — one-page
   download CTA.

### Nav bar (`src/components/Nav.tsx`)

Fixed top, glass/blur background for legibility over any content.
- Left: "Suyoung Kwon" text logo.
- Center/right: About, Work, Research, Resume anchor links.
- Far right: reserved slot the Hero's video chip docks into (kept in sync by
  hand — see `CHIP_W`/`CHIP_H` constants in `Hero.tsx` vs. the spacer `div` in
  `Nav.tsx`).

## 6. Content status

The owner has an existing PDF portfolio with real case study writing — it
will be trimmed down and migrated in once the design/structure is locked.
**Design and structure come first; content is placeholder until then.**

Placeholder content lives in `src/content/*.ts`, clearly marked with
bracketed text like `[Case Study Title]`:
- `works.ts` — 6 case study slots (see §5.3)
- `experience.ts` — real role history already filled in from the old bio
- `research.ts` — real research history already filled in
- `awards.ts` — placeholder, needs real entries
- `site.ts` — name, tagline, resume/video paths

Real raw material for migration lives in `legacy-jekyll/`:
- `_projects/*.md` — 7 real project write-ups (AICuration, AISearch,
  AsleepTrack, MARS, PhoniTale, SleepVice, SomMind) with links/tags/images
- `_pages/about.md` — original bio copy
- `_data/media.yml`, `_data/news.yml` — real press mentions and milestones
- `_bibliography/papers.bib` — real publication/patent entries

## 7. Outstanding items before this can go live

- [ ] Real Michael Jackson "Heal the World" video clip → `public/video/heal-the-world.mp4`
- [ ] Resume PDF → `public/resume.pdf`
- [ ] 6 real case studies (title, summary, metric) in `src/content/works.ts`
- [ ] Real Awards/Honors entries in `src/content/awards.ts`
- [ ] Re-wire Google Analytics (old GA ID: `G-B2Z4J55FNK`, was in the Jekyll
      `_config.yml`, not yet reconnected in the Next.js site)
- [ ] Decide deployment target (custom domain `suyoungkwon.com` currently
      points at GitHub Pages/Jekyll; moving to Vercel was the working
      assumption but not yet actioned)

## 8. Known simplifications (deliberate, revisit if it matters)

- Nav bar has a persistent translucent glass background from the very first
  frame (not fully transparent over the hero), so text stays legible
  regardless of what's playing in the video. A more cinematic "fully
  transparent until scrolled" version is possible but adds complexity.
- Hero video is muted (autoplay-compliant); the chip's play/pause button
  controls playback, not sound.
- The docked chip is a fixed 120×44px regardless of viewport size. On very
  small phones this is proportionally larger; nav text links (About/Work/
  Research/Resume) hide below the `sm` breakpoint to keep the bar from
  crowding — no hamburger menu yet.

## 9. Engineering conventions

- `src/app/` — routing, layout, global styles.
- `src/components/` — one component per landing-page section, plus shared
  bits (`Nav`, `SectionHeading`, `Footer`).
- `src/content/` — typed placeholder/real data, kept separate from markup so
  content can be swapped without touching component code.
- `src/lib/` — small shared utilities.
- Tests live next to the code they cover (`*.test.tsx`), run via Vitest.
- CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, and a
  production build on every push and PR.
