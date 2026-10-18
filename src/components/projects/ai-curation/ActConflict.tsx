"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, StickyScene, useStill } from "../story/motion";
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
import {
  CHINESE,
  HOLIDAY,
  MATCHA,
  PRODUCTS,
  SNACK,
  STALE_SECTIONS,
  YEAR_END,
  toSection,
} from "./data";
import { FEED_END, HomeScreen, MessageCard, ProductImage, QuoteCard, type HomeDay } from "./ui";

// Act 2, Conflict: 04 User Problem · 05 Company's Problem (spec §5.5–5.6).

/* ------------------------------------------------------------------ */
/* StaleHomeScene (04, and 12's After)                                 */
/* ------------------------------------------------------------------ */

const { yearend, snack } = PRODUCTS;

type Bubble = { emoji: string; text: string } | null;
export type HomeVariant = { days: HomeDay[]; bubbles: Bubble[] };

// The same three campaigns all week, only reshuffled, with more of their
// products sold out or gone each day.
const [LOW_SUGAR, GOURMET, FRUIT] = STALE_SECTIONS;
export const BEFORE: HomeVariant = {
  days: [
    { sections: [LOW_SUGAR, GOURMET, FRUIT] },
    {
      sections: [FRUIT, LOW_SUGAR, GOURMET],
      soldOut: ["lowsugar-2", "fruit-2"],
    },
    {
      sections: [GOURMET, FRUIT, LOW_SUGAR],
      soldOut: ["lowsugar-2", "gourmet-1", "fruit-2"],
      gone: ["lowsugar-3", "gourmet-2", "fruit-1"],
    },
  ],
  bubbles: [
    { emoji: "🙂", text: "Let’s see what’s new." },
    { emoji: "😐", text: "Didn’t I see this already?" },
    { emoji: "🥱", text: "Same old." },
  ],
};

const MATCHA_ROW = toSection(MATCHA, "Creamy, earthy and everywhere right now");
const SNACK_ROW = toSection(SNACK, "Sweet and salty picks for any break", snack.slice(0, 3));
const CHINESE_ROW = toSection(CHINESE, "Takeout favorites, ready at home");
const yearEndRow = (products = yearend) =>
  toSection(YEAR_END, "Stollen, tarts and treats for the holidays", products);

export const AFTER: HomeVariant = {
  days: [
    {
      sections: [MATCHA_ROW, yearEndRow([yearend[0], yearend[2], yearend[4]]), CHINESE_ROW],
    },
    { sections: [CHINESE_ROW, SNACK_ROW, MATCHA_ROW] },
    {
      sections: [SNACK_ROW, yearEndRow([yearend[1], yearend[3], yearend[5]]), CHINESE_ROW],
    },
  ],
  bubbles: [null, null, { emoji: "😍", text: "Oh, I didn’t know they had this." }],
};

export const DAYS = ["Mon", "Wed", "Fri"];
// How long the Before feed takes to scroll through its three rows, in s.
const SCROLL_S = 2.8;

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

// The phone on the homepage, one day per beat. In the Before, each day a
// finger scrolls the feed from the top to the bottom.
export function HomePhone({
  variant,
  day,
  scrolled = false,
  children,
}: {
  variant: HomeVariant;
  day: number;
  scrolled?: boolean;
  // Drawn over the screen (12's arriving campaign).
  children?: React.ReactNode;
}) {
  const still = useStill();
  return (
    <PhoneFrame>
      <div className="@container absolute inset-0">
        <HomeScreen
          day={variant.days[day]}
          scroll={scrolled ? FEED_END : 0}
          glide={scrolled ? SCROLL_S : 0.45}
        />
        {/* The finger: a soft dot that drags up the screen with the feed. */}
        {scrolled && !still && (
          <motion.span
            key={day}
            aria-hidden
            initial={{ top: "85%", opacity: 0 }}
            animate={{
              top: ["85%", "82%", "30%", "28%"],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: SCROLL_S,
              times: [0, 0.08, 0.92, 1],
              ease: "easeInOut",
            }}
            className="absolute left-[58%] z-20 size-[12cqw] -translate-x-1/2 rounded-full border-2 border-white bg-ink/25 shadow-lg"
          />
        )}
        {children}
      </div>
    </PhoneFrame>
  );
}

