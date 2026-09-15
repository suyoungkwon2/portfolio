import { cn } from "@/lib/utils";

// Shared rhythm (kicker + heading + spacing) for detail-page body
// sections, while leaving the content of each section free to differ
// per project — see AGENTS/the brief: same template for hero/meta, but
// main-content composition is bespoke per case study.
export function Section({
  kicker,
  title,
  children,
  wide = false,
  className,
}: {
  kicker?: string;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "mx-auto px-6 py-14 md:px-10 md:py-20",
        wide ? "max-w-5xl" : "max-w-3xl",
        className,
      )}
    >
      {kicker && (
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          {kicker}
        </span>
      )}
      {title && (
        <h2 className="font-display mt-3 text-2xl font-medium tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
      )}
      <div className={kicker || title ? "mt-6" : undefined}>{children}</div>
    </section>
  );
}
