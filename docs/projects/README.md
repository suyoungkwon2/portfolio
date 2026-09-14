# Project Content — Extraction Index

Structured, per-project content extracted from `public/pdf/SuyoungKwon_Portfolio.pdf` (31 pages),
cross-referenced against `public/pdf/CV_SuyoungKwon_2pages.pdf`, `public/pdf/CV_SuyoungKwon_1page.pdf`,
and the old Jekyll write-ups in `legacy-jekyll/_projects/*.md`. This is raw source material for
`src/content/works.ts` (see `docs/SPEC.md` §6–7) — not final website copy. Chip colors in the source
PDF: **green = domain**, **red = problem**, **blue = tech/system used to solve it**.

## Projects, in site order

### Healthcare / Education
1. [MARS](01-mars.md) — Medical Auto-documentation with Real-world Structuring (pdf pp. 3–6)
2. [Phonitale](02-phonitale.md) — AI-powered Mnemonic Foreign Vocab Learning (pdf pp. 7–10)
3. [SomMind](03-sommind.md) — Digital Therapeutic App for Severe Insomnia (pdf pp. 15–19)

### AI / Business
4. [AI Search](04-ai-search.md) — Enhancing Search Experience & Driving Sales (pdf pp. 24–27)
5. [AI Curation](05-ai-curation.md) — AI-Driven Scaling of Themed Campaigns (pdf pp. 28–31)
6. [AsleepTrack](06-asleeptrack.md) — Ultimate AI Sleep Tracking Module (pdf pp. 11–14)

### Bonus / 7th project (added at site owner's request, outside the original 6-project brief)
7. [SleepVice](07-sleepvice.md) — Alexa Voice Application for Best Sleep Quality (pdf pp. 20–23). This was
   the 7th project in the PDF's table of contents, originally left out of scope. Not yet assigned a site
   section/slot — decide whether it becomes a 4th Healthcare/Education card, a standalone "bonus" card, or
   reference-only content. It shares the same Asleep sleep-tracking AI core as SomMind and AsleepTrack
   (Korea's first official Amazon collaboration startup, contributed to Series B funding) — watch for
   redundant framing if multiple Asleep-era cards ship together.

## Discrepancies / open questions

✅ **Resolved:** AI Search and AI Curation year — confirmed by the site owner as **2024** (the portfolio
PDF's "2025" was a typo). Both `04-ai-search.md` and `05-ai-curation.md` have been updated to state
May–Aug 2024 and Jun–Dec 2024 respectively.

✅ **Resolved:** AsleepTrack MRR — site owner confirmed **$70K MRR** as the headline figure. Updated in
`06-asleeptrack.md`.

✅ **Resolved:** SomMind duration — site owner confirmed the case study should headline the **project
duration (Jun 2022 – Mar 2023)**, not the broader DTx-team role tenure (Sep 2021 – Mar 2023). Updated in
`03-sommind.md`.

✅ **Resolved:** legacy-jekyll `date` fields (PhoniTale 2025-10-01, MARS 2025-11-01) — site owner confirmed
these should be ignored in favor of the PDF/CV durations already used in `01-mars.md` and `02-phonitale.md`.
(PhoniTale still has a minor 1-month drift between the PDF "Mar–May 2025" and CV "Mar–Jun 2025" — using CV
as primary per that file's notes.)

✅ **Resolved:** AI Search headline numbers — site owner confirmed leading with **174x revenue lift** /
**35.52x ROI**, keeping the extreme percentage figures (e.g. +17,357% purchase revenue, off a near-zero
baseline) as secondary supporting detail. Updated in `04-ai-search.md`.

✅ **Resolved:** MARS team composition — site owner confirmed **4 people total**: site owner (Project
Managing), 2 LLM Engineers, 1 Psychiatry Professor as clinical advisor. Exact name-to-role mapping among
the 3 named teammates (Sana Kang, Myeongseok Gwon, Jeongkyeong Hong) isn't needed for site copy. Updated in
`01-mars.md`.

✅ **Resolved:** contact email — site owner confirmed `skwon3@andrew.cmu.edu` is the correct CMU address
(the 2-page CV's `skwon@andrew.cmu.edu` was the typo) and the KAIST email is no longer usable. **Final
decision: use the personal email `suyoungkwon77@gmail.com` as the public site contact** (not yet wired into
`src/content/site.ts` — do that when migrating this content into the site).

Still open:

1. **SleepVice duration discrepancy.** Portfolio says Jun 2021 – Jun 2022; the CV's matching role
   ("B2C App PM / Product Team") says Apr 2021 – Sep 2021 — a notably narrower and earlier window. Same
   pattern as the (now-resolved) SomMind duration question — needs a decision on which range to headline.
2. **SleepVice site placement.** Not yet assigned a section/slot on the site — decide whether it becomes a
   4th Healthcare/Education card, a standalone "bonus" card, or reference-only content.

## What's consistent (no action needed)

- All chip sets (domain/problem/tech) match exactly between the PDF and legacy-jekyll's
  `domain_tags`/`problem_tags`/`tech_tags` front-matter for all 7 projects — high confidence these are
  correct as extracted.
- AsleepTrack's duration (Apr 2023 – Mar 2024) matches the CV exactly.
- MARS's award date (Oct 2025) and result (Excellence Award, 2nd place in the final round) are consistent
  across the PDF and both CVs.