// Beside the stale phone, level with its bottom.
export function LabelNote() {
  return (
    <p className="mt-auto text-xs leading-relaxed text-ink-muted">
      The Sold Out and No Longer Sold labels are added to explain; the app doesn’t show them.
    </p>
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
        But as campaigns went untouched, the homepage lost its variety:{" "}
        <B>the same campaigns ran for weeks on end</B>, and with no one managing the products, more
        and more of them were sold out or no longer sold.
      </Body>
      <Body>
        As a result, customers were losing <B>the joy of finding new products</B>.
      </Body>
    </div>
  );
}

// Each day: a beat on the top of the feed, then the scroll down. Restarts
// whenever a day is landed on.
function useScrollThrough(day: number, active: boolean) {
  const [started, setStarted] = useState<number | null>(null);
  if (started !== null && (started !== day || !active)) setStarted(null);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(day), 700);
    return () => clearTimeout(t);
  }, [day, active]);
  return started === day;
}

// How long each day stays up before the next one plays on its own, in ms:
// the beat on top, the scroll down, then a moment to read the thought.
const DAY_MS = 700 + SCROLL_S * 1000 + 1500;

// The day on screen. It plays on by itself while the scene is in view, and
// each scroll step moves it one day on (or back), so scrolling never waits
// for the timer. Out of view, it falls back to the scroll position.
function useDay(step: number, active: boolean) {
  const clamp = (d: number) => Math.min(2, Math.max(0, d));
  const [day, setDay] = useState(clamp(step));
  const [lastStep, setLastStep] = useState(step);
  if (step !== lastStep) {
    setLastStep(step);
    setDay(clamp(day + step - lastStep));
  } else if (!active && day !== clamp(step)) {
    setDay(clamp(step));
  }
  useEffect(() => {
    if (!active || day >= 2) return;
    const t = setTimeout(() => setDay(day + 1), DAY_MS);
    return () => clearTimeout(t);
  }, [day, active]);
  return [day, setDay] as const;
}

function StaleScene({ step, live }: { step: number; live: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const active = live && inView;
  const [day, setDay] = useDay(step, active);
  const scrolled = useScrollThrough(day, active);
  return (
    <div ref={ref} className="w-full">
      <PhoneSplit
        header={<UserProblemHeader />}
        copy={<UserProblemBody />}
        phone={<HomePhone variant={BEFORE} day={day} scrolled={live && scrolled} />}
        side={
          <>
            <DayTabs day={day} onPick={live ? setDay : undefined} />
            <DayBubble bubble={BEFORE.bubbles[day]} shown />
            <LabelNote />
          </>
        }
      />
    </div>
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
        <>
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
          <LabelNote />
        </>
      }
    />
  );
}

// One scroll step per day, plus a spare so Friday has room to play.
const STALE_STEPS = 4;

