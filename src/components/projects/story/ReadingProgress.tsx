"use client";

import { motion, useScroll } from "framer-motion";

// Thin progress bar across the top: under the mobile top bar below lg,
// along the very top beside the sidebar from lg up.
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-14 z-40 h-[2px] origin-left bg-accent lg:left-60 lg:top-0"
    />
  );
}
