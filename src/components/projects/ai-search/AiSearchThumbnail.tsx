"use client";

import { motion, useInView } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SCREENS, SearchQuery } from "./ActSetup";
import { useStill, useTypewriter } from "./motion";

// The AI Search card thumbnail, played live from the hero's Kurly screens
// instead of a flat image: "granma padano" is typed into a search bar, the
// bar is pressed, the Before phone drops in with "No products found.", then
// an arrow and the After phone with the real Grana Padano results. Then it
// all dissolves and plays again while on screen; with reduced motion it
// shows the finished frame.
//
// Laid out in card-width units (cqw) so it scales from the landing grid down
// to the case-study footer.

const QUERY = "granma padano";
const TYPE_SPEED = 85;
const TYPE_START = 400;

type Phase = "idle" | "typing" | "click" | "before" | "arrow" | "after" | "reset";
const NEXT: Record<Phase, [Phase, number]> = {
  idle: ["typing", 300],
  typing: ["click", TYPE_START + QUERY.length * TYPE_SPEED + 500],
  click: ["before", 650],
  before: ["arrow", 900],
  arrow: ["after", 450],
  after: ["reset", 6300],
  reset: ["typing", 600],
};
const ORDER: Phase[] = ["idle", "typing", "click", "before", "arrow", "after", "reset"];
const reached = (phase: Phase, at: Phase) =>
  phase !== "reset" && ORDER.indexOf(phase) >= ORDER.indexOf(at);

// Top-down reveal for the phones. "gone" is the end of a loop: a quick
// dissolve that holds every other value where it is (framer would otherwise
// animate them back toward "hidden"), then "hidden" rewinds them unseen.
const drop = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0, transition: { duration: 0 } },
  shown: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
  gone: { clipPath: "inset(0 0 0% 0)", opacity: 0, transition: { duration: 0.3 } },
};
const line = {
  hidden: { pathLength: 0, opacity: 0, transition: { duration: 0 } },
  shown: { pathLength: 1, opacity: 1 },
  gone: { pathLength: 1, opacity: 0, transition: { duration: 0.3 } },
};
const fade = {
  hidden: { opacity: 0, y: "-1cqw", transition: { duration: 0 } },
  shown: { opacity: 1, y: 0 },
  gone: { y: 0, opacity: 0, transition: { duration: 0.3 } },
};

