"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// A "See X" pill that expands in place to reveal supplementary detail
// (a comparison table, a diagram) without pushing that detail into the
// main reading flow by default.
export function Accordion({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-2xl border border-line px-10 py-4 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink"
      >
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="mt-6 w-full">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