export function UserProblem() {
  return (
    <Chapter id="user-problem" label="04 User Problem" className="border-t border-line">
      <StickyScene
        steps={STALE_STEPS}
        vh={100}
        label="The same homepage on Monday, Wednesday and Friday"
        still={() => <StaleStill />}
      >
        {({ step, live }) => <StaleScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Company's Problem                                                */
/* ------------------------------------------------------------------ */

// A: the campaign nobody can look after. On a loop it shrinks, fades and
// drifts off to the top right, asking not to be forgotten.
// Shrink progress p (0 to 1) → where the card is. The bubble sits outside
// the card's scale so it stays readable, so it's placed from the same p:
// hanging off the shrunken card's bottom-left corner. The drift right is
// kept short so the bubble stays on screen. Card size is approximate.
const CARD_W = 380;
const CARD_H = 300;
const drift = (p: number) => {
  const scale = 1 - 0.7 * p;
  const x = 90 * p;
  const y = -150 * p;
  return {
    scale,
    x,
    y,
    opacity: 1 - 0.65 * p,
    bubbleX: x - (CARD_W / 2) * scale,
    bubbleY: y + (CARD_H / 2) * scale,
  };
};
// Fade in, a short hold, a 3.5s shrink, then gone; the bubble shows up once
// the shrink is 70% done. In seconds, then as fractions of the loop.
const [FADE_IN_S, HOLD_S, SHRINK_S, OUT_S] = [0.3, 0.4, 3.5, 0.45];
const DRIFT_S = FADE_IN_S + HOLD_S + SHRINK_S + OUT_S;
const FADE_END = FADE_IN_S / DRIFT_S;
const HOLD_END = (FADE_IN_S + HOLD_S) / DRIFT_S;
const SHRINK_END = (FADE_IN_S + HOLD_S + SHRINK_S) / DRIFT_S;
const atP = (p: number) => HOLD_END + p * (SHRINK_END - HOLD_END);
const START = drift(0);
const SPEAK = drift(0.7);
const END = drift(1);

function DriftingCampaign() {
  const still = useStill();
  const loop = { duration: DRIFT_S, repeat: Infinity, repeatDelay: 0.6, ease: "linear" } as const;
  return (
    <div
      role="img"
      aria-label="The “Aesthetic Holiday Prep is On” campaign card shrinks, fades and drifts away, saying “Don’t forget me!”"
      className="relative w-full max-w-[420px]"
    >
      {!still && (
        <motion.div
          animate={{
            opacity: [0, 0, 1, 1, 0],
            x: [SPEAK.bubbleX, SPEAK.bubbleX, SPEAK.bubbleX, END.bubbleX, END.bubbleX],
            y: [SPEAK.bubbleY, SPEAK.bubbleY, SPEAK.bubbleY, END.bubbleY, END.bubbleY],
          }}
          transition={{ ...loop, times: [0, atP(0.7), atP(0.74), SHRINK_END, 1] }}
          className="absolute left-1/2 top-1/2 z-10"
        >
          <div className="absolute -left-4 top-2.5">
            <ThoughtBubble
              emoji="🥺"
              text="Don’t forget me!"
              tail="top"
              className="whitespace-nowrap"
            />
          </div>
        </motion.div>
      )}
      {still && (
        <div className="absolute -bottom-14 left-0 z-10">
          <ThoughtBubble emoji="🥺" text="Don’t forget me!" tail="top" />
        </div>
      )}
      <motion.div
        animate={
          still
            ? undefined
            : {
                opacity: [0, 1, START.opacity, SPEAK.opacity, END.opacity, 0],
                scale: [1, 1, START.scale, SPEAK.scale, END.scale, END.scale],
                x: [0, 0, START.x, SPEAK.x, END.x, END.x],
                y: [0, 0, START.y, SPEAK.y, END.y, END.y],
              }
        }
        transition={
          still
            ? { duration: 0 }
            : { ...loop, times: [0, FADE_END, HOLD_END, atP(0.7), SHRINK_END, 1] }
        }
      >
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-[0_20px_40px_-24px_rgba(21,21,21,0.3)]">
          <p className="pb-3 text-base font-semibold text-ink">
            {HOLIDAY.emoji} {HOLIDAY.title} ›
          </p>
          <ul className="grid grid-cols-3 gap-2 text-sm">
            {HOLIDAY.products.map((p) => (
              <li key={p.id}>
                <ProductImage product={p} className="text-[13px]" />
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

// B: 40K+ products in front of one new MD. On a loop the wall fills with more
// tiles and the MD looks smaller, until they're lost. `hold` is how long
// each level stays up, in ms.
const WALL = [
  { cols: 6, rows: 4, avatar: 1, hold: 1200 },
  { cols: 12, rows: 8, avatar: 0.72, hold: 1200 },
  { cols: 20, rows: 13, avatar: 0.5, hold: 2400 },
];
const ALL_PRODUCTS = Object.values(PRODUCTS).flat();
// Tiles in a shuffled order, so the full wall doesn't show a pattern. Seeded
// (mulberry32) so server and client agree.
const TILES = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const { cols, rows } = WALL[WALL.length - 1];
  return Array.from(
    { length: cols * rows },
    () => ALL_PRODUCTS[Math.floor(rand() * ALL_PRODUCTS.length)],
  );
})();
// The avatar block is ~114px tall and scales about its centre, so at the
// smallest level its top sits this far below the unscaled top.
const LOST_NUDGE = (114 / 2) * (1 - WALL[WALL.length - 1].avatar);

function ProductWall() {
  const still = useStill();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (still) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % WALL.length), WALL[step].hold);
    return () => clearTimeout(id);
  }, [step, still]);
  const level = still ? WALL.length - 1 : step;
  const { cols, rows, avatar } = WALL[level];
  const lost = level === WALL.length - 1;
  return (
    <div className="flex w-full max-w-[440px] flex-col gap-3">
      <p className="font-display text-lg font-semibold text-ink">40K+ Products</p>
      <div
        role="img"
        aria-label="A wall of product tiles that keeps growing, with one new MD in the middle, looking smaller and smaller until they say “I’m lost.”"
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
              <ProductImage product={TILES[i]} className="rounded-none" />
            </motion.span>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={false}
            animate={{ scale: avatar }}
            transition={still ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 18 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="rounded-full bg-paper p-1.5 shadow-[0_12px_28px_-10px_rgba(21,21,21,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
              <img
                src="/images/ai-curation/people/new-md.webp"
                alt=""
                width={240}
                height={240}
                className="block size-[76px] rounded-full object-cover"
              />
            </span>
            <span className="rounded-full bg-paper px-2.5 py-0.5 text-xs font-medium text-ink shadow-sm">
              New MD
            </span>
          </motion.div>
          {/* At its smallest, the new MD speaks up, as the wall fills. Sits
            outside the scale so the bubble keeps its size; nudged down to
            meet the shrunken head. Gone at once when the loop restarts. */}
          <AnimatePresence>
            {lost && (
              <motion.div
                initial={still ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={
                  still ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 20 }
                }
                style={{ y: LOST_NUDGE }}
                className="absolute bottom-full left-1/2 -ml-9 mb-1 origin-bottom-left"
              >
                <ThoughtBubble
                  emoji="😵‍💫"
                  text="I’m lost…"
                  tail="bottom"
                  className="whitespace-nowrap"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
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

// Which part each scroll step shows. The visuals play on their own, so each
// part just gets two steps of room.
const COMPANY_STEPS = [0, 0, 1, 1, 2, 2];

function PartVisual({ part }: { part: number }) {
  if (part === 0) return <DriftingCampaign />;
  if (part === 1) return <ProductWall />;
  return <MessageCard quote={ASK} shown />;
}

function PartBeat({ part }: { part: number }) {
  return (
    // Fixed row height, copy pinned to the top: titles and paragraphs stay put
    // as the visuals change size.
    <div className="grid items-start gap-10 md:h-[24rem] md:grid-cols-[1fr_1fr] md:gap-14">
      <div className="flex flex-col gap-6">
        <p className="font-display text-lg font-medium text-ink md:text-xl">{PARTS[part].name}</p>
        {PARTS[part].copy}
      </div>
      {/* The ask's message is short: lift it level with the copy. */}
      <div
        className={cn(
          "flex h-full justify-center",
          part === 2 ? "items-start md:pt-12" : "items-center",
        )}
      >
        <PartVisual part={part} />
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
        steps={COMPANY_STEPS.length}
        vh={70}
        label="Campaigns left on hold, too many products to learn, and the MD team’s ask"
        still={() => (
          <div className={cn(wrap, "flex flex-col gap-16 py-10")}>
            <CompanyHeader />
            {PARTS.map((p, i) => (
              <PartBeat key={p.name} part={i} />
            ))}
          </div>
        )}
      >
        {({ step }) => {
          const part = COMPANY_STEPS[step];
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
                {/* No initial={false}: it would pass down and freeze the
                    looping visuals of the part shown on load. */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={part}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                  >
                    <PartBeat part={part} />
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
