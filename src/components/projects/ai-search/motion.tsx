"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// Motion plumbing for the AI Search case study (spec §2.2–2.3).

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Phones get scroll scenes unpinned, as stacked static steps (spec §2.3).
// Matches Tailwind's md breakpoint, where the CSS pin starts.
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

// Reduced motion: every scene shows its finished state, nothing moves.
// Read like useIsMobile (not framer's useReducedMotion) so the first
// client render matches the static HTML and hydration stays clean.
export const useStill = () => useMediaQuery("(prefers-reduced-motion: reduce)");

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export type SceneState = {
  // Current step, 0-based. Static scenes get the last one.
  step: number;
  // Scroll progress through the whole scene, 0 → 1.
  progress: MotionValue<number>;
  // Pinned and animating (false on phones and with reduced motion).
  live: boolean;
};

// `▶ Scroll scene`: pins its content for steps × `vh` of scroll and
// reports which step the reader is on. Below 768px or with reduced motion
// it renders `still` (or the finished state) in normal flow instead.
export function StickyScene({
  steps,
  vh = 90,
  children,
  still,
  className,
  label,
}: {
  steps: number;
  vh?: number;
  children: (state: SceneState) => React.ReactNode;
  still?: () => React.ReactNode;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const done = useMotionValue(1);
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(steps - 1, Math.max(0, Math.floor(v * steps))));
  });
  const reduced = useStill();
  const mobile = useIsMobile();
  const live = !reduced && !mobile;

  // Pinning lives in CSS (md + motion-safe), so the static HTML is already
  // right on phones and with reduced motion: nothing jumps on hydration.
  return (
    <div
      ref={ref}
      aria-label={label}
      className={cn("relative", live ? "md:motion-safe:h-(--scene-h)" : "py-10")}
      style={{ "--scene-h": `${steps * vh + 10}vh` } as React.CSSProperties}
    >
      {/* Below lg the site's 56px top bar is fixed over the page. */}
      <div
        className={cn(
          live &&
            "md:motion-safe:sticky md:motion-safe:top-14 md:motion-safe:flex md:motion-safe:h-[calc(100svh-3.5rem)] md:motion-safe:items-center md:motion-safe:overflow-hidden lg:motion-safe:top-0 lg:motion-safe:h-svh",
          className,
        )}
      >
        {live
          ? children({ step, progress: scrollYProgress, live: true })
          : still
            ? still()
            : children({ step: steps - 1, progress: done, live: false })}
      </div>
    </div>
  );
}

// Scrolls the page to the start of step `i` of the StickyScene `scene` (a
// hair past it, so rounding can't land on the step before).
export function scrollToStep(scene: HTMLElement, i: number, steps: number) {
  const top = scene.getBoundingClientRect().top + window.scrollY;
  const range = scene.offsetHeight - window.innerHeight;
  window.scrollTo({ top: top + ((i + 0.02) / steps) * range, behavior: "instant" });
}

// Fades its children up once, the first time they scroll into view.
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const still = useStill();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={still ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}

// Types `text` out a character at a time; restart it by changing `key`.
export function useTypewriter(
  text: string,
  { speed = 90, startDelay = 250, instant = false } = {},
) {
  const [count, setCount] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay, instant]);
  return { typed: text.slice(0, count), done: count >= text.length };
}

// One clock per beat of a scroll scene. Each scroll step is a beat; landing
// on one, from above or below, plays it from its start at normal speed and
// holds on its last frame. `starts` and `ends` are the beats' times on one
// timeline (seconds), `frameAt` turns a time on it into what the scene shows,
// and `same` keeps React from re-rendering every frame when nothing visible
// changed. Nothing plays until the scene (`ref`) is mostly on screen.
export function useBeatClock<F>({
  step,
  starts,
  ends,
  frameAt,
  same,
}: {
  step: number;
  starts: readonly number[];
  ends: readonly number[];
  frameAt: (t: number) => F;
  same: (a: F, b: F) => boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [frame, setFrame] = useState(() => frameAt(starts[step]));
  const local = useRef(0);
  const shownStep = useRef(step);

  useAnimationFrame((_, delta) => {
    if (!seen) return;
    if (shownStep.current !== step) {
      shownStep.current = step;
      local.current = 0;
    } else {
      // Stop just short of the end, which belongs to the next beat.
      const length = ends[step] - starts[step] - 0.001;
      if (local.current >= length) return;
      local.current = Math.min(length, local.current + delta / 1000);
    }
    const next = frameAt(starts[step] + local.current);
    setFrame((f) => (same(f, next) ? f : next));
  });

  return { ref, frame };
}
