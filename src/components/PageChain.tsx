"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { pageChain } from "@/content/navigation";
import { arrivedByPull } from "@/lib/pullNavigation";
import { PullToNavigate } from "./PullToNavigate";

// trailingSlash export serves /work/projects/; compare paths without it.
const normalize = (path: string | null) => (path ?? "/").replace(/(.)\/+$/, "$1");

// Wraps every page: pages in the reading chain (pageChain) can be pulled
// past either end into their neighbors. A page opened that way slides in
// from the side it was pulled from: from below going forward, from above
// (landing at its bottom) going back. Keyed by path, so each page gets its
// own entrance.
export function PageChain({ children }: { children: React.ReactNode }) {
  const pathname = normalize(usePathname());
  const index = pageChain.findIndex((page) => page.href === pathname);
  const next = index >= 0 ? pageChain[index + 1] : undefined;
  const prev = index > 0 ? pageChain[index - 1] : undefined;
  return (
    <PageEnter key={pathname}>
      {next || prev ? (
        <PullToNavigate next={next} prev={prev}>
          {children}
        </PullToNavigate>
      ) : (
        children
      )}
    </PageEnter>
  );
}

// Hold a pulled-in page at its landing spot (top going forward, end going
// back) only while the swipe that opened it is still gliding, so trackpad
// momentum doesn't carry it off. Momentum only slows down, so the first
// wheel event that is faster than the last one (or comes after a pause) is
// the visitor's own new swipe: let go right then, so it scrolls smoothly.
const HOLD_MAX_MS = 1200;
const HOLD_QUIET_MS = 100;
const FRESH_PUSH_RATIO = 1.5;

function PageEnter({ children }: { children: React.ReactNode }) {
  const [from] = useState(arrivedByPull);

  useLayoutEffect(() => {
    if (!from) return;
    const root = document.documentElement;
    const pin = () =>
      window.scrollTo({ top: from === "prev" ? root.scrollHeight : 0, behavior: "instant" });
    pin();

    const start = performance.now();
    let lastInput = start;
    let lastDelta = 0;
    // Never cancel the wheel itself: a swipe whose first event is cancelled
    // stays unscrollable to the browser, freezing the page until a click.
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const fresh =
        (lastDelta !== 0 && now - lastInput > HOLD_QUIET_MS) ||
        Math.sign(e.deltaY) !== Math.sign(lastDelta) ||
        Math.abs(e.deltaY) > Math.abs(lastDelta) * FRESH_PUSH_RATIO + 2;
      lastInput = now;
      // The very first event can't be told apart yet; treat it as glide.
      if (fresh && lastDelta !== 0) return release();
      lastDelta = e.deltaY;
    };
    const onScroll = () => pin();
    const resize = new ResizeObserver(pin);
    resize.observe(document.body);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll);
    // Touch has no momentum events to read; a finger on the screen is
    // always the visitor's own scroll.
    window.addEventListener("touchstart", release, { passive: true });

    let frame = 0;
    function release() {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", release);
    }
    const tick = () => {
      const now = performance.now();
      if (now - lastInput > HOLD_QUIET_MS || now - start > HOLD_MAX_MS) release();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return release;
  }, [from]);

  return (
    <motion.div
      initial={from ? { opacity: 0, y: from === "next" ? 140 : -140 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
