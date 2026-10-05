import { cn } from "@/lib/utils";

// The big headline at the top of a page, in the same spot, face, and size
// as the landing hero's "I'm Mel, …". It's a title, not a sentence, so no
// closing period. From lg up it scales with --f (set in app/layout.tsx).
export const pageTitleClass =
  "font-manrope text-[38px] font-semibold leading-[1.3] tracking-[-0.03em] text-ink md:text-[52px] lg:text-[calc(var(--f)*4.6)]";

export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={cn(pageTitleClass, className)}>{children}</h1>;
}
