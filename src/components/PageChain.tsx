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
// back) while the swipe that opened it is still gliding, so trackpad or
// touch momentum doesn't carry it off, and while late content (fonts,
// images) is still changing its height. Lets go once the scrolling has been
// quiet for a moment.
const HOLD_MIN_MS = 450;
const HOLD_MAX_MS = 1500;
const HOLD_QUIET_MS = 150;

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
    // Never cancel the wheel itself: a swipe whose first event is cancelled
    // stays unscrollable to the browser, freezing the page until a click.
    const onWheel = () => {
      lastInput = performance.now();
    };
    const onScroll = () => pin();
    const resize = new ResizeObserver(pin);
    resize.observe(document.body);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll);

    let frame = 0;
    const release = () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
    const tick = () => {
      const now = performance.now();
      const settled = now - start > HOLD_MIN_MS && now - lastInput > HOLD_QUIET_MS;
      if (settled || now - start > HOLD_MAX_MS) release();
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
