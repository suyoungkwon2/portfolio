import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  align = "left",
  className,
}: {
  kicker: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
        {kicker}
      </span>
      <h2 className="font-display mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
