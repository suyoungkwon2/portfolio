"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ChevronDown, Download, Megaphone, MessageSquare } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, scrollToStep, useStill } from "../story/motion";
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
  SubSubHeading,
  TermList,
  wrap,
  type Num,
} from "../story/ui";
import {
  COPILOT_RESULTS,
  MATCHA,
  PRODUCTS,
  SITE_CATEGORIES,
  SITES,
  YEAR_END,
  type CopilotRow,
  type Site,
} from "./data";
import { CampaignScreen, ProductImage, ProgressBeat } from "./ui";

// Act 4, Earn trust: 08 Internal Copilot · 09 Internal Evaluation ·
// 10 A/B Test, the climax (spec §5.9–5.11). Inside first, then experts,
// then customers.

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/* ------------------------------------------------------------------ */
/* 08 Internal Copilot: CopilotDemo                                    */
/* ------------------------------------------------------------------ */

const ROW_S = 0.06;
// Bigger scope finds more; stricter validation keeps fewer. Staged, not the
// real ranking: the list is fixed and only its length reacts.
const resultCount = (scope: number, strict: number) =>
  Math.max(
    3,
    Math.min(COPILOT_RESULTS.length, Math.round((scope * 3) / 8) + 1 - Math.floor(strict / 7)),
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

// The result table, after the Copilot's real columns (user manual). One row
// per content; the price is what customers pay today.
type Row = CopilotRow;
const won = (n: number) => `₩${n.toLocaleString("en-US")}`;
const priceOf = (r: Row) => Number(r.price.replace(/\D/g, ""));
const COLUMNS: { label: string; value: (r: Row) => string; num?: boolean }[] = [
  { label: "Price", value: (r) => r.price, num: true },
  { label: "List price", value: (r) => won(r.listPrice), num: true },
  { label: "Discount", value: (r) => won(r.listPrice - priceOf(r)), num: true },
  {
    label: "Discount rate",
    value: (r) => ((r.listPrice - priceOf(r)) / r.listPrice).toFixed(3),
    num: true,
  },
  { label: "Weekly sales", value: (r) => r.sales.toLocaleString("en-US"), num: true },
  { label: "Deal GMV", value: (r) => won(r.sales * priceOf(r)), num: true },
  {
    label: "Content GMV",
    value: (r) => won(Math.round((r.sales * priceOf(r) * r.contentDeals) / 100) * 100),
    num: true,
  },
  { label: "Stock", value: (r) => r.stock.toLocaleString("en-US"), num: true },
  { label: "In campaign", value: (r) => r.campaign },
  { label: "Supplier", value: (r) => r.supplier },
  { label: "Release date", value: (r) => r.released },
  { label: "Master code", value: (r) => r.master },
  { label: "Deal code", value: (r) => r.deal },
  { label: "Content code", value: (r) => r.content },
];

const csvCell = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

// The search and its results as a CSV. The BOM keeps Excel on Windows from
// garbling it (Beta 1.1's fix).
function downloadCsv(rows: Row[], search: [string, string][]) {
  const lines = [
    ...search.map(([k, v]) => [k, v]),
    [],
    ["Product", ...COLUMNS.map((c) => c.label)],
    ...rows.map((r) => [r.name, ...COLUMNS.map((c) => c.value(r))]),
  ].map((cells) => cells.map(csvCell).join(","));
  const url = URL.createObjectURL(
    new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "campaign-copilot-matcha.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const ROWS = COPILOT_RESULTS;

// 08's walkthrough: one step per scroll, each spotlighting part of the app.
type Spot = "theme" | "settings" | "search" | "results" | "csv" | "rate";
const GUIDE: { spots: Spot[]; title: string; body: string }[] = [
  { spots: ["theme"], title: "Type a theme", body: "The theme subject is all it needs." },
  {
    spots: ["settings"],
    title: "Tune the search",
    body: "Optional: must-have keywords, how widely to look, how strictly to judge, which categories.",
  },
  { spots: ["search", "results"], title: "Search", body: "Products come in, top to bottom." },
  {
    spots: ["results"],
    title: "Scroll for the details",
    body: "Price, discount, sales, stock, and codes for every product.",
  },
  { spots: ["csv"], title: "Download the CSV", body: "Ready to register in Kurly’s systems." },
  {
    spots: ["rate"],
    title: "Rate the results",
    body: "Every score showed us where the AI fell short.",
  },
];

function GuideSteps({ step, goTo }: { step: number | null; goTo: (i: number) => void }) {
  return (
    <ol className="flex flex-col gap-4">
      {GUIDE.map((g, i) => (
        <li key={g.title}>
          <button
            type="button"
            aria-current={step === i ? "step" : undefined}
            disabled={step === null}
            onClick={() => goTo(i)}
            className={cn(
              "flex gap-3 rounded-md text-left transition-opacity duration-300 hover:opacity-100",
              step !== null && step !== i && "opacity-35",
              focusRing,
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold",
                step === i ? "bg-accent text-paper" : "bg-paper-2 text-ink",
              )}
            >
              {i + 1}
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-ink">{g.title}</span>
              <span className="text-xs leading-relaxed text-ink-muted">{g.body}</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function CopilotDemo({ guide }: { guide?: { step: number; progress: MotionValue<number> } }) {
  const still = useStill();
  const [name, setName] = useState("Suyoung Kwon");
  const [position, setPosition] = useState("PM");
  const [scope, setScope] = useState(80);
  const [strict, setStrict] = useState(10);
  const [keywords, setKeywords] = useState("");
  const [site, setSite] = useState<Site>("Market");
  const [cats, setCats] = useState<Record<Site, string[]>>({ Market: [], Beauty: [], Now: [] });
  const [run, setRun] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState<number | null>(null);
  const rateId = useId();
  const [formNote, setFormNote] = useState(false);
  const table = useRef<HTMLDivElement>(null);
  const idle = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const onScreen = useInView(ref, { amount: 0.5 });

  // Guided, step 1 types the theme in by itself once the app is on screen,
  // again each time the walkthrough comes back to it.
  const typing = guide?.step === 0 && !still;
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    let i = 0;
    let timer = setTimeout(() => setTyped(0), 0);
    if (!typing || !onScreen) return () => clearTimeout(timer);
    const tick = () => {
      i += 1;
      setTyped(i);
      if (i < MATCHA.title.length) timer = setTimeout(tick, 70);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [typing, onScreen]);
  const theme = typing ? MATCHA.title.slice(0, typed) : MATCHA.title;

  // Guided: page scroll runs down the results (step 3), then across their
  // columns (step 4).
  useMotionValueEvent(guide?.progress ?? idle, "change", (v) => {
    if (!guide) return;
    const at = v * GUIDE.length;
    const step = Math.min(GUIDE.length - 1, Math.floor(at));
    const local = Math.min(1, Math.max(0, at - step));
    const ease = (from: number) => Math.min(1, Math.max(0, (local - from) / (0.9 - from)));
    const el = table.current;
    if (!el) return;
    el.scrollTop =
      step < 2 ? 0 : (step === 2 ? ease(0.35) : 1) * (el.scrollHeight - el.clientHeight);
    el.scrollLeft = step < 3 ? 0 : (step === 3 ? ease(0.1) : 1) * (el.scrollWidth - el.clientWidth);
  });
  // Guided, it runs when the walkthrough reaches Search and the results stay
  // empty before it, unless Search is pressed there; otherwise once by itself
  // the first time it's on screen. Search runs it again.
  const [pressed, setPressed] = useState(false);
  const [lastStep, setLastStep] = useState(guide?.step);
  if (guide?.step !== lastStep) {
    setLastStep(guide?.step);
    setPressed(false);
  }
  const waiting = guide !== undefined && guide.step < 2 && !pressed;
  if (waiting && run !== 0) {
    setRun(0);
    setRevealed(0);
  }
  if (run === 0 && (guide ? !waiting : inView)) setRun(1);
  const focus = guide ? GUIDE[guide.step].spots : null;
  // `fill` draws the ring inside the box it fills, edge to edge.
  const spot = (k: Spot | "other", fill = false) =>
    cn(
      "transition-opacity duration-300",
      focus &&
        (focus.includes(k as Spot)
          ? cn(
              "rounded-lg ring-2 ring-accent",
              fill ? "ring-inset" : "ring-offset-4 ring-offset-paper",
            )
          : "opacity-25"),
    );
  useEffect(() => {
    if (run === 0) return;
    const timers = [setTimeout(() => setRated(null), 0)];
    if (still) {
      timers.push(setTimeout(() => setRevealed(Infinity), 0));
      return () => timers.forEach(clearTimeout);
    }
    timers.push(setTimeout(() => setRevealed(0), 0));
    timers.push(
      ...Array.from({ length: ROWS.length + 1 }, (_, i) =>
        setTimeout(() => setRevealed(i === ROWS.length ? Infinity : i + 1), 400 + i * ROW_S * 1000),
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [run, still]);

  const words = keywords
    .split(/[,\s]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  // No sub-category picked means the whole site.
  const picked = cats[site];
  const results = ROWS.filter(
    (r) =>
      site !== "Beauty" &&
      (site !== "Now" || r.now) &&
      (picked.length === 0 || picked.includes(r.category)) &&
      (words.length === 0 ||
        words.some((w) => `${r.name} ${r.supplier}`.toLowerCase().includes(w))),
  ).slice(0, resultCount(scope, strict));
  const shown = waiting ? [] : results.slice(0, revealed);
  const done = !waiting && revealed === Infinity;
  const canRate = run > 0 && done && rated === null;

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <GradioWindow title="🎁 Campaign Copilot">
        <div className="grid gap-3 md:grid-cols-[17rem_minmax(0,1fr)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPressed(true);
              setRun((n) => n + 1);
            }}
            aria-label="Search"
            className="flex flex-col gap-4 rounded-lg border border-line bg-paper p-3"
          >
            <p
              className={cn(
                "text-sm font-semibold text-ink transition-opacity duration-300",
                focus && !focus.includes("theme") && !focus.includes("settings") && "opacity-25",
              )}
            >
              Search
            </p>
            <div className={cn("flex flex-col gap-4", spot("other"))}>
              <Field label="Name *">
                {(id) => (
                  <input
                    id={id}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(input, focusRing)}
                  />
                )}
              </Field>
              <Field label="Position">
                {(id) => (
                  <input
                    id={id}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. MD, Marketer"
                    className={cn(input, focusRing)}
                  />
                )}
              </Field>
            </div>
            {/* Steps 1 and 2 light up the form's full width. */}
            <div className={cn("-mx-3 -my-2 px-3 py-2", spot("theme", true))}>
              <Field label="Theme Subject *">
                {(id) => <input id={id} readOnly value={theme} className={cn(input, focusRing)} />}
              </Field>
            </div>
            <div
              className={cn("-mx-3 -my-2 flex flex-col gap-4 px-3 py-2", spot("settings", true))}
            >
              <Field label="Mandatory Keywords">
                {(id) => (
                  <input
                    id={id}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. latte, Osulloc"
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
                <legend className="pb-1 text-xs font-medium text-ink">Category</legend>
                <span className="text-[11px] text-ink-muted">
                  Pick none to search all of {site === "Now" ? "Kurly Now" : site}.
                </span>
                <div
                  role="radiogroup"
                  aria-label="Site"
                  className="flex rounded-lg bg-paper-2 p-0.5"
                >
                  {SITES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={site === s}
                      onClick={() => setSite(s)}
                      className={cn(
                        "flex-1 rounded-md py-1 text-xs font-medium transition-colors",
                        site === s
                          ? "bg-paper text-ink shadow-sm"
                          : "text-ink-muted hover:text-ink",
                        focusRing,
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {/* Kurly's full list, scrolling inside a short box. */}
                <div className="flex max-h-[8.5rem] flex-wrap gap-1.5 overflow-y-auto pt-1">
                  {SITE_CATEGORIES[site].map((c) => (
                    <label
                      key={c}
                      className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-ink"
                    >
                      <input
                        type="checkbox"
                        checked={picked.includes(c)}
                        onChange={(e) =>
                          setCats((all) => ({
                            ...all,
                            [site]: e.target.checked
                              ? [...all[site], c]
                              : all[site].filter((x) => x !== c),
                          }))
                        }
                        className={cn("size-3.5 accent-accent", focusRing)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
            <button
              type="submit"
              className={cn(
                "grid h-9 place-items-center rounded-lg bg-ink text-sm font-medium text-paper hover:opacity-85",
                focusRing,
                spot("search"),
              )}
            >
              Search
            </button>
          </form>

          {/* On wide screens the results take the search form's height and scroll inside it. */}
          <div className="min-w-0 md:relative">
            <div className="flex flex-col gap-3 md:absolute md:inset-0">
              {/* Rating and export, between the app's header and its results. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line bg-paper px-3 py-2">
                {/* Steps 5 and 6 light up the bar's full height. */}
                <div
                  className={cn(
                    "-my-2 -ml-3 flex flex-wrap items-center gap-x-3 gap-y-2 py-2 pl-3 pr-2",
                    spot("rate", true),
                  )}
                >
                  <label htmlFor={rateId} className="text-xs font-medium text-ink">
                    Satisfaction
                  </label>
                  <input
                    id={rateId}
                    type="range"
                    min={1}
                    max={10}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    aria-describedby={`${rateId}-hint`}
                    className={cn("w-24 accent-accent", focusRing)}
                  />
                  <span className="rounded border border-line bg-paper px-1.5 py-px text-xs tabular-nums text-ink">
                    {rating}
                  </span>
                  <span id={`${rateId}-hint`} className="sr-only">
                    1 very unsatisfied, 5 neutral, 10 very satisfied
                  </span>
                  <button
                    type="button"
                    disabled={!canRate}
                    aria-label="Submit satisfaction"
                    onClick={() => setRated(rating)}
                    className={cn(
                      "grid h-7 place-items-center rounded-md bg-ink px-3 text-xs font-medium text-paper transition-opacity hover:opacity-85 disabled:opacity-35",
                      focusRing,
                    )}
                  >
                    Submit
                  </button>
                  <p aria-live="polite" className="text-[11px] text-ink-muted">
                    {rated !== null &&
                      `Thanks, ${name || "you"}. Rated ${rated}/10 for this search.`}
                  </p>
                  {/* The real one took anything else through a Google Form. */}
                  <span className="relative">
                    <button
                      type="button"
                      aria-expanded={formNote}
                      onClick={() => setFormNote((v) => !v)}
                      onBlur={() => setFormNote(false)}
                      className={cn(
                        "flex items-center gap-1 text-xs text-ink-muted underline decoration-line underline-offset-2 hover:text-ink",
                        focusRing,
                      )}
                    >
                      <MessageSquare aria-hidden className="size-3.5" />
                      Feedback form
                    </button>
                    {formNote && (
                      <span
                        role="status"
                        className="absolute left-0 top-full z-30 mt-1.5 whitespace-nowrap rounded-md border border-line bg-paper px-2 py-1 text-[11px] text-ink-muted shadow-sm"
                      >
                        In the real tool, this opened the team’s Google Form.
                      </span>
                    )}
                  </span>
                </div>
                <span className={cn("-my-2 -mr-3 ml-auto py-2 pl-2 pr-3", spot("csv", true))}>
                  <button
                    type="button"
                    disabled={!done || results.length === 0}
                    onClick={() =>
                      downloadCsv(results, [
                        ["Name", name],
                        ["Position", position],
                        ["Theme Subject", MATCHA.title],
                        ["Mandatory Keywords", keywords],
                        ["Search Scope", String(scope)],
                        ["Validation Strictness", String(strict)],
                        ["Category", picked.length ? `${site}: ${picked.join(", ")}` : site],
                      ])
                    }
                    className={cn(
                      "flex h-7 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-medium text-ink hover:bg-paper-2 disabled:opacity-35",
                      focusRing,
                    )}
                  >
                    <Download aria-hidden className="size-3.5" />
                    CSV Download
                  </button>
                </span>
              </div>
              <div
                className={cn(
                  "flex min-h-0 flex-1 flex-col rounded-lg border border-line bg-paper",
                  spot("results"),
                )}
              >
                <p className="border-b border-line px-3 py-2 text-sm font-semibold text-ink">
                  Result
                </p>
                {/* Scrolls through every row and column; the header and product stay put. */}
                <div
                  ref={table}
                  tabIndex={0}
                  role="region"
                  aria-label="Result table, scrolls sideways"
                  className={cn("max-h-[28rem] overflow-auto md:max-h-none md:flex-1", focusRing)}
                >
                  <table className="w-max min-w-full text-left text-xs">
                    <thead className="sticky top-0 z-20 bg-paper text-[11px] text-ink-muted">
                      <tr className="border-b border-line">
                        <th
                          scope="col"
                          className="sticky left-0 z-10 w-[15.5rem] bg-paper px-3 py-1.5 font-medium shadow-[inset_-1px_0_0_var(--color-line)]"
                        >
                          Product
                        </th>
                        {COLUMNS.map((c) => (
                          <th
                            key={c.label}
                            scope="col"
                            className={cn(
                              "whitespace-nowrap px-3 py-1.5 font-medium",
                              c.num && "text-right",
                            )}
                          >
                            {c.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {shown.map((r) => (
                          <motion.tr
                            key={r.id}
                            initial={still ? false : { opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                            className="border-b border-line/60 last:border-b-0"
                          >
                            <th
                              scope="row"
                              className="sticky left-0 z-10 bg-paper px-3 py-1.5 font-normal shadow-[inset_-1px_0_0_var(--color-line)]"
                            >
                              <span className="flex w-[14.5rem] items-center gap-2.5">
                                <ProductImage product={r} className="size-9 shrink-0 text-[10px]" />
                                {/* Names linked to the Kurly product page (v2.3). */}
                                <span className="leading-snug text-ink underline decoration-line underline-offset-2">
                                  {r.name}
                                </span>
                              </span>
                            </th>
                            {COLUMNS.map((c) => (
                              <td
                                key={c.label}
                                className={cn(
                                  "whitespace-nowrap px-3 py-1.5 text-ink",
                                  c.num && "text-right tabular-nums",
                                )}
                              >
                                {c.value(r)}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
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
          </div>
        </div>
      </GradioWindow>
      <DataNote>
        A rebuild of the real Copilot. Illustrative data. Internal figures have been changed.
      </DataNote>
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
// Refine, generate, and rank do most of the work.
const KEY_NODES = [1, 2, 4];
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
                  end ? "none" : KEY_NODES.includes(i) ? "var(--color-accent)" : "var(--color-line)"
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
                KEY_NODES.includes(i) ? "border-accent" : "border-line",
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
        A simplified view of the curation algorithm our ML engineer built.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 08: six updates                                                     */
/* ------------------------------------------------------------------ */

// After the first release (Beta 1.0), from the user manual's version history.
const UPDATES = ["1.1", "1.2", "2.0", "2.1", "2.2", "2.3"];

function UpdateTimeline() {
  return (
    <ol
      aria-label="Six Copilot updates, 1.1 to 2.3"
      className="relative flex items-end justify-between gap-2"
    >
      {/* Runs through the dots' centers. */}
      <span aria-hidden className="absolute inset-x-4 bottom-1 h-px bg-line" />
      {UPDATES.map((v, i) => (
        <Reveal
          as="li"
          key={v}
          delay={i * 0.1}
          className="relative flex flex-col items-center gap-2"
        >
          <span className="grid size-9 place-items-center rounded-lg border border-line bg-paper shadow-sm">
            <Megaphone aria-hidden className="size-4 text-ink-muted" strokeWidth={1.75} />
          </span>
          <span className="text-xs font-semibold text-ink">{v}</span>
          <span className="size-[9px] rounded-full bg-accent ring-4 ring-paper" />
        </Reveal>
      ))}
    </ol>
  );
}

// The updates that changed the most, each answering what MDs ran into.
const KEY_UPDATES = [
  {
    v: "1.2",
    title: "CSV ready for the CMS",
    body: "Downloads match the CMS upload format, so a list goes straight in.",
  },
  {
    v: "2.0",
    title: "Scope and strictness sliders",
    body: "MDs choose how widely to look and how strictly to judge.",
  },
  {
    v: "2.1",
    title: "Include and exclude keywords",
    body: "Must-have and must-not words, which also made brand search work.",
  },
];

// Fades in on the updates' second beat; its numbers count up once it's in.
// While it counts, the page holds still so the numbers can land.
const COUNT_MS = 400 + 1100;
const SCROLL_KEYS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];

function Performance({ shown, hold }: { shown: boolean; hold: boolean }) {
  const still = useStill();
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPlay(shown), shown ? 400 : 0);
    return () => clearTimeout(t);
  }, [shown]);
  useEffect(() => {
    if (!shown || !hold || still) return;
    const block = (e: Event) => {
      if (
        e instanceof KeyboardEvent &&
        (!SCROLL_KEYS.includes(e.key) || e.target instanceof HTMLInputElement)
      )
        return;
      e.preventDefault();
    };
    const opts = { passive: false } as const;
    window.addEventListener("wheel", block, opts);
    window.addEventListener("touchmove", block, opts);
    window.addEventListener("keydown", block);
    const release = () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", block);
    };
    const t = setTimeout(release, COUNT_MS);
    return () => {
      clearTimeout(t);
      release();
    };
  }, [shown, hold, still]);
  return (
    <motion.div
      initial={false}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
      className="flex flex-col gap-5"
    >
      <SubSubHeading>Performance</SubSubHeading>
      <p className="text-sm leading-relaxed text-ink-muted">
        Not just features: searches got faster, more accurate, and cheaper too.
      </p>
      <TechTable play={play} />
    </motion.div>
  );
}

// The first release against the last.
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

function TechTable({ play }: { play?: boolean }) {
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
            <th scope="row" className="py-3 pr-4 text-base font-normal text-ink">
              {t.metric}
            </th>
            <td className="whitespace-nowrap py-3 pr-4 text-base text-ink-muted">{t.first}</td>
            <td className="whitespace-nowrap py-3 font-display text-xl font-medium tracking-tight text-accent md:text-2xl">
              <CountUp to={t.final} from={t.from} play={play} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// The timeline comes in, then Features, then (on the next scroll, and never
// before Features) Performance.
function UpdatesScene({ step, live }: { step: number; live: boolean }) {
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [featuresIn, setFeaturesIn] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setFeaturesIn(true), live && !still ? 1100 : 0);
    return () => clearTimeout(t);
  }, [inView, live, still]);
  const wantPerf = featuresIn && (!live || step >= 1);
  const [perfIn, setPerfIn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPerfIn(wantPerf), wantPerf && live && !still ? 600 : 0);
    return () => clearTimeout(t);
  }, [wantPerf, live, still]);
  return (
    <div ref={ref} className={cn(wrap, "flex w-full flex-col gap-12")}>
      <div className="grid items-end gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div className="flex flex-col gap-4">
          <SubHeading>6 updates to make it MD-ready</SubHeading>
          <Body>
            MDs’ ratings, feedback, and follow-up interviews drove every update. I announced
            each one and trained MDs on how to use it.
          </Body>
        </div>
        <UpdateTimeline />
      </div>
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={false}
          animate={featuresIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
          className="flex flex-col gap-5"
        >
          <SubSubHeading>Features</SubSubHeading>
          <p className="text-sm leading-relaxed text-ink-muted">
            New features that made MDs’ work easier and the results more satisfying.
          </p>
          <ul className="flex flex-col gap-5">
            {KEY_UPDATES.map((u) => (
              <li key={u.v} className="flex gap-4">
                <span className="w-7 shrink-0 pt-0.5 text-xs font-semibold text-accent">
                  {u.v}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-base font-medium text-ink">{u.title}</span>
                  <span className="text-sm leading-relaxed text-ink-muted">{u.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
        <Performance shown={perfIn} hold={live} />
      </div>
    </div>
  );
}

const GLANCE = [
  "Open to every employee",
  "6 updates in 8 weeks from MD feedback",
  "Reads product descriptions, not just names",
];

export function Copilot() {
  const stage = useRef<HTMLDivElement>(null);
  const goTo = (i: number) => {
    const scene = stage.current?.firstElementChild;
    if (scene instanceof HTMLElement) scrollToStep(scene, i, GUIDE.length);
  };
  return (
    <Chapter
      id="copilot"
      label="08 Internal Copilot"
      className="border-t border-line py-24 md:py-32"
    >
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader label="08 INTERNAL COPILOT" headline="A Copilot That Cuts Curation Time" />
        <div className="flex max-w-[48rem] flex-col gap-3">
          <Body className="max-w-none">
            I designed and delivered <B>Campaign Copilot</B>, an internal tool that supports how MDs
            plan campaigns. Since only employees would use it, a custom front end wasn’t worth the
            time, so I chose <B>Gradio</B> to ship it fast and clean. It had two goals:
          </Body>
          <ol className="flex flex-col gap-2 text-base leading-relaxed text-ink-muted md:text-lg">
            <li>
              1. <B>Cut the time spent finding and picking products.</B> It reads what a theme is
              after, finds products that fit, and shows what MDs need to choose them in one view.
            </li>
            <li>
              2. <B>Raise curation quality until MDs are satisfied with it.</B> Every search they
              ran and rated showed us where the AI fell short.
            </li>
          </ol>
        </div>
        <ul aria-label="At a glance" className="flex flex-wrap gap-2">
          {GLANCE.map((g) => (
            <li key={g} className="rounded-full bg-paper-2 px-3 py-1.5 text-sm text-ink">
              {g}
            </li>
          ))}
        </ul>
      </div>

      {/* Pins on the Copilot; scrolling on runs down its results, then moves on. */}
      <div ref={stage}>
        <StickyScene steps={GUIDE.length} vh={70} label="Campaign Copilot, step by step">
          {({ step, progress, live }) => (
            <div
              className={cn(
                wrap,
                "grid w-full gap-6 xl:grid-cols-[13rem_minmax(0,1fr)] xl:items-center xl:gap-10",
              )}
            >
              <div className={cn(live && "hidden xl:block")}>
                <GuideSteps step={live ? step : null} goTo={goTo} />
              </div>
              {live && (
                <p aria-live="polite" className="text-sm text-ink xl:hidden">
                  <span className="font-semibold text-accent">{step + 1}.</span>{" "}
                  {GUIDE[step].title}. <span className="text-ink-muted">{GUIDE[step].body}</span>
                </p>
              )}
              {/* A touch smaller, so the whole app fits the pinned screen. */}
              <Reveal className="md:[zoom:0.86]">
                <CopilotDemo guide={live ? { step, progress } : undefined} />
              </Reveal>
            </div>
          )}
        </StickyScene>
      </div>

      {/* How it works and the updates each hold for a scroll. */}
      <StickyScene steps={2} vh={60} label="How the curation algorithm works">
        {() => (
          <div className={cn(wrap, "flex w-full flex-col gap-6")}>
            <div className="flex flex-col gap-4">
              <SubHeading>How it works</SubHeading>
              <div className="flex max-w-[48rem] flex-col gap-3">
                <Body className="max-w-none">
                  From nothing but a short theme subject, the algorithm finds the products that fit.
                  <br />
                  Three steps do most of the work:
                </Body>
                <ol className="flex flex-col gap-1 text-base leading-relaxed text-ink-muted md:text-lg">
                  <li>
                    1. <B>Refining the request</B> into what the theme is after
                  </li>
                  <li>
                    2. <B>Generating candidate products and keywords</B> over several rounds
                  </li>
                  <li>
                    3. <B>Ranking</B> what comes back
                  </li>
                </ol>
              </div>
            </div>
            <PipelineDots />
          </div>
        )}
      </StickyScene>

      {/* Features first; Performance comes in on the next scroll. */}
      <StickyScene steps={3} vh={50} label="Six updates to the Copilot">
        {({ step, live }) => <UpdatesScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 09 Internal Evaluation                                              */
/* ------------------------------------------------------------------ */

const { yearend } = PRODUCTS;

// 09's first check on two of its 10 themes, one plain and one that needs
// reasoning. A is our algorithm (its picks from the test); B stands in for the
// Vertex agent with a few of Kurly's keyword-search results for the same
// phrase, which ignores what a theme leaves out; the two overlap, as they did.
type Pick = { no: number; name: string; breaks?: boolean };
const BLIND: { kind: string; theme: string; ruled?: string; a: Pick[]; b: Pick[] }[] = [
  {
    kind: "Plain theme",
    theme: "A cute home café",
    a: [
      { no: 5116361, name: "[Osulloc] Strawberry Green Tea Cake" },
      { no: 5065874, name: "[Fritz] Seal Cupping Mug" },
      { no: 1000052839, name: "[Coffee Bean] Choco Mousse Cake" },
      { no: 5040751, name: "[Blue Bottle] Mug" },
      { no: 1000093702, name: "[Bread & Co] Earl Grey Cake" },
    ],
    b: [
      { no: 5040751, name: "[Blue Bottle] Mug" },
      { no: 1000490315, name: "[Teavine] Low-Sugar Home Café Syrup" },
      { no: 1000093702, name: "[Bread & Co] Earl Grey Cake" },
      { no: 1000370038, name: "[Home Moment] Café Mugs" },
      { no: 5116361, name: "[Osulloc] Strawberry Green Tea Cake" },
    ],
  },
  {
    kind: "Needs reasoning",
    theme: "Beer snacks, but no chicken",
    ruled: "chicken",
    a: [
      { no: 5031956, name: "Spicy Squid Tempura" },
      { no: 1000353959, name: "Fried Smelt" },
      { no: 5119405, name: "Squid & Peanuts Platter" },
      { no: 1000168269, name: "Seasoned Dried Squid" },
      { no: 5042999, name: "Perilla Leaf Tempura" },
    ],
    b: [
      { no: 1000353959, name: "Fried Smelt" },
      { no: 1000308975, name: "Boneless Sweet Crispy Chicken", breaks: true },
      { no: 1001530446, name: "Air-Fryer Squid Tempura" },
      { no: 1000168269, name: "Seasoned Dried Squid" },
      { no: 1000608637, name: "Boneless BBQ Chicken", breaks: true },
    ],
  },
];
const LISTS = [
  { key: "a", list: "Model A", model: "Our algorithm" },
  { key: "b", list: "Model B", model: "Vertex AI agent" },
] as const;
// Where each list sits on wide screens: row r (after the header), column c.
const CELL = [
  ["md:[grid-area:2/2]", "md:[grid-area:2/3]"],
  ["md:[grid-area:3/2]", "md:[grid-area:3/3]"],
];
const CONDITIONS = [
  "56 people, including the CEO, MD lead, and marketing lead",
  "10 themes",
  "Blind: only Model A and Model B",
];

function PickTiles({ picks, flag }: { picks: Pick[]; flag: boolean }) {
  return (
    <ul className="grid grid-cols-5 gap-2">
      {picks.map((p) => (
        <li key={p.no} className="relative">
          <span
            className={cn(
              "block aspect-square overflow-hidden rounded-lg bg-[#f4f1ea] ring-offset-2 ring-offset-paper transition-shadow duration-500",
              flag && p.breaks && "ring-2 ring-alert",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img
              src={`/images/ai-curation/products/kurly-${p.no}.webp`}
              alt={p.name}
              loading="lazy"
              className="size-full object-cover"
            />
          </span>
          {p.breaks && (
            <span
              aria-hidden
              className={cn(
                "absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-alert text-[11px] font-bold text-paper transition-[opacity,scale] duration-300",
                flag ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            >
              ✕
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

// Two beats: the lists as the voters saw them, A and B; then who made which,
// what B got wrong, and the result.
function BlindTest({ revealed }: { revealed: boolean }) {
  const still = useStill();
  const fade = still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT };
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SubHeading>1 · Which AI? A blind test</SubHeading>
        <Body className="max-w-[48rem]">
          To choose the model, I tested whether <B>our own algorithm</B>, built around how MDs
          curate, beats a general-purpose AI, <B>Google Cloud’s Vertex AI agent</B>.
        </Body>
        <ul aria-label="Test conditions" className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <li key={c} className="rounded-full bg-paper-2 px-3 py-1.5 text-sm text-ink">
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-[10rem_1fr_1fr]">
        {/* The pick: Model A's column gets a box and a check. */}
        <motion.span
          aria-hidden
          initial={false}
          animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
          transition={fade}
          className="pointer-events-none relative -mx-4 -my-3 hidden rounded-2xl border-2 border-pass md:block md:[grid-area:1/2/4/3]"
        >
          <span className="absolute -right-3 -top-3 grid size-6 place-items-center rounded-full bg-pass text-[13px] font-bold text-paper">
            ✓
          </span>
        </motion.span>
        {LISTS.map((l, c) => (
          <p
            key={l.key}
            className={cn(
              "hidden text-sm font-semibold md:block",
              c === 0 ? "md:[grid-area:1/2]" : "md:[grid-area:1/3]",
            )}
          >
            <span className={cn(revealed && l.key === "a" ? "text-pass" : "text-ink")}>
              {l.list}
            </span>
            <motion.span
              initial={false}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={fade}
              className="font-normal text-ink-muted"
            >
              {" "}
              · {l.model}
            </motion.span>
          </p>
        ))}
        {BLIND.map((t, r) => (
          <div key={t.theme} className="contents">
            <div
              className={cn(
                "flex flex-col gap-1 md:pt-2",
                r === 0 ? "md:[grid-area:2/1]" : "md:[grid-area:3/1]",
              )}
            >
              <span className="text-xs text-ink-muted">{t.kind}</span>
              <span className="font-display text-lg font-medium leading-snug text-ink">
                “{t.theme}”
              </span>
            </div>
            {LISTS.map((l, c) => (
              <div key={l.key} className={cn("flex flex-col gap-2", CELL[r][c])}>
                <span className="text-xs font-semibold text-ink md:hidden">
                  {l.list}
                  {revealed && ` · ${l.model}`}
                </span>
                <PickTiles picks={t[l.key]} flag={revealed} />
                {t.ruled && l.key === "b" && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: revealed ? 1 : 0 }}
                    transition={fade}
                    className="text-xs font-medium text-alert"
                  >
                    {t[l.key].filter((p) => p.breaks).length} of 5 are {t.ruled}
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <motion.div
        initial={false}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={fade}
        className="flex max-w-[48rem] flex-col gap-2"
      >
        <p className="font-display text-xl font-medium text-ink md:text-2xl">
          Our algorithm won 68% of 56 votes.
        </p>
        <p className="text-base leading-relaxed text-ink-muted">
          On plain themes the two were close. On themes that needed reasoning, ours won{" "}
          <B>77%</B>: keyword search can’t tell what a theme leaves out or puts first.
        </p>
        <DataNote>
          A’s picks are from the test. B is illustrative: Kurly’s keyword search for the same
          theme.
        </DataNote>
      </motion.div>
    </div>
  );
}

// 21 campaigns, each the mean of three experts' scores (so in thirds). Real:
// the 8.95 average, most at 10, and one 0 for a theme that returned no
// products. The rest of the spread is staged to land on the average.
const SCORES = [
  0,
  ...Array(1).fill(22),
  ...Array(1).fill(23),
  ...Array(3).fill(26),
  ...Array(3).fill(27),
  ...Array(12).fill(30),
].map((thirds: number) => thirds / 3);
const MEAN = 8.95;
const AXIS_W = 640;
const AXIS_X0 = 20;
const unitX = (v: number) => AXIS_X0 + (v / 10) * (AXIS_W - AXIS_X0 * 2);
const DOT_R = 6;
const AXIS_Y = 190;

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
        aria-label="21 test campaigns scored out of 10 by an expert panel. Most scored 10; one scored 0 because it returned no products. The average is 8.95."
        className="w-full max-w-[640px]"
      >
        <line
          x1={AXIS_X0}
          x2={AXIS_W - AXIS_X0}
          y1={AXIS_Y}
          y2={AXIS_Y}
          stroke="var(--color-line)"
        />
        {Array.from({ length: 11 }, (_, k) => (
          <g key={k}>
            <line
              x1={unitX(k)}
              x2={unitX(k)}
              y1={AXIS_Y}
              y2={AXIS_Y + 5}
              stroke="var(--color-ink-muted)"
            />
            <text
              x={unitX(k)}
              y={AXIS_Y + 20}
              textAnchor="middle"
              fontSize={12}
              fill="var(--color-ink-muted)"
            >
              {k}
            </text>
          </g>
        ))}
        {dots.map((d) => (
          <motion.circle
            key={d.i}
            cx={d.x}
            r={DOT_R}
            fill={d.v === 0 ? "var(--color-alert)" : "var(--color-accent)"}
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
          {/* The one 0: a theme that came back empty. */}
          <text
            x={unitX(0) + DOT_R + 6}
            y={AXIS_Y - DOT_R + 2}
            fontSize={12}
            fill="var(--color-alert)"
          >
            No products found
          </text>
        </motion.g>
      </svg>
      <figcaption>
        <DataNote>Illustrative distribution. Average is actual.</DataNote>
      </figcaption>
    </figure>
  );
}

export function Evaluation() {
  return (
    <Chapter
      id="evaluation"
      label="09 Internal Evaluation"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader
          label="09 INTERNAL EVALUATION"
          headline="Earning the MDs’ Trust, One Test at a Time"
        />
        <Body className="max-w-[48rem]">
          Before asking customers to see AI picks, I needed proof that the people who know
          curation best trusted them. I ran two checks.
        </Body>
      </div>

      {/* Each check holds for its own scroll. */}
      <StickyScene steps={3} vh={60} label="Blind test: our algorithm or Vertex AI">
        {({ step, live }) => (
          <div className={cn(wrap, "w-full")}>
            <BlindTest revealed={!live || step >= 1} />
          </div>
        )}
      </StickyScene>

      <StickyScene steps={2} vh={60} label="Expert panel scores">
        {() => (
          <div className={cn(wrap, "w-full")}>
            <section className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr] md:gap-14">
              <div className="flex flex-col gap-4">
                <SubHeading>2 · Would experts ship it?</SubHeading>
                <Body>
                  An expert panel, a PM, the MD lead, and the marketing lead, scored{" "}
                  <B>21 test campaigns</B> out of 10. Most got a 10. The average was{" "}
                  <B>8.95 / 10</B> only because one theme returned no products and scored 0; the
                  other 20 averaged <B>9.4</B>.
                </Body>
              </div>
              <ScoreDots />
            </section>
          </div>
        )}
      </StickyScene>

      <Kicker>The experts trusted it. Now the question was whether customers would. ↓</Kicker>
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
  { name: "Campaign click user ratio", ai: 98.1, p: "0.076" },
  { name: "Campaign add-to-cart user ratio", ai: 100.0, p: "0.982" },
  { name: "Campaign purchase user ratio", ai: 100.5, p: "0.937" },
];
const SECONDARY: Kpi[] = [
  { name: "Add-to-cart value per user", ai: 98.9, p: "0.839" },
  { name: "Purchase value per user", ai: 97.8, p: "0.773" },
  { name: "Product clicks per user", ai: 99.5, p: "0.779" },
  { name: "Add-to-cart clicks per user", ai: 103.7, p: "0.174" },
  { name: "Purchases per user", ai: 95.9, p: "0.571" },
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
