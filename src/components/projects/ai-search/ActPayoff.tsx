"use client";

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { TALK_URL } from "./ActSetup";
import { EASE_OUT, Reveal, StickyScene, useStill } from "./motion";
import {
  AssetMedia,
  B,
  Body,
  Chapter,
  MetricCounter,
  ProcessStrip,
  SectionHeader,
  ThoughtBubble,
  wrap,
} from "./ui";

// Act 5, Payoff: 10 Integration · 11 Monitoring · 12 Business Impact ·
// Outro (spec §5.10–5.13).

const linkClass =
  "text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-3 hover:decoration-accent-3";

/* ------------------------------------------------------------------ */
/* 10 Integration                                                      */
/* ------------------------------------------------------------------ */

// Staged ratios, deliberately unlabelled (spec §5.10): most queries are
// answered from cache or stopped, the rest reach Vertex AI.
type Outcome = "ai" | "cache" | "block";
const FATES: Outcome[] = [
  "ai",
  "cache",
  "ai",
  "block",
  "cache",
  "ai",
  "cache",
  "block",
  "ai",
  "cache",
];
const LANES: Record<Outcome, { y: number; label: string }> = {
  ai: { y: 18, label: "Vertex AI" },
  cache: { y: 50, label: "Cache (12h)" },
  block: { y: 82, label: "Blocklist" },
};
const PROXY_X = 48;

function Packet({ progress, j }: { progress: MotionValue<number>; j: number }) {
  const fate = FATES[j];
  const t = useTransform(progress, (v) => (v * 3 + j / FATES.length) % 1);
  const left = useTransform(t, (u) => {
    if (u < 0.5) return `${4 + (u / 0.5) * (PROXY_X - 4)}%`;
    if (fate === "block") return `${PROXY_X + 4}%`;
    return `${PROXY_X + ((u - 0.5) / 0.5) * (84 - PROXY_X)}%`;
  });
  const top = useTransform(t, (u) =>
    u < 0.5 || (fate === "block" && u < 0.55)
      ? "50%"
      : `${50 + (LANES[fate].y - 50) * Math.min(1, (u - 0.5) / 0.2)}%`,
  );
  const opacity = useTransform(t, (u) =>
    u > 0.9
      ? (1 - u) / 0.1
      : fate === "block" && u > 0.55
        ? Math.max(0, 1 - (u - 0.55) / 0.15)
        : Math.min(1, u / 0.05),
  );
  return (
    <motion.span
      aria-hidden
      style={{ left, top, opacity }}
      className={cn(
        "absolute -ml-1.5 -mt-1.5 size-3 rounded-full",
        fate === "ai" ? "bg-accent" : fate === "cache" ? "bg-ink" : "bg-ink-muted/50",
      )}
    />
  );
}

function Meter({ label, width }: { label: string; width: MotionValue<string> | string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs font-medium text-ink-muted">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper-2">
        <motion.div
          style={{ width }}
          className={cn("h-full rounded-full", label === "AI calls" ? "bg-accent" : "bg-ink")}
        />
      </div>
    </div>
  );
}

function ProxyScene({ progress, live }: { progress: MotionValue<number>; live: boolean }) {
  const searches = useTransform(progress, [0, 1], ["4%", "100%"]);
  const calls = useTransform(progress, [0, 1], ["2%", "48%"]);
  return (
    <div
      role="img"
      aria-label="Searches enter the proxy server: some are answered from the cache, some are stopped by the blocklist, and only the rest reach Vertex AI, so AI calls grow more slowly than searches."
      className="flex w-full flex-col gap-6"
    >
      <div className="relative h-[280px] w-full rounded-2xl border border-line bg-paper-2/40">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-ink-muted">
          Searches
        </span>
        <div
          className="absolute top-1/2 grid h-24 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border-2 border-ink bg-paper text-center text-xs font-semibold text-ink"
          style={{ left: `${PROXY_X}%` }}
        >
          Proxy server
        </div>
        {(Object.keys(LANES) as Outcome[]).map((k) => (
          <span
            key={k}
            className={cn(
              "absolute right-3 -translate-y-1/2 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              k === "ai"
                ? "bg-accent text-paper"
                : k === "cache"
                  ? "bg-ink text-paper"
                  : "border border-dashed border-ink-muted/50 text-ink-muted",
            )}
            style={{ top: `${LANES[k].y}%` }}
          >
            {LANES[k].label}
          </span>
        ))}
        {live && FATES.map((_, j) => <Packet key={j} progress={progress} j={j} />)}
      </div>
      <div className="flex flex-col gap-2">
        <Meter label="Searches" width={live ? searches : "100%"} />
        <Meter label="AI calls" width={live ? calls : "48%"} />
      </div>
    </div>
  );
}

