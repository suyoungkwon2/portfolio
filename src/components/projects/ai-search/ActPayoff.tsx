"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TALK_URL } from "./ActSetup";
import { EASE_OUT, Reveal, StickyScene, useStill } from "./motion";
import {
  AssetMedia,
  B,
  Body,
  Chapter,
  CountUp,
  MetricCounter,
  SectionHeader,
  ThoughtBubble,
  wrap,
} from "./ui";

// Act 5, Payoff: 10 Improvement (A: proxy server, B: monitoring) ·
// 11 Integration & Impact (spec §5.10–5.11).

const linkClass =
  "text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-3 hover:decoration-accent-3";

const smallMetric =
  "[&>p:first-child]:text-[1.5rem] md:[&>p:first-child]:text-[1.75rem]";

/* ------------------------------------------------------------------ */
/* 10 Improvement                                                      */
/* ------------------------------------------------------------------ */

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]">
      {children}
    </h3>
  );
}

// A: the proxy server. One scene, Before turning into After on scroll:
// queries pour in from the left toward Vertex AI, and every one that lands
// costs a "$". Then the proxy server appears in between, sparkles as it
// handles most queries itself, and only a few still reach Vertex AI. The
// pass ratio is staged, not a measured number.
const QUERIES = 40;
const PERIOD = 3.2; // seconds for one query to cross
const START_X = 3;
const PROXY_X = 50;
const AI_X = 84; // where a query lands, at the Vertex AI box's left edge
const ARRIVE = 0.85; // share of a cycle spent travelling
const AT_PROXY = (ARRIVE * (PROXY_X - START_X)) / (AI_X - START_X);

// Deterministic jitter, so server and client render the same scene.
const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
// Rounded, so the server's styles match the client's on hydration.
const r2 = (v: number) => Math.round(v * 100) / 100;
const pct = (v: number) => `${r2(v)}%`;
const DOTS = Array.from({ length: QUERIES }, (_, j) => ({
  phase: j / QUERIES + rand(j, 1) * 0.02,
  y0: r2(10 + rand(j, 2) * 80),
  passes: rand(j, 3) < 0.1,
  // 💵 leaves the Vertex AI box from its top, bottom or right side.
  side: (["top", "bottom", "right"] as const)[j % 3],
  jitter: r2((rand(j, 4) - 0.5) * 2),
  sparkX: r2(PROXY_X + (rand(j, 6) - 0.5) * 8),
  sparkY: r2(50 + (rand(j, 7) - 0.5) * 50),
}));

const cycle = (t: number, phase: number) => (t / PERIOD + phase) % 1;
const smooth = (v: number) => v * v * (3 - 2 * v);

type Dot = (typeof DOTS)[number];

function Query({
  dot,
  time,
  mix,
}: {
  dot: Dot;
  time: MotionValue<number>;
  mix: MotionValue<number>;
}) {
  const left = useTransform([time, mix], ([t, m]: number[]) => {
    const u = Math.min(cycle(t, dot.phase), ARRIVE);
    const x = START_X + (u / ARRIVE) * (AI_X - START_X);
    // In After, a query the proxy handles stops there.
    return pct(!dot.passes && x > PROXY_X ? x + (PROXY_X - x) * m : x);
  });
  const top = useTransform(time, (t) => {
    const k = smooth(Math.min(1, cycle(t, dot.phase) / AT_PROXY));
    return pct(dot.y0 + (50 - dot.y0) * k);
  });
  const opacity = useTransform([time, mix], ([t, m]: number[]) => {
    const u = cycle(t, dot.phase);
    if (u > ARRIVE) return 0;
    const fadeIn = Math.min(1, u / 0.04);
    return r2(u > AT_PROXY && !dot.passes ? fadeIn * (1 - m) : fadeIn);
  });
  return (
    <motion.span
      aria-hidden
      style={{ left, top, opacity }}
      className="absolute -ml-1 -mt-1 size-2 rounded-full bg-ink/70"
    />
  );
}

