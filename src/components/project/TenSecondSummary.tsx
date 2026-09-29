import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/content/projects";

// Filled-pill section label — originally PhoniTale's, shared now that the
// 10s Summary strip appears on every published case study.
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-fit bg-accent px-4 py-1 text-xs font-medium tracking-[3px] text-paper">
      {children}
    </span>
  );
}

// "10s Summary" strip — What / Why / How in three columns split by vertical
// hairlines. Columns stack with horizontal hairlines below md.
export function TenSecondSummary({ summary }: { summary: ProjectSummary }) {
  const items = [
    { q: "What?", a: summary.what },
    { q: "Why?", a: summary.why },
    { q: "How?", a: summary.how },
  ];
  return (
    <section id="summary" data-chapter="10s Summary" className="mt-4 flex scroll-mt-16 flex-col gap-4 py-10">
      <Kicker>10s Summary</Kicker>
      <div className="flex flex-col gap-4 md:flex-row">
        {items.map(({ q, a }, i) => (
          <div
            key={q}
            className={cn(
              "flex flex-1 flex-col gap-2",
              i > 0 && "border-t border-line pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0",
            )}
          >
            <h2 className="text-xl font-semibold leading-[1.2] text-ink">{q}</h2>
            <p className="text-sm leading-normal text-ink-muted">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
