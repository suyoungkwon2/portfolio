"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, StickyScene, scrollToStep, useStill } from "../story/motion";
import {
  B,
  Body,
  Chapter,
  Kicker,
  PhoneFrame,
  PhoneSplit,
  SectionHeader,
  ThoughtBubble,
  wrap,
} from "../story/ui";
import { CHINESE, HOLIDAY, MATCHA, PRODUCTS, SNACK, YEAR_END, type Product } from "./data";
import { HomeScreen, MdAvatar, MessageCard, ProductImage, QuoteCard, type HomeDay } from "./ui";

// Act 2, Conflict: 04 User Problem · 05 Company's Problem (spec §5.5–5.6).

/* ------------------------------------------------------------------ */
/* StaleHomeScene (04, and 12's After)                                 */
/* ------------------------------------------------------------------ */

const { yearend, snack, chinese } = PRODUCTS;
const BEST: Product[] = [chinese[1], snack[4], snack[5]];

type Bubble = { emoji: string; text: string } | null;
export type HomeVariant = {
  days: HomeDay[];
  bubbles: Bubble[];
  // How grey the screen gets, day by day (CSS saturate).
  saturate: number[];
};

const SAME_SECOND = { theme: SNACK, products: [yearend[0], snack[0], snack[1]] };
export const BEFORE: HomeVariant = {
  days: [
    { main: HOLIDAY, second: SAME_SECOND },
    { main: HOLIDAY, second: SAME_SECOND, soldOut: [yearend[3].id] },
    {
      main: HOLIDAY,
      second: SAME_SECOND,
      soldOut: [yearend[1].id, yearend[3].id, yearend[5].id],
      same: true,
    },
  ],
  bubbles: [
    { emoji: "🙂", text: "Let’s see what’s new." },
    { emoji: "😐", text: "Didn’t I see this already?" },
    { emoji: "🥱", text: "Same old." },
  ],
  saturate: [1, 0.75, 0.45],
};

export const AFTER: HomeVariant = {
  days: [
    { main: MATCHA, second: { theme: YEAR_END, products: [yearend[0], yearend[2], yearend[4]] } },
    { main: CHINESE, second: { theme: SNACK, products: snack.slice(0, 3) } },
    { main: SNACK, second: { theme: YEAR_END, products: [yearend[1], yearend[3], yearend[5]] } },
  ],
  bubbles: [null, null, { emoji: "😍", text: "Oh, I didn’t know they had this." }],
  saturate: [1, 1, 1],
};

export const DAYS = ["Mon", "Wed", "Fri"];
// How far the stale feed is flicked past, in cqw.
const FLICK = 64;

// Mon / Wed / Fri, like 04's tabs. Clicking one scrolls to it.
export function DayTabs({ day, onPick }: { day: number; onPick?: (i: number) => void }) {
  return (
    <ol aria-label="Days of the week" className="flex gap-2">
      {DAYS.map((d, i) => (
        <li key={d}>
          <button
            type="button"
            aria-current={i === day ? "step" : undefined}
            onClick={() => onPick?.(i)}
            className={cn(
              "h-10 w-16 rounded-full border text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              i === day
                ? "border-accent bg-accent text-paper"
                : "border-line bg-paper text-ink hover:border-accent",
            )}
          >
            {d}
          </button>
        </li>
      ))}
    </ol>
  );
}

