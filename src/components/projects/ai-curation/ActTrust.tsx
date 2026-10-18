"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDown, ChevronDown, Megaphone } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useStill } from "../story/motion";
import {
  B,
  Body,
  Chapter,
  CountUp,
  DataNote,
  Fold,
  GradioWindow,
  Kicker,
  PhoneFrame,
  SectionHeader,
  SubHeading,
  TermList,
  wrap,
  type Num,
} from "../story/ui";
import { CATEGORIES, COPILOT_RESULTS, MATCHA, PRODUCTS, YEAR_END, type Category } from "./data";
import { CampaignScreen, ProductImage, ProgressBeat } from "./ui";

// Act 4, Earn trust: 08 Internal Copilot · 09 Internal Evaluation ·
// 10 A/B Test, the climax (spec §5.9–5.11). Inside first, then experts,
// then customers.

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/* ------------------------------------------------------------------ */
/* 08 Internal Copilot: CopilotDemo                                    */
/* ------------------------------------------------------------------ */

const ROW_S = 0.14;
// Bigger scope finds more; stricter validation keeps fewer. Staged, not the
// real ranking: the list is fixed and only its length reacts.
const resultCount = (scope: number, strict: number) =>
  Math.max(
    3,
    Math.min(COPILOT_RESULTS.length, Math.round(scope / 10) + 1 - Math.floor(strict / 7)),
  );

function Slider({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-ink">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        <span className="rounded border border-line bg-paper px-1.5 py-px tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-[11px] text-ink-muted">{hint}</span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("w-full accent-accent", focusRing)}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: (id: string) => React.ReactNode }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-ink">
        {label}
      </label>
      {children(id)}
    </div>
  );
}

const input =
  "h-9 w-full rounded-lg border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-muted/60";

