import { useId } from "react";
import type { ProjectChips } from "@/content/projects";
import { cn } from "@/lib/utils";

const order = ["type", "domain", "proof"] as const;

// A project's Type · Domain · Proof chips, joined by a thin "gooey" neck so
// they read as one phrase. The pill backgrounds are drawn twice: once under
// an SVG goo filter (blur, then a sharp alpha threshold, which melts pills
// a few px apart into each other) and once as plain text on top, so the
// labels stay crisp.
export function ChipGroup({ chips, className }: { chips: ProjectChips; className?: string }) {
  const filterId = `goo-${useId().replace(/:/g, "")}`;
  const pill = "rounded-full px-2.5 py-1 text-xs font-medium leading-none";

  return (
    <div className={cn("grid w-fit", className)}>
      <svg aria-hidden className="absolute h-0 w-0">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
        </filter>
      </svg>
      <div
        aria-hidden
        className="col-start-1 row-start-1 flex gap-[3px]"
        style={{ filter: `url(#${filterId})` }}
      >
        {order.map((key) => (
          <span key={key} className={cn(pill, "bg-paper-2 text-transparent")}>
            {chips[key]}
          </span>
        ))}
      </div>
      {/* relative: the filtered layer is its own stacking context, which
          would otherwise paint over these labels. */}
      <ul className="relative col-start-1 row-start-1 flex gap-[3px]">
        {order.map((key) => (
          <li key={key} className={cn(pill, "text-ink")}>
            {chips[key]}
          </li>
        ))}
      </ul>
    </div>
  );
}
