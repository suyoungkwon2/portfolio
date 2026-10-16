"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, StickyScene, useStill } from "./motion";
import { SCREENS } from "./ActSetup";
import { B, Body, Chapter, CountUp, PhoneFrame, SectionHeader, wrap } from "./ui";

// Act 4, Proof: 08 Search Flow · 09 A/B Test (spec §5.8–5.9).

/* ------------------------------------------------------------------ */
/* 08 FlowDiagram                                                      */
/* ------------------------------------------------------------------ */

const MAIN_X = 170;
const SIDE_X = 445;
const ROW = 84;
const TOP = 40;
const y = (row: number) => TOP + row * ROW;

type Node = { id: string; label: string; x: number; row: number; diamond?: boolean };

// Exactly the spec's nodes: main path in one column, N3 and N7 to the right.
const NODES: Node[] = [
  { id: "N1", label: "Search request", x: MAIN_X, row: 0 },
  { id: "N2", label: "Legacy search (exact match)", x: MAIN_X, row: 1 },
  { id: "D1", label: "Results found?", x: MAIN_X, row: 2, diamond: true },
  { id: "N3", label: "Show legacy results", x: SIDE_X, row: 2 },
  { id: "N4", label: "Multi-section result check", x: MAIN_X, row: 3 },
  { id: "N5", label: "Blocklisted query check", x: MAIN_X, row: 4 },
  { id: "N6", label: "Call Vertex AI Search API", x: MAIN_X, row: 5 },
  { id: "D2", label: "AI results ≥ 1?", x: MAIN_X, row: 6, diamond: true },
  { id: "N7", label: "Legacy No-Result view", x: SIDE_X, row: 6 },
  { id: "N8", label: "AI Search Result view", x: MAIN_X, row: 7 },
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

const EDGES: { from: string; to: string; label?: string }[] = [
  { from: "N1", to: "N2" },
  { from: "N2", to: "D1" },
  { from: "D1", to: "N3", label: "yes" },
  { from: "D1", to: "N4", label: "no / “No Result”" },
  { from: "N4", to: "N5" },
  { from: "N5", to: "N6" },
  { from: "N6", to: "D2" },
  { from: "D2", to: "N7", label: "no" },
  { from: "D2", to: "N8", label: "yes" },
];

const ROUTES = {
  milk: ["N1", "N2", "D1", "N3"],
  cabage: ["N1", "N2", "D1", "N4", "N5", "N6", "D2", "N8"],
} as const;
type Route = keyof typeof ROUTES;

const W_MAIN = 270;
const W_SIDE = 215;
const H = 46;

// The new AI path (from the multi-section check down) is drawn in the
// gradient of the app's "Kurly Only" chip; the old engine keeps the ink.
const AI_FROM = "#b072ff";
const AI_TO = "#5be1ff";
const AI_TEXT = "#7a3fd0";
const isNew = (n: Node) => n.row >= 3;

// Room on the left for the Old engine / New AI search rail.
const RAIL_X = 0;
const VIEW_X = -40;
const VIEW_W = SIDE_X + W_SIDE / 2 + 10 - VIEW_X;
const VIEW_H = y(7) + TOP;
const SPANS = [
  { label: "Old engine", top: y(0) - H / 2, bottom: y(2) + 32, ai: false },
  { label: "New AI search", top: y(3) - H / 2, bottom: y(7) + H / 2, ai: true },
];

function FlowDefs() {
  return (
    <defs>
      <linearGradient id="ai-line" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor={AI_FROM} />
        <stop offset="1" stopColor={AI_TO} />
      </linearGradient>
      <linearGradient id="ai-tint" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#f3e9ff" />
        <stop offset="1" stopColor="#e6fbff" />
      </linearGradient>
      <linearGradient
        id="ai-rail"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1={SPANS[1].top}
        x2="0"
        y2={SPANS[1].bottom}
      >
        <stop offset="0" stopColor={AI_FROM} />
        <stop offset="1" stopColor={AI_TO} />
      </linearGradient>
    </defs>
  );
}

// A vertical line down the left per stage, its name running along it.
function StageRail() {
  return (
    <g aria-hidden>
      {SPANS.map((s) => {
        const mid = (s.top + s.bottom) / 2;
        return (
          <g key={s.label}>
            <line
              x1={RAIL_X}
              x2={RAIL_X}
              y1={s.top}
              y2={s.bottom}
              stroke={s.ai ? "url(#ai-rail)" : "var(--color-accent)"}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={RAIL_X - 14}
              y={mid}
              transform={`rotate(-90 ${RAIL_X - 14} ${mid})`}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={13}
              fontWeight={600}
              letterSpacing="0.12em"
              fill={s.ai ? AI_TEXT : "var(--color-accent)"}
            >
              {s.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function edgeOnRoute(route: readonly string[], from: string, to: string) {
  const i = route.indexOf(from);
  return i >= 0 && route[i + 1] === to;
}

function FlowNode({ node, on }: { node: Node; on: boolean }) {
  const cy = y(node.row);
  const ai = isNew(node);
  // The AI result view is the one box that stands out, like the chip.
  const end = node.id === "N8";
  const stroke = ai ? "url(#ai-line)" : on ? "var(--color-accent)" : "var(--color-line)";
  const fill = end
    ? on
      ? "url(#ai-tint)"
      : "var(--color-paper)"
    : on
      ? ai
        ? "#f7f2ff"
        : "#f3f3f8"
      : "var(--color-paper)";
  const text = end ? AI_TEXT : on ? "var(--color-ink)" : "var(--color-ink-muted)";
  const strokeOpacity = ai && !on ? 0.45 : 1;
  const strokeWidth = end && on ? 2 : 1;
  const w = node.x === SIDE_X ? W_SIDE : W_MAIN;
  return (
    <g>
      {node.diamond ? (
        <polygon
          points={`${node.x},${cy - 32} ${node.x + 105},${cy} ${node.x},${cy + 32} ${node.x - 105},${cy}`}
          fill={fill}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke,fill] duration-300"
        />
      ) : (
        <rect
          x={node.x - w / 2}
          y={cy - H / 2}
          width={w}
          height={H}
          rx={10}
          fill={fill}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke,fill] duration-300"
        />
      )}
      <text
        x={node.x}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize={node.diamond ? 15 : 16}
        fontWeight={on || end ? 600 : 500}
      >
        {node.label}
      </text>
    </g>
  );
}

function FlowEdge({ from, to, label, on }: { from: Node; to: Node; label?: string; on: boolean }) {
  const horizontal = from.row === to.row;
  const x1 = horizontal ? from.x + (from.diamond ? 105 : W_MAIN / 2) : from.x;
  const y1 = horizontal ? y(from.row) : y(from.row) + (from.diamond ? 32 : H / 2);
  const x2 = horizontal ? to.x - W_SIDE / 2 : to.x;
  const y2 = horizontal ? y(to.row) : y(to.row) - (to.diamond ? 32 : H / 2);
  const color = on ? "var(--color-accent)" : "#cfcfcf";
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2 - (horizontal ? 6 : 0)}
        y2={y2 - (horizontal ? 0 : 6)}
        stroke={color}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        className="transition-[stroke] duration-300"
      />
      <polygon
        points={
          horizontal
            ? `${x2},${y2} ${x2 - 8},${y2 - 5} ${x2 - 8},${y2 + 5}`
            : `${x2},${y2} ${x2 - 5},${y2 - 8} ${x2 + 5},${y2 - 8}`
        }
        fill={color}
        className="transition-[fill] duration-300"
      />
      {label && (
        <text
          x={horizontal ? (x1 + x2) / 2 : x1 + 10}
          y={horizontal ? y1 - 10 : (y1 + y2) / 2}
          textAnchor={horizontal ? "middle" : "start"}
          dominantBaseline="central"
          fontSize={13}
          fill={on ? "var(--color-accent)" : "var(--color-ink-muted)"}
          fontWeight={on ? 600 : 400}
        >
          {label}
        </text>
      )}
    </g>
  );
}

// The query travelling its route as a dot, one segment at a time.
function Traveller({ route, label }: { route: readonly string[]; label: string }) {
  // Stops at the edge of the last box, so it doesn't sit on its label.
  const sideEnd = byId[route[route.length - 2]].row === byId[route[route.length - 1]].row;
  const pts = route.map((id, i) => {
    const n = byId[id];
    if (i < route.length - 1) return { x: n.x, y: y(n.row) };
    return sideEnd
      ? { x: n.x - W_SIDE / 2 - 12, y: y(n.row) }
      : { x: n.x, y: y(n.row) - H / 2 - 12 };
  });
  const lengths = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = lengths.reduce((a, b) => a + b, 0);
  const times = lengths.reduce((t, l) => [...t, t[t.length - 1] + l / total], [0]);
  const transition = { duration: route.length * 0.45, times, ease: "easeInOut" as const };
  return (
    <motion.g
      initial={{ x: pts[0].x, y: pts[0].y }}
      animate={{ x: pts.map((p) => p.x), y: pts.map((p) => p.y) }}
      transition={transition}
    >
      <circle
        r={9}
        fill="var(--color-ink)"
        stroke="var(--color-paper)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      <text
        x={-16}
        y={sideEnd ? 26 : -10}
        textAnchor="end"
        fontSize={14}
        fontWeight={600}
        fill="var(--color-ink)"
        className="font-mono"
      >
        {label}
      </text>
    </motion.g>
  );
}

function FlowDiagram() {
  const [route, setRoute] = useState<Route>("cabage");
  const [run, setRun] = useState(0);
  const still = useStill();
  const path = ROUTES[route];

  return (
    <div className="flex w-full max-w-[620px] flex-col gap-6 justify-self-center">
      {/* Centred over the Search request box. */}
      <div
        role="group"
        aria-label="Follow a search through the system"
        className="flex justify-center gap-2"
        style={{
          marginLeft: `${((MAIN_X - W_MAIN / 2 - VIEW_X) / VIEW_W) * 100}%`,
          width: `${(W_MAIN / VIEW_W) * 100}%`,
        }}
      >
        {(Object.keys(ROUTES) as Route[]).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={route === r}
            onClick={() => {
              setRoute(r);
              setRun((n) => n + 1);
            }}
            className={cn(
              "rounded-full border px-5 py-2 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              route === r
                ? "border-accent bg-accent text-paper"
                : "border-line text-ink hover:border-accent",
            )}
          >
            {r}
          </button>
        ))}
      </div>
      <svg
        viewBox={`${VIEW_X} 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-labelledby="flow-desc"
      >
        <desc id="flow-desc">
          {route === "milk"
            ? "“milk”: legacy search finds results, so the user sees the legacy results. AI is never called."
            : "“cabage”: legacy search finds nothing. After the multi-section and blocklist checks, Vertex AI Search is called; it returns results, so the user sees the AI Search Result view."}
        </desc>
        <FlowDefs />
        <StageRail />
        {EDGES.map((e) => (
          <FlowEdge
            key={`${e.from}-${e.to}`}
            from={byId[e.from]}
            to={byId[e.to]}
            label={e.label}
            on={edgeOnRoute(path, e.from, e.to)}
          />
        ))}
        {NODES.map((n) => (
          <FlowNode key={n.id} node={n} on={path.includes(n.id as never)} />
        ))}
        {!still && <Traveller key={`${route}-${run}`} route={path} label={route} />}
      </svg>
    </div>
  );
}

export function Architecture() {
  return (
    <Chapter
      id="search-flow"
      label="08 Search Flow"
      className="border-t border-line py-24 md:py-32"
    >
      <div className={cn(wrap, "grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-start")}>
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <SectionHeader
            label="08 SEARCH FLOW"
            headline="AI Search Only Steps In When Search Fails"
          />
          <Body>
            I designed the flow to <B>keep the search engine team’s work to a minimum</B>. Every
            search still goes to the old engine first, and only an empty result calls AI Search.
          </Body>
        </div>
        <FlowDiagram />
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 09 A/B Test                                                         */
/* ------------------------------------------------------------------ */

const AB_OVERVIEW = [
  ["Objective", "Improve Kurly’s search performance with AI Search"],
  [
    "Hypothesis",
    "Google AI Search will return meaningful results for “No Result” searches, lifting search conversion (CVR) and customer satisfaction",
  ],
  ["Target", "All customers (3.5M MAU), 50% Control : 50% Treatment"],
  ["Duration", "2 weeks"],
] as const;

// Two scopes, the same two metrics in each. Control first, then Treatment.
type AbMetric = { metric: string; control: number; treatment: number };
const AB_GROUPS: { scope: string; note: string; rows: AbMetric[] }[] = [
  {
    scope: "No-Result searches",
    note: "Searches the old engine found nothing for",
    rows: [
      { metric: "Click-Through Rate", control: 3.83, treatment: 26.5 },
      { metric: "No-Result Rate", control: 99.98, treatment: 2.93 },
    ],
  },
  {
    scope: "All searches",
    note: "Every search on Kurly",
    rows: [
      { metric: "Click-Through Rate", control: 58.6, treatment: 60.14 },
      { metric: "No-Result Rate", control: 6.8, treatment: 0.22 },
    ],
  },
];
const AB_ROW_COUNT = AB_GROUPS.reduce((n, g) => n + g.rows.length, 0);
const pct = (v: number) => `${v.toFixed(2)}%`;

// One arm of the test: the screen its users saw for the same search.
const ARMS = {
  control: { name: "Control", note: "Legacy search", src: `${SCREENS}/before.webp` },
  treatment: { name: "Treatment", note: "AI Search", src: `${SCREENS}/after.webp` },
} as const;

function ArmLabel({ arm }: { arm: keyof typeof ARMS }) {
  const { name, note } = ARMS[arm];
  return (
    <p className="flex flex-col items-center text-center">
      <span
        className={cn(
          "font-display text-base font-medium uppercase tracking-[0.2em]",
          arm === "control" ? "text-ink-muted" : "text-accent",
        )}
      >
        {name}
      </span>
      <span className="text-sm text-ink-muted">{note}</span>
    </p>
  );
}

function ArmScreen({ arm }: { arm: keyof typeof ARMS }) {
  const control = arm === "control";
  return (
    <div className="flex justify-center">
      <PhoneFrame muted={control}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
        <img
          src={ARMS[arm].src}
          alt={
            control
              ? "Control: searching “Cabage” shows “No products found.”"
              : "Treatment: the same search shows cabbage results from AI Search."
          }
          className="w-full"
        />
      </PhoneFrame>
    </div>
  );
}

function ArmPhone({ arm }: { arm: keyof typeof ARMS }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <ArmLabel arm={arm} />
      <ArmScreen arm={arm} />
    </div>
  );
}

// One metric: Control's value sits on the Control side, Treatment's on the
// Treatment side. Control lands first; Treatment then slides over from it,
// counting from Control's value to its own.
function ResultRow({ row, on }: { row: AbMetric; on: boolean }) {
  const still = useStill();
  const [go, setGo] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setGo(on), on ? 450 : 0);
    return () => clearTimeout(timer);
  }, [on]);
  const played = (on && go) || still;
  return (
    <motion.div
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className="flex flex-col gap-1.5"
    >
      <p className="text-center text-sm text-ink-muted">{row.metric}</p>
      <p
        className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-baseline gap-3 font-display font-medium leading-none tracking-tight tabular-nums",
          "text-[1.75rem] md:text-[2.25rem]",
        )}
      >
        <span className="text-left text-ink-muted/80">{pct(row.control)}</span>
        <motion.span
          aria-hidden
          initial={false}
          animate={played ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="origin-left text-[0.6em] text-ink-muted/50"
        >
          →
        </motion.span>
        <span className="sr-only"> to </span>
        <motion.span
          initial={false}
          animate={played ? { opacity: 1, x: 0 } : { opacity: 0, x: -48 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="text-right text-accent"
        >
          <CountUp
            from={row.control}
            to={{ value: row.treatment, decimals: 2, suffix: "%" }}
            play={played}
          />
        </motion.span>
      </p>
    </motion.div>
  );
}

// The two scopes as labelled groups; rows come in one per scroll step.
function ResultRows({ shown }: { shown: number }) {
  let index = 0;
  return (
    <div aria-label="A/B test results" className="flex w-full flex-col gap-10">
      {AB_GROUPS.map((g) => {
        const first = index;
        const rows = g.rows.map((row) => ({ row, i: index++ }));
        return (
          <motion.section
            key={g.scope}
            initial={false}
            animate={shown > first ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            {/* ---- Scope ---- : the group's name sits in the middle of its rule. */}
            <header className="flex flex-col gap-0.5">
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px flex-1 bg-line" />
                <h4 className="font-display text-lg font-medium text-ink md:text-xl">{g.scope}</h4>
                <span aria-hidden className="h-px flex-1 bg-line" />
              </div>
              <p className="text-center text-sm text-ink-muted">{g.note}</p>
            </header>
            {rows.map(({ row, i }) => (
              <ResultRow key={row.metric} row={row} on={i < shown} />
            ))}
          </motion.section>
        );
      })}
    </div>
  );
}

const ResultsTitle = () => (
  <h3 className="text-center font-display font-medium tracking-tight text-2xl text-ink md:text-[2rem]">
    Test Results
  </h3>
);

// Arrives on the two phones alone, then one result per scroll, plus a spare
// step so a quick scroll can't skip the last.
const RESULT_STEPS = AB_ROW_COUNT + 2;

export function AbTest() {
  return (
    <Chapter id="ab-test" label="09 A/B Test" className="border-t border-line pt-24 md:pt-32">
      <div className={cn(wrap, "flex flex-col gap-8")}>
        <SectionHeader label="09 A/B TEST" headline="Would Users Actually Click on AI Results?" />
        <Body className="max-w-none">
          To prove the system’s value, I <B>designed an A/B test around the KPIs</B> we set in
          Define.
        </Body>
        <dl className="flex flex-col">
          {AB_OVERVIEW.map(([term, value]) => (
            <div
              key={term}
              className="grid gap-1 border-b border-line py-4 first:pt-0 last:border-b-0 md:grid-cols-[14rem_1fr] md:gap-8"
            >
              <dt className="text-base text-ink-muted md:text-lg">{term}</dt>
              <dd className="text-base leading-relaxed text-ink md:text-lg">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <StickyScene
        steps={RESULT_STEPS}
        label="A/B test results: Control and Treatment"
        className="mt-16 md:mt-0"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-10")}>
            <ResultsTitle />
            <ResultRows shown={AB_ROW_COUNT} />
            <div className="flex flex-wrap justify-center gap-8">
              <ArmPhone arm="control" />
              <ArmPhone arm="treatment" />
            </div>
          </div>
        )}
      >
        {({ step }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-8")}>
            <ResultsTitle />
            {/* Labels on one row, phones and results on the next, so the
                results start level with the top of the phones. */}
            <div className="grid w-full grid-cols-[272px_1fr_272px] gap-x-10 gap-y-3">
              <ArmLabel arm="control" />
              <div />
              <ArmLabel arm="treatment" />
              <ArmScreen arm="control" />
              <div className="self-start">
                <ResultRows shown={Math.min(step, AB_ROW_COUNT)} />
              </div>
              <ArmScreen arm="treatment" />
            </div>
          </div>
        )}
      </StickyScene>

      <div
        className={cn(wrap, "flex flex-col items-center gap-6 pb-28 pt-10 text-center md:pb-36")}
      >
        <SectionHeader
          as="h3"
          headline="Hypothesis Validated, Across Every KPI"
          className="items-center"
        />
        {/* One sentence per line. */}
        <Body className="max-w-[60rem]">
          <span className="block">
            I shared the test’s progress and results with every stakeholder, every day.
          </span>
          <span className="block">
            With that result, I went to the CEO and got approval to{" "}
            <B>integrate AI Search into the full system</B>.
          </span>
        </Body>
      </div>
    </Chapter>
  );
}
