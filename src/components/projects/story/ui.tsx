"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChipGroup } from "@/components/project/ChipGroup";
import type { ProjectChips } from "@/content/projects";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useStill } from "./motion";

// The case-study kit: layout, type and the recurring pieces every story page
// (AI Search, AI Curation) shares, so they read as one series.

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

// Number and label centred in their column.
export const CENTERED = "items-center text-center [&>p:first-child]:justify-center";

/* ------------------------------------------------------------------ */
/* Type                                                                */
/* ------------------------------------------------------------------ */

// `01 CONTEXT`
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{children}</p>;
}

// `01 CONTEXT` + one headline. Reading only these tells the story.
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
      {label && <SectionLabel>{label}</SectionLabel>}
      <Tag className="font-display font-medium tracking-tight text-[1.75rem] leading-[1.15] text-ink text-balance md:text-[2.5rem]">
        {headline}
      </Tag>
    </header>
  );
}

// `body` may be a list of paragraphs.
export type CopyBeat = { headline: React.ReactNode; body: React.ReactNode | React.ReactNode[] };

// A chapter's “fact → But…” copy: two (or more) headline + body beats in one
// grid cell, so nothing reflows when the scene swaps them. Phones and
// reduced motion read them one after the other.
export function BeatCopy({
  label,
  beats,
  active,
  live,
}: {
  label: string;
  beats: CopyBeat[];
  active: number;
  live: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>{label}</SectionLabel>
      <div className={live ? "grid" : "flex flex-col gap-10"}>
        {beats.map((beat, i) => {
          const shown = !live || i === active;
          return (
            <motion.div
              key={i}
              aria-hidden={!shown || undefined}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: i < active ? -16 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "flex flex-col gap-6",
                live && "[grid-area:1/1]",
                !shown && "pointer-events-none",
              )}
            >
              <SectionHeader headline={beat.headline} as={i === 0 ? "h2" : "h3"} />
              {Array.isArray(beat.body) ? (
                <div className="flex flex-col gap-4">
                  {beat.body.map((p, j) => (
                    <Body key={j}>{p}</Body>
                  ))}
                </div>
              ) : (
                <Body>{beat.body}</Body>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// A beat inside a chapter (06's “Objectives and Goals”).
export function Subhead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-display font-medium tracking-tight text-2xl text-ink md:text-[2rem]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

// A numbered part of a chapter (10's “1. A Proxy Server…”).
export function SubHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function SubSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display text-xl font-medium tracking-tight text-ink md:text-2xl">
      {children}
    </h4>
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

// The line that hands a chapter to the next (“So I asked a different
// question. ↓”), centred under it.
export function Kicker({
  children,
  tight = false,
}: {
  children: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <div className={cn(wrap, "pt-12", tight ? "pb-12 md:pb-16" : "pb-28 md:pb-36")}>
      <Reveal>
        <p className="font-display font-medium tracking-tight text-center text-[1.4rem] leading-snug text-ink md:text-[1.75rem]">
          {children}
        </p>
      </Reveal>
    </div>
  );
}

// Plain text link with an arrow: "Watch the talk →".
export const textLink =
  "text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-3 hover:decoration-accent-3";

// Sits under rebuilt company screens: their numbers are made up.
export function DataNote({
  className,
  children = "Illustrative data. Internal figures have been changed.",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <p className={cn("text-xs text-ink-muted", className)}>{children}</p>;
}

// Term | value rows on hairlines (the A/B setup card, 06's goals).
export function TermList({
  rows,
  className,
}: {
  rows: readonly (readonly [string, React.ReactNode])[];
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-col", className)}>
      {rows.map(([term, value]) => (
        <div
          key={term}
          className="grid gap-1 border-b border-line py-4 first:pt-0 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8"
        >
          <dt className="text-base text-ink-muted md:text-lg">{term}</dt>
          <dd className="text-base leading-relaxed text-ink md:text-lg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// The How-might-we question. As the reader scrolls, the rest of the
// sentence dims so only the constraint (`turn`) stays lit. `turn` starts on
// its own line unless `inline`.
export function Question({
  lead,
  turn,
  progress,
  live,
  inline = false,
}: {
  lead: React.ReactNode;
  turn: React.ReactNode;
  progress?: MotionValue<number>;
  live: boolean;
  inline?: boolean;
}) {
  const idle = useMotionValue(0);
  const dim = useTransform(progress ?? idle, [0.06, 0.2], [1, 0.25]);
  const rest = live ? { opacity: dim } : undefined;
  return (
    <p className="font-display font-medium tracking-tight text-[1.75rem] leading-[1.2] text-ink md:text-[2.6rem]">
      <motion.span style={rest}>{lead}</motion.span>
      {inline ? " " : <br />}
      <Em>{turn}</Em>
      <motion.span style={rest}>?</motion.span>
    </p>
  );
}

// Detail the reader can open: a text link with a chevron, the content
// unfolding under it.
export function Fold({
  label,
  children,
  center = false,
}: {
  label: string;
  children: React.ReactNode;
  center?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={cn("flex flex-col", center ? "items-center" : "items-start")}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          textLink,
          "inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      >
        {label}
        <ChevronDown
          aria-hidden
          strokeWidth={1.75}
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <div className="pt-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

// Back link, chips, title, tagline, one paragraph and the meta grid on the
// left; the page's device on the right (above it on phones).
export function StoryHero({
  chips,
  title,
  tagline,
  body,
  meta,
  link,
  device,
}: {
  chips: ProjectChips;
  title: React.ReactNode;
  tagline: string;
  body: React.ReactNode;
  // One entry per line, like the other project heroes.
  meta: readonly (readonly [string, readonly string[]])[];
  link?: { href: string; label: string };
  device: React.ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <div className={cn(wrap, "pb-16 pt-10 md:pb-24 md:pt-16")}>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent-3"
        >
          <span aria-hidden>←</span> Selected Works
        </Link>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div className="order-2 flex flex-col items-start md:order-1">
            <ChipGroup chips={chips} />
            <h1 className="font-display font-medium tracking-tight mt-6 text-[2.25rem] leading-[1.1] text-ink text-balance md:text-[3.25rem]">
              {title}
            </h1>
            <p className="mt-4 text-lg italic text-ink-muted md:text-xl">{tagline}</p>
            <Body className="mt-6">{body}</Body>

            <dl className="mt-10 grid w-full grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:grid-cols-4">
              {meta.map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                    {term}
                  </dt>
                  <dd className="font-display mt-1.5 text-sm font-medium text-ink">
                    {value.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            {link && (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("mt-10", textLink)}
              >
                {link.label}
              </a>
            )}
          </div>

          <div className="order-1 flex justify-center md:order-2">{device}</div>
        </div>
      </div>
    </div>
  );
}

// The small label over the hero device that flips between two states
// (Before → After, Theme → Campaign). `on` paints it in the accent.
export function FlipLabel({ text, on }: { text: string; on: boolean }) {
  return (
    <div className="relative h-6 w-full">
      <AnimatePresence initial={false}>
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "font-display absolute inset-0 text-center text-base font-medium uppercase tracking-[0.2em]",
            on ? "text-accent" : "text-ink-muted",
          )}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Full-screen hook                                                    */
/* ------------------------------------------------------------------ */

// Two lines, one screen. It holds on the first; one scroll brings in the
// second, and a spare step keeps a quick scroll from skipping it.
const HOOK_STEPS = 3;

export function HookLines({
  first,
  second,
  label,
}: {
  first: React.ReactNode;
  second: React.ReactNode;
  label: string;
}) {
  return (
    <StickyScene steps={HOOK_STEPS} label={label}>
      {({ step, live }) => (
        <div className={cn(wrap, "grid w-full place-items-center", !live && "min-h-[60svh] py-14")}>
          <p className="font-display font-medium tracking-tight text-center text-[2rem] leading-[1.15] text-ink text-balance md:text-[3.25rem]">
            <span className="block">{first}</span>
            {/* Half a line apart, so the two sentences read as two beats. */}
            <motion.span
              className="mt-[0.5em] block"
              initial={false}
              animate={step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              {second}
            </motion.span>
          </p>
        </div>
      )}
    </StickyScene>
  );
}

/* ------------------------------------------------------------------ */
/* Phone                                                               */
/* ------------------------------------------------------------------ */

// Fixed size on purpose: a Before and its After must line up.
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

// Text on the left, the phone and what goes with it on the right; the title
// spans both. One layout for a Before and its After (AI Search 04 and 07B, AI Curation
// 04 and 12) so their phones line up. The text
// and the side column start level with the top of the phone.
export function PhoneSplit({
  header,
  copy,
  phone,
  side,
}: {
  header: React.ReactNode;
  copy: React.ReactNode;
  phone: React.ReactNode;
  side: React.ReactNode;
}) {
  return (
    <div className={cn(wrap, "flex flex-col gap-8 lg:gap-10")}>
      {header}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
        <div className="flex flex-col gap-8">{copy}</div>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-center lg:gap-10">
          {phone}
          <div className="flex w-[18.5rem] flex-col items-start gap-6 md:self-stretch">{side}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thought bubble                                                      */
/* ------------------------------------------------------------------ */

// The numbered list beside a pinned scene's parts: the current one lit, and
// clicking one jumps the scroll to it.
export function StepIndex({
  label,
  items,
  current,
  onPick,
}: {
  label: string;
  items: string[];
  current: number;
  onPick: (i: number) => void;
}) {
  return (
    <ol aria-label={label} className="flex flex-col gap-1 self-start pt-1">
      {items.map((name, i) => (
        <li key={name}>
          <button
            type="button"
            aria-current={i === current ? "step" : undefined}
            onClick={() => onPick(i)}
            className={cn(
              "flex w-full cursor-pointer items-baseline gap-3 border-l-2 py-2 pl-4 text-left transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              i === current
                ? "border-accent text-ink"
                : "border-line text-ink-muted/60 hover:text-ink",
            )}
          >
            <span className="text-xs font-semibold">{i + 1}</span>
            <span className="font-display text-base font-medium">{name}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

// Staged, not quoted: emoji + italic in a soft bubble, never quote marks,
// so it can't be mistaken for an interview line.
export function ThoughtBubble({
  emoji,
  text,
  className,
  tail = "left",
}: {
  emoji: string;
  text: string;
  className?: string;
  tail?: "left" | "bottom" | "top" | "none";
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
      {tail === "top" && (
        <span
          aria-hidden
          className="absolute -top-[7px] left-8 size-3 rotate-45 border-l border-t border-ink/10 bg-paper"
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
  label: React.ReactNode;
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
/* Gradio window                                                       */
/* ------------------------------------------------------------------ */

// A rebuilt Gradio demo page: its title on the left, the gradio mark on the
// right, the app below.
export function GradioWindow({
  title,
  label,
  className,
  children,
}: {
  title: React.ReactNode;
  // When set, the whole window is one described picture.
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-line bg-paper-2/60 p-3 md:p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink md:text-base">{title}</span>
        <span className="flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized PNG */}
          <img src="/images/ai-search/logo_gradio.png" alt="" className="h-[18px] w-auto" />
          <span className="text-[17px] font-semibold leading-none tracking-tight text-ink">
            gradio
          </span>
        </span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reflection                                                          */
/* ------------------------------------------------------------------ */

export type Lesson = { title: string; body: React.ReactNode };

// Three takeaways, one more per scroll, then a hold.
export function Lessons({
  id,
  label,
  chapter,
  lessons,
}: {
  id: string;
  // `12 REFLECTION`
  label: string;
  // `12 Reflection`, for the sidebar.
  chapter: string;
  lessons: Lesson[];
}) {
  const still = useStill();
  return (
    <Chapter id={id} label={chapter} className="border-t border-line pt-24 md:pt-32">
      <StickyScene steps={lessons.length + 1} vh={50} label="Three takeaways">
        {({ step, live }) => (
          <div className={cn(wrap, "flex flex-col gap-12")}>
            <SectionHeader label={label} headline="What This Project Taught Me" />
            <ol className="grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
              {lessons.map((l, i) => {
                const on = !live || step >= i;
                return (
                  <motion.li
                    key={l.title}
                    initial={false}
                    animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
                    className="flex flex-col gap-3"
                  >
                    <span className="font-display text-sm font-medium text-accent">0{i + 1}</span>
                    <h3 className="font-display text-xl font-medium tracking-tight text-ink md:text-2xl">
                      {l.title}
                    </h3>
                    <Body>{l.body}</Body>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        )}
      </StickyScene>
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}
