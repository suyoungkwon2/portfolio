import Link from "next/link";
import type { WorkItem } from "@/content/works";
import { cn } from "@/lib/utils";
import { WorkThumbnail } from "../WorkCard";

// Previous / next case study, each with its card thumbnail under the
// title so the way on is easy to spot.
export function ProjectFooterNav({ prev, next }: { prev?: WorkItem; next?: WorkItem }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 border-t border-line px-6 pb-40 pt-16 sm:grid-cols-2 md:px-10">
      <div>{prev && <NavLink work={prev} label="← Previous" />}</div>
      <div>{next && <NavLink work={next} label="Next →" alignEnd />}</div>
    </div>
  );
}

function NavLink({ work, label, alignEnd }: { work: WorkItem; label: string; alignEnd?: boolean }) {
  return (
    <Link href={`/work/${work.slug}`} className={cn("group block", alignEnd && "sm:text-right")}>
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
        {label}
      </span>
      <p className="font-display mt-1.5 text-lg font-medium text-ink transition-colors group-hover:text-accent-3">
        {work.title}
      </p>
      <div className="mt-4">
        <WorkThumbnail
          work={work}
          sizes="(min-width: 1152px) 500px, (min-width: 640px) 50vw, 100vw"
        />
      </div>
    </Link>
  );
}