// 💵 pops out of Vertex AI each time a query lands, and lingers a moment.
const COIN_LIFE = 1.1; // seconds
const AI_W = 96; // Vertex AI box, px
const AI_H = 128; // the proxy box matches it

function Coin({
  dot,
  time,
  mix,
}: {
  dot: Dot;
  time: MotionValue<number>;
  mix: MotionValue<number>;
}) {
  // Seconds since this query landed, as a share of the coin's life.
  const life = useTransform(time, (t) => {
    const since =
      (((cycle(t, dot.phase) - ARRIVE + 1) % 1) * PERIOD) / COIN_LIFE;
    return since < 1 ? since : -1;
  });
  const opacity = useTransform([life, mix], ([v, m]: number[]) => {
    if (v < 0) return 0;
    const fade = v < 0.15 ? v / 0.15 : v > 0.7 ? (1 - v) / 0.3 : 1;
    return r2(fade * (dot.passes ? 1 : 1 - m));
  });
  const drift = useTransform(life, (v) => r2(Math.max(0, v) * 34));
  const x = useTransform(drift, (d) => (dot.side === "right" ? d : 0));
  const y = useTransform(drift, (d) =>
    dot.side === "top" ? -d : dot.side === "bottom" ? d : 0,
  );
  const scale = useTransform(life, (v) =>
    r2(0.6 + 0.4 * Math.min(1, Math.max(0, v) * 5)),
  );
  const j = dot.jitter;
  const pos =
    dot.side === "right"
      ? {
          left: `calc(${AI_X}% + ${AI_W + 6}px)`,
          top: `calc(50% + ${r2(j * 28)}px)`,
        }
      : {
          left: `calc(${AI_X}% + ${r2(AI_W / 2 + j * 46)}px)`,
          top: `calc(50% ${dot.side === "top" ? "-" : "+"} ${AI_H / 2 + 12}px)`,
        };
  return (
    <motion.span
      aria-hidden
      style={{ ...pos, opacity, x, y, scale }}
      className="absolute z-20 -ml-2 -mt-2 text-base leading-none"
    >
      💵
    </motion.span>
  );
}

// A small flash on the proxy each time it handles a query itself.
function Spark({
  dot,
  time,
  mix,
}: {
  dot: Dot;
  time: MotionValue<number>;
  mix: MotionValue<number>;
}) {
  const v = useTransform(time, (t) => (cycle(t, dot.phase) - AT_PROXY) / 0.08);
  const opacity = useTransform([v, mix], ([p, m]: number[]) =>
    p < 0 || p > 1 ? 0 : r2(Math.sin(Math.PI * p) * m),
  );
  const scale = useTransform(v, (p) =>
    r2(0.4 + Math.max(0, Math.min(1, p)) * 1.2),
  );
  return (
    <motion.span
      aria-hidden
      style={{ left: `${dot.sparkX}%`, top: `${dot.sparkY}%`, opacity, scale }}
      className="absolute z-20 -ml-1 -mt-1 size-2 rounded-full bg-[#5be1ff] shadow-[0_0_12px_4px_#78c4fe]"
    />
  );
}

const GUARDS = [
  {
    name: "Cache",
    text: "Keeps results per keyword for 12 hours, so a repeat search doesn’t call the AI again.",
  },
  {
    name: "Validate",
    text: "Filters out abnormal and malicious queries before they reach the AI.",
  },
  {
    name: "Block",
    text: "Enforces the blocklist: unlisted brands, profanity, and medical terms.",
  },
  {
    name: "Fall back",
    text: "A circuit breaker shows the original screen if the AI is too slow.",
  },
];

const VERTEX_BLUE = "#4285F4"; // Vertex AI's blue, as in 07's triangle
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// Card centres in the 4-column row (gap-3 = 12px), for the connector lines.
const cardX = (i: number) =>
  `calc((100% - 36px) * ${(2 * i + 1) / 8} + ${12 * i}px)`;

// Proxy → four cards: a stem, then a rounded elbow out to each card. Each
// elbow is a bordered box, revealed by clip-path: across first, then down.
const LINE = "#c9c9c9";

