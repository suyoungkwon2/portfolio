# Legacy content archive

This folder is **not built or deployed**. It is the old Jekyll (al-folio) site,
kept only as a source of real content while the new Next.js site
(`src/`, `public/`) is being written.

Everything that was pure theme/vendor code or unfilled template placeholder
data has already been deleted. What remains is real content:

| Path | What it is |
| --- | --- |
| `_pages/about.md` | Original bio copy — source for the About section |
| `_projects/*.md` | Real case study write-ups (AICuration, AISearch, AsleepTrack, MARS, PhoniTale, SleepVice, SomMind) with links, tags, and dates — the raw material for `src/content/works.ts` |
| `_data/media.yml` | Real press/media mentions |
| `_data/news.yml` | Real timeline of milestones |
| `_bibliography/papers.bib` | Real publication (PhoniTale, EMNLP 2025) and patent entries |
| `assets/img/` | Real photos: profile pictures, project screenshots, media clippings, social icons |

Once the equivalent content has been migrated into `src/content/*.ts` and
`public/`, this entire folder can be deleted.
