import { cn } from "@/lib/utils";

// The landing hero's "I'm Mel," headline: large, and from lg up scales with
// --f (set in app/layout.tsx).
export const heroTitleClass =
  "font-manrope text-[38px] font-semibold leading-[1.3] tracking-[-0.03em] text-ink md:text-[52px] lg:text-[calc(var(--f)*4.6)]";

// The headline at the top of every other page, in the same spot and face
// as the hero's but at an ordinary page-title size. It's a title, not a
// sentence, so no closing period.
export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "font-manrope text-[28px] font-semibold leading-[1.25] tracking-[-0.025em] text-ink md:text-[36px]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
