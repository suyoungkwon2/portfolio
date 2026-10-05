"use client";

import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { markPullNavigation, type PullDirection } from "@/lib/pullNavigation";

type Page = { href: string; label: string };

// How far (after resistance) the visitor has to pull past the page's end.
const THRESHOLD = 64;
// Each px of scroll moves the content this much, so it gives a little.
const RESISTANCE = 0.9;
const MAX_PULL = 120;
// A wheel burst that was already running when the page hit an end (trackpad
// momentum) shouldn't count; pulling arms only after this much quiet.
const ARM_AFTER_IDLE_MS = 220;
// Slow, gentle scrolling has gaps between wheel events; don't snap back
// in the middle of one.
const RELEASE_AFTER_IDLE_MS = 300;

const atBottom = () =>
  window.innerHeight + window.scrollY >=
  document.documentElement.scrollHeight - 2;
const atTop = () => window.scrollY <= 0;

// Pull-to-refresh, but sideways through the site: at the end of the page,
// keep scrolling (or drag up on a phone) and the content stretches up with
// a springy give, then dissolves upward and opens `next` once pulled far
// enough (it rises in from below, see PageChain). The same at the top,
// scrolling up, opens `prev`. Let go early and it snaps back. The ring at
// the bottom shows the pull's progress and is also a link to `next`.
export function PullToNavigate({
  next,
  prev,
  children,
}: {
  next?: Page;
  prev?: Page;
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Signed: positive pulls toward `next` (content lifts), negative toward
  // `prev` (content drops).
  const pull = useMotionValue(0);
  const y = useSpring(pull, { stiffness: 420, damping: 28, mass: 0.6 });
  const lift = useTransform(y, (v) => -v);
  const progress = useTransform(y, [0, THRESHOLD], [0, 1], { clamp: true });
  const ring = useTransform(progress, (p) => 1 - p);
  const grow = useTransform(progress, [0, 1], [1, 1.25]);
  const fade = useMotionValue(1);
  const going = useRef(false);

  const go = useCallback(
    (direction: PullDirection) => {
      const page = direction === "next" ? next : prev;
      if (!page || going.current) return;
      going.current = true;
      markPullNavigation(direction);
      router.prefetch(page.href);
      const sign = direction === "next" ? 1 : -1;
      animate(pull, sign * (MAX_PULL + 80), { duration: 0.28, ease: "easeIn" });
      animate(fade, 0, { duration: 0.28, ease: "easeIn" });
      // Leave the top while the old page is fully faded, so the new one
      // doesn't flash in at the old scroll position first. (Going back, the
      // new page puts itself at its own end.)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        router.push(page.href, { scroll: false });
      }, 280);
    },
    [next, prev, router, pull, fade],
  );

  const hasNext = !!next;
  const hasPrev = !!prev;

  useEffect(() => {
    const setPull = (v: number) => {
      if (going.current) return;
      pull.set(
        Math.min(hasNext ? MAX_PULL : 0, Math.max(hasPrev ? -MAX_PULL : 0, v)),
      );
    };

    // Wheel / trackpad: there's no "release", so crossing the line opens it.
    let armed: PullDirection | null = null;
    // Counts as recent activity, so momentum carried over from the page that
    // was just left can't arm a pull here.
    let lastWheel = performance.now();
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const idle = now - lastWheel;
      lastWheel = now;
      const direction: PullDirection | null =
        e.deltaY > 0 && hasNext && atBottom()
          ? "next"
          : e.deltaY < 0 && hasPrev && atTop()
            ? "prev"
            : null;
      if (direction !== armed) {
        if (armed) setPull(0);
        armed = direction && idle >= ARM_AFTER_IDLE_MS ? direction : null;
      }
      if (!armed) return;
      setPull(pull.get() + e.deltaY * RESISTANCE);
      if (Math.abs(pull.get()) >= THRESHOLD) go(armed);
      if (going.current) return;
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => setPull(0), RELEASE_AFTER_IDLE_MS);
    };

    // Touch: drag up from the bottom (or down from the top), open on
    // release if pulled far enough.
    let startY: number | null = null;
    let canNext = false;
    let canPrev = false;
    const onTouchStart = (e: TouchEvent) => {
      canNext = hasNext && atBottom();
      canPrev = hasPrev && atTop();
      startY = canNext || canPrev ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY === null) return;
      const v = (startY - e.touches[0].clientY) * RESISTANCE;
      setPull((v > 0 && canNext) || (v < 0 && canPrev) ? v : 0);
    };
    const onTouchEnd = () => {
      const v = pull.get();
      if (startY !== null && Math.abs(v) >= THRESHOLD)
        go(v > 0 ? "next" : "prev");
      else setPull(0);
      startY = null;
    };

    // Stop the browser's own pull-to-refresh / rubber band at the top, which
    // would otherwise fight the pull back to the previous page.
    const root = document.documentElement;
    if (hasPrev) root.style.overscrollBehaviorY = "none";

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      clearTimeout(releaseTimer);
      root.style.overscrollBehaviorY = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [hasNext, hasPrev, pull, go]);

  return (
    <motion.div style={{ y: lift, opacity: fade }}>
      {children}
      {next && (
        <div className="flex justify-center pb-16 pt-14">
          <Link
            href={next.href}
            aria-label={next.label}
            onClick={(e) => {
              e.preventDefault();
              go("next");
            }}
            className="rounded-full p-2 text-ink transition-opacity hover:opacity-70"
          >
            <motion.span
              aria-hidden
              className="relative grid size-9 place-items-center"
              style={{ scale: grow }}
            >
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-line"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-ink"
                  strokeWidth="2"
                  pathLength={1}
                  strokeDasharray="1 1"
                  style={{ strokeDashoffset: ring }}
                />
              </svg>
              <ArrowDown className="size-4" />
            </motion.span>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