// The phone on the homepage, one day per beat. In the Before, Friday ends
// with a finger flicking straight past the campaign.
export function HomePhone({
  variant,
  day,
  flicked = false,
  children,
}: {
  variant: HomeVariant;
  day: number;
  flicked?: boolean;
  // Drawn over the screen (12's arriving campaign).
  children?: React.ReactNode;
}) {
  const still = useStill();
  return (
    <div className="flex flex-col items-center gap-3">
      <PhoneFrame muted={variant === BEFORE && day === 2}>
        <div
          className="@container absolute inset-0 transition-[filter] duration-700"
          style={{ filter: `saturate(${variant.saturate[day]})` }}
        >
          <HomeScreen day={variant.days[day]} best={BEST} scroll={flicked ? FLICK : 0} />
          {/* The finger: a soft dot that sweeps up the screen once. */}
          {flicked && !still && (
            <motion.span
              aria-hidden
              initial={{ top: "92%", opacity: 0 }}
              animate={{ top: ["92%", "88%", "30%"], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.55, times: [0, 0.2, 1], ease: "easeOut" }}
              className="absolute left-[58%] z-20 size-[12cqw] -translate-x-1/2 rounded-full border-2 border-white bg-ink/25 shadow-lg"
            />
          )}
          {children}
        </div>
      </PhoneFrame>
      <p className="text-xs text-ink-muted">Illustrative scene.</p>
    </div>
  );
}

