"use client";

import { ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navTree, type NavNode } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Chapter = { id: string; label: string };

// trailingSlash export serves /work/mars/; compare paths without it.
const normalize = (path: string | null) => (path ?? "/").replace(/(.)\/+$/, "$1");

const pathOf = (href: string) => href.split("#")[0];

const isCurrent = (node: NavNode, pathname: string) =>
  !node.href.includes("#") && pathOf(node.href) === pathname;

function containsPath(node: NavNode, pathname: string): boolean {
  return isCurrent(node, pathname) || (node.children ?? []).some((c) => containsPath(c, pathname));
}

// Case-study chapters: any element with an id and data-chapter="<label>"
// (ChapterDivider and friends set both), in document order. They nest
// under the current project in the tree, with the one in view marked.
// Fewer than two chapters isn't worth listing.
function useChapters(pathname: string) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter][id]"));

    let frame = 0;
    const update = () => {
      frame = 0;
      // Active = the last chapter whose top has crossed the upper third.
      const vh = window.innerHeight;
      let current = els[0]?.id ?? null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= vh * 0.35) current = el.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // First read happens in a frame callback (not synchronously in the
    // effect) so the chapter list and scroll state land in one render.
    frame = requestAnimationFrame(() => {
      setChapters(
        els.length < 2 ? [] : els.map((el) => ({ id: el.id, label: el.dataset.chapter ?? el.id })),
      );
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return { chapters, activeId };
}

// Children hang off a hairline, indented under their folder's label.
const branchClass = "ml-2 flex flex-col gap-px border-l border-line pl-1.5";

function TreeItem({
  node,
  depth,
  pathname,
  open,
  onToggle,
  chapters,
}: {
  node: NavNode;
  depth: number;
  pathname: string;
  open: (node: NavNode, depth: number) => boolean;
  onToggle: (node: NavNode, depth: number) => void;
  chapters: ReturnType<typeof useChapters>;
}) {
  const current = isCurrent(node, pathname);
  // A folder whose own page is open highlights its matching child instead
  // (About -> Hello Visitor), so only one row is ever marked.
  const marked = current && !(node.children ?? []).some((c) => isCurrent(c, pathname));
  const isFolder = !!node.children?.length;
  const expanded = isFolder && open(node, depth);
  const showChapters = marked && !isFolder && chapters.chapters.length > 0;

  return (
    <li>
      {/* The label links to the folder's page; the chevron at the row's
          right edge only opens and closes it. */}
      <div
        className={cn(
          "flex min-h-7 items-center rounded-md transition-colors",
          marked ? "bg-ink/[0.05]" : "hover:bg-ink/[0.03]",
        )}
      >
        <Link
          href={node.href}
          aria-current={marked ? "page" : undefined}
          className={cn(
            "flex min-h-7 flex-1 items-center px-2 text-[13px] leading-snug tracking-[-0.005em] transition-colors",
            marked
              ? "font-medium text-ink"
              : depth === 0
                ? "text-ink"
                : "text-ink-muted hover:text-ink",
          )}
        >
          {node.label}
        </Link>
        {isFolder && (
          <button
            type="button"
            onClick={() => onToggle(node, depth)}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${node.label}`}
            aria-expanded={expanded}
            className="mr-1 flex size-6 shrink-0 items-center justify-center rounded text-ink-muted/70 transition-colors hover:text-ink"
          >
            <ChevronRight
              aria-hidden
              strokeWidth={1.5}
              className={cn("size-3 transition-transform duration-200", expanded && "rotate-90")}
            />
          </button>
        )}
      </div>

      {expanded && (
        <ul className={branchClass}>
          {node.children!.map((child) => (
            <TreeItem
              key={child.href}
              node={child}
              depth={depth + 1}
              pathname={pathname}
              open={open}
              onToggle={onToggle}
              chapters={chapters}
            />
          ))}
        </ul>
      )}

      {showChapters && (
        <ul aria-label="On this page" className={branchClass}>
          {chapters.chapters.map(({ id, label }) => {
            const active = id === chapters.activeId;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "flex min-h-6 items-center rounded-md px-2 text-[12px] leading-snug transition-colors",
                    active ? "text-ink" : "text-ink-muted/80 hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mr-1.5 size-1 shrink-0 rounded-full transition-colors",
                      active ? "bg-ink" : "bg-transparent",
                    )}
                  />
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function NavTree({ pathname }: { pathname: string }) {
  // Folders the visitor toggled by hand. Cleared on every navigation, so
  // the tree always reopens around the page they land on.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOverrides({});
  }
  const chapters = useChapters(pathname);

  // Top-level folders start open; nested ones open while you're inside them.
  const open = (node: NavNode, depth: number) =>
    overrides[node.href] ?? (depth === 0 || containsPath(node, pathname));
  const onToggle = (node: NavNode, depth: number) =>
    setOverrides((o) => ({ ...o, [node.href]: !open(node, depth) }));

  return (
    <ul className="flex flex-col gap-px">
      {navTree.map((node) => (
        <TreeItem
          key={node.href}
          node={node}
          depth={0}
          pathname={pathname}
          open={open}
          onToggle={onToggle}
          chapters={chapters}
        />
      ))}
    </ul>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label={`${site.name}, home`} className="inline-block">
      <Image src="/images/logo_mk.svg" alt="" width={614} height={306} priority className="h-7 w-auto" />
    </Link>
  );
}

function Colophon() {
  return (
    <div className="px-5 py-6 text-[11px] leading-relaxed text-ink-muted">
      <p>
        © {new Date().getFullYear()} {site.name}
      </p>
    </div>
  );
}

// Site navigation as a folder tree: fixed down the left edge from lg up;
// below that, a top bar whose menu button drops the same tree over the page.
export function Sidebar() {
  const pathname = normalize(usePathname());
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-paper lg:flex">
        <div className="px-5 pb-10 pt-8">
          <Logo />
        </div>
        <nav aria-label="Site" className="flex-1 overflow-y-auto px-3">
          <NavTree pathname={pathname} />
        </nav>
        <Colophon />
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-line bg-paper/90 px-6 backdrop-blur-md lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 flex size-10 items-center justify-center text-ink"
        >
          {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </header>
      {menuOpen && (
        <div id="mobile-nav" className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col overflow-y-auto bg-paper lg:hidden">
          <nav aria-label="Site" className="flex-1 px-3 py-6">
            <NavTree pathname={pathname} />
          </nav>
          <Colophon />
        </div>
      )}
      {/* Keeps page content from starting under the mobile top bar. */}
      <div aria-hidden className="h-14 lg:hidden" />
    </>
  );
}
