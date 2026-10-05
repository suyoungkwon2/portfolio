"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { pageChain } from "@/content/navigation";
import { arrivedByPull } from "@/lib/pullNavigation";
import { PullToNavigate } from "./PullToNavigate";

// trailingSlash export serves /work/projects/; compare paths without it.
const normalize = (path: string | null) =>
  (path ?? "/").replace(/(.)\/+$/, "$1");

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

function PageEnter({ children }: { children: React.ReactNode }) {
  const [from] = useState(arrivedByPull);

  // Coming back up, pick up where the visitor left this page: its end.
  useLayoutEffect(() => {
    if (from === "prev") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      });
    }
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
