"use client";

import { animate, motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { createContext, useContext, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ASSETS, type AssetId, type ResolvedAssets } from "./assets";
import { EASE_OUT, useStill } from "./motion";

// Shared pieces of the AI Search case study (spec §3).

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

// One numbered chapter. id + data-chapter put it in the sidebar's
// "On this page" list, which is this page's Chapter Nav.
export function Chapter({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-chapter={label}
      className={cn("scroll-mt-16 overflow-x-clip lg:scroll-mt-0", className)}
    >
      {children}
    </section>
  );
}

export const wrap = "mx-auto w-full max-w-[1120px] px-6 md:px-10";

// `01 CONTEXT` + one serif headline. Reading only these tells the story.
export function SectionHeader({
  label,
  headline,
  className,
  as: Tag = "h2",
}: {
  label?: string;
  headline: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{label}</p>
      )}
      <Tag className="font-display font-medium tracking-tight text-[1.75rem] leading-[1.15] text-ink text-balance md:text-[2.5rem]">
        {headline}
      </Tag>
    </header>
  );
}

export function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn("max-w-[38rem] text-base leading-relaxed text-ink-muted md:text-lg", className)}
    >
      {children}
    </p>
  );
}

export function B({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

const AssetContext = createContext<ResolvedAssets>({});

export function AssetProvider({
  assets,
  children,
}: {
  assets: ResolvedAssets;
  children: React.ReactNode;
}) {
  return <AssetContext.Provider value={assets}>{children}</AssetContext.Provider>;
}

export function useAsset(id: AssetId) {
  return useContext(AssetContext)[id] ?? {};
}

// Stand-in until the file exists: the manifest id plus what it should show.
export function AssetPlaceholder({ id, className }: { id: AssetId; className?: string }) {
  return (
    <div
      role="img"
      aria-label={ASSETS[id].alt}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/15 bg-paper-2 p-4 text-center",
        className,
      )}
    >
      <span className="font-mono text-[11px] font-medium text-ink">{id}</span>
      <span className="max-w-[28ch] text-[11px] leading-snug text-ink-muted">{ASSETS[id].alt}</span>
    </div>
  );
}

// Small corner tag on a coded stand-in scene, naming the recording that
// will replace it.
export function StandInTag({ id, className }: { id: AssetId; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] text-paper",
        className,
      )}
    >
      placeholder · {id}
    </span>
  );
}

// `▶ Video` (muted, looping, lazy, paused off screen) or an image, or the
// placeholder when the file isn't in yet. Fills its parent.
export function AssetMedia({
  id,
  priority = false,
  fit = "cover",
  className,
  fallback,
}: {
  id: AssetId;
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  // Rendered instead of the grey placeholder when the file is missing.
  fallback?: React.ReactNode;
}) {
  const asset = useAsset(id);
  const still = useStill();
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: "200px 0px" });
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (near) video.play().catch(() => {});
    else video.pause();
  }, [near]);

  if (!asset.src) return <>{fallback ?? <AssetPlaceholder id={id} className={className} />}</>;

  if (!asset.isVideo || (still && asset.poster)) {
    const src = asset.isVideo ? asset.poster! : asset.src;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, files are pre-sized
      <img
        src={src}
        alt={ASSETS[id].alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("h-full w-full", fitClass, className)}
      />
    );
  }

  // Sources only mount once the video is near the viewport (or right away
  // for the hero), so off-screen clips cost nothing.
  const load = priority || near;
  return (
    <video
      ref={ref}
      aria-label={ASSETS[id].alt}
      poster={asset.poster}
      muted
      loop
      playsInline
      autoPlay={!still}
      preload={priority ? "auto" : "none"}
      className={cn("h-full w-full", fitClass, className)}
    >
      {load && asset.webm && <source src={asset.webm} type="video/webm" />}
      {load && <source src={asset.src} type="video/mp4" />}
    </video>
  );
}

