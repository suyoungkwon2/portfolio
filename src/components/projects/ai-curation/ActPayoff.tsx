"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  EASE_OUT,
  Reveal,
  StickyScene,
  scrollToStep,
  useStill,
  useTypewriter,
} from "../story/motion";
import {
  B,
  Body,
  CENTERED,
  Chapter,
  CountUp,
  DataNote,
  Lessons,
  MetricCounter,
  PhoneSplit,
  SectionHeader,
  SubHeading,
  ThoughtBubble,
  textLink,
  wrap,
  type Lesson,
  type Num,
} from "../story/ui";
import { AFTER, BEFORE, DayBubble, DayTabs, HomePhone } from "./ActConflict";
import { CHINESE, MATCHA, SNACK } from "./data";
import { ProgressBeat, RoadmapGrid9 } from "./ui";

// Act 5, Payoff: 11 Improvement · 12 Integration & Impact · 13 Reflection
// (spec §5.12–5.14).

/* ------------------------------------------------------------------ */
/* 11 Improvement: VersionRace                                         */
/* ------------------------------------------------------------------ */

type Version = { name: string; change: string; all: number; critical: number; live?: boolean };
const VERSIONS: Version[] = [
  { name: "Start", change: "", all: 9.17, critical: 0.76 },
  { name: "v1", change: "More verification passes", all: 8.72, critical: 0.64 },
  { name: "v2", change: "Added new data types", all: 2.64, critical: 1.21, live: true },
  { name: "v3", change: "v1 + v2 together", all: 4.08, critical: 1.56 },
];
const START = VERSIONS[0].all;
// The bar's track runs to 10%.
const TRACK = 10;
const V3 = 3;
// v3 dives below v2 before bouncing back up.
const V3_DIP = 1.9;

function RaceRow({ v, i, on, still }: { v: Version; i: number; on: boolean; still: boolean }) {
  const pct = (x: number) => `${(x / TRACK) * 100}%`;
  const width =
    !on && i > 0
      ? pct(START)
      : i === V3 && !still
        ? [pct(START), pct(V3_DIP), pct(v.all)]
        : pct(v.all);
  return (
    <tr className="border-b border-line last:border-b-0">
      <th scope="row" className="py-4 pr-4 text-left align-middle">
        <span
          className={cn(
            "font-display text-lg font-medium md:text-xl",
            v.live ? "text-accent" : "text-ink",
          )}
        >
          {v.name}
          {v.live && <span className="ml-1.5 text-base">✅</span>}
        </span>
      </th>
      <td
        className={cn(
          "hidden whitespace-nowrap py-4 pr-6 align-middle text-base md:table-cell md:text-lg",
          v.live ? "font-semibold text-ink" : "text-ink-muted",
        )}
      >
        {v.change}
      </td>
      <td className="w-full py-4 pr-4 align-middle">
        <span className="block h-7 w-full rounded-md bg-paper-2">
          <motion.span
            initial={false}
            animate={{ width, opacity: on ? 1 : 0.35 }}
            transition={
              still
                ? { duration: 0 }
                : i === V3 && on
                  ? { width: { duration: 1.6, times: [0, 0.5, 1], ease: ["easeIn", "backOut"] } }
                  : { type: "spring", stiffness: 110, damping: 20 }
            }
            className={cn(
              "block h-full rounded-md",
              v.live ? "bg-accent" : i === 0 ? "bg-ink-muted/50" : "bg-ink-muted/30",
            )}
          />
        </span>
      </td>
      <td className="py-4 pr-4 text-right align-middle font-display text-xl font-medium tabular-nums tracking-tight md:text-2xl">
        <span className={cn(v.live ? "text-accent" : "text-ink", !on && "opacity-0")}>
          <CountUp to={{ value: v.all, decimals: 2, suffix: "%" }} from={START} play={on} />
        </span>
      </td>
      <td className="whitespace-nowrap py-4 text-right align-middle text-sm tabular-nums text-ink-muted">
        <span className={cn("transition-opacity duration-300", !on && "opacity-0")}>
          {v.critical.toFixed(2)}%
        </span>
      </td>
    </tr>
  );
}