const GUARDS = [
  {
    name: "Block",
    text: "Filters unlisted brands, profanity, medical terms, and abnormal or malicious queries.",
  },
  { name: "Fall back", text: "A circuit breaker shows the original screen if the AI is too slow." },
  {
    name: "Reuse",
    text: (
      <>
        Caches results per keyword for 12 hours, cutting repeat AI calls by <B>up to 30%</B>.
      </>
    ),
  },
];

export function Integration() {
  return (
    <Chapter
      id="integration"
      label="10 Integration"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader label="10 INTEGRATION" headline="Built for Millions, and for the Bill" />
        <Body>
          A test can afford surprises; production can’t. I led the build of a <B>proxy server</B>{" "}
          between Kurly and Vertex AI that decides when the AI is worth calling.
        </Body>
      </div>

      <StickyScene steps={3} vh={70} label="Queries through the proxy server">
        {({ progress, live }) => (
          <div className={cn(wrap, "flex justify-center")}>
            <div className="w-full max-w-[760px]">
              <ProxyScene progress={progress} live={live} />
            </div>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-10 pb-28 pt-6 md:pb-36")}>
        <ul className="grid gap-4 md:grid-cols-3">
          {GUARDS.map((g, i) => (
            <Reveal
              as="li"
              key={g.name}
              delay={i * 0.1}
              className="flex flex-col gap-2 rounded-2xl border border-line p-6"
            >
              <p className="font-display text-base font-medium text-ink">{g.name}</p>
              <p className="text-sm leading-relaxed text-ink-muted">{g.text}</p>
            </Reveal>
          ))}
        </ul>
        <ProcessStrip at="Integration" />
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 11 Monitoring                                                       */
/* ------------------------------------------------------------------ */

const PANELS = ["Daily AI Search Stats", "Top AI Queries", "Caching Rate", "Anomaly Search Rate"];

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">{children}</p>
  );
}

function SlackNotice({ show, bubble }: { show: boolean; bubble: boolean }) {
  const still = useStill();
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            key="slack"
            initial={still ? false : { opacity: 0, y: -40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative aspect-[4/3] w-full max-w-[440px] overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_20px_50px_-25px_rgba(21,21,21,0.35)]"
          >
            <AssetMedia id="slack-bot" fit="contain" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={false}
        animate={{ opacity: bubble ? 1 : 0, y: bubble ? 0 : 10 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <ThoughtBubble emoji="🧐" text="Why is everyone searching for this?" tail="none" />
      </motion.div>
    </div>
  );
}

export function Monitoring() {
  return (
    <Chapter id="monitoring" label="11 Monitoring" className="border-t border-line pt-24 md:pt-32">
      <div className={cn(wrap, "flex flex-col gap-10")}>
        <SectionHeader
          label="11 MONITORING"
          headline="Everyone Could See What AI Search Was Doing"
        />
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div className="flex flex-col gap-5">
            <SubLabel>Transparency</SubLabel>
            <Body>
              During the A/B test and rollout, I didn’t want results hiding in a PM’s slides. I
              designed and built a <B>Looker dashboard</B> so the CEO, engineers, and business teams
              could all watch the same numbers in real time.
            </Body>
            <ul className="flex flex-wrap gap-2">
              {PANELS.map((p) => (
                <li
                  key={p}
                  className="rounded-full bg-paper-2 px-3 py-1.5 text-xs font-medium text-ink"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-paper-2">
            <AssetMedia id="dashboard-pan" />
          </Reveal>
        </div>
      </div>

      <StickyScene steps={2} label="The daily Slack bot">
        {({ step, live }) => (
          <div className={cn(wrap, "grid items-center gap-10 md:grid-cols-[1fr_1.3fr]")}>
            <div className="flex flex-col gap-5">
              <SubLabel>A window into demand</SubLabel>
              <Body>
                Failed searches are customers telling us what they want. A daily <B>Slack bot</B>{" "}
                sends merchandisers and marketers the search queries losing the most clicks, so they
                can <B>spot new trends and unmet demand</B> fast.
              </Body>
            </div>
            <SlackNotice show={!live || step >= 0} bubble={!live || step >= 1} />
          </div>
        )}
      </StickyScene>
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 12 Business Impact                                                  */
/* ------------------------------------------------------------------ */

// cabage's last appearance: into the cart, and the cart turns into revenue.
function CartScene({ progress }: { progress: MotionValue<number> }) {
  const chipY = useTransform(progress, [0.08, 0.4], [-150, 0]);
  const chipScale = useTransform(progress, [0.3, 0.42], [1, 0.4]);
  const chipOpacity = useTransform(progress, [0, 0.05, 0.38, 0.42], [0, 1, 1, 0]);
  const cartScale = useTransform(progress, [0.4, 0.46, 0.52, 0.62, 0.7], [1, 1.18, 1, 1, 0.3]);
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
        <ShoppingCart aria-hidden className="size-8" strokeWidth={1.75} />
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="h-full w-full">
        <motion.path
          d="M0 380 C 220 370, 380 340, 520 270 S 820 90, 1000 30"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.14}
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: still ? 1 : pathLength }}
        />
      </svg>
    </div>
  );
}

export function BusinessImpact() {
  return (
    <Chapter id="business-impact" label="12 Business Impact" className="border-t border-line">
      <StickyScene steps={3} vh={60} label="cabage becomes revenue">
        {({ progress }) => (
          <div className={wrap}>
            <CartScene progress={progress} />
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "relative flex flex-col gap-14 pb-24 pt-10 md:pb-32")}>
        <RisingCurve />
        <SectionHeader
          label="12 BUSINESS IMPACT"
          headline="One Typo at a Time, ₩5B a Month"
          className="relative"
        />
        <div className="relative">
          <MetricCounter
            size="xl"
            to={{ value: 5, prefix: "₩", suffix: "B" }}
            extra="(~$3.6M)"
            label="New monthly revenue from searches that used to end in nothing"
          />
          {/* TODO(spec §9.3): one-line note on how the ₩5B was measured. */}
        </div>
        <div className="relative grid gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCounter
            from={{ value: 6.8, decimals: 2, suffix: "%" }}
            to={{ value: 0.22, decimals: 2, suffix: "%" }}
            label="No-Result Rate"
            className="[&>p:first-child]:text-[1.5rem] md:[&>p:first-child]:text-[1.75rem]"
          />
          <MetricCounter
            from={{ value: 58.6, decimals: 2, suffix: "%" }}
            to={{ value: 60.14, decimals: 2, suffix: "%" }}
            label="Search Click-Through Rate"
            className="[&>p:first-child]:text-[1.5rem] md:[&>p:first-child]:text-[1.75rem]"
          />
          <MetricCounter
            to={{ value: -30, suffix: "%" }}
            label="AI Search Operating Cost vs. Pilot"
            className="[&>p:first-child]:text-[1.5rem] md:[&>p:first-child]:text-[1.75rem]"
          />
          <MetricCounter
            to={{ value: 2, suffix: " months" }}
            label="From PoC to Full Production"
            className="[&>p:first-child]:text-[1.5rem] md:[&>p:first-child]:text-[1.75rem]"
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
          <p className="text-base leading-relaxed text-ink-muted">
            Google featured this project as a leading enterprise case of AI on GCP. Kurly’s CEO told
            the story on stage, and I built the presentation.
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

/* ------------------------------------------------------------------ */
/* Outro                                                               */
/* ------------------------------------------------------------------ */

const RELATED = [
  { label: "Kurly Tech Blog", url: "https://helloworld.kurly.com/blog/vertex-ai-search-nr/" },
  { label: "Google Cloud Summit 2024 talk", url: TALK_URL },
  { label: "PDF version", url: "/pdf/SuyoungKwon_Portfolio.pdf" },
];

export function Outro() {
  return (
    <div className="border-t border-line">
      <div className={cn(wrap, "py-20 md:py-28")}>
        {/* TODO(spec §9.2): two-sentence reflection, hidden until written. */}
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Related links
          </p>
          <ul className="flex flex-col gap-3">
            {RELATED.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