/* ------------------------------------------------------------------ */
/* Phone                                                               */
/* ------------------------------------------------------------------ */

// Fixed size on purpose: 04 (Before) and 07B (After) must line up.
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-[248px] shrink-0 rounded-[2.6rem] border-[9px] border-ink bg-paper shadow-[0_30px_60px_-30px_rgba(21,21,21,0.45)] md:w-[272px]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.95rem]">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thought bubble                                                      */
/* ------------------------------------------------------------------ */

// Staged, not quoted: emoji + italic in a soft bubble, never quote marks,
// so it can't be mistaken for an interview line (spec §2.3).
export function ThoughtBubble({
  emoji,
  text,
  className,
  tail = "left",
}: {
  emoji: string;
  text: string;
  className?: string;
  tail?: "left" | "bottom" | "none";
}) {
  return (
    <div
      className={cn(
        "relative w-fit max-w-[17rem] rounded-2xl border border-ink/10 bg-paper/80 px-4 py-3 shadow-sm backdrop-blur",
        className,
      )}
    >
      <p className="flex items-start gap-2 text-[15px] italic leading-snug text-ink">
        <span aria-hidden className="not-italic">
          {emoji}
        </span>
        <span>
          <span className="sr-only">Illustrative thought: </span>
          {text}
        </span>
      </p>
      {tail === "left" && (
        <span
          aria-hidden
          className="absolute -left-[7px] top-5 size-3 rotate-45 border-b border-l border-ink/10 bg-paper"
        />
      )}
      {tail === "bottom" && (
        <span
          aria-hidden
          className="absolute -bottom-[7px] left-8 size-3 rotate-45 border-b border-r border-ink/10 bg-paper"
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up                                                            */
/* ------------------------------------------------------------------ */

export type Num = { value: number; decimals?: number; prefix?: string; suffix?: string };

const fmt = (n: Num, v: number) =>
  `${n.prefix ?? ""}${v.toFixed(n.decimals ?? 0)}${n.suffix ?? ""}`.replace("-", "−");

// `Count-up`: once, on first view, over ~1s. The server-rendered text is
// already the final value, so no-JS and reduced motion see it as is.
export function CountUp({ to, from, className }: { to: Num; from?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const still = useStill();
  const start = from ?? 0;
  const { value, decimals, prefix, suffix } = to;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const n = { value, decimals, prefix, suffix };
    if (still) {
      el.textContent = fmt(n, value);
      return;
    }
    if (!inView) {
      el.textContent = fmt(n, start);
      return;
    }
    const controls = animate(start, value, {
      duration: 1.1,
      ease: EASE_OUT,
      onUpdate: (v) => {
        el.textContent = fmt(n, v);
      },
    });
    return () => controls.stop();
  }, [inView, still, start, value, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {fmt(to, to.value)}
    </span>
  );
}

// `MetricCounter`: a single value or from → to, with its label.
export function MetricCounter({
  from,
  to,
  extra,
  label,
  size = "md",
  className,
}: {
  from?: Num;
  to: Num;
  extra?: string;
  label: string;
  size?: "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p
        className={cn(
          "font-display font-medium tracking-tight flex flex-wrap items-baseline leading-none",
          size === "md" && "text-[2rem] md:text-[2.4rem]",
          size === "lg" && "text-[2.75rem] md:text-[3.5rem]",
          size === "xl" && "text-[3.25rem] md:text-[5.5rem]",
        )}
      >
        {from && (
          <>
            <span className="text-ink-muted/80">{fmt(from, from.value)}</span>
            <span aria-hidden className="mx-[0.2em] text-ink-muted/50">
              →
            </span>
            <span className="sr-only"> to </span>
          </>
        )}
        <CountUp to={to} from={from?.value} className="text-accent" />
        {extra && <span className="ml-2 text-[0.45em] text-ink-muted">{extra}</span>}
      </p>
      <p className="text-sm font-medium text-ink-muted">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Process strip                                                       */
/* ------------------------------------------------------------------ */

const PROCESS = ["Discover", "Define", "PoC", "CEO Decision", "Integration", "Deliver"] as const;
export type ProcessStep = (typeof PROCESS)[number];

// Where the project is: everything before `at` is done, `at` is current
// (or done too, with `complete`). CEO Decision is a gate, drawn as a diamond.
export function ProcessStrip({
  at,
  complete = false,
  className,
}: {
  at: ProcessStep;
  complete?: boolean;
  className?: string;
}) {
  const atIndex = PROCESS.indexOf(at);
  return (
    <ol
      aria-label="Project progress"
      className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2 text-xs", className)}
    >
      {PROCESS.map((name, i) => {
        const status =
          i < atIndex || (i === atIndex && complete)
            ? "done"
            : i === atIndex
              ? "current"
              : "upcoming";
        const gate = name === "CEO Decision";
        return (
          <li key={name} className="flex items-center gap-1.5">
            {i > 0 && (
              <span
                aria-hidden
                className={cn("h-px w-3 md:w-5", status === "upcoming" ? "bg-line" : "bg-ink/40")}
              />
            )}
            <span
              aria-current={status === "current" ? "step" : undefined}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-2 py-1 font-medium transition-colors duration-500",
                gate ? "rounded-sm" : "rounded-full",
                status === "done" && "bg-paper-2 text-ink",
                status === "current" && "bg-accent text-paper",
                status === "upcoming" && "border border-line text-ink-muted",
              )}
            >
              {gate && (
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rotate-45 border",
                    status === "current" ? "border-paper" : "border-current",
                    status === "done" && "bg-current",
                  )}
                />
              )}
              {status === "done" && !gate && <Check aria-hidden className="size-3" />}
              {name}
              <span className="sr-only"> ({status})</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Search screen stand-in                                              */
/* ------------------------------------------------------------------ */

// A coded phone screen for the search scenes, used until the screen
// recordings exist. "fail" types the query and lands on No Result;
// "recover" holds the empty page for half a second, then AI results
// with the Beta label slide in.
export function SearchScreen({
  query,
  typed,
  phase,
  emoji,
}: {
  query: string;
  typed: string;
  phase: "typing" | "empty" | "results";
  emoji: string;
}) {
  const still = useStill();
  return (
    <div className="flex h-full flex-col bg-paper pt-9 text-left">
      <div className="mx-3 flex items-center gap-2 rounded-full bg-paper-2 px-3 py-2">
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 shrink-0 text-ink-muted">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="truncate text-[13px] text-ink">
          {typed}
          {phase === "typing" && (
            <span
              aria-hidden
              className="ml-px inline-block h-3.5 w-px animate-pulse bg-ink align-middle"
            />
          )}
        </span>
        <span className="sr-only">Search: {query}</span>
      </div>

      <div className="relative flex-1">
        {phase !== "results" ? (
          <motion.div
            key="empty"
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: phase === "empty" ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <span aria-hidden className="text-3xl grayscale">
              🔍
            </span>
            <p className="text-[13px] font-semibold text-ink-muted">No products found</p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={still ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="absolute inset-0 flex flex-col gap-2.5 px-3 pt-3"
          >
            <div className="flex items-center gap-1.5 rounded-lg bg-accent/[0.07] px-2.5 py-1.5">
              <span className="rounded-full bg-accent px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-paper">
                Beta
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="flex flex-col gap-1.5">
                  <span
                    aria-hidden
                    className="grid aspect-square place-items-center rounded-lg bg-paper-2 text-4xl"
                  >
                    {emoji}
                  </span>
                  <span aria-hidden className="h-1.5 w-4/5 rounded-full bg-ink/15" />
                  <span aria-hidden className="h-1.5 w-1/2 rounded-full bg-ink/10" />
                </li>
              ))}
            </ul>
            <span className="sr-only">Product results for {query}, marked Beta.</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
