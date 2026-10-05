"use client";

import Image from "next/image";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { heroTitleClass } from "./PageTitle";

// One point each for business, impact, scale, and AI depth, each tagged with
// its field and where it happened. Keep these in sync with src/content/works.ts. In `value`,
// {braces} mark a unit or symbol that renders smaller. "3.5M‑MAU" and
// "co‑first" use non-breaking hyphens (U+2011) so they never split across
// lines. In `label`, \n marks a line break that applies on desktop only:
// break between phrases (keeping a/an with its noun), with each line short
// enough to fit a column at 1512px.
const proofPoints = [
  { field: "B2B AI SaaS", org: "Asleep", value: "$60K+ {MRR}", label: "First B2B revenue line,\nbuilt 0 → 1 at a sleep-tech startup" },
  { field: "Digital Health", org: "Asleep", value: "K-FDA {Approved}", label: "Clinical trial for\nan insomnia digital therapeutic app" },
  { field: "AI Search", org: "Kurly", value: "$3.5M+ {/mo}", label: "Revenue recovered from\nno-result searches, 3.5M MAU" },
  { field: "AI Research", org: "CMU LTI", value: "EMNLP 2025", label: "Main Conference paper,\nco‑first author" },
];

// The hats behind the work, in order, each with its picture.
const roles = [
  { title: "Product Manager", src: "/images/img_hero_2productmanager.jpg" },
  { title: "UX Designer", src: "/images/img_hero_3UXdesigner.jpg" },
  { title: "HCI Researcher", src: "/images/img_hero_4HCIresearcher.jpg" },
  { title: "MDes @ CMU", src: "/images/img_hero_5mastercmu.jpg" },
];

// Width over height of the photos (1548×908).
const PHOTO_RATIO = 1.7;
// Spread out, each photo leans a little, alternating, like prints laid on
// a table.
const TILTS = [-5, 3, -3, 4];
const DROPS = [10, 0, 4, 2];
// Stacked, the photos behind the front one fan out down and to the right.
const STACK = [
  { x: 0, y: 0, r: 0 },
  { x: 14, y: 6, r: 4 },
  { x: 26, y: 10, r: 7 },
  { x: 36, y: 15, r: 10 },
];
// The stacked pile is closer to square than the spread-out photos.
const STACK_RATIO = 1.23;
// How far neighbouring photos overlap once spread.
const OVERLAP_PX = 20;
// Hovering a spread photo enlarges it and its title by this much.
const HOVER_SCALE = 1.04;

function StatValue({ value }: { value: string }) {
  return value.split(/\{(.*?)\}/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="ml-0.5 text-[0.55em] font-medium tracking-normal">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// How long after the page opens the photos spread on their own.
const SPREAD_DELAY_MS = 300;

// Whether the photos are spread out. They start stacked and spread
// SPREAD_DELAY_MS after the page opens, or sooner if the visitor scrolls
// (or clicks the stack) first.
function useSpread() {
  const [spread, setSpread] = useState(false);

  useEffect(() => {
    const spreadNow = () => {
      setSpread(true);
      clearTimeout(timer);
      window.removeEventListener("scroll", spreadNow);
    };
    const timer = setTimeout(spreadNow, SPREAD_DELAY_MS);
    window.addEventListener("scroll", spreadNow, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", spreadNow);
    };
  }, []);

  return [spread, () => setSpread(true)] as const;
}

// Width of `ref`, kept current on resize, and whether a resize is under
// way (true until RESIZE_SETTLE_MS after the last change).
const RESIZE_SETTLE_MS = 200;

function useWidth(ref: React.RefObject<HTMLElement | null>, fallback: number) {
  const [width, setWidth] = useState(fallback);
  const [resizing, setResizing] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let first = true;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
      // The first reading is the initial measurement, not a resize.
      if (first) {
        first = false;
        return;
      }
      setResizing(true);
      clearTimeout(settle);
      settle = setTimeout(() => setResizing(false), RESIZE_SETTLE_MS);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(settle);
    };
  }, [ref]);
  return { width, resizing };
}

// Where every photo sits, stacked or spread, for a stage of width `w`.
// Four across on wide stages, two by two on narrow ones.
function layout(w: number) {
  const cols = w >= 640 ? 4 : 2;
  const fontSize = Math.min(30, Math.max(14, w * 0.022 - 6));
  const labelH = fontSize * 1.6;
  // Spread, neighbours overlap by OVERLAP_PX. The first and last are
  // pulled in by `pad` (3% of a photo's width) so their tilted corners
  // stay inside the content edges.
  const cw = (w + OVERLAP_PX * (cols - 1)) / (cols + 0.06);
  const pad = cw * 0.03;
  const step = (w - 2 * pad - cw) / (cols - 1);
  const ch = cw / PHOTO_RATIO;
  const rowH = labelH + ch + cw * 0.12;
  const stackW = Math.min(230, Math.max(150, w * 0.14));

  const cards = roles.map((_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      spread: { x: pad + col * step, y: row * rowH + labelH + DROPS[i], width: cw, height: ch, rotate: TILTS[i] },
      stacked: { x: STACK[i].x, y: labelH + STACK[i].y, width: stackW, height: stackW / STACK_RATIO, rotate: STACK[i].r },
    };
  });
  const height = Math.ceil(cols === 4 ? rowH : rowH * 2);
  return { fontSize, cardWidth: cw, cards, height };
}

