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

// The turn in a headline (“But…”, “without…”): black, bold, italic.
export function Em({ children }: { children: React.ReactNode }) {
  return <em className="font-bold italic text-ink">{children}</em>;
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
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Grey body, for a "before" state. */
  muted?: boolean;
}) {
  const body = muted ? "border-[#6b6e73]" : "border-ink";
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-[248px] shrink-0 rounded-[2.6rem] border-[9px] bg-paper shadow-[0_30px_60px_-30px_rgba(21,21,21,0.45)] transition-colors duration-500 md:w-[272px]",
        body,
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full transition-colors duration-500",
          muted ? "bg-[#6b6e73]" : "bg-ink",
        )}
      />
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
// Pass `play` to start it from a scroll step instead; until then it's hidden.
export function CountUp({
  to,
  from,
  play,
  className,
}: {
  to: Num;
  from?: number;
  play?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const inView = play ?? seen;
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
    <span
      ref={ref}
      className={cn(
        "tabular-nums transition-opacity duration-200",
        play === false && !still && "opacity-0",
        className,
      )}
    >
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
  countFrom,
  play,
  size = "md",
  className,
}: {
  from?: Num;
  to: Num;
  extra?: string;
  // Where the count-up starts (defaults to `from`, else 0).
  countFrom?: number;
  // See CountUp.
  play?: boolean;
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
        {/* The old value sits small and grey on the new one's baseline, so the
            improvement reads at a glance. */}
        {from && (
          <span className="mr-[0.35em] text-[0.5em] text-ink-muted/80">
            {fmt(from, from.value)}
            <span aria-hidden className="mx-[0.3em] text-ink-muted/50">
              →
            </span>
            <span className="sr-only"> to </span>
          </span>
        )}
        <CountUp to={to} from={countFrom ?? from?.value} play={play} className="text-accent" />
        {extra && (
          <span
            className={cn(
              "ml-2 text-[0.45em] text-ink-muted transition-opacity duration-200",
              play === false && "motion-safe:opacity-0",
            )}
          >
            {extra}
          </span>
        )}
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