function CopilotDemo() {
  const still = useStill();
  const [scope, setScope] = useState(80);
  const [strict, setStrict] = useState(10);
  const [keywords, setKeywords] = useState("");
  const [cats, setCats] = useState<Category[]>([...CATEGORIES]);
  const [run, setRun] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  // It runs once by itself the first time it's on screen; Submit runs it again.
  if (inView && run === 0) setRun(1);
  useEffect(() => {
    if (run === 0) return;
    if (still) {
      const t = setTimeout(() => setRevealed(Infinity), 0);
      return () => clearTimeout(t);
    }
    const timers = [setTimeout(() => setRevealed(0), 0)];
    timers.push(
      ...Array.from({ length: COPILOT_RESULTS.length + 1 }, (_, i) =>
        setTimeout(
          () => setRevealed(i === COPILOT_RESULTS.length ? Infinity : i + 1),
          400 + i * ROW_S * 1000,
        ),
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [run, still]);

  const words = keywords
    .split(/[,\s]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  const results = COPILOT_RESULTS.filter(
    (p) =>
      cats.includes(p.category!) &&
      (words.length === 0 || words.some((w) => p.name.toLowerCase().includes(w))),
  ).slice(0, resultCount(scope, strict));
  const shown = results.slice(0, revealed);
  const done = revealed === Infinity;

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <GradioWindow title="Campaign Copilot">
        <div className="grid gap-3 md:grid-cols-[17rem_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRun((n) => n + 1);
            }}
            aria-label="Search"
            className="flex flex-col gap-4 rounded-lg border border-line bg-paper p-3"
          >
            <p className="text-sm font-semibold text-ink">Search</p>
            <Field label="Theme Subject *">
              {(id) => (
                <input id={id} readOnly value={MATCHA.title} className={cn(input, focusRing)} />
              )}
            </Field>
            <Field label="Mandatory Keywords">
              {(id) => (
                <input
                  id={id}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. latte, ice cream"
                  className={cn(input, focusRing)}
                />
              )}
            </Field>
            <Slider
              label="Search Scope"
              hint="How widely to look for products"
              value={scope}
              min={10}
              max={100}
              onChange={setScope}
            />
            <Slider
              label="Validation Strictness"
              hint="How strictly each product must fit the theme"
              value={strict}
              min={1}
              max={20}
              onChange={setStrict}
            />
            <fieldset className="flex flex-col gap-2">
              <legend className="pb-2 text-xs font-medium text-ink">Category</legend>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {CATEGORIES.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs text-ink">
                    <input
                      type="checkbox"
                      checked={cats.includes(c)}
                      onChange={(e) =>
                        setCats((list) =>
                          e.target.checked ? [...list, c] : list.filter((x) => x !== c),
                        )
                      }
                      className={cn("size-3.5 accent-accent", focusRing)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              className={cn(
                "grid h-9 place-items-center rounded-lg bg-ink text-sm font-medium text-paper transition-opacity hover:opacity-85",
                focusRing,
              )}
            >
              Submit
            </button>
          </form>

          <div className="flex min-w-0 flex-col rounded-lg border border-line bg-paper">
            <p className="border-b border-line px-3 py-2 text-sm font-semibold text-ink">Result</p>
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-ink-muted">
                <tr className="border-b border-line">
                  <th scope="col" className="w-14 px-3 py-1.5 font-medium">
                    <span className="sr-only">Photo</span>
                  </th>
                  <th scope="col" className="py-1.5 font-medium">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-1.5 text-right font-medium">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {shown.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={still ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="border-b border-line/60 last:border-b-0"
                    >
                      <td className="px-3 py-1.5">
                        <ProductImage product={p} className="size-9 text-[10px]" />
                      </td>
                      <td className="py-1.5 pr-2 leading-snug text-ink">{p.name}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-ink">{p.price}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {run > 0 && done && results.length === 0 && (
              <p className="px-3 py-6 text-center text-xs text-ink-muted">No products match.</p>
            )}
            <p aria-live="polite" className="mt-auto px-3 py-2 text-[11px] text-ink-muted">
              {done
                ? `${results.length} products found for “${MATCHA.title}”.`
                : run > 0
                  ? "Curating…"
                  : ""}
            </p>
          </div>
        </div>
      </GradioWindow>
      <DataNote />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 08: PipelineDots                                                    */
/* ------------------------------------------------------------------ */

const PIPELINE = [
  "Theme input",
  "Refine the request",
  "Generate 10 candidate products and keywords",
  "Expand to similar products",
  "Rank",
  "Filter",
  "Final product list",
];
const LOOP_NODE = 2;
const NODE_W = 124;
const NODE_GAP = 26;
const NODE_H = 66;
const MID_Y = 60;
const nodeX = (i: number) => 8 + i * (NODE_W + NODE_GAP);
const nodeCx = (i: number) => nodeX(i) + NODE_W / 2;
const VIEW_W = nodeX(PIPELINE.length - 1) + NODE_W + 8;
// The repeating stretch: a loop under “Generate…”, the dot goes round it.
const LOOP_RX = 44;
const LOOP_RY = 22;
const LOOP_CY = MID_Y + NODE_H / 2 + LOOP_RY + 4;
const ROUNDS = 3;

// Splits a label into lines of at most ~18 characters.
function lines(label: string) {
  return label.split(" ").reduce<string[]>((out, word) => {
    const last = out[out.length - 1];
    if (last && (last + " " + word).length <= 18) out[out.length - 1] = `${last} ${word}`;
    else out.push(word);
    return out;
  }, []);
}

function dotPath() {
  const xs: number[] = [];
  const ys: number[] = [];
  PIPELINE.forEach((_, i) => {
    xs.push(nodeCx(i));
    ys.push(MID_Y);
    if (i === LOOP_NODE) {
      for (let r = 0; r < ROUNDS; r++) {
        for (let k = 1; k <= 8; k++) {
          const a = -Math.PI / 2 + (k / 8) * Math.PI * 2;
          xs.push(nodeCx(i) + LOOP_RX * Math.cos(a));
          ys.push(LOOP_CY + LOOP_RY * Math.sin(a));
        }
      }
      xs.push(nodeCx(i));
      ys.push(MID_Y);
    }
  });
  return { xs, ys };
}

function PipelineDots() {
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const { xs, ys } = dotPath();
  return (
    <figure ref={ref} className="flex flex-col gap-4">
      <svg
        viewBox={`0 0 ${VIEW_W} ${LOOP_CY + LOOP_RY + 16}`}
        role="img"
        aria-label="The curation algorithm: theme input, refine the request, generate 10 candidate products and keywords (repeated k times), expand to similar products, rank, filter, final product list."
        className="hidden w-full md:block"
      >
        <defs>
          <marker
            id="pipe-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M1 1 9 5 1 9" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1.5" />
          </marker>
        </defs>
        {PIPELINE.slice(0, -1).map((_, i) => (
          <line
            key={i}
            x1={nodeX(i) + NODE_W + 2}
            x2={nodeX(i + 1) - 3}
            y1={MID_Y}
            y2={MID_Y}
            stroke="var(--color-ink-muted)"
            strokeWidth={1}
            markerEnd="url(#pipe-arrow)"
          />
        ))}
        <ellipse
          cx={nodeCx(LOOP_NODE)}
          cy={LOOP_CY}
          rx={LOOP_RX}
          ry={LOOP_RY}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.4}
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <text
          x={nodeCx(LOOP_NODE) + LOOP_RX + 8}
          y={LOOP_CY + 4}
          fontSize={12}
          fill="var(--color-accent)"
          fontWeight={600}
        >
          × k
        </text>
        {PIPELINE.map((label, i) => {
          const ls = lines(label);
          const end = i === PIPELINE.length - 1;
          return (
            <g key={label}>
              <rect
                x={nodeX(i)}
                y={MID_Y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={12}
                fill={end ? "var(--color-accent)" : "var(--color-paper)"}
                stroke={
                  end ? "none" : i === LOOP_NODE ? "var(--color-accent)" : "var(--color-line)"
                }
              />
              <text
                x={nodeCx(i)}
                y={MID_Y - ((ls.length - 1) * 15) / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12.5}
                fontWeight={500}
                fill={end ? "var(--color-paper)" : "var(--color-ink)"}
              >
                {ls.map((l, k) => (
                  <tspan key={k} x={nodeCx(i)} dy={k === 0 ? 0 : 15}>
                    {l}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        {!still && inView && (
          <motion.circle
            r={6}
            fill="var(--color-accent)"
            stroke="var(--color-paper)"
            strokeWidth={2}
            initial={{ cx: xs[0], cy: ys[0] }}
            animate={{ cx: xs, cy: ys }}
            transition={{
              duration: xs.length * 0.16,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1.2,
            }}
          />
        )}
      </svg>
      {/* Phones: the same steps, top to bottom. */}
      <ol className="flex flex-col items-start gap-1 text-sm text-ink md:hidden">
        {PIPELINE.map((label, i) => (
          <li key={label} className="flex flex-col items-start gap-1">
            <span
              className={cn(
                "rounded-lg border px-3 py-1.5",
                i === LOOP_NODE ? "border-accent" : "border-line",
                i === PIPELINE.length - 1 && "border-accent bg-accent text-paper",
              )}
            >
              {label}
              {i === LOOP_NODE && <span className="ml-2 text-xs text-accent">× k</span>}
            </span>
            {i < PIPELINE.length - 1 && (
              <ArrowDown aria-hidden className="ml-3 size-3.5 text-ink-muted" />
            )}
          </li>
        ))}
      </ol>
      <figcaption className="text-xs text-ink-muted">
        Curation algorithm built by our ML engineer.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 08: six updates                                                     */
/* ------------------------------------------------------------------ */

function UpdateTimeline() {
  return (
    <ol
      aria-label="Six Copilot updates, v1 to v6"
      className="relative flex items-end justify-between gap-2"
    >
      <span aria-hidden className="absolute inset-x-4 bottom-[13px] h-px bg-line" />
      {Array.from({ length: 6 }, (_, i) => (
        <Reveal
          as="li"
          key={i}
          delay={i * 0.1}
          className="relative flex flex-col items-center gap-2"
        >
          <span className="grid size-9 place-items-center rounded-lg border border-line bg-paper shadow-sm">
            <Megaphone aria-hidden className="size-4 text-ink-muted" strokeWidth={1.75} />
          </span>
          <span className="text-xs font-semibold text-ink">v{i + 1}</span>
          <span className="size-[9px] rounded-full bg-accent ring-4 ring-paper" />
        </Reveal>
      ))}
      <Reveal as="li" delay={0.7} className="relative flex flex-col items-center pb-0.5">
        <ArrowDown aria-hidden className="size-5 text-accent" />
        <span className="sr-only">On to the internal evaluation</span>
      </Reveal>
    </ol>
  );
}

const GLANCE = [
  "8 weeks before the A/B test",
  "6 updates from MD feedback",
  "Open to every employee",
  "Tracked searches, speed, results, and satisfaction",
];

export function Copilot() {
  return (
    <Chapter
      id="copilot"
      label="08 Internal Copilot"
      className="border-t border-line py-24 md:py-32"
    >
      <div className={cn(wrap, "flex flex-col gap-14")}>
        <div className="flex flex-col gap-6">
          <SectionHeader
            label="08 INTERNAL COPILOT"
            headline="Give the AI to MDs Before Giving It the Homepage"
          />
          <Body className="max-w-[48rem]">
            Instead of putting AI straight on the homepage, I first gave it to the MDs as an
            internal tool, <B>Campaign Copilot</B>. It did two jobs at once: it saved them time
            right away, and every search they ran and rated{" "}
            <B>showed us how to make the AI better</B>.
          </Body>
          <ul aria-label="At a glance" className="flex flex-wrap gap-2">
            {GLANCE.map((g) => (
              <li key={g} className="rounded-full bg-paper-2 px-3 py-1.5 text-sm text-ink">
                {g}
              </li>
            ))}
          </ul>
        </div>

        <Reveal>
          <CopilotDemo />
        </Reveal>

        <div className="flex flex-col gap-6">
          <SubHeading>How it works</SubHeading>
          <PipelineDots />
        </div>

        <div className="grid items-end gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div className="flex flex-col gap-4">
            <SubHeading>6 updates, one guide at a time</SubHeading>
            <Body>
              Every update came with an announcement and a short guide I wrote, so MDs always knew
              what changed and how to use it.
            </Body>
          </div>
          <UpdateTimeline />
        </div>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 09 Internal Evaluation                                              */
/* ------------------------------------------------------------------ */

const { matcha, snack, yearend } = PRODUCTS;
// Shown as List 1 and List 2; which model made which stays hidden until the
// reader picks. Model B drifts off theme.
const BLIND = [
  {
    list: "List 1",
    model: "Model B",
    who: "Google Cloud Vertex agent",
    products: [matcha[0], snack[4], matcha[5], yearend[3], matcha[4]],
  },
  {
    list: "List 2",
    model: "Model A",
    who: "our own algorithm built on GPT-4o",
    products: [matcha[2], matcha[3], matcha[0], snack[3], matcha[1]],
  },
];

function BlindPick() {
  const [pick, setPick] = useState<number | null>(null);
  const revealed = pick !== null;
  return (
    <div className="flex flex-col gap-5">
      <p className="font-display text-lg font-medium text-ink md:text-xl">
        Which list would you publish?
      </p>
      <div role="group" aria-label="Pick a list" className="grid gap-4 md:grid-cols-2">
        {BLIND.map((b, i) => {
          const picked = pick === i;
          const winner = b.model === "Model A";
          return (
            <button
              key={b.list}
              type="button"
              aria-pressed={picked}
              onClick={() => setPick(i)}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border bg-paper p-4 text-left transition-[border-color,box-shadow] duration-300",
                picked ? "border-accent ring-2 ring-accent" : "border-line hover:border-accent",
                focusRing,
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{b.list}</span>
                <span className="relative h-6">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={revealed ? "model" : "pick"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                        !revealed && "bg-paper-2 text-ink-muted",
                        revealed && winner && "bg-accent text-paper",
                        revealed && !winner && "bg-paper-2 text-ink",
                      )}
                    >
                      {revealed ? b.model : "Publish this one"}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
              <span className="text-xs text-ink-muted">
                {MATCHA.emoji} {MATCHA.title}
              </span>
              <span className="grid grid-cols-5 gap-1.5">
                {b.products.map((p) => (
                  <ProductImage key={p.id} product={p} />
                ))}
              </span>
              <span
                className={cn(
                  "text-xs text-ink-muted transition-opacity duration-300",
                  revealed ? "opacity-100" : "opacity-0",
                )}
              >
                {b.model}: {b.who}
                {picked && " · Your pick"}
              </span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="min-h-6 font-display text-lg font-medium text-ink">
        {revealed && "Kurly employees picked Model A 68% of the time."}
      </p>
      <DataNote>Illustrative data.</DataNote>
    </div>
  );
}

// 21 campaigns, each the mean of three experts' 1–10 scores (so in thirds).
// Only the average is real; the spread is staged to land on it.
const SCORES = [
  ...Array(1).fill(22),
  ...Array(2).fill(24),
  ...Array(2).fill(25),
  ...Array(3).fill(26),
  ...Array(4).fill(27),
  ...Array(5).fill(28),
  ...Array(2).fill(29),
  ...Array(2).fill(30),
].map((thirds: number) => thirds / 3);
const MEAN = 8.95;
const AXIS_W = 640;
const AXIS_X0 = 20;
const unitX = (v: number) => AXIS_X0 + ((v - 1) / 9) * (AXIS_W - AXIS_X0 * 2);
const DOT_R = 7;
const AXIS_Y = 120;

function ScoreDots() {
  const still = useStill();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const on = still || inView;
  // Dots with the same score stack up.
  const seen = new Map<number, number>();
  const dots = SCORES.map((v, i) => {
    const level = seen.get(v) ?? 0;
    seen.set(v, level + 1);
    return { v, i, x: unitX(v), y: AXIS_Y - DOT_R - 2 - level * (DOT_R * 2 + 2) };
  });
  return (
    <figure className="flex flex-col gap-3">
      <svg
        ref={ref}
        viewBox={`0 0 ${AXIS_W} ${AXIS_Y + 34}`}
        role="img"
        aria-label="21 test campaigns scored from 1 to 10 by an expert panel, most between 8 and 10. The average is 8.95."
        className="w-full max-w-[640px]"
      >
        <line
          x1={AXIS_X0}
          x2={AXIS_W - AXIS_X0}
          y1={AXIS_Y}
          y2={AXIS_Y}
          stroke="var(--color-line)"
        />
        {Array.from({ length: 10 }, (_, k) => (
          <g key={k}>
            <line
              x1={unitX(k + 1)}
              x2={unitX(k + 1)}
              y1={AXIS_Y}
              y2={AXIS_Y + 5}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={unitX(k + 1)}
              y={AXIS_Y + 20}
              textAnchor="middle"
              fontSize={12}
              fill="var(--color-ink-muted)"
            >
              {k + 1}
            </text>
          </g>
        ))}
        {dots.map((d) => (
          <motion.circle
            key={d.i}
            cx={d.x}
            r={DOT_R}
            fill="var(--color-accent)"
            fillOpacity={0.85}
            initial={still ? false : { cy: -20, opacity: 0 }}
            animate={on ? { cy: d.y, opacity: 1 } : { cy: -20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: still ? 0 : d.i * 0.06,
            }}
          />
        ))}
        <motion.g
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.5, delay: still ? 0 : 1.6 }}
        >
          <line
            x1={unitX(MEAN)}
            x2={unitX(MEAN)}
            y1={14}
            y2={AXIS_Y}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
          <text
            x={unitX(MEAN) - 8}
            y={12}
            textAnchor="end"
            fontSize={14}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            8.95
          </text>
        </motion.g>
      </svg>
      <figcaption>
        <DataNote>Illustrative distribution. Average is actual.</DataNote>
      </figcaption>
    </figure>
  );
}

const TECH: { metric: string; first: string; final: Num; from?: number }[] = [
  {
    metric: "Search speed",
    first: "~1 minute",
    final: { value: 15, prefix: "~", suffix: " seconds" },
    from: 60,
  },
  { metric: "Minimum conditions met", first: "Often missed", final: { value: 87, suffix: "%+" } },
  {
    metric: "Cost per query",
    first: "~$0.50",
    final: { value: 0.07, decimals: 2, prefix: "under $" },
    from: 0.5,
  },
];

function TechTable() {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-line text-sm text-ink-muted">
          <th scope="col" className="pb-3 font-medium">
            Metric
          </th>
          <th scope="col" className="pb-3 font-medium">
            First version
          </th>
          <th scope="col" className="pb-3 font-medium">
            Final version
          </th>
        </tr>
      </thead>
      <tbody>
        {TECH.map((t) => (
          <tr key={t.metric} className="border-b border-line last:border-b-0">
            <th scope="row" className="py-4 pr-4 text-base font-normal text-ink md:text-lg">
              {t.metric}
            </th>
            <td className="py-4 pr-4 text-base text-ink-muted md:text-lg">{t.first}</td>
            <td className="py-4 font-display text-xl font-medium tracking-tight text-accent md:text-[1.75rem]">
              <CountUp to={t.final} from={t.from} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Evaluation() {
  return (
    <Chapter
      id="evaluation"
      label="09 Internal Evaluation"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-20")}>
        <div className="flex flex-col gap-6">
          <SectionHeader
            label="09 INTERNAL EVALUATION"
            headline="Earning the MDs’ Trust, One Test at a Time"
          />
          <Body className="max-w-[48rem]">
            Before asking customers to see AI picks, I needed proof that the people who know
            curation best trusted them. I ran three checks.
          </Body>
        </div>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <SubHeading>1 · Which AI? A blind test</SubHeading>
            <Body className="max-w-[48rem]">
              Two models curated the same 10 themes: <B>Model A</B>, our own algorithm built on
              GPT-4o, and <B>Model B</B>, a Google Cloud Vertex agent. People from C-level,
              marketing, MD, and data teams picked the better list without knowing which was which.{" "}
              <B>Model A won 68% of 56 votes</B>, and <B>77%</B> on themes that needed more
              reasoning.
            </Body>
          </div>
          <BlindPick />
        </section>

        <section className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-14">
          <div className="flex flex-col gap-4">
            <SubHeading>2 · Would experts ship it?</SubHeading>
            <Body>
              An expert panel, a PM, the MD lead, and the marketing lead, scored{" "}
              <B>21 test campaigns</B> from 1 to 10. The average was <B>8.95 / 10</B>, with high
              satisfaction across most themes.
            </Body>
          </div>
          <ScoreDots />
        </section>

        <section className="flex flex-col gap-8">
          <SubHeading>3 · Faster, more accurate, cheaper</SubHeading>
          <TechTable />
        </section>
      </div>

      <Kicker tight>The experts trusted it. Now the question was whether customers would. ↓</Kicker>
      <ProgressBeat
        from={0}
        lit={2}
        current={2}
        label="The copilot passed internal evaluation; the A/B test is next"
      />
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 10 A/B Test                                                         */
/* ------------------------------------------------------------------ */

const SETUP = [
  ["Objective", "Validate AI curation quality before the final integration decision"],
  [
    "Hypothesis",
    <>
      AI-curated campaigns perform <B>as well as</B> MD-curated ones
    </>,
  ],
  ["Method", "Same homepage slot, same theme; only who picked the products changed"],
  ["Target", "24,455 users (AI) vs 24,278 users (MD)"],
  ["Conditions", "20 slots, at least 30 products per campaign, a new theme every day"],
  ["Duration", "2 weeks"],
] as const;

// Same theme, two pickers. Campaign 2 is the AI's.
const TELL = [
  { label: "Campaign 1", ai: false, products: [0, 2, 3, 5, 1, 4].map((i) => yearend[i]) },
  { label: "Campaign 2", ai: true, products: [2, 4, 0, 1, 5, 3].map((i) => yearend[i]) },
];

function CanYouTell() {
  const [pick, setPick] = useState<number | null>(null);
  const revealed = pick !== null;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center">
        {TELL.map((c, i) => (
          <div key={c.label} className="flex flex-col items-center gap-4">
            <p className="flex h-7 items-center gap-2">
              <span className="font-display text-base font-medium uppercase tracking-[0.2em] text-ink-muted">
                {c.label}
              </span>
              {revealed && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    c.ai ? "bg-accent text-paper" : "bg-paper-2 text-ink",
                  )}
                >
                  {c.ai ? "Picked by AI" : "Picked by an MD"}
                </motion.span>
              )}
            </p>
            <PhoneFrame>
              <CampaignScreen theme={YEAR_END} products={c.products} />
            </PhoneFrame>
            <button
              type="button"
              aria-pressed={pick === i}
              aria-label={`${c.label}: this one was picked by AI`}
              onClick={() => setPick(i)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                pick === i
                  ? "border-accent bg-accent text-paper"
                  : "border-line text-ink hover:border-accent",
                focusRing,
              )}
            >
              This one was picked by AI
            </button>
          </div>
        ))}
      </div>
      <p
        aria-live="polite"
        className="min-h-8 font-display text-xl font-medium text-ink md:text-2xl"
      >
        {revealed && "Customers couldn’t tell either."}
      </p>
      <DataNote>Illustrative example.</DataNote>
    </div>
  );
}

const TRUST = [
  ["A/A test", "No difference between groups before the test"],
  ["Sample ratio", "Balanced (p = 0.423)"],
  ["Power", "0.8 at α = 0.05, MDE 0.004"],
] as const;

function TrustChip({ name, text }: { name: string; text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <li className="flex flex-col items-start gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-full bg-paper-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line",
          focusRing,
        )}
      >
        {name}
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-1 text-sm text-ink-muted"
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </li>
  );
}

type Kpi = { name: string; ai: number; p: string };
const PRIMARY: Kpi[] = [
  { name: "Campaign click user ratio", ai: 101.7, p: "0.076" },
  { name: "Campaign add-to-cart user ratio", ai: 100.0, p: "0.982" },
  { name: "Campaign purchase user ratio", ai: 99.5, p: "0.937" },
];
const SECONDARY: Kpi[] = [
  { name: "Add-to-cart value per user", ai: 101.1, p: "0.839" },
  { name: "Purchase value per user", ai: 102.2, p: "0.773" },
  { name: "Product clicks per user", ai: 100.5, p: "0.779" },
  { name: "Add-to-cart clicks per user", ai: 96.5, p: "0.174" },
  { name: "Purchases per user", ai: 104.5, p: "0.571" },
];
// Bars are drawn from zero, so near-equal values look near-equal.
const BAR_MAX = 110;

function ParityBars({
  kpis,
  grown,
  small = false,
}: {
  kpis: Kpi[];
  grown: boolean;
  small?: boolean;
}) {
  const still = useStill();
  const h = small ? 120 : 200;
  const on = still || grown;
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-10",
        small ? "grid-cols-2 md:grid-cols-5" : "md:grid-cols-3",
      )}
    >
      {kpis.map((k, i) => (
        <li
          key={k.name}
          className="flex flex-col items-center gap-3 text-center"
          aria-label={`${k.name}: MD-curated 100, AI-curated ${k.ai.toFixed(1)}, p = ${k.p}`}
        >
          <div aria-hidden className="flex items-end gap-3" style={{ height: h + 28 }}>
            {[
              { v: 100, ai: false },
              { v: k.ai, ai: true },
            ].map((bar) => (
              <div key={String(bar.ai)} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "font-display font-medium tabular-nums tracking-tight",
                    small ? "text-sm" : "text-lg md:text-xl",
                    bar.ai ? "text-accent" : "text-ink-muted",
                  )}
                >
                  <CountUp to={{ value: bar.v, decimals: 1 }} play={on} />
                </span>
                <motion.span
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0 }}
                  transition={
                    still
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 90,
                          damping: 18,
                          delay: i * 0.12 + (bar.ai ? 0.15 : 0),
                        }
                  }
                  className={cn(
                    "block origin-bottom rounded-t-md",
                    small ? "w-7" : "w-12 md:w-14",
                    bar.ai ? "bg-accent" : "bg-ink-muted/30",
                  )}
                  style={{ height: (bar.v / BAR_MAX) * h }}
                />
              </div>
            ))}
          </div>
          <p className={cn("font-medium text-ink", small ? "text-xs" : "text-sm md:text-base")}>
            {k.name}
          </p>
          <p className="text-xs text-ink-muted">p = {k.p}</p>
        </li>
      ))}
    </ul>
  );
}

function BarLegend() {
  return (
    <p className="flex justify-center gap-6 text-sm text-ink-muted">
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-ink-muted/30" />
        MD-curated
      </span>
      <span className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-accent" />
        AI-curated
      </span>
    </p>
  );
}

function SecondaryKpis() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  return (
    <div ref={ref}>
      <ParityBars kpis={SECONDARY} grown={inView} small />
    </div>
  );
}

export function AbTest() {
  return (
    <Chapter id="ab-test" label="10 A/B Test" className="border-t border-line pt-24 md:pt-32">
      <div className={cn(wrap, "flex flex-col gap-10")}>
        <SectionHeader label="10 A/B TEST" headline="Could Customers Tell the Difference?" />
        <Body className="max-w-[48rem]">
          To decide whether AI could run the homepage, I <B>designed a 2-week A/B test</B> around
          one question: would customers notice who did the picking?
        </Body>
        <TermList rows={SETUP} />
      </div>

      <div className={cn(wrap, "pt-20")}>
        <CanYouTell />
      </div>

      <div className={cn(wrap, "flex flex-col gap-4 pt-16")}>
        <p className="text-sm font-medium text-ink-muted">Trust the test</p>
        <ul className="flex flex-wrap items-start gap-3">
          {TRUST.map(([name, text]) => (
            <TrustChip key={name} name={name} text={text} />
          ))}
        </ul>
      </div>

      <StickyScene
        steps={3}
        vh={70}
        label="A/B test results: AI and MD side by side"
        className="mt-12 md:mt-0"
      >
        {({ step, live }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-10")}>
            <SectionHeader
              as="h3"
              headline="Hypothesis Validated: No Significant Difference"
              className="items-center text-center"
            />
            <BarLegend />
            <ParityBars kpis={PRIMARY} grown={!live || step >= 1} />
            <p className="text-center text-xs text-ink-muted">
              All metrics are indexed to the MD-curated group (= 100).
            </p>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-16 pt-4")}>
        <Fold label="Secondary KPIs" center>
          <SecondaryKpis />
        </Fold>

        <div className="flex flex-col gap-5">
          <SubHeading>What AI did differently</SubHeading>
          <ul className="flex flex-col gap-3 text-base leading-relaxed text-ink-muted md:text-lg">
            <li className="flex gap-3">
              <span aria-hidden className="text-accent">
                •
              </span>
              <span>
                AI campaigns used <B>fewer products but more diverse categories</B>, with similar
                theme relevance.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-accent">
                •
              </span>
              <span>
                <B>Relevance in the top slots</B> drove clicks the most.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Kicker tight>
        A tie was the win. I took the results to the CEO and got approval to let AI run the slots.
      </Kicker>
      <ProgressBeat
        from={2}
        lit={4}
        current={4}
        label="The A/B test passed and the CEO approved; integration is next"
      />
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}