// The four roles as photos, each with its title attached above it, so a
// title tilts with its photo and stays centered on it. Stacked, only the
// front photo's title shows, left-aligned right under "I'm Mel,"; spread,
// it slides to the middle of its photo and the other titles dissolve in
// once their photos have landed. Clicking the stack spreads it too.
function RolePhotos({ spread, onSpread }: { spread: boolean; onSpread: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { width, resizing } = useWidth(stageRef, 1100);
  const [labelWidths, setLabelWidths] = useState<number[]>([]);
  const reduceMotion = useReducedMotion();
  const { fontSize, cardWidth, cards, height } = layout(width);


  // Centering a title over its photo needs its width, which changes with
  // the font size.
  useLayoutEffect(() => {
    setLabelWidths(labelRefs.current.map((el) => el?.offsetWidth ?? 0));
  }, [fontSize]);

  // While the window is being resized the photos just follow the new
  // layout, with no animation.
  const spring = (i: number) =>
    reduceMotion || resizing
      ? { duration: 0 }
      : { type: "spring" as const, stiffness: 110, damping: 19, mass: 0.9, delay: spread ? i * 0.06 : 0 };

  return (
    <div ref={stageRef} aria-hidden className="relative" style={{ height }}>
      {roles.map((role, i) => {
        const centered = (cardWidth - (labelWidths[i] ?? 0)) / 2;
        return (
          <motion.div
            key={role.src}
            initial={false}
            animate={spread ? cards[i].spread : cards[i].stacked}
            whileHover={spread ? { scale: HOVER_SCALE } : undefined}
            transition={{ ...spring(i), scale: { type: "spring", stiffness: 300, damping: 24 } }}
            // Same stacking order spread as stacked, hovered or not: the
            // front photo stays on top where neighbours overlap.
            style={{ zIndex: roles.length - i }}
            className="absolute left-0 top-0"
          >
            <motion.span
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              initial={false}
              animate={i === 0 ? { x: spread ? centered : 0 } : { x: centered, opacity: spread ? 1 : 0 }}
              transition={
                i === 0
                  ? spring(i)
                  : {
                      x: { duration: 0 },
                      opacity: reduceMotion
                        ? { duration: 0 }
                        : { duration: 0.7, ease: "easeOut", delay: spread ? 0.35 + i * 0.1 : 0 },
                    }
              }
              style={{ fontSize, marginBottom: fontSize * 0.25 }}
              className="font-manrope absolute bottom-full left-0 whitespace-nowrap font-semibold leading-[1.3] tracking-[-0.02em] text-ink"
            >
              {role.title}
            </motion.span>
            <button
              type="button"
              tabIndex={-1}
              onClick={onSpread}
              className={cn(
                "absolute inset-0 overflow-hidden bg-paper-2 shadow-[0_2px_14px_rgba(0,0,0,0.10)]",
                spread ? "cursor-default" : "cursor-pointer",
              )}
            >
              <Image
                src={role.src}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 28vw, 55vw"
                // One shared grade (a touch brighter, softer, less saturated)
                // so the four photos read as a set.
                className="object-cover brightness-[1.08] contrast-[0.88] saturate-[0.85]"
              />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

// `children` is whatever follows the hero on the page (the Work section):
// hidden along with the subcopy until the photos spread, then faded in.
export function Hero({ children }: { children?: React.ReactNode }) {
  const [spread, onSpread] = useSpread();
  const reduceMotion = useReducedMotion();
  const fadeIn = {
    initial: false as const,
    animate: { opacity: spread ? 1 : 0, y: spread ? 0 : -12 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" as const, delay: spread ? 0.35 : 0 },
  };

  return (
    <>
      <section id="hero" className="flex flex-col px-6 pb-10 pt-12 md:px-10 md:pt-16">
        <h1 className={heroTitleClass}>
          I’m Mel,
          <span className="sr-only">
            {" "}
            {roles.map((r) => r.title).join(", ")}
          </span>
        </h1>

        <div className="mt-2">
          <RolePhotos spread={spread} onSpread={onSpread} />
        </div>

        {/* Hidden (but holding their space, so nothing below moves) until
            the photos spread. */}
        <motion.div {...fadeIn} className={cn(!spread && "pointer-events-none")}>
          {/* Three set lines from md up; phones wrap naturally. */}
          <p className="font-manrope mt-10 text-[22px] font-medium leading-[1.32] tracking-[-0.02em] text-ink md:text-[32px]">
            I design &amp; ship B2C/B2B/AI products{" "}
            <br className="hidden md:inline" />
            for startups and tech companies{" "}
            <br className="hidden md:inline" />
            toward positive social impact
          </p>

          {/* Columns split by hairlines from xl up; two columns
              with no rules below that (four don't fit beside the sidebar). */}
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {proofPoints.map((p, i) => (
              <div key={p.value} className={cn("xl:px-6", i === 0 ? "xl:pl-0" : "xl:border-l xl:border-ink/15")}>
                <p className="flex items-baseline gap-2 text-[13px] text-ink">
                  {p.field}
                  <span className="font-manrope text-[11px] font-medium text-ink-muted">@ {p.org}</span>
                </p>
                <p className="font-manrope mt-3 whitespace-nowrap text-[26px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[30px]">
                  <StatValue value={p.value} />
                </p>
                <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-ink-muted lg:max-w-none">
                  {p.label.split("\n").map((line, j) => (
                    <Fragment key={line}>
                      {j > 0 && (
                        <>
                          {" "}
                          <br className="hidden lg:inline" />
                        </>
                      )}
                      {line}
                    </Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      {children && (
        <motion.div
          initial={false}
          animate={{ opacity: spread ? 1 : 0, y: spread ? 0 : -12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut", delay: spread ? 0.55 : 0 }}
          className={cn(!spread && "pointer-events-none")}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
