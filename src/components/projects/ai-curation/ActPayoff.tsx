"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useStill, useTypewriter } from "../story/motion";
import {
  B,
  Body,
  CENTERED,
  Chapter,
  CountUp,
  Lessons,
  MetricCounter,
  SectionHeader,
  SubHeading,
  ThoughtBubble,
  textLink,
  wrap,
  type Lesson,
  type Num,
} from "../story/ui";
import { AiNode, DashLine, GLOW, KurlyWeb, SHOWN, webHeight } from "./ActSetup";
import { CHINESE, MATCHA, SNACK } from "./data";

// Act 5, Payoff: 11 Integration & Impact · 12 Reflection
// (spec §5.13–5.14).

/* ------------------------------------------------------------------ */
/* 11 Integration: SheetToHome                                          */
/* ------------------------------------------------------------------ */

const PRESS = [
  {
    outlet: "Economist Korea",
    date: "Feb 2025",
    url: "https://economist.co.kr/article/view/ecn202502140048",
  },
  {
    outlet: "Viva100",
    date: "Feb 2025",
    url: "https://www.viva100.com/article/20250216500401",
  },
];

type SheetRow = { title: string; subtitle: string; start: string; end: string };
const SHEET_ROWS: SheetRow[] = [
  {
    title: `${CHINESE.emoji} ${CHINESE.title}`,
    subtitle: "Mala, jjamppong and more",
    start: "11/04",
    end: "11/10",
  },
  {
    title: `${SNACK.emoji} ${SNACK.title}`,
    subtitle: "Snacks loved by all ages",
    start: "11/06",
    end: "11/19",
  },
];
const NEW_ROW: SheetRow = {
  title: `${MATCHA.emoji} ${MATCHA.title}`,
  subtitle: "This month’s trend, from latte to ice cream",
  start: "11/11",
  end: "11/24",
};
const NEW_CELLS = [NEW_ROW.title, NEW_ROW.subtitle, NEW_ROW.start, NEW_ROW.end];
const NEW_TEXT = NEW_CELLS.join("\t");

// Google Sheets' mark, drawn: a green page with a white grid.
function SheetsIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 26" className={cn("h-6 w-auto", className)}>
      <path d="M2 0h11l7 7v17a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z" fill="#0f9d58" />
      <path d="M13 0v5a2 2 0 0 0 2 2h5Z" fill="#87ceac" />
      <rect x="4.5" y="11" width="11" height="9" rx="0.8" fill="#fff" />
      <path d="M4.5 14h11M4.5 17h11M8.5 11v9" stroke="#0f9d58" strokeWidth="1" />
    </svg>
  );
}

// The new row, typed in cell by cell (tabs split the cells).
const TYPE_MS = 18;
const TYPE_DELAY_MS = 150;
function TypedCells({
  children,
}: {
  children: (cells: string[], typing: boolean) => React.ReactNode;
}) {
  const { typed, done } = useTypewriter(NEW_TEXT, {
    speed: TYPE_MS,
    startDelay: TYPE_DELAY_MS,
  });
  return <>{children(typed.split("\t"), !done)}</>;
}

const SHEET_COLS = (
  <colgroup>
    <col className="w-[46%]" />
    <col className="w-[30%]" />
    <col className="w-[12%]" />
    <col className="w-[12%]" />
  </colgroup>
);
const CELL =
  "overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#e1e3e1] px-2 py-1.5 last:border-r-0";

// The sheet MDs launch from: its rows roll down under the header when it
// opens, ending in an empty row; the new row types in while `typing`.
function CampaignSheet({ open, typing, done }: { open: boolean; typing: boolean; done: boolean }) {
  return (
    // An invisible open copy holds the space, so nothing around the sheet
    // moves as it opens.
    <div className="grid">
      <div aria-hidden className="invisible [grid-area:1/1]">
        <SheetBox open typing={false} done />
      </div>
      <div className="self-start [grid-area:1/1]">
        <SheetBox open={open} typing={typing} done={done} />
      </div>
    </div>
  );
}

