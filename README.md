# Suyoung Kwon — Portfolio

Personal Product Manager portfolio site.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for scroll-linked animation
- [Vitest](https://vitest.dev/) + Testing Library for component tests

See [`docs/SPEC.md`](docs/SPEC.md) for the full design/content spec — the
reference for what this site is supposed to be and why.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, and a production
build on every push and pull request.

## Structure

```
src/app/         routing, layout, global styles
src/components/  one component per landing-page section
src/content/     typed content data (placeholder until real copy lands)
src/lib/         shared utilities
public/          static assets (video, resume, images)
legacy-jekyll/   old Jekyll (al-folio) site, kept only as a content source —
                 not built or deployed, see its own README
```
