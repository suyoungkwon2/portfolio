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

// Scrolling while a held scene is pinned plays it this much faster: down
// runs it forward, up runs it back.
const FAST_RATE = 4;
const FAST_WINDOW_MS = 250;

// One clock for a scene that plays on its own once on screen (`ref`). While
// `stage` is pinned, scrolling down doesn't leave until the clock reaches
// `finish`: it runs the clock faster instead. Scrolling up rewinds it the
// same way back to the start, so the scene can be watched again. `seek`
// jumps the clock. `frameAt` turns clock seconds into what the scene shows;
// `same` keeps React from re-rendering every frame when nothing visible
// changed.
export function useHeldClock<F>({
  stage,
  finish,
  frameAt,
  same,
}: {
  stage: React.RefObject<HTMLDivElement | null>;
  finish: number;
  frameAt: (t: number) => F;
  same: (a: F, b: F) => boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [frame, setFrame] = useState(() => frameAt(0));
  const clock = useRef(0);
  const lastPush = useRef(-Infinity);
  const lastPull = useRef(-Infinity);

  useAnimationFrame((time, delta) => {
    if (!seen) return;
    const s = delta / 1000;
    const pulling = time - lastPull.current < FAST_WINDOW_MS;
    if (pulling) {
      if (clock.current <= 0) return;
      clock.current = Math.max(0, clock.current - s * FAST_RATE);
    } else {
      if (clock.current >= finish) return;
      const fast = time - lastPush.current < FAST_WINDOW_MS;
      clock.current = Math.min(finish, clock.current + s * (fast ? FAST_RATE : 1));
    }
    const next = frameAt(clock.current);
    setFrame((f) => (same(f, next) ? f : next));
  });

  const seek = useCallback(
    (t: number) => {
      clock.current = Math.min(finish, Math.max(0, t));
      lastPull.current = -Infinity;
      setFrame(frameAt(clock.current));
    },
    [finish, frameAt],
  );

  useEffect(() => {
    const pinned = () => {
      const el = stage.current;
      if (!el) return false;
      const top = window.matchMedia("(min-width: 1024px)").matches ? 0 : 56;
      const r = el.getBoundingClientRect();
      return r.top <= top + 1 && r.bottom >= window.innerHeight - 1;
    };
    const go = (e: Event, down: boolean) => {
      if (!pinned()) return;
      if (down ? clock.current >= finish : clock.current <= 0) return;
      e.preventDefault();
      if (down) lastPush.current = performance.now();
      else lastPull.current = performance.now();
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) go(e, e.deltaY > 0);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) go(e, true);
      else if (["ArrowUp", "PageUp"].includes(e.key)) go(e, false);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      if (y !== touchY) go(e, y < touchY);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [stage, finish]);

  return { ref, frame, seek };
}
