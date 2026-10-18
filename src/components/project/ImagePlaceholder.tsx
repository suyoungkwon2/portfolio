import { DashedBorder } from "@/components/Dashed";
import { cn } from "@/lib/utils";

// Labeled placeholder for real screenshots/diagrams to be dropped in
// later (see docs/SPEC.md §6 — content is text-first for now). Keeping
// the label specific (what the image should show) makes it a to-do list
// for asset sourcing, not just visual filler.
export function ImagePlaceholder({
  label,
  aspect = "aspect-[16/9]",
  className,
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-paper-2 px-6 text-center",
        aspect,
        className,
      )}
    >
      <DashedBorder radius={8} className="text-line" />
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
        {label}
      </span>
    </div>
  );
}