export function AiSearchThumbnail() {
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (still || !inView) return;
    const [next, wait] = NEXT[phase];
    const timer = setTimeout(() => {
      if (next === "typing") setCycle((c) => c + 1);
      setPhase(next);
    }, wait);
    return () => clearTimeout(timer);
  }, [phase, inView, still]);

  const at = (p: Phase) => still || reached(phase, p);
  const reveal = (p: Phase) => (at(p) ? "shown" : phase === "reset" ? "gone" : "hidden");

  return (
    <div ref={ref} aria-hidden className="@container absolute inset-0">
      {/* Search bar, tilted, top left. Pressed once the query is in. */}
      <motion.div
        animate={phase === "click" && !still ? { scale: [1, 0.92, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, delay: 0.15, times: [0, 0.4, 1] }}
        className="absolute left-[12cqw] top-[6.5cqw] z-20 -rotate-[5deg] rounded-[2cqw] bg-[linear-gradient(90deg,#dccbff,#f58fd6)] p-[0.5cqw] shadow-[0_1.5cqw_3cqw_-1cqw_rgba(0,0,0,0.35)]"
      >
        <div className="flex h-[6.8cqw] items-center gap-[2cqw] rounded-[1.5cqw] bg-[#f0f3f7] px-[2.8cqw]">
          <Search className="size-[3cqw] shrink-0 text-[#8b97a3]" strokeWidth={2.4} />
          {/* The full query, invisible, sizes the bar so the X never moves. */}
          <span className="relative whitespace-nowrap text-[3.8cqw] leading-none tracking-[-0.01em] text-[#1f2124]">
            <span className="invisible">{QUERY}</span>
            <span className="absolute inset-0 flex items-center whitespace-pre">
              {still ? (
                QUERY
              ) : phase === "typing" ? (
                <Typed key={cycle} />
              ) : phase === "idle" ? null : (
                QUERY
              )}
            </span>
          </span>
          <X className="ml-[2cqw] size-[2.7cqw] shrink-0 text-[#8b97a3]" strokeWidth={2.2} />
        </div>
      </motion.div>

      {/* Before: "? BEFORE ?", then the phone, top down. */}
      <motion.div
        initial={false}
        animate={reveal("before")}
        variants={fade}
        transition={{ duration: 0.4 }}
        className="absolute left-[14.4cqw] top-[24.5cqw] flex w-[28cqw] items-center justify-between leading-none"
      >
        <span className="font-display -rotate-6 text-[5cqw] font-semibold text-[#9aa0a8]">?</span>
        <Label>Before</Label>
        <span className="font-display rotate-12 text-[5cqw] font-semibold text-[#9aa0a8]">?</span>
      </motion.div>
      <motion.div
        initial={false}
        animate={reveal("before")}
        variants={drop}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[11.4cqw] top-[31.5cqw] w-[34cqw] rounded-t-[4cqw] bg-[#c4c6ca] p-[0.8cqw] pb-0"
      >
        <Screen src={`${SCREENS}/before.webp`} radius="3.2cqw" />
      </motion.div>

      {/* The arrow, drawn from Before to After. */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="absolute left-[40cqw] top-[15cqw] w-[8.5cqw] overflow-visible"
      >
        <motion.path
          d="M8 92 C 14 50, 46 26, 90 24"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={false}
          animate={reveal("arrow")}
          variants={line}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.path
          d="M72 8 L 92 24 L 74 42"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={reveal("after")}
          variants={line}
          transition={{ duration: 0.2 }}
        />
      </svg>

      {/* After: the label, then the real Grana Padano results, top down. */}
      <motion.div
        initial={false}
        animate={reveal("after")}
        variants={fade}
        transition={{ duration: 0.4 }}
        className="absolute left-[48cqw] top-[12cqw] flex w-[42cqw] justify-center"
      >
        <Label after>After</Label>
      </motion.div>
      <motion.div
        initial={false}
        animate={reveal("after")}
        variants={drop}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[48cqw] top-[17cqw] w-[42cqw] rounded-t-[4.6cqw] bg-[linear-gradient(180deg,#e0d4ff,#f49ad8)] p-[1cqw] pb-0"
      >
        <Screen src={`${SCREENS}/grana-after.webp`} radius="3.6cqw" />
      </motion.div>
    </div>
  );
}

function Typed() {
  const { typed, done } = useTypewriter(QUERY, {
    speed: TYPE_SPEED,
    startDelay: TYPE_START,
  });
  return (
    <>
      {typed}
      {!done && <Caret />}
    </>
  );
}

// BEFORE / AFTER over the phones, as in the hero.
function Label({ children, after = false }: { children: React.ReactNode; after?: boolean }) {
  return (
    <span
      className={`font-display text-[2.6cqw] font-medium uppercase tracking-[0.2em] ${after ? "text-white" : "text-[#c4c6ca]"}`}
    >
      {children}
    </span>
  );
}

function Caret() {
  return <span className="ml-[0.2cqw] h-[1.1em] w-[0.3cqw] shrink-0 animate-pulse bg-[#1f2124]" />;
}

// A Kurly screen from the hero, cropped under the status bar with a little
// white above the search header, and the query drawn in our type like the
// hero.
function Screen({ src, radius }: { src: string; radius: string }) {
  return (
    <div
      className="overflow-hidden bg-white pt-[4%]"
      style={{ borderTopLeftRadius: radius, borderTopRightRadius: radius }}
    >
      <div className="overflow-hidden">
        <div className="@container relative -mt-[12%] aspect-[590/1280] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img src={src} alt="" className="absolute inset-0 size-full" />
          <SearchQuery text={QUERY} />
        </div>
      </div>
    </div>
  );
}