export function DayBubble({ bubble, shown }: { bubble: Bubble; shown: boolean }) {
  return (
    <div className="min-h-24">
      <AnimatePresence mode="wait">
        {bubble && shown && (
          <motion.div
            key={bubble.text}
            initial={{ opacity: 0, x: -10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.2 }}
          >
            <ThoughtBubble emoji={bubble.emoji} text={bubble.text} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 User Problem                                                     */
/* ------------------------------------------------------------------ */

function UserProblemHeader() {
  return (
    <SectionHeader label="04 USER PROBLEM" headline="The Homepage Stopped Surprising Anyone" />
  );
}

function UserProblemBody() {
  return (
    <div className="flex flex-col gap-4">
      <Body>
        Kurly customers love the products its MDs pick for them, and <B>“the joy of discovery”</B>{" "}
        is one of the company’s goals.
      </Body>
      <Body>
        But as campaigns went untouched, the homepage lost its variety: the same products stayed for
        weeks, sold-out items lingered, and <B>one campaign started to look a lot like the next</B>.
      </Body>
    </div>
  );
}

// Friday's flick, then its bubble. Restarts each time Friday is landed on.
function useFriday(active: boolean) {
  const [phase, setPhase] = useState(0);
  if (!active && phase !== 0) setPhase(0);
  useEffect(() => {
    if (!active) return;
    const a = setTimeout(() => setPhase(1), 1300);
    const b = setTimeout(() => setPhase(2), 1800);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [active]);
  return phase;
}

function StaleScene({
  step,
  live,
  goTo,
}: {
  step: number;
  live: boolean;
  goTo: (i: number) => void;
}) {
  const day = Math.min(step, 2);
  const friday = useFriday(live && day === 2);
  const flicked = live && friday >= 1;
  // Friday's bubble waits for the flick; the other days speak on arrival.
  const bubbleShown = !live || day < 2 || friday >= 2;
  return (
    <PhoneSplit
      header={<UserProblemHeader />}
      copy={<UserProblemBody />}
      phone={<HomePhone variant={BEFORE} day={day} flicked={flicked} />}
      side={
        <>
          <DayTabs day={day} onPick={live ? goTo : undefined} />
          <DayBubble bubble={BEFORE.bubbles[day]} shown={bubbleShown} />
        </>
      }
    />
  );
}

// Phones and reduced motion: Friday's screen, with all three days' thoughts.
function StaleStill() {
  return (
    <PhoneSplit
      header={<UserProblemHeader />}
      copy={<UserProblemBody />}
      phone={<HomePhone variant={BEFORE} day={2} />}
      side={
        <ol className="flex flex-col gap-4">
          {BEFORE.bubbles.map((b, i) => (
            <li key={DAYS[i]} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
                {DAYS[i]}
              </span>
              {b && <ThoughtBubble emoji={b.emoji} text={b.text} tail="none" />}
            </li>
          ))}
        </ol>
      }
    />
  );
}

// One scroll step per day, plus a spare so Friday's flick can't be skipped.
const STALE_STEPS = 4;

export function UserProblem() {
  const stage = useRef<HTMLDivElement>(null);
  const goTo = (i: number) => {
    const scene = stage.current?.firstElementChild;
    if (scene instanceof HTMLElement) scrollToStep(scene, i, STALE_STEPS);
  };
  return (
    <Chapter id="user-problem" label="04 User Problem" className="border-t border-line">
      <div ref={stage}>
        <StickyScene
          steps={STALE_STEPS}
          vh={100}
          label="The same homepage on Monday, Wednesday and Friday"
          still={() => <StaleStill />}
        >
          {({ step, live }) => <StaleScene step={step} live={live} goTo={goTo} />}
        </StickyScene>
      </div>
      <Kicker>Kurly promised discovery. The homepage was delivering repetition.</Kicker>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Company's Problem                                                */
/* ------------------------------------------------------------------ */

// A: the campaign nobody can look after: dust settles, sold-outs pile up.
function DustyCampaign({ dusty }: { dusty: boolean }) {
  const still = useStill();
  const products = HOLIDAY.products;
  const soldOut = dusty ? [1, 3, 4, 5] : [];
  return (
    <div
      role="img"
      aria-label={
        dusty
          ? "The “Aesthetic Holiday Prep is On” campaign card, greyed over like dust, with four of its six products sold out."
          : "The “Aesthetic Holiday Prep is On” campaign card with six products."
      }
      className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-line bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(21,21,21,0.3)]"
    >
      <p className="pb-3 text-base font-semibold text-ink">
        {HOLIDAY.emoji} {HOLIDAY.title} ›
      </p>
      <ul className="grid grid-cols-3 gap-2 text-sm">
        {products.map((p, i) => (
          <li key={p.id}>
            <ProductImage product={p} soldOut={soldOut.includes(i)} className="text-[13px]" />
          </li>
        ))}
      </ul>
      {/* Dust: a grey veil with a little grain. */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: dusty ? 1 : 0 }}
        transition={still ? { duration: 0 } : { duration: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0 bg-[#9a9a96]/35 [background-image:radial-gradient(rgba(80,80,76,0.35)_1px,transparent_1.4px)] [background-size:7px_7px]"
      />
    </div>
  );
}

// B: 40K+ products in front of one new MD. More tiles each beat; the MD
// looks smaller.
const WALL = [
  { cols: 6, rows: 4, avatar: 1 },
  { cols: 12, rows: 8, avatar: 0.72 },
  { cols: 20, rows: 13, avatar: 0.5 },
];
const ALL_PRODUCTS = Object.values(PRODUCTS).flat();

function ProductWall({ level }: { level: number }) {
  const { cols, rows, avatar } = WALL[level];
  const still = useStill();
  return (
    <div
      role="img"
      aria-label="A wall of product tiles that keeps growing, with one new MD in front of it, looking smaller and smaller."
      className="relative aspect-[4/3] w-full max-w-[440px] overflow-hidden rounded-2xl bg-paper-2"
    >
      <div
        className="grid h-full gap-[3px] p-[3px] transition-[grid-template-columns] duration-700"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols * rows }, (_, i) => (
          <motion.span
            key={i}
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: still ? 0 : (i % 17) * 0.02 }}
            className="block aspect-square overflow-hidden rounded-[3px]"
          >
            <ProductImage
              product={ALL_PRODUCTS[(i * 7 + Math.floor(i / cols) * 11) % ALL_PRODUCTS.length]}
              className="rounded-none"
            />
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={false}
        animate={{ scale: avatar }}
        transition={still ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 18 }}
        className="absolute bottom-4 left-1/2 -ml-11 flex origin-bottom flex-col items-center gap-1"
      >
        <span className="rounded-full bg-paper p-1.5 shadow-[0_12px_28px_-10px_rgba(21,21,21,0.5)]">
          <MdAvatar tone={2} className="size-[76px]" />
        </span>
        <span className="rounded-full bg-paper px-2.5 py-0.5 text-xs font-medium text-ink shadow-sm">
          New MD
        </span>
      </motion.div>
    </div>
  );
}

const PARTS = [
  {
    name: "Left on hold",
    copy: (
      <>
        <Body>
          Every campaign needed daily care as products sold out and sales shifted. With fewer MDs,
          that care stopped, and <B>outdated campaigns meant missed sales</B>.
        </Body>
        <QuoteCard quote="We know it needs to be done. It’s just been on hold for a while. We’re blocked." />
      </>
    ),
  },
  {
    name: "Hard to catch up",
    copy: (
      <Body>
        New MDs joined, but getting to know <B>40K+ products</B> well enough to curate takes time.
        Campaigns waited while they ramped up.
      </Body>
    ),
  },
  {
    name: "The ask",
    copy: <Body>Then the MD team came to us with a question:</Body>,
  },
];
const ASK = "A lot of our work is blocked right now. Is there anything we could automate?";

// Which part each scroll step shows, and its beat within the part.
const COMPANY_BEATS = [
  { part: 0, beat: 0 },
  { part: 0, beat: 1 },
  { part: 1, beat: 0 },
  { part: 1, beat: 1 },
  { part: 1, beat: 2 },
  { part: 2, beat: 0 },
  { part: 2, beat: 0 },
];

function PartVisual({ part, beat, live }: { part: number; beat: number; live: boolean }) {
  if (part === 0) return <DustyCampaign dusty={!live || beat >= 1} />;
  if (part === 1) return <ProductWall level={live ? beat : WALL.length - 1} />;
  return <MessageCard quote={ASK} shown />;
}

function PartBeat({ part, beat, live }: { part: number; beat: number; live: boolean }) {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
      <div className="flex flex-col gap-6">
        <p className="font-display text-lg font-medium text-ink md:text-xl">{PARTS[part].name}</p>
        {PARTS[part].copy}
      </div>
      <div className="flex justify-center">
        <PartVisual part={part} beat={beat} live={live} />
      </div>
    </div>
  );
}

function CompanyHeader() {
  return (
    <SectionHeader label="05 COMPANY’S PROBLEM" headline="Fewer Hands, the Same 40K+ Products" />
  );
}

export function CompanyProblem() {
  return (
    <Chapter id="company-problem" label="05 Company’s Problem" className="border-t border-line">
      <StickyScene
        steps={COMPANY_BEATS.length}
        vh={70}
        label="Campaigns left on hold, too many products to learn, and the MD team’s ask"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-16 py-10")}>
            <CompanyHeader />
            {PARTS.map((p, i) => (
              <PartBeat key={p.name} part={i} beat={0} live={false} />
            ))}
          </div>
        )}
      >
        {({ step }) => {
          const { part, beat } = COMPANY_BEATS[step];
          return (
            <div className={cn(wrap, "flex w-full flex-col gap-8 md:gap-10")}>
              <CompanyHeader />
              <div className="grid w-full gap-10 md:grid-cols-[11rem_1fr] md:gap-12">
                <ol aria-label="Three problems" className="flex flex-col gap-1 self-start pt-1">
                  {PARTS.map((p, i) => (
                    <li
                      key={p.name}
                      aria-current={i === part ? "step" : undefined}
                      className={cn(
                        "flex items-baseline gap-3 border-l-2 py-2 pl-4 transition-colors duration-500",
                        i === part ? "border-accent text-ink" : "border-line text-ink-muted/60",
                      )}
                    >
                      <span className="text-xs font-semibold">{i + 1}</span>
                      <span className="font-display text-base font-medium">{p.name}</span>
                    </li>
                  ))}
                </ol>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={part}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <PartBeat part={part} beat={beat} live />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          );
        }}
      </StickyScene>

      <div className={cn(wrap, "pt-16")}>
        <p className="mx-auto max-w-[44rem] text-center font-display text-[1.4rem] font-medium leading-snug tracking-tight text-ink text-balance md:text-[1.75rem]">
          But curation was Kurly’s core value. Handing homepage picks to a machine raised a real
          question: <B>could AI pick like a Kurly MD</B>, without costing customers’ trust?
        </p>
      </div>
      <Kicker>
        So before building anything, I sat down with the people who do this every day. ↓
      </Kicker>
    </Chapter>
  );
}
