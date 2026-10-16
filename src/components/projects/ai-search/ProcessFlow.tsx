"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, useStill } from "./motion";

// Prove the case, build it, then give it back to the team that owns search.
const STRATEGY = [
  {
    name: "PoC",
    text: "Show that similar products convert far better than the Bestsellers on a No-Result search.",
  },
  {
    name: "CEO Decision",
    text: "Bring the evidence to the CEO and get the go-ahead.",
    gate: true,
  },
  { name: "Improvement", text: "Tune the AI layer on what the PoC taught us." },
  { name: "Integration", text: "Ship it into Kurly’s live search." },
  {
    name: "Hand-off",
    text: "Pass it to the Search Engine team as part of their roadmap.",
  },
];
const GATE = STRATEGY.findIndex((s) => s.gate);
const GREEN = "#16a34a";

// The five-step plan from 06 Define. Without `approved` every step is lit, as
// planned. With it (09), the steps past the PoC wait in gray until the CEO
// says yes: the gate turns green with a check and says so, then the rest
// light up in turn. That version is centred under its centred heading,
// names only.
export function ProcessFlow({
  animate,
  approved,
}: {
  animate: boolean;
  approved?: boolean;
}) {
  const still = useStill() || !animate;
  const gated = approved !== undefined;
  // How long after approval step i lights up (the gate first).
  const wait = (i: number) =>
    approved && i >= GATE ? 0.15 + (i - GATE) * 0.3 : 0;
  const lit = (i: number) => !gated || approved || i < GATE;
  return (
    <ol className="grid gap-3 md:grid-cols-5 md:gap-0">
      {STRATEGY.map((s, i) => {
        const on = lit(i);
        const passed = gated && approved && s.gate;
        const color = { transitionDelay: `${wait(i)}s` };
        return (
          <motion.li
            key={s.name}
            initial={still ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.45,
              ease: EASE_OUT,
              delay: 0.2 + i * 0.18,
            }}
            className={cn(
              "relative flex flex-col gap-3",
              gated ? "items-center px-3 text-center" : "md:pr-6",
            )}
          >
            <span
              className={cn(
                "relative flex items-center gap-3",
                gated && "w-full justify-center",
              )}
            >
              {passed && <GoBubble />}
              <span
                aria-hidden
                style={{
                  ...color,
                  backgroundColor: passed ? GREEN : undefined,
                }}
                className={cn(
                  "relative grid size-7 shrink-0 place-items-center text-xs font-semibold text-paper transition-colors duration-500",
                  on ? "bg-accent" : "bg-line",
                  s.gate ? "rotate-45 rounded-sm" : "rounded-full",
                )}
              >
                <motion.span
                  initial={false}
                  animate={
                    passed
                      ? { opacity: 0, scale: 0.5 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "col-start-1 row-start-1",
                    s.gate && "-rotate-45",
                  )}
                >
                  {i + 1}
                </motion.span>
                {s.gate && (
                  <motion.svg
                    viewBox="0 0 16 16"
                    initial={false}
                    animate={
                      passed
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.5 }
                    }
                    transition={{
                      duration: 0.3,
                      ease: EASE_OUT,
                      delay: passed ? 0.15 : 0,
                    }}
                    className="col-start-1 row-start-1 size-4 -rotate-45"
                  >
                    <path
                      d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </span>
              {i < STRATEGY.length - 1 && (
                <span
                  aria-hidden
                  style={{ transitionDelay: `${wait(i + 1)}s` }}
                  className={cn(
                    "hidden h-px transition-colors duration-500 md:block",
                    // Centred: from this icon to the next one, a column over.
                    gated
                      ? "absolute left-[calc(50%+1.25rem)] top-1/2 w-[calc(100%-2.5rem+1.5rem)]"
                      : "flex-1",
                    lit(i + 1) ? "bg-accent/30" : "bg-line",
                  )}
                />
              )}
            </span>
            <p
              style={color}
              className={cn(
                "font-display text-lg font-medium transition-colors duration-500 md:text-xl",
                on ? "text-ink" : "text-ink-muted/50",
              )}
            >
              {s.name}
            </p>
            {/* 09 shows the names alone; 06 already explained each step. */}
            {!gated && (
              <p className="text-base leading-relaxed text-ink-muted md:text-lg">
                {s.text}
              </p>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}

// The CEO's yes, tilted over the gate once it turns green.
function GoBubble() {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, scale: 0.4, rotate: 0, y: 8 }}
      animate={{ opacity: 1, scale: 1, rotate: -8, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.35 }}
      className="absolute bottom-[calc(100%+12px)] left-1/2 -ml-6 origin-bottom-left whitespace-nowrap rounded-xl px-3 py-1.5 font-display text-base font-semibold text-paper shadow-md"
      style={{ backgroundColor: GREEN }}
    >
      OK, go!
      <span
        className="absolute -bottom-1 left-4 size-2.5 rotate-45"
        style={{ backgroundColor: GREEN }}
      />
    </motion.span>
  );
}
