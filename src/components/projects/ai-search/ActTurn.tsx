"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, StickyScene, useStill, useTypewriter } from "../story/motion";
import { ProcessFlow, type ProcessStep } from "../story/ProcessFlow";
import {
  B,
  Body,
  Chapter,
  GradioWindow,
  Question as StoryQuestion,
  SectionHeader,
  Subhead,
  wrap,
} from "../story/ui";
import { TryItStage } from "./TryItScene";

// Act 3, Turn: 06 Define · 07 PoC Approach (spec §5.6–5.7). 07B is the
// page's climax: the same typos from 04, in the same phone, now found.

/* ------------------------------------------------------------------ */
/* 06 Define                                                           */
/* ------------------------------------------------------------------ */

function Question({ progress, live }: { progress?: MotionValue<number>; live: boolean }) {
  return (
    <StoryQuestion
      lead="How might we turn “No Results” into results,"
      turn="without rebuilding the search engine"
      progress={progress}
      live={live}
    />
  );
}

const GOALS = [
  ["Long-term goal", "Improve Kurly’s search performance and search experience"],
  ["Short-term goal", "Validate the baseline performance and immediate impact of AI search"],
] as const;

function TermTable({
  title,
  rows,
  animate,
}: {
  title: string;
  rows: readonly (readonly [string, React.ReactNode])[];
  animate: boolean;
}) {
  const still = useStill() || !animate;
  return (
    <div className="flex flex-col gap-8">
      <Subhead>{title}</Subhead>
      <dl className="flex flex-col">
        {rows.map(([term, value], i) => (
          <motion.div
            key={term}
            initial={still ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 + i * 0.15 }}
            className="grid gap-1 border-b border-line py-5 first:pt-0 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8"
          >
            <dt className="text-base text-ink-muted md:text-lg">{term}</dt>
            <dd className="text-base leading-relaxed text-ink md:text-lg">{value}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}

// Two groups side by side; abbreviation | full name, one metric per line.
// Business names follow common e-commerce usage (RPS, GMV).
const KPI_GROUPS = [
  [
    "User behavior metrics",
    [
      ["NRR", "No-Result Rate"],
      ["CTR", "Click-Through Rate"],
      ["ATC CVR", "Add-to-Cart Conversion Rate"],
      ["CVR", "Purchase Conversion Rate"],
    ],
  ],
  [
    "Business metrics",
    [
      ["RPS", "Revenue per Search"],
      ["", "Add-to-Cart Value"],
      ["GMV", "Gross Merchandise Value"],
      ["", "Estimated Gross Margin"],
      ["", "AI API Cost"],
    ],
  ],
] as const;

function Kpis({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  return (
    <div className="flex flex-col gap-8">
      <Subhead>Key Performance Indicators</Subhead>
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        {KPI_GROUPS.map(([group, metrics], i) => (
          <motion.div
            key={group}
            initial={still ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 + i * 0.15 }}
            className="flex flex-col gap-4"
          >
            <p className="border-b border-line pb-3 text-base text-ink-muted md:text-lg">{group}</p>
            <ul className="flex flex-col gap-2 text-base leading-relaxed text-ink md:text-lg">
              {metrics.map(([abbr, name]) => (
                <li key={name} className="grid grid-cols-[6rem_1fr] gap-4">
                  <span className="font-semibold">{abbr}</span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Prove the case, build it, then give it back to the team that owns search.
export const STRATEGY: ProcessStep[] = [
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

const Goals = ({ animate }: { animate: boolean }) => (
  <TermTable title="Objectives and Goals" rows={GOALS} animate={animate} />
);
function Strategy({ animate }: { animate: boolean }) {
  return (
    <div className="flex flex-col gap-8">
      <Subhead>Strategic Process</Subhead>
      <Body className="max-w-[44rem]">
        Leadership believed the Bestsellers were enough.
        <br />
        So the plan was to <B>test that belief with real data</B>, prove the engine update was worth
        it, and then <B>hand the work back</B> to the team that owned search.
      </Body>
      <ProcessFlow steps={STRATEGY} animate={animate} />
    </div>
  );
}

// 07 (1): no rebuild; a SaaS goes on top of the search we had. Strike,
// then an arrow draws right, then the new plan lands.
function AddSaas({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  return (
    <p
      role="img"
      aria-label="“Rebuild” is crossed out, and an arrow points to “Add SaaS”."
      className="font-display flex max-w-[40rem] items-center justify-center gap-3 py-10 text-[1.75rem] font-medium leading-none tracking-tight md:gap-5 md:text-[3.5rem]"
    >
      <span className="relative text-ink-muted">
        Rebuild
        <motion.span
          aria-hidden
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
          className="absolute inset-x-0 top-1/2 h-[3px] origin-left bg-ink"
        />
      </span>
      <svg aria-hidden viewBox="0 0 64 24" className="w-10 shrink-0 text-ink md:w-16">
        <motion.path
          d="M2 12 H60 M50 3 L61 12 L50 21"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={still ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 1 }}
        />
      </svg>
      <motion.span
        initial={still ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: 1.45 }}
        className="text-accent"
      >
        Add SaaS
      </motion.span>
    </p>
  );
}

// 07 (2): one triangle in Google Cloud's colors. BigQuery (yellow) is the
// base that was already there; Vertex AI (blue) drops in and closes the
// tip. The logo sits underneath.
function VertexStack({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  return (
    <div
      role="img"
      aria-label="Google Cloud: Vertex AI sits on top of BigQuery, where Kurly’s product data already lived."
      className="flex flex-col items-center gap-6"
    >
      <svg viewBox="0 0 300 220" className="w-full max-w-[340px]">
        <motion.g
          initial={still ? false : { opacity: 0, y: -36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.5 }}
        >
          {/* Overlaps the seam by half a unit so no hairline shows. */}
          <path d="M150 4 L215.5 112.5 H84.5 Z" fill="#4285F4" />
          <text
            x="150"
            y="90"
            textAnchor="middle"
            fill="#fff"
            className="text-[15px] font-semibold"
          >
            Vertex AI
          </text>
        </motion.g>
        <path d="M84.8 112 H215.2 L278 216 H22 Z" fill="#FBBC05" />
        <text
          x="150"
          y="160"
          textAnchor="middle"
          fill="#202124"
          className="text-[15px] font-semibold"
        >
          BigQuery
        </text>
        <text x="150" y="180" textAnchor="middle" fill="#3C4043" className="text-[11px]">
          Kurly’s product data
        </text>
      </svg>
      <motion.img
        src="/images/ai-search/logo_google_cloud.png"
        alt=""
        initial={still ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
        className="h-7 w-auto md:h-8"
      />
    </div>
  );
}

const RULES = [
  {
    name: "Only on failure",
    text: "AI runs only when the old search finds nothing.",
  },
  { name: "Narrow scope first", text: "Typos, spacing, and synonyms only." },
  {
    name: "Same business rules",
    text: "Every AI result respects Kurly’s business and inventory policies.",
  },
];

function Rules({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Subhead>Guardrails</Subhead>
        <p className="text-base leading-relaxed text-ink-muted md:text-lg">
          Three rules the AI had to follow:
        </p>
      </div>
      <ol className="grid gap-4 md:grid-cols-3">
        {RULES.map((rule, i) => (
          <motion.li
            key={rule.name}
            initial={still ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: EASE_OUT,
              delay: 0.15 + i * 0.15,
            }}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-6"
          >
            <span className="font-display font-medium tracking-tight text-2xl leading-none text-accent">
              {i + 1}
            </span>
            <p className="font-display text-lg font-medium text-ink md:text-xl">{rule.name}</p>
            <p className="text-base leading-relaxed text-ink-muted md:text-lg">{rule.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Define() {
  return (
    <Chapter id="define" label="06 Define" className="border-t border-line">
      <StickyScene
        steps={5}
        vh={100}
        label="From question to rules"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-16 py-14")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              06 DEFINE
            </p>
            <Question live={false} />
            <Goals animate={false} />
            <Kpis animate={false} />
            <Strategy animate={false} />
            <Rules animate={false} />
          </div>
        )}
      >
        {({ step, progress }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-8 md:gap-10")}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              06 DEFINE
            </p>
            {/* Every beat, invisible, stacked in one cell: the box is as tall as
                the tallest beat, so the label sits still while beats swap. */}
            <div className="grid">
              {[
                <Question key="q" live={false} />,
                <Goals key="g" animate={false} />,
                <Kpis key="k" animate={false} />,
                <Strategy key="s" animate={false} />,
                <Rules key="r" animate={false} />,
              ].map((beat) => (
                <div key={beat.key} aria-hidden className="invisible col-start-1 row-start-1">
                  {beat}
                </div>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="col-start-1 row-start-1 w-full"
                  key={step}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  {step === 0 && <Question progress={progress} live />}
                  {step === 1 && <Goals animate />}
                  {step === 2 && <Kpis animate />}
                  {step === 3 && <Strategy animate />}
                  {step === 4 && <Rules animate />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </StickyScene>

      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 07A How it works                                                    */
/* ------------------------------------------------------------------ */

// 07 (3): the Gradio demo page, rebuilt. “Granma Padano” types in; Kurly
// finds nothing, both AI columns fill, then structured data wins.
const DEMO = "/images/ai-search/demo";
const DEMO_QUERY = "Granma Padano";
const CRAWLED = [
  { title: "[Mantova] Grana Padano – Market Kurly", hit: true },
  { title: "[Dano] Pumpkin meal shake 25 g × 10 – Market Kurly", hit: false },
  { title: "[Dano] Red bean meal shake 25 g × 10 – Market Kurly", hit: false },
  { title: "[Dano] Black sesame meal shake 25 g × 10 – Market Kurly", hit: false },
  { title: "[Dano] Protein bars (choose 1) – Market Kurly", hit: false },
];
const STRUCTURED = [
  "[Boîte Gourmande] Grana Padano snow shreds",
  "[Antico] Grana Padano",
  "[Mantova] Grana Padano",
  "[Mantova] Parmigiano Reggiano",
  "Grana Padano cheese",
];

function DataSourceShowdown({ animate }: { animate: boolean }) {
  const still = useStill() || !animate;
  const { typed, done } = useTypewriter(DEMO_QUERY, { speed: 70, startDelay: 400, instant: still });
  // 0 typing · 1 results in · 2 winner called
  const [phase, setPhase] = useState(still ? 2 : 0);
  useEffect(() => {
    if (still || !done) return;
    const a = setTimeout(() => setPhase(1), 350);
    const b = setTimeout(() => setPhase(2), 2300);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [still, done]);
  const won = phase >= 2;

  const row = (i: number) => ({
    initial: still ? false : { opacity: 0, y: 8 },
    animate: phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    transition: { duration: 0.35, ease: EASE_OUT, delay: phase >= 1 && !won ? i * 0.12 : 0 },
  });

  const panel = (name: string, state: "lost" | "won" | "idle", children: React.ReactNode) => (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border bg-paper transition-all duration-500",
        state === "won" ? "border-accent ring-2 ring-accent" : "border-line",
        state === "lost" && "opacity-45",
      )}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="font-mono text-[13px] font-semibold text-ink">{name}</span>
        {state === "won" && (
          <motion.span
            initial={still ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper"
          >
            Winner
          </motion.span>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <GradioWindow
      title="AI Search - Demo"
      label="AI Search - Demo dashboard, built with Gradio: searching “Granma Padano”. Kurly search finds nothing. Web crawling returns one Grana Padano and four unrelated meal shakes and bars. Structured data returns five Grana Padano and related cheeses, and wins."
    >
      <div className="grid items-end gap-3 md:grid-cols-[1fr_1fr_auto] md:gap-5">
        <div className="flex h-9 items-center rounded-lg border border-line bg-paper px-3 text-sm text-ink">
          {typed}
          {!done && <span aria-hidden className="ml-px h-4 w-px animate-pulse bg-ink" />}
        </div>
        <div className="flex flex-col gap-2 pb-1">
          <div className="flex items-center justify-between text-[11px] text-ink">
            <span className="font-medium">Maximum results (1–50)</span>
            <span className="rounded border border-line bg-paper px-1.5 py-px tabular-nums">
              20
            </span>
          </div>
          <div className="relative h-1 rounded-full bg-line">
            <div className="absolute inset-y-0 left-0 w-[39%] rounded-full bg-accent" />
            <div className="absolute left-[39%] top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper shadow-sm" />
          </div>
        </div>
        <span
          className={cn(
            "grid h-9 place-items-center rounded-lg border px-6 text-sm font-medium transition-colors duration-300",
            phase >= 1 ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink",
          )}
        >
          Search
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {panel(
          "Kurly",
          won ? "lost" : "idle",
          <motion.p
            {...row(0)}
            className="grid flex-1 place-items-center px-3 py-6 text-xs text-ink-muted"
          >
            No results
          </motion.p>,
        )}
        {panel(
          "Web crawling",
          won ? "lost" : "idle",
          <ul>
            {CRAWLED.map((item, i) => (
              <motion.li
                key={item.title}
                {...row(i)}
                className="flex items-center gap-2.5 border-b border-line/60 px-2 py-1 last:border-b-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
                <img
                  src={`${DEMO}/crawl-${i + 1}.webp`}
                  alt=""
                  className="h-9 w-7 shrink-0 rounded-sm object-cover"
                />
                <span className="line-clamp-2 text-[11px] leading-snug text-ink">{item.title}</span>
              </motion.li>
            ))}
          </ul>,
        )}
        {panel(
          "Structured data",
          won ? "won" : "idle",
          <ul>
            {STRUCTURED.map((title, i) => (
              <motion.li
                key={title}
                {...row(i)}
                className="flex items-center gap-2.5 border-b border-line/60 px-2 py-1 last:border-b-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
                <img
                  src={`${DEMO}/structured-${i + 1}.webp`}
                  alt=""
                  className="h-9 w-7 shrink-0 rounded-sm object-cover"
                />
                <span className="line-clamp-2 text-[11px] leading-snug text-ink">{title}</span>
              </motion.li>
            ))}
          </ul>,
        )}
      </div>
    </GradioWindow>
  );
}

// Three calls, in the order they were made: how to prove it fast, which
// model, which data.
const PICKS = [
  {
    name: "AI Search SaaS",
    question: "Prove it first, build later",
    body: (
      <>
        First we had to prove that fixing No-Result searches was worth it, fast. So instead of
        building our own, we added <B>an AI Search SaaS</B> on top of the existing search.
      </>
    ),
    Visual: AddSaas,
  },
  {
    name: "AI Model",
    question: "Use what Kurly’s data already sits on",
    body: (
      <>
        Kurly’s product data already lived in <B>BigQuery on Google Cloud</B>. So we chose Google
        Cloud’s <B>Vertex AI Search</B>, which plugs straight into that data and matches by meaning,
        not exact spelling.
      </>
    ),
    Visual: VertexStack,
  },
  {
    name: "Data Source",
    question: "Crawl the website, or feed it clean data?",
    body: (
      <>
        To compare result quality across{" "}
        <B>Kurly’s search engine, web crawling, and structured data</B>, I quickly built a demo
        dashboard with <B>Gradio</B>. <B>Structured product data</B> gave far more stable results.
      </>
    ),
    Visual: DataSourceShowdown,
  },
];

function PickBeat({ index, animate }: { index: number; animate: boolean }) {
  const { question, body, Visual } = PICKS[index];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Subhead>{question}</Subhead>
        <Body className="max-w-[40rem]">{body}</Body>
      </div>
      <Visual animate={animate} />
    </div>
  );
}

function PocHeader() {
  return (
    <SectionHeader
      label="07 POC APPROACH"
      headline="Teaching Search to Understand, Not Just Match"
    />
  );
}

export function PocApproach() {
  return (
    <Chapter id="poc" label="07 PoC Approach" className="border-t border-line">
      <StickyScene
        steps={PICKS.length}
        vh={100}
        label="Three choices: AI Search SaaS, AI model, data source"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-16 py-10")}>
            <PocHeader />
            {PICKS.map((pick, i) => (
              <PickBeat key={pick.name} index={i} animate={false} />
            ))}
          </div>
        )}
      >
        {({ step }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-8 md:gap-10")}>
            <PocHeader />
            <div className="grid w-full gap-10 md:grid-cols-[13rem_1fr] md:gap-14">
              <ol aria-label="Three choices" className="flex flex-col gap-1 self-start pt-1">
                {PICKS.map((pick, i) => (
                  <li
                    key={pick.name}
                    aria-current={i === step ? "step" : undefined}
                    className={cn(
                      "flex items-baseline gap-3 border-l-2 py-2 pl-4 transition-colors duration-500",
                      i === step ? "border-accent text-ink" : "border-line text-ink-muted/60",
                    )}
                  >
                    <span className="text-xs font-semibold">{i + 1}</span>
                    <span className="font-display text-base font-medium">{pick.name}</span>
                  </li>
                ))}
              </ol>
              {/* Every beat stacked invisibly sizes the box, so nothing jumps. */}
              <div className="grid">
                {PICKS.map((pick, i) => (
                  <div key={pick.name} aria-hidden className="invisible col-start-1 row-start-1">
                    <PickBeat index={i} animate={false} />
                  </div>
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    className="col-start-1 row-start-1"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <PickBeat index={step} animate />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </StickyScene>

      <TryItStage />
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}
