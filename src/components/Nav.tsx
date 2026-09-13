"use client";

import { navItems, site } from "@/content/site";

// The empty div on the right reserves the exact box the Hero's video
// chip docks into once the intro scroll animation finishes. Keep its
// size (CHIP_W x CHIP_H in Hero.tsx) and this spacer's size in sync.
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[84px] border-b border-line/60 bg-paper/75 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 md:px-10">
        <a
          href="#hero"
          className="font-display text-base font-medium tracking-tight text-ink sm:text-lg"
        >
          {site.name}
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted sm:flex md:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="h-11 w-[120px] shrink-0" aria-hidden />
      </div>
    </header>
  );
}
