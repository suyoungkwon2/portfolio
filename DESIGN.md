---
version: alpha
name: Suyoung Mel Kwon — Portfolio
description: Cool/navy-leaning, near-monochrome portfolio site. Neutrals carry ~90% of the UI; the 5 brand colors are reserved strictly for point-of-interest moments (eyebrows, category tags, metrics, hover states) and never used as a base surface or for body copy.
colors:
  paper: "#fafafa"
  paper-2: "#eef0f3"
  ink: "#1a1a1a"
  ink-muted: "#5b6472"
  line: "#e3e6ea"
  accent: "#2f3061"
  accent-soft: "#ded9e2"
  accent-2: "#55917f"
  accent-2-soft: "#d4f0a8"
  accent-3: "#9c85d6"
typography:
  display:
    fontFamily: Aspekta
    fontWeight: 400
  sans:
    fontFamily: Inter
  instrument:
    fontFamily: Instrument Serif
    fontWeight: 400
    fontSize: 94px
    lineHeight: 103px
rounded:
  xl: 0.75rem
  2xl: 1rem
spacing:
  base: 0.25rem
components:
  section-heading-kicker:
    textColor: "{colors.accent}"
    typography: "{typography.display}"
  section-heading-title:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
  body-text:
    textColor: "{colors.ink-muted}"
    typography: "{typography.sans}"
  nav:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  nav-link-hover:
    textColor: "{colors.accent-3}"
  card:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.xl}"
  card-large:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.2xl}"
  work-thumbnail:
    backgroundColor: "{colors.accent-soft}"
    rounded: "{rounded.2xl}"
  work-thumbnail-secondary:
    backgroundColor: "{colors.accent-2-soft}"
    rounded: "{rounded.2xl}"
  work-meta:
    textColor: "{colors.ink-muted}"
    typography: "{typography.sans}"
  research-period:
    textColor: "{colors.accent-2}"
    typography: "{typography.sans}"
---

## Overview

A Product Manager portfolio. The direction is deliberately restrained: near-black-and-white surfaces and text, with a small navy-led accent palette reserved for signaling — section labels, category tags, key metrics, and interactive hover states — so those moments stay legible against an otherwise quiet, trustworthy field.

## Colors

The palette is almost entirely neutral, with five brand colors used only as point colors, never as a base surface.

- **paper (#fafafa):** Page background.
- **paper-2 (#eef0f3):** Card/panel surface, always used at reduced opacity (50–60%) over paper.
- **ink (#1a1a1a):** Primary text and default icon/border-emphasis color.
- **ink-muted (#5b6472):** Secondary text — descriptions, metadata, captions.
- **line (#e3e6ea):** Borders and dividers.
- **accent (#2f3061, Twilight Indigo):** Primary point color — section eyebrows, key metrics, the Healthcare/Education work category.
- **accent-soft (#ded9e2, Lavender):** Light tint for the Healthcare/Education work-thumbnail placeholder; also serves as `accent-3`'s soft tint (same indigo/violet family).
- **accent-2 (#55917f, Jungle Teal):** Secondary point color — Research period labels.
- **accent-2-soft (#d4f0a8, Tea Green):** Light tint for the AI/Business work-thumbnail placeholder.
- **accent-3 (#9c85d6, Soft Periwinkle):** Interaction accent — hover/focus state color for links and icons. Not tied to a content category.

## Typography

Three type families, each with a fixed role. There is no shared numeric type scale (font size/line-height are chosen per component); `instrument` is the exception, since its one deployed size is the role's defining, canonical usage.

- **display (Aspekta, weight 400 — the only weight loaded):** Nav wordmark/links and every section heading (kicker + H2).
- **sans (Inter):** All body copy, descriptions, and metadata.
- **instrument (Instrument Serif, 400, 94px/103px):** Reserved for the hero headline and other high-emphasis phrases — never used for UI or body text.

## Shapes

Two corner-radius steps, both from Tailwind's default scale (not custom-defined): `xl` (0.75rem) for standard info cards, `2xl` (1rem) for the larger, single-focus surfaces (Resume CTA, work thumbnails). No sharp-cornered surfaces. Kept deliberately tighter than a typical "friendly" large-radius portfolio look.

## Components

- **section-heading-kicker / section-heading-title:** An uppercase, letter-spaced kicker in `accent` above an `ink`-colored, `display`-family H2. Used to open every major section (About, Selected Works, Experience, Research, Awards, Resume).
- **body-text:** Secondary copy — descriptions, metadata, captions — in `ink-muted` and the `sans` family.
- **nav:** Fixed header on `paper` with `ink` text; hidden until the user scrolls past the hero.
- **nav-link-hover:** Interactive text (nav links, footer email, card affordance icons) shifts to `accent-3` on hover instead of a generic opacity or ink-darken change, so hover states read as distinctly "interactive" rather than just dimmed.
- **card / card-large:** A `paper-2` panel (at reduced opacity) with a `line` border (not a modeled component field — see Colors). `card` (rounded xl) is the standard info-panel size; `card-large` (rounded 2xl) is for single-focus feature cards (Resume CTA).
- **work-thumbnail / work-thumbnail-secondary:** Selected Works card image area — modeled on tushar.work's Selected Work grid (plain thumbnail, no card border/background, text below rather than overlaid). A fixed 4:3 frame, `rounded.2xl` corners, tinted `accent-soft` (Healthcare/Education) or `accent-2-soft` (AI/Business) as a placeholder until real case-study screenshots replace it; scales to 1.03 on hover over an 800ms ease.
- **work-meta:** Plain (non-badge) uppercase tracked line below the thumbnail — tag and year — in `ink-muted`, replacing an earlier colored-pill treatment.
- **research-period:** Research card's date-range eyebrow, in `accent-2`.

## Do's and Don'ts

- Don't use `accent`, `accent-2`, or `accent-3` for large surfaces or body text — they are point colors only, reserved for signaling.
- Don't use `accent-soft` or `accent-2-soft` as text color; they're backgrounds only.
- Don't put a border or background card around Selected Works thumbnails — that treatment is reserved for `card`/`card-large` info panels elsewhere on the page.