function SheetBox({ open, typing, done }: { open: boolean; typing: boolean; done: boolean }) {
  const still = useStill();
  const row = (cells: string[], caretOn: boolean) => (
    <tr className="bg-[#e8f0fe]/60">
      {NEW_CELLS.map((full, k) => (
        <td key={full} className={cn(CELL, k === 0 && "ring-2 ring-inset ring-[#1a73e8]")}>
          {cells[k] ?? ""}
          {caretOn && k === cells.length - 1 && (
            <span className="ml-px inline-block h-3 w-px animate-pulse bg-ink align-middle" />
          )}
          {/* Keeps the row's height while it's empty. */}
          {k === 0 && !cells[0] && <span className="invisible">.</span>}
        </td>
      ))}
    </tr>
  );
  return (
    <div className="relative">
      {/* The hero's glow, while the MD writes. */}
      <motion.div
        aria-hidden
        className={cn(GLOW, "inset-x-3 bottom-0 top-4")}
        initial={false}
        animate={{ opacity: typing ? 0.6 : 0 }}
        transition={{ duration: still ? 0 : 0.6 }}
      />
      <div
        role="img"
        aria-label={`The Campaign Management Sheet in Google Sheets. A new row is added: “${NEW_ROW.title}”, “${NEW_ROW.subtitle}”, running ${NEW_ROW.start} to ${NEW_ROW.end}.`}
        className="relative overflow-hidden rounded-xl border border-line bg-paper shadow-[0_20px_40px_-24px_rgba(21,21,21,0.35)]"
      >
        <div
          className={cn("flex items-center gap-2.5 px-3 py-2.5", open && "border-b border-line")}
        >
          <SheetsIcon />
          <span className="text-sm font-medium text-ink">Campaign Management Sheet</span>
        </div>
        <div aria-hidden className="text-left text-[11.5px] text-[#202124]">
          {/* Closed, the sheet is just its title bar; opening rolls the
              header and rows down. */}
          <motion.div
            initial={false}
            animate={{ height: open ? "auto" : 0 }}
            transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <table className="w-full table-fixed border-collapse">
              {SHEET_COLS}
              <thead className="bg-[#f8f9fa] text-[11px] text-[#5f6368]">
                <tr className="border-b border-[#e1e3e1]">
                  {["Title", "Subtitle", "Start", "End"].map((h) => (
                    <th key={h} className={cn(CELL, "font-medium")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHEET_ROWS.map((r) => (
                  <tr key={r.title} className="border-b border-[#e1e3e1]">
                    {[r.title, r.subtitle, r.start, r.end].map((c) => (
                      <td key={c} className={CELL}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
                {done ? (
                  row(NEW_CELLS, false)
                ) : typing ? (
                  <TypedCells>{(cells, caretOn) => row(cells, caretOn)}</TypedCells>
                ) : (
                  row([], false)
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Between the sheet and the page, as in the hero: a dashed line from the
// sheet into the AI orb, and one out of it to the page, running under the orb
// so nothing gaps.
const LINK_W = 190;
const LINK_H = 64;
const ORB_GAP = 30;
const LINKS = [
  `M0 ${LINK_H / 2} H${LINK_W / 2 - ORB_GAP}`,
  `M${LINK_W / 2 + ORB_GAP} ${LINK_H / 2} H${LINK_W}`,
];

function SheetToWeb({ on }: { on: [boolean, boolean, boolean] }) {
  const still = useStill();
  return (
    <div aria-hidden className="relative" style={{ width: LINK_W, height: LINK_H }}>
      <svg
        width={LINK_W}
        height={LINK_H}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        {LINKS.map((d, i) => (
          <DashLine
            key={d}
            d={d}
            on={on[i === 0 ? 0 : 2]}
            still={still}
            w={LINK_W}
            h={LINK_H}
            duration={ARROW_MS / 1000}
          />
        ))}
      </svg>
      <AiNode on={on[1]} top={0} />
    </div>
  );
}

// Once the row is done: the line into AI, AI, the line out, then the new
// campaign's products one by one. Times in ms from the landing.
const ARROW_MS = 160;
const LINE_IN_MS = 0;
const AI_MS = ARROW_MS;
const LINE_OUT_MS = AI_MS + 120;
const FILL_MS = LINE_OUT_MS + ARROW_MS + 60;
const FILL_STEP_MS = 110;

function useLanding(on: boolean, still: boolean) {
  const [t, setT] = useState(-1);
  useEffect(() => {
    if (!on || still) return;
    const marks = [
      LINE_IN_MS,
      AI_MS,
      LINE_OUT_MS,
      ...Array.from({ length: SHOWN + 1 }, (_, k) => FILL_MS + k * FILL_STEP_MS),
    ];
    const timers = marks.map((ms) => setTimeout(() => setT(ms), ms));
    return () => {
      timers.forEach(clearTimeout);
      setT(-1);
    };
  }, [on, still]);
  const at = !on ? -1 : still ? Infinity : t;
  return {
    links: [at >= LINE_IN_MS, at >= AI_MS, at >= LINE_OUT_MS] as [boolean, boolean, boolean],
    shown: at < FILL_MS ? -1 : Math.min(SHOWN, Math.floor((at - FILL_MS) / FILL_STEP_MS)),
  };
}

// 1 · Launch, one step per scroll, and playing on its own once the scene
// arrives: 0 open the sheet · 1 add the row · 2 AI turns it into a campaign
// on the homepage · 3 spare.
const SHEET_STEPS = 4;
// On arrival: step 1 lights up, then the sheet opens.
const BEGIN_MS = 200;
const OPEN_MS = 500;
// How long each auto beat holds before the next: the sheet opening, then
// the row typing itself in.
const AUTO_MS = [OPEN_MS + 800, TYPE_DELAY_MS + NEW_TEXT.length * TYPE_MS + 500];

const LAUNCH_STEPS = [
  "Open the sheet",
  "Add a row: title, subtitle, start and end dates",
  "Done 🎉",
];
const WEB_THEMES = [CHINESE, SNACK, MATCHA];

function LaunchScene({ step, live }: { step: number; live: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Arrived once the scene's bottom edge is on screen.
  const arrived = useInView(ref, { amount: 1 });
  const [begun, setBegun] = useState(false);
  const [opened, setOpened] = useState(false);
  const [auto, setAuto] = useState(0);
  // Scrolling back up takes the auto play back with it.
  const [prevStep, setPrevStep] = useState(step);
  if (step !== prevStep) {
    setPrevStep(step);
    if (step < prevStep) setAuto(Math.min(auto, step));
  }
  const at = live ? Math.max(step, auto) : SHEET_STEPS - 1;

  // On arrival the sheet opens; leaving resets it for the next visit.
  useEffect(() => {
    if (!live || !arrived) return;
    const timers = [
      setTimeout(() => setBegun(true), BEGIN_MS),
      setTimeout(() => setOpened(true), OPEN_MS),
    ];
    return () => {
      timers.forEach(clearTimeout);
      setBegun(false);
      setOpened(false);
      setAuto(0);
    };
  }, [live, arrived]);

  // Then each beat hands on to the next without a scroll.
  useEffect(() => {
    if (!live || !arrived || at >= 2 || (at === 0 && !opened)) return;
    const t = setTimeout(() => setAuto(at + 1), at === 0 ? AUTO_MS[0] - OPEN_MS : AUTO_MS[1]);
    return () => clearTimeout(t);
  }, [live, arrived, at, opened]);

  const landed = at >= 2;
  const { links, shown } = useLanding(landed, !live);
  return (
    <div
      className={cn(
        wrap,
        "relative grid w-full items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-x-0 lg:gap-y-8",
      )}
    >
      <SubHeading className="lg:col-span-3">1 · Launch from the sheet MDs already use</SubHeading>
      {/* Text at the top, the sheet level with the bottom of the page. */}
      <div className="flex flex-col gap-7 self-stretch lg:justify-between">
        <div className="flex flex-col gap-7">
          <Body className="max-w-[44rem]">
            To keep MDs from having to learn a new tool, I kept the launch in the{" "}
            <B>Google Sheets</B> they already use. They add one row, and the AI fills the campaign
            and puts it on the homepage.
          </Body>
          <ol className="flex flex-col gap-2">
            {LAUNCH_STEPS.map((s, i) => (
              <motion.li
                key={s}
                initial={false}
                // All three wait, dimmed, and light up in turn.
                animate={{ opacity: !live || i < at || (i === at && (at > 0 || begun)) ? 1 : 0.3 }}
                transition={{ duration: 0.4 }}
                className="flex items-baseline gap-3"
              >
                <span className="font-display text-lg font-medium text-accent">{i + 1}</span>
                <span className="text-base leading-relaxed text-ink">{s}</span>
              </motion.li>
            ))}
          </ol>
        </div>
        <CampaignSheet open={!live || at > 0 || opened} typing={live && at === 1} done={at >= 2} />
      </div>
      {/* Level with the middle of the sheet. */}
      <div className="hidden pb-[3.25rem] lg:block">
        <SheetToWeb on={links} />
      </div>
      <div
        role="img"
        aria-label="Kurly’s homepage with the Spicy Chinese Takeout Vibe and The Ultimate Snack Drop campaigns. Once the row is added, AI turns it into Matcha Core: Trending Now, which appears below them, filled with matcha products."
        className="relative mx-auto w-[300px] md:[zoom:1.1]"
      >
        {/* The hero's glow, as the new campaign arrives. */}
        <motion.div
          aria-hidden
          className={cn(GLOW, "inset-x-2 bottom-2 top-4")}
          initial={false}
          animate={{ opacity: shown >= 0 ? 0.7 : 0 }}
          transition={shown >= 0 && live ? { duration: 0.8 } : { duration: 0 }}
        />
        <div className="relative rounded-xl shadow-[0_20px_40px_-24px_rgba(21,21,21,0.35)]">
          <KurlyWeb
            themes={WEB_THEMES}
            filled={[SHOWN, SHOWN, shown]}
            height={webHeight(WEB_THEMES.length)}
          />
        </div>
      </div>
      <div ref={ref} aria-hidden className="absolute inset-x-0 bottom-0 h-px" />
    </div>
  );
}

// A small AI orb, in the same colors as the big one in 01.
function AiOrb() {
  return (
    <span
      aria-hidden
      className="grid size-7 place-items-center rounded-full font-display text-[10px] font-bold text-white"
      style={{ background: "radial-gradient(circle at 40% 30%, #FDE6FF, #9B5CF6 70%)" }}
    >
      AI
    </span>
  );
}

// 2 · Rules: the pipeline behind the sheet, one policy per stop. The fifth
// rides the loop back from the homepage to the MD.
const STOPS = [
  {
    icon: <SheetsIcon />,
    node: "Campaign sheet",
    rule: "Read every night",
    why: "New and edited rows go in at midnight, and every live product list is rebuilt weekly as stock changes.",
  },
  {
    icon: <AiOrb />,
    node: "AI builds the list",
    rule: "At least 20 products",
    why: "A thin campaign looks broken, so it isn’t shown. Products with mostly bad reviews in the past 2 weeks are left out.",
  },
  {
    icon: <Database aria-hidden className="size-6 text-[#5f0080]" strokeWidth={1.75} />,
    node: "Kurly’s CMS",
    rule: "Registered on its own",
    why: "The AI is linked to Kurly’s content management tool, so each campaign is registered and kept up to date with no manual entry.",
  },
  {
    // eslint-disable-next-line @next/next/no-img-element -- static export
    icon: <img src="/images/ai-curation/app/kurly-logo.svg" alt="" className="h-5 w-auto" />,
    node: "Homepage",
    rule: "A fresh lineup every day",
    why: "Campaigns share the homepage’s theme slots, and each day the slots show a new mix, led by what customers click.",
  },
];
const LOOP = {
  rule: "Miss the click target, and it comes down",
  why: "MDs track each campaign’s numbers in the same sheet, and a weak one leaves the homepage.",
};
// 0 the bare flow · 1–5 one rule each · 6 spare.
const RULE_STEPS = STOPS.length + 3;

// One stop's card: it appears when the flow reaches it, and its border goes
// back to gray once the flow moves on.
function StopCard({
  shown,
  current,
  className,
  children,
}: {
  shown: boolean;
  current: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const still = useStill();
  return (
    <motion.div
      initial={false}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={still ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT }}
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border bg-paper p-4 transition-[border-color,box-shadow] duration-300",
        current
          ? "border-accent shadow-[0_0_0_1px_var(--color-accent),0_10px_24px_-14px_rgba(21,21,21,0.4)]"
          : "border-line",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function Rule({ rule, why }: { rule: string; why: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-base font-semibold leading-snug text-ink">{rule}</p>
      <p className="text-sm leading-relaxed text-ink-muted">{why}</p>
    </div>
  );
}

function RulesScene({ step, live }: { step: number; live: boolean }) {
  const shown = (i: number) => !live || step >= i + 1;
  const current = (i: number) => live && step === i + 1;
  const still = useStill();
  return (
    <div className={cn(wrap, "flex w-full flex-col gap-10")}>
      <div className="flex flex-col gap-5">
        <SubHeading>2 · The rules behind the sheet</SubHeading>
        <Body className="max-w-[48rem]">
          To fit the AI system into Kurly’s platform without putting the live homepage at risk, I
          set <B>every rule it runs on</B>, so each campaign stays full, fresh, and stable
          automatically.
        </Body>
      </div>
      <figure aria-label="From the sheet to the homepage, with the rule at each stop">
        <ol className="grid gap-4 md:grid-cols-4 md:gap-8">
          {STOPS.map((s, i) => (
            <li key={s.node} className="flex">
              <StopCard shown={shown(i)} current={current(i)} className="flex-1">
                {/* The arrow in comes with the card. */}
                {i > 0 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -left-6 top-6 hidden size-4 text-ink-muted md:block"
                  />
                )}
                <div className="flex h-8 items-center gap-2.5">
                  <span className="grid min-w-8 shrink-0 place-items-center">{s.icon}</span>
                  <p className="text-sm font-medium leading-snug text-ink">{s.node}</p>
                </div>
                <Rule rule={s.rule} why={s.why} />
              </StopCard>
            </li>
          ))}
        </ol>
        {/* Back to the MD: a return line from the homepage to the sheet,
            drawn with the card that sits on it. */}
        <motion.div
          initial={false}
          animate={{ opacity: shown(STOPS.length) ? 1 : 0 }}
          transition={still ? { duration: 0 } : { duration: 0.45 }}
          aria-hidden
          className="relative mx-[12.5%] mt-4 hidden h-8 rounded-b-xl border-x border-b border-ink-muted/40 md:block"
        >
          <span className="absolute -left-[5px] -top-1 size-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-ink-muted/60" />
        </motion.div>
        <StopCard
          shown={shown(STOPS.length)}
          current={current(STOPS.length)}
          className="mx-auto mt-4 max-w-[27rem] md:-mt-6"
        >
          <Rule rule={LOOP.rule} why={LOOP.why} />
        </StopCard>
      </figure>
    </div>
  );
}

const IMPACT: { to?: Num; text?: string; extra?: string; label: string }[] = [
  {
    text: "On par",
    label: "with hand-picked campaigns, with more diverse categories",
  },
  {
    to: { value: 25, suffix: "%" },
    label: "of key homepage campaign slots run fully by AI",
  },
  { to: { value: 200, suffix: "+" }, label: "campaigns run by AI" },
  { to: { value: 2 }, extra: "days / week", label: "of MD time saved" },
];

export function Integration() {
  return (
    <Chapter
      id="integration"
      label="11 Integration"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader label="11 INTEGRATION" headline="Name a Theme, Get a Live Campaign" />
        <Body className="max-w-[48rem]">
          Going live had two sides:
          <br />a launch MDs could run on their own,
          <br />
          and the rules that keep every campaign full and fresh once it’s live.
        </Body>
      </div>

      <StickyScene
        steps={SHEET_STEPS}
        vh={80}
        label="A row in the Google Sheet becomes a live campaign on the homepage"
      >
        {({ step, live }) => <LaunchScene step={step} live={live} />}
      </StickyScene>

      <StickyScene
        steps={RULE_STEPS}
        vh={55}
        label="The rules from the sheet to the homepage, one at a time"
      >
        {({ step, live }) => <RulesScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 12 Results                                                          */
/* ------------------------------------------------------------------ */

// The MD turns into the AI: a band of ASCII sweeps left to right across her,
// whitening her into characters, and the AI (flipped to face the same way,
// on the same spot) is left behind it.
const MORPH_MS = 1200;
const BAND = 0.24;
const GLYPH = 8;
const RAMP = " .:-=+*#%@";

function AsciiMorph({ run }: { run: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const md = useRef<HTMLImageElement>(null);
  const still = useStill();
  // Where the AI's edge is, 0–1 across the figure.
  const [seam, setSeam] = useState(still ? 1 : 0);

  useEffect(() => {
    if (!run || still) return;
    const c = canvas.current;
    const img = md.current;
    const el = box.current;
    if (!c || !img || !el) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let stop = false;
    const go = () => {
      if (stop) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      // Not laid out yet (or the image never decoded): skip to the AI.
      if (!w || !h || !img.naturalWidth) {
        setSeam(1);
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // One sample of the MD per character cell: her shape and shade.
      const cols = Math.ceil(w / GLYPH);
      const rows = Math.ceil(h / GLYPH);
      const probe = document.createElement("canvas");
      probe.width = cols;
      probe.height = rows;
      const pctx = probe.getContext("2d", { willReadFrequently: true });
      if (!pctx) return;
      pctx.drawImage(img, 0, 0, cols, rows);
      const px = pctx.getImageData(0, 0, cols, rows).data;
      ctx.font = `${GLYPH + 1}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const t0 = performance.now();
      const frame = (now: number) => {
        const p = Math.min(1, (now - t0) / MORPH_MS);
        const ease = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
        const front = ease * (1 + BAND);
        setSeam(front - BAND / 2);
        ctx.clearRect(0, 0, w, h);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const t = (front - x / cols) / BAND;
            if (t <= 0 || t >= 1) continue;
            const i = (y * cols + x) * 4;
            if (px[i + 3] < 60) continue;
            const strength = Math.sin(Math.PI * t);
            // Whiten the figure under the band, then type her in characters.
            ctx.fillStyle = `rgba(255,255,255,${0.92 * strength})`;
            ctx.fillRect(x * GLYPH, y * GLYPH, GLYPH, GLYPH);
            const dark = 1 - (px[i] + px[i + 1] + px[i + 2]) / 765;
            const k = Math.min(
              RAMP.length - 1,
              Math.max(1, Math.round(dark * (RAMP.length - 1) + Math.random() * 3)),
            );
            ctx.fillStyle = `rgba(135,80,230,${strength})`;
            ctx.fillText(RAMP[k], x * GLYPH + GLYPH / 2, y * GLYPH + GLYPH / 2);
          }
        }
        if (p < 1) raf = requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, w, h);
      };
      raf = requestAnimationFrame(frame);
    };
    if (img.complete) go();
    else img.addEventListener("load", go, { once: true });
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      img.removeEventListener("load", go);
    };
  }, [run, still]);

  const at = Math.max(0, Math.min(100, seam * 100));
  return (
    <div
      ref={box}
      role="img"
      aria-label="A Kurly MD turns into the AI, in the same pose"
      className="relative aspect-[560/751] w-full max-w-[300px]"
    >
      {/* The desk from 02: its edge at her lowest fingertips, fading at the ends.
          From md up the scene draws a longer one, under the numbers too. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[15%] bottom-0 h-[20.5%] md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent)",
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
      <img
        ref={md}
        src="/images/ai-curation/impact/md.webp"
        alt=""
        width={560}
        height={751}
        className="absolute inset-0 size-full"
        // Only ahead of the seam: her hair and pen reach past the AI's outline.
        style={{ clipPath: `inset(0 0 0 ${at}%)` }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
      <img
        src="/images/ai-curation/impact/ai.webp"
        alt=""
        width={560}
        height={751}
        className="absolute inset-0 size-full -scale-x-100"
        // Mirrored, so the inset's right edge is the figure's left.
        style={{ clipPath: `inset(0 0 0 ${100 - at}%)` }}
      />
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}

// The MD alone until the scene has fully arrived; then, after a beat, she
// turns into the AI on her own and the numbers follow. The next scroll moves
// on (it also turns her, if it comes first).
const ARRIVE_MS = 400;
function ImpactMorphScene({ step, live }: { step: number; live: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const still = useStill();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const arrived = useInView(end, { amount: 1 });
  // Once turned, it stays turned, even scrolling back up.
  const [turned, setTurned] = useState(false);
  if (!turned && (live ? step >= 1 : inView)) setTurned(true);
  useEffect(() => {
    if (!live || !arrived || turned) return;
    const t = setTimeout(() => setTurned(true), ARRIVE_MS);
    return () => clearTimeout(t);
  }, [live, arrived, turned]);
  const [counted, setCounted] = useState(still);
  useEffect(() => {
    if (!turned || counted) return;
    const t = setTimeout(() => setCounted(true), MORPH_MS * 0.85);
    return () => clearTimeout(t);
  }, [turned, counted]);
  return (
    // Fully arrived = the whole scene, heading to press links, is on screen.
    <div ref={end} className={cn(wrap, "flex w-full flex-col gap-12")}>
      <div className="flex flex-col gap-6">
        <SectionHeader label="12 RESULTS" headline="Trusted With Kurly’s Homepage" />
        <Body className="max-w-[48rem]">
          Despite Kurly’s doubts about automating curation, AI Curation{" "}
          <B>now runs 25% of key homepage campaign slots fully on its own</B>. Proven on the
          homepage, it was rolled out to other parts of Kurly, such as <B>Beauty Kurly</B>.
        </Body>
      </div>
      <div
        ref={ref}
        className="relative -mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,240px)_1fr] lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-14"
      >
        {/* One desk under the figure and on under the numbers, its edge at her
            lowest fingertips; the figure is the row's tallest, so 20.5% of it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[4%] bottom-0 right-0 hidden h-[20.5%] md:block"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent)",
            maskImage: "linear-gradient(to right, transparent, black 8%, black 85%, transparent)",
          }}
        />
        <AsciiMorph run={turned} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {IMPACT.map((m, i) => (
            <motion.div
              key={m.label}
              // In from the left, one after another, as the sweep runs out.
              initial={still ? false : { opacity: 0, x: -20 }}
              animate={counted ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: counted ? i * 0.2 : 0 }}
            >
              {m.to ? (
                <MetricCounter
                  to={m.to}
                  extra={m.extra}
                  label={m.label}
                  countFrom={0}
                  play={counted}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="font-display text-[2rem] font-medium leading-none tracking-tight text-accent md:text-[2.4rem]">
                    {m.text}
                  </p>
                  <p className="text-sm font-medium text-ink-muted">{m.label}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Under the figure. */}
      <div className="-mt-9 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
          In the press
        </span>
        {PRESS.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={textLink}
          >
            {p.outlet} ({p.date}) ↗
          </a>
        ))}
      </div>
    </div>
  );
}

export function LiveImpact() {
  return (
    <Chapter id="results" label="12 Results" className="border-t border-line pt-24 md:pt-32">
      <StickyScene steps={2} vh={80} label="The MD turns into the AI, and the results follow">
        {({ step, live }) => <ImpactMorphScene step={step} live={live} />}
      </StickyScene>
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 13 Reflection                                                       */
/* ------------------------------------------------------------------ */

const LESSONS: Lesson[] = [
  {
    title: "Defining the Right Bar",
    body: (
      <>
        The goal was not to beat our MDs but to match them. Setting <B>parity as success</B> made a
        sensitive change, letting AI pick for a curation brand, something the company could say yes
        to.
      </>
    ),
  },
  {
    title: "Trust Before Scale",
    body: (
      <>
        Putting AI in MDs’ hands first turned the people with the most at stake into the people{" "}
        <B>shaping it</B>. Their feedback made the model better, and their trust made the rollout
        possible.
      </>
    ),
  },
  {
    title: "One Step in a Bigger Plan",
    body: (
      <>
        Framing this as Project 1 of a personalization roadmap kept every decision pointed
        somewhere. The Sheet, the hourly refresh, and the data it collects all{" "}
        <B>set up what comes next</B>.
      </>
    ),
  },
];

export function Reflection() {
  return (
    <Lessons id="reflection" label="13 REFLECTION" chapter="13 Reflection" lessons={LESSONS} />
  );
}
