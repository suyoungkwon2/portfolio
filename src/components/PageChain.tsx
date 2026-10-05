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

// Coming back up, a pulled-in page lands at its end. PullToNavigate waits
// out the swipe's momentum before opening it, so nothing here fights the
// scroll; the end is only re-found while late content (fonts, images) grows
// the page, until the visitor scrolls on their own.
const FOLLOW_END_MAX_MS = 1500;

function PageEnter({ children }: { children: React.ReactNode }) {
  const [from] = useState(arrivedByPull);

  useLayoutEffect(() => {
    if (!from) return;
    const root = document.documentElement;
    const pin = () =>
      window.scrollTo({ top: from === "prev" ? root.scrollHeight : 0, behavior: "instant" });
    pin();
    if (from !== "prev") return;

    const resize = new ResizeObserver(pin);
    resize.observe(document.body);
    const stop = () => {
      clearTimeout(timer);
      resize.disconnect();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
    const timer = setTimeout(stop, FOLLOW_END_MAX_MS);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return stop;
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
