"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Chapter = { id: string; label: string };

// Sticky "on this page" rail for long case studies. Chapters aren't
// configured here — any element on the page with an id and a
// data-chapter="<label>" attribute (ChapterDivider sets both) is picked up
// in document order, so a detail page opts in just by marking its
// chapters. Renders nothing with fewer than two chapters.
//
// Only shown from 1400px up: the case-study column is 1200px wide, so the
// side gutter is too narrow for labels below that. Fades in once the first
// chapter reaches mid-screen, so the hero stays clean.
export function ProjectSideNav() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter][id]"));
    if (els.length < 2) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      setVisible(els[0].getBoundingClientRect().top < vh * 0.5);
      // Active = the last chapter whose top has crossed the upper third.
      let current = els[0].id;
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
      setChapters(els.map((el) => ({ id: el.id, label: el.dataset.chapter ?? el.id })));
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (chapters.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "fixed left-5 top-1/2 z-30 hidden w-[120px] -translate-y-1/2 transition-opacity duration-300 min-[1400px]:block",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ul className="flex flex-col border-l border-line">
        {chapters.map(({ id, label }) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors",
                  active
                    ? "border-accent font-medium text-ink"
                    : "border-transparent text-ink-muted hover:text-ink",
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
