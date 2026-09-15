import Link from "next/link";

type NavTarget = { slug: string; title: string };

export function ProjectFooterNav({ prev, next }: { prev?: NavTarget; next?: NavTarget }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-line px-6 py-16 sm:flex-row sm:items-start sm:justify-between md:px-10">
      <div>
        {prev && (
          <Link href={`/work/${prev.slug}`} className="group block">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
              ← Previous
            </span>
            <p className="font-display mt-1.5 text-lg font-medium text-ink transition-colors group-hover:text-accent-3">
              {prev.title}
            </p>
          </Link>
        )}
      </div>
      <div className="sm:text-right">
        {next && (
          <Link href={`/work/${next.slug}`} className="group block">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
              Next →
            </span>
            <p className="font-display mt-1.5 text-lg font-medium text-ink transition-colors group-hover:text-accent-3">
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