function VersionRace({ shown, bubble }: { shown: number; bubble: boolean }) {
  const still = useStill();
  return (
    <div className="relative flex flex-col gap-3">
      <table className="w-full">
        <caption className="sr-only">
          Share of low-quality items by version: all levels, and critical.
        </caption>
        <thead>
          <tr className="border-b border-line text-left text-sm text-ink-muted">
            <th scope="col" className="pb-3 pr-4 font-medium">
              Version
            </th>
            <th
              scope="col"
              className="hidden whitespace-nowrap pb-3 pr-6 font-medium md:table-cell"
            >
              What changed
            </th>
            <th scope="col" className="pb-3 pr-4 font-medium">
              <span className="sr-only">Bar</span>
            </th>
            <th scope="col" className="pb-3 pr-4 text-right font-medium">
              All levels
            </th>
            <th scope="col" className="pb-3 text-right font-medium">
              Critical
            </th>
          </tr>
        </thead>
        <tbody>
          {VERSIONS.map((v, i) => (
            <RaceRow key={v.name} v={v} i={i} on={i < shown} still={still} />
          ))}
        </tbody>
      </table>
      <div className="flex min-h-14 justify-end">
        <AnimatePresence>
          {bubble && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: still ? 0 : 1.2 }}
            >
              <ThoughtBubble emoji="🤔" text="Wait, why?" tail="none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Lands on the starting point; one version per scroll; then the call; a spare.
const RACE_STEPS = VERSIONS.length + 2;

export function Improvement() {
  return (
    <Chapter
      id="improvement"
      label="11 Improvement"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader label="11 IMPROVEMENT" headline="Two Fixes, Combined, Made It Worse" />
        <Body className="max-w-[48rem]">
          The A/B test showed the top slots matter most, so before the full rollout I went after{" "}
          <B>low-quality items</B>, products that didn’t really fit the theme. We graded them by
          severity, and I set one goal: <B>lower the overall share of low-quality items</B>.
        </Body>
        <Body className="max-w-[48rem]">
          Starting point: <B>9.17%</B> of items were low-quality at any level, and <B>0.76%</B> were
          critical.
        </Body>
      </div>

      <StickyScene steps={RACE_STEPS} vh={60} label="Low-quality items, version by version">
        {({ step, live }) => {
          const shown = live ? Math.min(step + 1, VERSIONS.length) : VERSIONS.length;
          const decided = !live || step >= VERSIONS.length;
          return (
            <div className={cn(wrap, "flex w-full flex-col gap-6")}>
              <VersionRace shown={shown} bubble={shown > V3 && !decided} />
              <motion.div
                initial={false}
                animate={decided ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="flex flex-col gap-4"
              >
                <p className="font-display text-[1.4rem] font-medium leading-snug tracking-tight text-ink md:text-[1.75rem]">
                  The obvious move was to combine both fixes. <B>It made things worse.</B>
                </p>
                <Body className="max-w-[52rem]">
                  Critical items were rare to begin with, so the bigger win was cutting low-quality
                  items overall. <B>v2 alone brought them from 9.17% to 2.64%</B>, so v2 went live.
                </Body>
              </motion.div>
            </div>
          );
        }}
      </StickyScene>
      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 12 Integration & Impact: SheetToHome                                */
/* ------------------------------------------------------------------ */

const PRESS = [
  {
    outlet: "Economist Korea",
    date: "Feb 2025",
    url: "https://economist.co.kr/article/view/ecn202502140048",
  },
  { outlet: "Viva100", date: "Feb 2025", url: "https://www.viva100.com/article/20250216500401" },
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
function TypedCells({
  children,
}: {
  children: (cells: string[], typing: boolean) => React.ReactNode;
}) {
  const { typed, done } = useTypewriter(NEW_TEXT, { speed: 28, startDelay: 400 });
  return <>{children(typed.split("\t"), !done)}</>;
}

// The sheet MDs launch from. The new row types itself in once the sheet is
// on screen.
function CampaignSheet({ typing, folded }: { typing: boolean; folded: boolean }) {
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const cellClass =
    "overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#e1e3e1] px-2 py-1.5 last:border-r-0";
  const row = (cells: string[], caretOn: boolean) => (
    <tr className="bg-[#e8f0fe]/60">
      {NEW_CELLS.map((full, k) => (
        <td key={full} className={cn(cellClass, k === 0 && "ring-2 ring-inset ring-[#1a73e8]")}>
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
    <motion.div
      ref={ref}
      initial={false}
      animate={folded ? { scaleY: 0.08, opacity: 0, y: -12 } : { scaleY: 1, opacity: 1, y: 0 }}
      transition={still ? { duration: 0 } : { duration: 0.55, ease: EASE_OUT }}
      className="origin-top"
    >
      <div
        role="img"
        aria-label={`The Campaign Management Sheet in Google Sheets. A new row is added: “${NEW_ROW.title}”, “${NEW_ROW.subtitle}”, running ${NEW_ROW.start} to ${NEW_ROW.end}.`}
        className="overflow-hidden rounded-xl border border-line bg-paper shadow-[0_20px_40px_-24px_rgba(21,21,21,0.35)]"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
          <SheetsIcon />
          <span className="text-sm font-medium text-ink">Campaign Management Sheet</span>
        </div>
        <div aria-hidden>
          <table className="w-full table-fixed border-collapse text-left text-[11.5px] text-[#202124]">
            <colgroup>
              <col className="w-[46%]" />
              <col className="w-[30%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead className="bg-[#f8f9fa] text-[11px] text-[#5f6368]">
              <tr className="border-b border-[#e1e3e1]">
                {["Title", "Subtitle", "Start", "End"].map((h) => (
                  <th key={h} className={cn(cellClass, "font-medium")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SHEET_ROWS.map((r) => (
                <tr key={r.title} className="border-b border-[#e1e3e1]">
                  {[r.title, r.subtitle, r.start, r.end].map((c) => (
                    <td key={c} className={cellClass}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
              {still || !typing ? (
                row(NEW_CELLS, false)
              ) : inView ? (
                <TypedCells>{(cells, caretOn) => row(cells, caretOn)}</TypedCells>
              ) : (
                row([], false)
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DataNote className="mt-2">Illustrative data.</DataNote>
    </motion.div>
  );
}

// What's left of the sheet once it has folded away: its one new row, sent on.
function SentRow({ shown }: { shown: boolean }) {
  return (
    <motion.p
      initial={false}
      animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.45, ease: EASE_OUT, delay: shown ? 0.35 : 0 }}
      className="flex w-fit items-center gap-2.5 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink shadow-sm"
    >
      <SheetsIcon className="h-4" />
      {NEW_ROW.title}
      <ArrowRight aria-hidden className="size-4 text-accent" />
      <span className="text-accent">Live</span>
    </motion.p>
  );
}

function IntegrationHeader() {
  return (
    <SectionHeader label="12 INTEGRATION & IMPACT" headline="Name a Theme, Get a Live Campaign" />
  );
}

function IntegrationBody() {
  return (
    <Body>
      MDs already worked in spreadsheets, so I designed the launch to happen there. They add a
      campaign to <B>a Google Sheet</B>, and the AI fills it, ranks it, and refreshes it every hour
      on the live homepage. Behind it, I designed how the AI connects to Kurly’s{" "}
      <B>inventory and content management tools</B>, so every campaign stays in stock and on brand.
    </Body>
  );
}

// 0 the row types in (the phone still shows 04's stale Friday) · 1 the sheet
// folds and the matcha campaign lands · 2 Wed · 3 Fri · 4 spare.
const SHEET_STEPS = 5;

function SheetScene({
  step,
  live,
  goTo,
}: {
  step: number;
  live: boolean;
  goTo: (i: number) => void;
}) {
  const sent = !live || step >= 1;
  const day = live ? Math.max(0, Math.min(step - 1, 2)) : 2;
  return (
    <PhoneSplit
      header={<IntegrationHeader />}
      copy={
        <>
          <IntegrationBody />
          <div className="grid">
            <div className="[grid-area:1/1]">
              <CampaignSheet typing={live && step === 0} folded={live && sent} />
            </div>
            {live && (
              <div className="[grid-area:1/1]">
                <SentRow shown={sent} />
              </div>
            )}
          </div>
        </>
      }
      phone={
        sent ? <HomePhone variant={AFTER} day={day} /> : <HomePhone variant={BEFORE} day={2} />
      }
      side={
        <>
          <motion.div
            initial={false}
            animate={{ opacity: sent ? 1 : 0.35 }}
            transition={{ duration: 0.4 }}
          >
            <DayTabs day={sent ? day : -1} onPick={live ? (i) => goTo(i + 1) : undefined} />
          </motion.div>
          <DayBubble bubble={AFTER.bubbles[day]} shown={sent && (!live || step >= 3)} />
        </>
      }
    />
  );
}

const LAUNCH = [
  "Open the sheet",
  "Add the campaign: title, subtitle, start and end dates",
  "Done 🎉",
];
const FLOW = [
  "MD",
  "Campaign Management Sheet",
  "Business logic + AI model",
  "Kurly frontend & backend (with inventory and content management)",
  "Monitoring",
];

function SystemFlow() {
  return (
    <figure
      role="img"
      aria-label="System flow: MD, Campaign Management Sheet, business logic and AI model, Kurly frontend and backend with inventory and content management, monitoring, and back to the MD."
      className="flex flex-col gap-0"
    >
      <ol
        aria-hidden
        className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-0"
      >
        {FLOW.map((node, i) => (
          <li key={node} className="flex flex-col items-center md:flex-1 md:flex-row">
            <span
              className={cn(
                "w-full rounded-xl border px-3 py-3 text-center text-sm leading-snug md:min-h-[4.5rem] md:content-center",
                i === 2 ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ink",
              )}
            >
              {node}
            </span>
            {i < FLOW.length - 1 && (
              <ArrowRight className="my-1 size-4 shrink-0 rotate-90 text-ink-muted md:mx-1.5 md:my-0 md:rotate-0" />
            )}
          </li>
        ))}
      </ol>
      {/* Back to the MD: a return line under the row. */}
      <div
        aria-hidden
        className="relative mx-[9%] hidden h-8 rounded-b-xl border-x border-b border-ink-muted/40 md:block"
      >
        <span className="absolute -left-[5px] -top-1 size-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-ink-muted/60" />
        <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-paper px-2 text-xs text-ink-muted">
          back to MD
        </span>
      </div>
      <p aria-hidden className="pt-2 text-center text-xs text-ink-muted md:hidden">
        ↺ back to MD
      </p>
    </figure>
  );
}

const IMPACT: { to?: Num; text?: string; extra?: string; label: string }[] = [
  { to: { value: 25, suffix: "%" }, label: "of key homepage campaign slots run fully by AI" },
  { to: { value: 200, suffix: "+" }, label: "campaigns run by AI" },
  { to: { value: 2 }, extra: "days / week", label: "of MD time saved" },
  { text: "On par", label: "with hand-picked campaigns, with more diverse categories" },
];

export function IntegrationImpact() {
  const stage = useRef<HTMLDivElement>(null);
  const goTo = (i: number) => {
    const scene = stage.current?.firstElementChild;
    if (scene instanceof HTMLElement) scrollToStep(scene, i, SHEET_STEPS);
  };
  return (
    <Chapter
      id="integration-impact"
      label="12 Integration & Impact"
      className="border-t border-line pt-10 md:pt-0"
    >
      <div ref={stage}>
        <StickyScene
          steps={SHEET_STEPS}
          vh={90}
          label="A row in the Google Sheet becomes a live campaign on the homepage"
        >
          {({ step, live }) => <SheetScene step={step} live={live} goTo={goTo} />}
        </StickyScene>
      </div>

      <div className={cn(wrap, "flex flex-col gap-20 pt-16")}>
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div className="flex flex-col gap-5">
            <SubHeading>How to launch</SubHeading>
            <ol className="flex flex-col gap-3">
              {LAUNCH.map((s, i) => (
                <Reveal as="li" key={s} delay={i * 0.1} className="flex items-baseline gap-3">
                  <span className="font-display text-lg font-medium text-accent">{i + 1}</span>
                  <span className="text-base leading-relaxed text-ink md:text-lg">{s}</span>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-5">
            <SubHeading>System flow</SubHeading>
            <SystemFlow />
          </div>
        </div>
      </div>

      <ProgressBeat from={3} lit={4} label="AI now runs the core homepage slots" />

      <div className={cn(wrap, "flex flex-col gap-20 pb-8")}>
        <div className="grid gap-10 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {IMPACT.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              {m.to ? (
                <MetricCounter
                  size="lg"
                  to={m.to}
                  extra={m.extra}
                  label={m.label}
                  className={CENTERED}
                />
              ) : (
                <div className={cn("flex flex-col gap-2", CENTERED)}>
                  <p className="font-display text-[2.75rem] font-medium leading-none tracking-tight text-accent md:text-[3.5rem]">
                    {m.text}
                  </p>
                  <p className="text-sm font-medium text-ink-muted">{m.label}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Body className="mx-auto max-w-[44rem] text-center">
            The same logic was requested for the search tab and for Beauty Kurly, and{" "}
            <B>went live on Beauty Kurly in 2025</B>, after I left.
          </Body>
          <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2">
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
        </Reveal>

        <div className="grid items-center gap-10 rounded-2xl bg-paper-2/60 p-6 md:grid-cols-[1fr_auto] md:gap-14 md:p-10">
          <div className="flex flex-col gap-4">
            <SubHeading>The First Step Toward a Personal Homepage</SubHeading>
            <Body>
              Once campaigns could run themselves, the only limit on how many we could have was
              ideas. And with enough campaigns, plus a sense of each customer’s taste, the homepage
              could <B>show every customer the campaigns that fit them</B>.
            </Body>
          </div>
          <RoadmapGrid9 spread />
        </div>
      </div>
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