function Elbow({
  i,
  bar,
  drop,
}: {
  i: number;
  bar: MotionValue<number>;
  drop: MotionValue<number>;
}) {
  const left = i < 2;
  const clipPath = useTransform([bar, drop], ([h, v]: number[]) => {
    const across = `${r2((1 - h) * 100)}%`;
    const down = `calc((100% - 1px) * ${r2(1 - v)})`;
    return left
      ? `inset(0 0 ${down} ${across})`
      : `inset(0 ${across} ${down} 0)`;
  });
  return (
    <motion.span
      style={{
        clipPath,
        borderColor: LINE,
        ...(left
          ? { left: cardX(i), right: "50%" }
          : { left: "50%", right: `calc(100% - ${cardX(i)})` }),
      }}
      className={cn(
        "absolute bottom-0 top-4 border-t",
        left ? "rounded-tl-xl border-l" : "rounded-tr-xl border-r",
      )}
    />
  );
}

function Connector({ draw }: { draw: MotionValue<number> }) {
  const trunk = useTransform(draw, (d) => r2(clamp01(d / 0.3)));
  const bar = useTransform(draw, (d) => r2(clamp01((d - 0.3) / 0.35)));
  const drop = useTransform(draw, (d) => r2(clamp01((d - 0.65) / 0.35)));
  return (
    <div aria-hidden className="relative hidden h-10 w-full lg:block">
      <motion.span
        style={{ scaleY: trunk, background: LINE }}
        className="absolute left-1/2 top-0 h-4 w-px origin-top"
      />
      {[0, 1, 2, 3].map((i) => (
        <Elbow key={i} i={i} bar={bar} drop={drop} />
      ))}
    </div>
  );
}

function GuardCard({
  g,
  i,
  draw,
}: {
  g: (typeof GUARDS)[number];
  i: number;
  draw: MotionValue<number>;
}) {
  const shown = useTransform(draw, (d) =>
    r2(clamp01((d - 0.65 - i * 0.08) / 0.11)),
  );
  const y = useTransform(shown, (v) => r2((1 - v) * 12));
  return (
    <motion.li
      style={{ opacity: shown, y }}
      className="flex flex-col gap-1 rounded-2xl border border-line bg-paper p-4"
    >
      <p className="font-display text-base font-medium text-ink md:text-lg">
        {g.name}
      </p>
      <p className="text-sm leading-relaxed text-ink-muted">{g.text}</p>
    </motion.li>
  );
}

