"use client";

import { useEffect, useState } from "react";
import { navItems, site } from "@/content/site";

// The empty div on the right reserves the exact box the Hero's video
// chip docks into once the intro scroll animation finishes. Keep its
// size (CHIP_W x CHIP_H in Hero.tsx) and this spacer's size in sync.
export function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[84px] border-b border-line/60 bg-paper/75 backdrop-blur-md transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 md:px-10">
        <a
          href="#hero"
          className="font-display text-base font-medium tracking-tight text-ink sm:text-lg"
        >
          {site.name}
        </a>

        <nav className="hidden items-center gap-6 sm:flex md:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{ color: "rgb(26, 26, 26)" }}
              className="font-display text-[15px] font-normal not-italic leading-[21px] transition-opacity hover:opacity-70"
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
