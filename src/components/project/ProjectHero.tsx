import Link from "next/link";
import type { ProjectMeta } from "@/content/projects";
import { Chip } from "./Chip";
import { ImagePlaceholder } from "./ImagePlaceholder";

// The one piece of template every project detail page shares verbatim —
// back link, kicker, title, subtitle, tagline, meta grid, chips, hero
// image. Per-project body composition (below this, in each project's
// Detail component) is free to differ.
export function ProjectHero({ meta }: { meta: ProjectMeta }) {
  return (
    <div className="border-b border-line pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl px-6 pt-28 md:px-10 md:pt-36">
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent-3"
        >
          <span aria-hidden>←</span> Selected Works
        </Link>

        <div className="mt-8 flex flex-col items-center text-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Chip kind="domain">{meta.chips.domain}</Chip>
            <Chip kind="problem">{meta.chips.problem}</Chip>
            {meta.chips.tech.map((tech) => (
              <Chip key={tech} kind="tech">
                {tech}
              </Chip>
            ))}
          </div>
          <p className="instrument-serif-regular-italic mt-6 text-2xl text-ink md:text-3xl">
            &ldquo;{meta.tagline}&rdquo;
          </p>
          <h1 className="font-display mt-4 text-4xl font-medium tracking-tight text-ink sm:text-5xl md:whitespace-nowrap md:text-[clamp(1.75rem,4vw,3.6rem)]">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg text-ink-muted md:text-xl">{meta.subtitle}</p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
          {(
            [
              ["Period", [meta.period]],
              ["Role", meta.role],
              ["Team", meta.team],
              ["Org", [meta.org]],
            ] as const
          ).map(([term, items]) => (
            <div key={term}>
              <dt className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                {term}
              </dt>
              <dd className="font-display mt-1.5 text-sm font-medium text-ink md:text-base">
                {items.map((item) => (
                  <span key={item} className="block">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <ImagePlaceholder
          label={`Hero image — ${meta.title}`}
          aspect="mt-14 aspect-[16/9] md:aspect-[21/9]"
        />
      </div>
    </div>
  );
}