function ProxyScene({
  progress,
  live,
}: {
  progress: MotionValue<number>;
  live: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const time = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (live && inView) time.set(time.get() + delta / 1000);
  });
  // Functions, not ranges: framer would hand a range off to the browser's
  // scroll timeline, which disagrees with the JS-driven dots.
  const mix = useTransform(progress, (v) => clamp01((v - 0.15) / 0.22));
  // Then the proxy's four jobs branch out of it, line first, cards after.
  const draw = useTransform(progress, (v) => clamp01((v - 0.42) / 0.3));
  const proxyScale = useTransform(mix, (m) => 0.85 + 0.15 * m);
  const stem = useTransform(draw, (d) => clamp01(d / 0.3));
  const [after, setAfter] = useState(() => mix.get() > 0.5);
  useMotionValueEvent(mix, "change", (m) => setAfter(m > 0.5));
  // Last beat: the result, once all four cards are out.
  const [result, setResult] = useState(() => progress.get() > 0.78);
  useMotionValueEvent(progress, "change", (v) => setResult(v > 0.78));
  return (
    <div ref={ref} className="flex w-full flex-col">
      <div
        role="img"
        aria-label="Before: every search query goes straight to Vertex AI, and each one costs money. After: a proxy server sits in between and handles most queries itself, so far fewer reach Vertex AI."
        className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-line bg-paper-2/40 md:h-[260px]"
      >
        {/* After: the grey turns a light sky blue, to sit with Vertex AI. */}
        <motion.span
          aria-hidden
          style={{ opacity: mix }}
          className="absolute inset-0 bg-[#e8f0fe]"
        />
        <span
          aria-hidden
          className={cn(
            "absolute left-3 top-3 z-30 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500",
            after ? "bg-accent text-paper" : "bg-paper-2 text-ink-muted",
          )}
        >
          {after ? "After" : "Before"}
        </span>
        <span className="absolute bottom-3 left-3 text-[11px] font-medium text-ink-muted">
          Search queries
        </span>
        <span
          aria-hidden
          className="absolute top-1/2 h-px bg-line"
          style={{ left: `${START_X}%`, right: `${100 - AI_X}%` }}
        />
        {DOTS.map((d, j) => (
          <Query key={j} dot={d} time={time} mix={mix} />
        ))}
        {/* The first stretch of the line down to the cards. */}
        <motion.span
          aria-hidden
          style={{ left: `${PROXY_X}%`, scaleY: stem, background: LINE }}
          className="absolute bottom-0 top-1/2 hidden w-px origin-top lg:block"
        />
        <motion.div
          style={{
            left: `${PROXY_X}%`,
            height: AI_H,
            opacity: mix,
            scale: proxyScale,
          }}
          className="absolute top-1/2 z-10 grid w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[20px] border border-white/80 bg-white/45 text-center text-xs font-semibold text-ink shadow-[0_24px_48px_-24px_rgba(21,21,21,0.3),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl"
        >
          Proxy server
        </motion.div>
        {DOTS.filter((d) => !d.passes).map((d, j) => (
          <Spark key={j} dot={d} time={time} mix={mix} />
        ))}
        <div
          className="absolute top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-xl text-xs font-semibold text-white"
          style={{
            left: `${AI_X}%`,
            width: AI_W,
            height: AI_H,
            background: VERTEX_BLUE,
          }}
        >
          Vertex AI
        </div>
        {DOTS.map((d, j) => (
          <Coin key={j} dot={d} time={time} mix={mix} />
        ))}
      </div>
      <Connector draw={draw} />
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
        {GUARDS.map((g, i) => (
          <GuardCard key={g.name} g={g} i={i} draw={draw} />
        ))}
      </ul>
      <motion.div
        initial={false}
        animate={{ opacity: result ? 1 : 0, y: result ? 0 : 12 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="flex flex-col items-center gap-1 pt-8 text-center"
      >
        <p className="text-sm font-medium text-ink-muted">As a result,</p>
        <p className="flex flex-wrap items-center justify-center gap-x-3 font-display font-medium tracking-tight">
          {/* Reads as one sentence: "As a result, SaaS cost fell 30.82% with no
              change to key KPIs." "fell" carries the drop, so no minus sign. */}
          <span className="text-xl text-ink md:text-2xl">SaaS cost fell</span>
          <CountUp
            to={{ value: 30.82, decimals: 2, suffix: "%" }}
            play={result}
            className="text-[2.75rem] leading-none text-accent md:text-[3.5rem]"
          />
        </p>
        <p className="text-sm font-medium text-ink-muted">
          with no change to key KPIs.
        </p>
      </motion.div>
    </div>
  );
}

// B: monitoring.
const MONITOR = "/images/ai-search/monitoring";

// The daily Slack bot (Figma: Portfolio_Asset 578:91), rebuilt in code so
// each day can carry its own list. One message a day, stacking up.
const SLACK_DAYS = [
  {
    date: "2024-06-24",
    terms: [
      "avacodo, 262 occurrences, 100%",
      "strawbery, 179 occurrences, 80%",
      "brocolli, 185 occurrences, 67%",
      "qunioa, 82 occurrences, 60%",
      "zuchinni, 174 occurrences, 50%",
      "mozzarela, 218 occurrences, 45%",
      "chikpeas, 160 occurrences, 41%",
    ],
  },
  {
    date: "2024-06-25",
    terms: [
      "tomatto, 206 occurrences, 100%",
      "spinich, 149 occurrences, 71%",
      "rasberrie, 116 occurrences, 63%",
      "cinamon, 88 occurrences, 50%",
      "bell peper, 122 occurrences, 47%",
      "parmessan, 109 occurrences, 42%",
      "greek yogrut, 149 occurrences, 38%",
    ],
  },
  {
    date: "2024-06-26",
    terms: [
      "mushroms, 231 occurrences, 100%",
      "sourdoh bread, 193 occurrences, 67%",
      "cauliflour, 136 occurrences, 60%",
      "jalepeno, 95 occurrences, 50%",
      "almnods, 141 occurrences, 45%",
      "basmati rcie, 128 occurrences, 40%",
      "guacamloe, 96 occurrences, 36%",
    ],
  },
  {
    date: "2024-06-27",
    terms: [
      "onoin flakes, 64 occurrences, 100%",
      "cacao powdre, 121 occurrences, 75%",
      "bannana, 191 occurrences, 50%",
      "peenuts, 138 occurrences, 50%",
      "brown rcie, 99 occurrences, 44%",
      "mozzarela, 218 occurrences, 43%",
      "cucumebr, 128 occurrences, 40%",
    ],
  },
];
const STACK_STEP = 44; // px each newer message sits below the last
// Each newer message is a touch bigger, so the pile reads as a pile.
const grow = (i: number) => 0.9 + (0.1 * i) / (SLACK_DAYS.length - 1);

function SlackMessage({ date, terms }: (typeof SLACK_DAYS)[number]) {
  return (
    <div className="relative h-[300px] overflow-hidden rounded-xl border border-white/15 bg-[#1a1d21] p-5 shadow-[0_24px_48px_-20px_rgba(21,21,21,0.55)]">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
        <img
          src={`${MONITOR}/bot-owl.webp`}
          alt=""
          className="size-10 shrink-0 rounded-lg"
        />
        <div className="min-w-0 text-[#d1d2d3]">
          <p className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-white">
              AI Search Results Bot
            </span>
            <span className="rounded-[3px] bg-white/10 px-1 text-[10px] font-semibold text-[#a8a9ab]">
              APP
            </span>
            <span className="text-xs text-[#a8a9ab]">10:01 AM</span>
          </p>
          <p className="text-[15px]">
            {date} Market Google search terms · Top 30
          </p>
          <p className="mt-3 text-sm">CTR, highest to lowest</p>
          <ol className="mt-1 border-l-4 border-[#1d9bd1] pl-3 text-sm leading-[1.65]">
            {terms.map((t, i) => (
              <li key={t}>
                {i + 1}. {t}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {/* The list goes on to 30; fade it out. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1a1d21] to-transparent" />
    </div>
  );
}

// One message pops in per scroll step, each on top of and a little below
// the day before, like a channel filling up over a week.
// Sits under the Slack bot and the dashboard: their numbers are made up.
function DataNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-ink-muted", className)}>
      Illustrative data. Internal figures have been changed.
    </p>
  );
}

function SlackStack({ shown, bubble }: { shown: number; bubble: boolean }) {
  const still = useStill();
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className="relative w-full max-w-[460px]"
        style={{ height: 300 + STACK_STEP * (SLACK_DAYS.length - 1) }}
      >
        {SLACK_DAYS.map((day, i) => {
          const on = i < shown;
          return (
            <motion.div
              key={day.date}
              aria-hidden={!on}
              initial={false}
              animate={
                on
                  ? { opacity: 1, scale: grow(i), y: 0 }
                  : { opacity: 0, scale: grow(i) * 0.88, y: -24 }
              }
              transition={
                still
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 22 }
              }
              className="absolute inset-x-0"
              style={{
                top: i * STACK_STEP,
                zIndex: i,
                transformOrigin: "top center",
              }}
            >
              <SlackMessage {...day} />
            </motion.div>
          );
        })}
      </div>
      <DataNote className="-mt-3 w-full max-w-[460px]" />
      <motion.div
        initial={false}
        animate={{ opacity: bubble ? 1 : 0, y: bubble ? 0 : 10 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <ThoughtBubble
          emoji="🧐"
          text="Why is everyone searching for this?"
          tail="none"
        />
      </motion.div>
    </div>
  );
}

// The Looker dashboard (Figma: Portfolio_Asset 583:10635), one long page.
// It sits in a square window and moves inside it, one area per beat, with
// the area being read lit and the rest dimmed. Always at full size, never
// zoomed. Boxes are fractions of the image.
const DASH = { src: "google-dashboard.webp", w: 1400, h: 2353 };
const DASH_BEATS = [
  {
    label: "Yesterday’s stats",
    pan: 0.06,
    box: { x: 0.015, y: 0.075, w: 0.452, h: 0.24 },
  },
  {
    label: "Daily trend",
    pan: 0.33,
    box: { x: 0.015, y: 0.345, w: 0.452, h: 0.625 },
  },
  {
    label: "Top search terms",
    pan: 0.06,
    box: { x: 0.486, y: 0.075, w: 0.498, h: 0.478 },
  },
];

function DashBeats({ step }: { step: number }) {
  return (
    <ol className="flex flex-col gap-2">
      {DASH_BEATS.map((b, i) => (
        <li
          key={b.label}
          className={cn(
            "flex items-center gap-3 text-base transition-colors duration-300",
            i === step ? "text-ink" : "text-ink-muted",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full transition-colors duration-300",
              i === step ? "bg-accent" : "bg-line",
            )}
          />
          {b.label}
        </li>
      ))}
    </ol>
  );
}

function DashWindow({ step, live }: { step: number; live: boolean }) {
  const still = useStill();
  const beat = DASH_BEATS[step];
  const spring = still
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 120, damping: 22 };
  return (
    <figure className="flex w-full max-w-[520px] flex-col gap-2">
      <div className="overflow-hidden rounded-xl border border-line bg-paper shadow-[0_20px_40px_-20px_rgba(21,21,21,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-2 rounded-full bg-line" />
          ))}
          <span className="ml-2 text-xs text-ink-muted">Looker Studio</span>
        </div>
        {/* Phones and reduced motion: no pinned tour, the reader scrolls it. */}
        <div
          className={cn(
            "relative",
            live ? "overflow-hidden" : "overflow-y-auto",
          )}
          style={{ aspectRatio: "1 / 1" }}
        >
          <motion.div
            initial={false}
            animate={{ y: live ? `-${pct(beat.pan * 100)}` : 0 }}
            transition={spring}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img
              src={`${MONITOR}/${DASH.src}`}
              alt="Google search dashboard: yesterday’s stats, daily trend, and search terms by site"
              width={DASH.w}
              height={DASH.h}
              className="block h-auto w-full"
            />
            {live && (
              <motion.div
                aria-hidden
                initial={false}
                animate={{
                  left: pct(beat.box.x * 100),
                  top: pct(beat.box.y * 100),
                  width: pct(beat.box.w * 100),
                  height: pct(beat.box.h * 100),
                }}
                transition={spring}
                className="absolute rounded-md shadow-[0_0_0_9999px_rgba(255,255,255,0.6)] ring-1 ring-accent/40"
              />
            )}
          </motion.div>
        </div>
      </div>
      <figcaption>
        <DataNote />
      </figcaption>
    </figure>
  );
}

function SubSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display text-xl font-medium tracking-tight text-ink md:text-2xl">
      {children}
    </h4>
  );
}

export function Improvement() {
  return (
    <Chapter
      id="improvement"
      label="10 Improvement"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader
          label="10 IMPROVEMENT"
          headline="Safe to Scale, Easy to Watch"
        />
        <Body className="max-w-none">
          The A/B test proved the idea, but going live for every customer asked
          for more.
          <br />
          Before the rollout I improved two things: <B>what reaches the AI</B>,
          and <B>how everyone can watch it</B>.
        </Body>
      </div>

      {/* A: proxy server. Heading, scene and cards share one screen. */}
      <div className="pt-12 md:pt-16" />
      <StickyScene steps={5} vh={60} label="Queries through the proxy server">
        {({ progress, live }) => (
          <div className={cn(wrap, "flex flex-col gap-6")}>
            <div className="flex flex-col gap-3">
              <SubHeading>1. A Proxy Server for Safety and Cost</SubHeading>
              <Body className="max-w-none">
                Live traffic brought two new needs: <B>production safety</B> and{" "}
                <B>cost efficiency</B>.
                <br />I led the build of a <B>proxy server</B> between Kurly and
                Vertex AI that decides when the AI is worth calling.
              </Body>
            </div>
            <ProxyScene progress={progress} live={live} />
          </div>
        )}
      </StickyScene>

      {/* B: monitoring. Slack bot first, then the dashboard; same layout. */}
      <div className={cn(wrap, "pt-24 md:pt-32")}>
        <SubHeading>2. Monitoring for Performance and Demand</SubHeading>
      </div>

      <StickyScene
        steps={SLACK_DAYS.length + 1}
        vh={55}
        label="The daily Slack bot"
      >
        {({ step, live }) => (
          <div
            className={cn(
              wrap,
              "grid items-start gap-10 md:grid-cols-[1fr_1.2fr]",
            )}
          >
            <div className="flex flex-col gap-4">
              <SubSubHeading>Slack Bot</SubSubHeading>
              <Body>
                Because failed searches are customers telling us what they want,
                I built a <B>Slack bot</B> that brings them to the team every
                morning.
                <br />
                It sends merchandisers and marketers the search queries losing
                the most clicks, so they can{" "}
                <B>spot new trends and unmet demand</B> fast.
              </Body>
            </div>
            <SlackStack
              shown={live ? step + 1 : SLACK_DAYS.length}
              bubble={!live || step >= SLACK_DAYS.length}
            />
          </div>
        )}
      </StickyScene>

      <StickyScene
        steps={DASH_BEATS.length}
        vh={60}
        label="The Looker dashboard"
      >
        {({ step, live }) => (
          <div
            className={cn(
              wrap,
              "grid items-start gap-10 md:grid-cols-[1fr_1.2fr]",
            )}
          >
            <div className="flex flex-col gap-4">
              <SubSubHeading>Dashboard</SubSubHeading>
              <Body>
                Because the Slack bot showed only the top queries, I designed
                and built a <B>Looker dashboard</B> for the full detail and
                daily performance tracking.
                <br />
                The CEO, engineers, and business teams all watched the same
                numbers in real time.
              </Body>
              {live && <DashBeats step={step} />}
            </div>
            <div className="flex justify-center">
              <DashWindow step={step} live={live} />
            </div>
          </div>
        )}
      </StickyScene>
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 11 Integration & Impact                                             */
/* ------------------------------------------------------------------ */

// cabage's last appearance: into the cart, and the cart turns into revenue.
function CartScene({ progress }: { progress: MotionValue<number> }) {
  const chipY = useTransform(progress, [0.08, 0.4], [-150, 0]);
  const chipScale = useTransform(progress, [0.3, 0.42], [1, 0.4]);
  const chipOpacity = useTransform(
    progress,
    [0, 0.05, 0.38, 0.42],
    [0, 1, 1, 0],
  );
  const cartScale = useTransform(
    progress,
    [0.4, 0.46, 0.52, 0.62, 0.7],
    [1, 1.18, 1, 1, 0.3],
  );
  const cartOpacity = useTransform(progress, [0.62, 0.7], [1, 0]);
  const moneyOpacity = useTransform(progress, [0.66, 0.78], [0, 1]);
  const moneyScale = useTransform(progress, [0.66, 0.8], [0.6, 1]);
  return (
    <div
      role="img"
      aria-label="“cabage” drops into a cart, and the cart turns into ₩5B in monthly revenue."
      className="relative mx-auto grid h-[340px] w-full max-w-[420px] place-items-center"
    >
      <motion.span
        style={{ y: chipY, scale: chipScale, opacity: chipOpacity }}
        className="absolute top-[42%] rounded-full bg-ink px-4 py-1.5 font-mono text-sm text-paper"
      >
        cabage
      </motion.span>
      <motion.span
        style={{ scale: cartScale, opacity: cartOpacity }}
        className="absolute top-[58%] grid size-20 place-items-center rounded-full bg-accent text-paper"
      >
        <ShoppingCart
          aria-hidden
          className="size-8"
          strokeWidth={1}
          absoluteStrokeWidth
        />
      </motion.span>
      <motion.span
        style={{ opacity: moneyOpacity, scale: moneyScale }}
        className="font-display font-medium tracking-tight absolute top-[50%] text-[4.5rem] leading-none text-accent md:text-[6rem]"
      >
        ₩5B
      </motion.span>
    </div>
  );
}

function RisingCurve() {
  const ref = useRef<HTMLDivElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const pathLength = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 1000 400"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <motion.path
          d="M0 380 C 220 370, 380 340, 520 270 S 820 90, 1000 30"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.14}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: still ? 1 : pathLength }}
        />
      </svg>
    </div>
  );
}

