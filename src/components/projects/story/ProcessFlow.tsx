"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, useStill } from "./motion";

export type ProcessStep = {
  name: string;
  text: string;
  // The CEO's go-ahead: a diamond that turns green with a check once passed.
  gate?: boolean;
};

const GREEN = "#16a34a";

// A project's Strategic Process. Without `lit`, every step is lit and
// explained, as planned (Define). With it, the page tracks progress: the
// first `lit` steps are lit, the rest wait in gray, and `current` gets a
// ring. Steps from `from` on light up in turn, as if just reached, and a gate
// passed on this beat says “OK, go!”. That version is centred under its
// centred heading, names only.
export function ProcessFlow({
  steps,
  animate,
  lit,
  from = lit,
  current,
}: {
  steps: readonly ProcessStep[];
  animate: boolean;
  lit?: number;
  from?: number;
  current?: number;
}) {
  const still = useStill() || !animate;
  const gated = lit !== undefined;
  const on = (i: number) => !gated || i < lit;
  // How long after the beat lands step i lights up.
  const wait = (i: number) =>
    gated && from !== undefined && i >= from && i < lit ? 0.15 + (i - from) * 0.3 : 0;
  return (
    <ol
      className="grid gap-3 md:grid-cols-(--cols) md:gap-0"
      style={{ "--cols": `repeat(${steps.length}, minmax(0, 1fr))` } as React.CSSProperties}
    >
      {steps.map((s, i) => {
        const lightOn = on(i);
        const passed = gated && lightOn && s.gate;
        const cheer = passed && from !== undefined && i >= from;
        const ring = gated && i === current;
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
            aria-current={ring ? "step" : undefined}
            className={cn(
              "relative flex flex-col gap-3",
              gated ? "items-center px-3 text-center" : "md:pr-6",
            )}
          >
            <span
              className={cn("relative flex items-center gap-3", gated && "w-full justify-center")}
            >
              {cheer && <GoBubble />}
              <span
                aria-hidden
                style={{
                  ...color,
                  backgroundColor: passed ? GREEN : undefined,
                }}
                className={cn(
                  "relative grid size-7 shrink-0 place-items-center text-xs font-semibold text-paper transition-colors duration-500",
                  lightOn ? "bg-accent" : "bg-line",
                  s.gate ? "rotate-45 rounded-sm" : "rounded-full",
                  ring && "ring-2 ring-accent ring-offset-4 ring-offset-paper",
                )}
              >
                <motion.span
                  initial={false}
                  animate={passed ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={cn("col-start-1 row-start-1", s.gate && "-rotate-45")}
                >
                  {i + 1}
                </motion.span>
                {s.gate && (
                  <motion.svg
                    viewBox="0 0 16 16"
                    initial={false}
                    animate={passed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
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
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  style={{ transitionDelay: `${wait(i + 1)}s` }}
                  className={cn(
                    "hidden h-px transition-colors duration-500 md:block",
                    // Centred: from this icon to the next one, a column over.
                    gated
                      ? "absolute left-[calc(50%+1.25rem)] top-1/2 w-[calc(100%-2.5rem+1.5rem)]"
                      : "flex-1",
                    on(i + 1) ? "bg-accent/30" : "bg-line",
                  )}
                />
              )}
            </span>
            <p
              style={color}
              className={cn(
                "font-display text-lg font-medium transition-colors duration-500 md:text-xl",
                lightOn || ring ? "text-ink" : "text-ink-muted/50",
              )}
            >
              {s.name}
            </p>
            {/* The tracker shows the names alone; Define already explained each step. */}
            {!gated && (
              <p className="text-base leading-relaxed text-ink-muted md:text-lg">{s.text}</p>
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
