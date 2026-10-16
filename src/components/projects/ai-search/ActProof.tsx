"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useStill } from "./motion";
import { AssetMedia, B, Body, Chapter, ProcessStrip, SectionHeader, wrap } from "./ui";

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
            ? "“milk”: legacy search finds results, so the shopper sees the legacy results. AI is never called."
            : "“cabage”: legacy search finds nothing. After the multi-section and blocklist checks, Vertex AI Search is called; it returns results, so the shopper sees the AI Search Result view."}
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

const AB_ROWS = [
  ["No-Result searches", "Click-Through Rate", "3.83%", "26.50%"],
  ["No-Result searches", "No-Result Rate", "99.98%", "2.93%"],
  ["All searches", "Click-Through Rate", "58.60%", "60.14%"],
  ["All searches", "No-Result Rate", "6.80%", "0.22%"],
];

function BigCtr({ size = "lg" }: { size?: "lg" | "sm" }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
        No-Result searches · Click-Through Rate
      </p>
      <p
        className={cn(
          "font-display font-medium tracking-tight leading-none",
          size === "lg" ? "text-[2.75rem] md:text-[6rem]" : "text-[2.25rem] md:text-[3.25rem]",
        )}
      >
        <span className="text-ink-muted/80">3.83%</span>
        <span aria-hidden className="mx-3 text-ink-muted/40">
          →
        </span>
        <span className="sr-only"> to </span>
        <span className="text-accent">26.50%</span>
      </p>
    </div>
  );
}

function AbTable() {
  return (
    <table className="w-full max-w-[760px] border-collapse text-left text-[12px] md:text-sm">
      <thead>
        <tr className="border-b border-ink/20 text-ink-muted">
          {["Scope", "Metric", "Control", "AI Search"].map((h, i) => (
            <th key={h} scope="col" className={cn("py-3 pr-2 font-medium", i > 1 && "text-right")}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {AB_ROWS.map(([scope, metric, control, ai], i) => (
          <tr key={i} className={cn("border-b border-line", i === 0 && "bg-accent/[0.05]")}>
            <td className="py-3 pr-2 text-ink-muted">{scope}</td>
            <td className="py-3 pr-2 text-ink">{metric}</td>
            <td className="py-3 pr-2 text-right tabular-nums text-ink-muted">{control}</td>
            <td className="py-3 text-right font-semibold tabular-nums text-accent">{ai}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AbTest() {
  // The gate reads "current" for a beat once in view, then turns done.
  const endRef = useRef<HTMLDivElement>(null);
  const seen = useInView(endRef, { once: true, amount: 1 });
  const [decided, setDecided] = useState(false);
  useEffect(() => {
    if (!seen) return;
    const timer = setTimeout(() => setDecided(true), 900);
    return () => clearTimeout(timer);
  }, [seen]);

  return (
    <Chapter id="ab-test" label="09 A/B Test" className="border-t border-line pt-24 md:pt-32">
      <div className={cn(wrap, "flex flex-col gap-8")}>
        <SectionHeader
          label="09 A/B TEST"
          headline="Would Shoppers Actually Click on AI Results?"
        />
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Hypothesis
          </p>
          <p className="font-display max-w-[36ch] text-[1.3rem] font-medium leading-snug tracking-tight text-ink md:text-[1.6rem]">
            AI search will turn No-Result moments into meaningful results and lift search
            conversion.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {["All customers (3.5M MAU)", "50 / 50 split", "2 weeks"].map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink"
            >
              {chip}
            </li>
          ))}
        </ul>
        <Reveal className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-line bg-paper-2">
          <AssetMedia id="ab-split-screen" />
        </Reveal>
      </div>

      <StickyScene
        steps={2}
        label="A/B test results"
        still={() => (
          <div className={cn(wrap, "flex flex-col items-center gap-12 py-10")}>
            <BigCtr size="sm" />
            <AbTable />
          </div>
        )}
      >
        {({ step }) => (
          <div className={cn(wrap, "flex justify-center")}>
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 ? (
                <motion.div
                  key="zoom"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                  <BigCtr />
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, scale: 1.25 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: EASE_OUT }}
                  className="flex w-full flex-col items-center gap-10"
                >
                  <BigCtr size="sm" />
                  <AbTable />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-6 pb-28 pt-10 md:pb-36")}>
        <SectionHeader as="h3" headline="Hypothesis Validated, Across Every KPI" />
        <Body>
          Shoppers who used to hit an empty page clicked <B>about 7x more often</B>. The CEO
          approved full integration.
        </Body>
        <div ref={endRef} className="mt-4">
          <ProcessStrip at="CEO Decision" complete={decided} />
        </div>
      </div>
    </Chapter>
  );
}