export function IntegrationImpact() {
  return (
    <Chapter
      id="integration-impact"
      label="11 Integration & Impact"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-10")}>
        <SectionHeader
          label="11 INTEGRATION & IMPACT"
          headline="Live in Two Months, ₩5B a Month"
        />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <Body>
            Two months after the PoC, AI Search was live for every Kurly
            customer. Then I handed it to the <B>Search Engine team</B>, and it
            became part of their roadmap.
          </Body>
          <MetricCounter
            size="lg"
            to={{ value: 2, suffix: " months" }}
            label="From PoC to Full Production"
          />
        </div>
      </div>

      <StickyScene steps={3} vh={60} label="cabage becomes revenue">
        {({ progress }) => (
          <div className={wrap}>
            <CartScene progress={progress} />
          </div>
        )}
      </StickyScene>

      <div
        className={cn(
          wrap,
          "relative flex flex-col gap-14 pb-24 pt-10 md:pb-32",
        )}
      >
        <RisingCurve />
        <div className="relative">
          <MetricCounter
            size="xl"
            to={{ value: 5, prefix: "₩", suffix: "B" }}
            extra="(~$3.6M)"
            label="New monthly revenue from searches that used to end in nothing"
          />
          {/* TODO(spec §9.3): one-line note on how the ₩5B was measured. */}
        </div>
        <div className="relative grid gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-3">
          <MetricCounter
            from={{ value: 6.8, decimals: 2, suffix: "%" }}
            to={{ value: 0.22, decimals: 2, suffix: "%" }}
            label="No-Result Rate"
            className={smallMetric}
          />
          <MetricCounter
            from={{ value: 58.6, decimals: 2, suffix: "%" }}
            to={{ value: 60.14, decimals: 2, suffix: "%" }}
            label="Search Click-Through Rate"
            className={smallMetric}
          />
          <MetricCounter
            to={{ value: 35.52, decimals: 2, suffix: "x" }}
            label="Return on AI cost: margin per product vs. API fee per purchase"
            className={smallMetric}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-0 md:px-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-2 md:aspect-[21/8] md:rounded-2xl">
          <AssetMedia id="summit-stage-photo" />
        </div>
      </div>
      <div
        className={cn(
          wrap,
          "flex flex-col gap-4 pb-28 pt-8 md:flex-row md:items-end md:justify-between md:pb-36",
        )}
      >
        <div className="flex max-w-[40rem] flex-col gap-3">
          <h3 className="font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]">
            Google Cloud Summit Seoul 2024
          </h3>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            Google featured this project as a leading enterprise case of AI on
            GCP. Kurly’s CEO told the story on stage, and I built the
            presentation.
          </p>
        </div>
        <a
          href={TALK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, "shrink-0")}
        >
          Watch the talk ↗
        </a>
      </div>
    </Chapter>
  );
}
