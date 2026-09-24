import Link from "next/link";
import { navItems, site } from "@/content/site";

const linkClass =
  "font-display text-[15px] font-normal not-italic leading-[21px] text-ink transition-colors hover:text-accent-3";

// Always visible, on the same max-w-6xl grid as the page content: the logo
// links home (where Work lives); Resume and About sit at the right.
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[84px] border-b border-line/60 bg-paper/75 backdrop-blur-md">
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
  );
}
