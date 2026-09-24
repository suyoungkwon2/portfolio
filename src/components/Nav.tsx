"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, site } from "@/content/site";

export const NAV_HEIGHT = 63;
// How far the page scrolls before the nav folds up out of view. It comes
// back once the visitor scrolls above this point again.
const HIDE_AFTER_PX = 200;

const linkClass =
  "font-display text-[15px] font-normal not-italic leading-[21px] text-ink transition-colors hover:text-accent-3";

// Fixed to the top, on the same max-w-6xl grid as the page content: the
// logo links home (where Work lives); Resume and About sit at the right.
// Frosted (40% white + backdrop blur). With `overlay` (the landing page)
// it floats over the hero background; otherwise a same-height spacer keeps
// page content from starting underneath it.
export function Nav({ overlay = false }: { overlay?: boolean }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function onScroll() {
      setHidden(window.scrollY > HIDE_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        style={{ height: NAV_HEIGHT }}
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/40 backdrop-blur-md transition-transform ${
          // Folding away is slower and eased so it doesn't feel abrupt;
          // coming back stays quick.
          hidden
            ? "-translate-y-full duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            : "translate-y-0 duration-300 ease-out"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 md:px-10">
          <Link
            href="/"
            className="font-display text-base font-medium tracking-tight text-ink sm:text-lg"
          >
            {site.name}
          </Link>

          <nav className="flex items-center gap-6 md:gap-8">
            {navItems.map((item) =>
              item.external ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>
      {!overlay && <div aria-hidden style={{ height: NAV_HEIGHT }} />}
    </>
  );
}
