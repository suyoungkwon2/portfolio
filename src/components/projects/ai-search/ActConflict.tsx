"use client";

import { AnimatePresence, motion, useInView, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { SCREENS, SearchQuery } from "./ActSetup";
import { IosKeyboard } from "./IosKeyboard";
import { EASE_OUT, Reveal, StickyScene, useHeldClock } from "./motion";
import { B, Body, Chapter, CountUp, PhoneFrame, SectionHeader, ThoughtBubble, wrap } from "./ui";

// Act 2, Conflict: 04 User Problem · 05 Company's Problem (spec §5.4–5.5).

// The query being typed, with its failure type above it.
export function QueryCaption({
  type,
  query,
  note,
}: {
  type: string;
  query: string;
  note?: string;
}) {
  return (
    <>
      {note && <p className="text-sm font-medium text-ink-muted">{note}</p>}
      <p className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-accent md:text-2xl">
        {type}
      </p>
      <p className="font-mono text-2xl text-ink md:text-[1.75rem]">{query}</p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 04 User Problem                                                     */
/* ------------------------------------------------------------------ */

export type Want = { name: string; src: string };

export const CABBAGE: Want = {
  name: "Cabbage",
  src: "/images/ai-search/want/cabbage.webp",
};
export const JALAPENO: Want = {
  name: "Jalapeño",
  src: "/images/ai-search/want/jalapeno.webp",
};

type Attempt = {
  type: string;
  query: string;
  want: Want;
  emoji: string;
  bubble: string;
};

const ATTEMPTS: Attempt[] = [
  {
    type: "Misspelling",
    query: "cabage",
    want: CABBAGE,
    emoji: "🤔",
    bubble: "Huh, no cabbage today?",
  },
  {
    type: "Spacing",
    query: "ca bbage",
    want: CABBAGE,
    emoji: "😕",
    bubble: "Maybe I typed it wrong…",
  },
  {
    type: "Synonym",
    query: "cole",
    want: CABBAGE,
    emoji: "😤",
    bubble: "I know you sell this.",
  },
  {
    type: "Foreign word",
    query: "halapeno",
    want: JALAPENO,
    emoji: "😡",
    bubble: "Forget it.",
  },
];

// One try on the phone, in seconds from the try's start. The field is
// tapped (Recent Searches opens with the keyboard), the query types out, the
// keyboard drops and "No products found." stays. The last try ends with the
// screen switching off like an old TV, as the user gives up.
const KEY_S = 0.11;
const KEY_DOWN_S = 0.09;
const HOLD_S = 1.6;
const OFF_AFTER_S = 0.6;
const OFF_S = 0.6;

type Beat = {
  start: number;
  focus: number;
  type: number;
  result: number;
  end: number;
};

const BEATS: Beat[] = (() => {
  let start = 0;
  return ATTEMPTS.map((a, i) => {
    const focus = i === 0 ? 0.15 : 0.35;
    const type = i === 0 ? 0.6 : 0.75;
    const result = type + a.query.length * KEY_S + 0.35;
    const last = i === ATTEMPTS.length - 1;
    const end = last ? result + OFF_AFTER_S + OFF_S : result + HOLD_S;
    const beat = { start, focus, type, result, end };
    start += end;
    return beat;
  });
})();
const FINISH_S = BEATS[BEATS.length - 1].start + BEATS[BEATS.length - 1].end;

// Everything the scene shows at clock time `t` (seconds).
type Frame = {
  step: number;
  focused: boolean;
  typed: number;
  pressed: boolean;
  result: boolean;
  off: boolean;
  finished: boolean;
};

function frameAt(t: number): Frame {
  let step = 0;
  while (step < BEATS.length - 1 && t >= BEATS[step].start + BEATS[step].end) step++;
  const beat = BEATS[step];
  const local = t - beat.start;
  const len = ATTEMPTS[step].query.length;
  const into = local - beat.type;
  const typed = into < 0 ? 0 : Math.min(len, Math.floor(into / KEY_S) + 1);
  const last = step === BEATS.length - 1;
  return {
    step,
    focused: local >= beat.focus,
    typed,
    pressed: typed > 0 && typed <= len && into < len * KEY_S && into % KEY_S < KEY_DOWN_S,
    result: local >= beat.result,
    off: last && local >= beat.result + OFF_AFTER_S,
    finished: t >= FINISH_S,
  };
}

const sameFrame = (a: Frame, b: Frame) =>
  (Object.keys(a) as (keyof Frame)[]).every((k) => a[k] === b[k]);

// The Recent Searches list baked into the Figma screen (recent.webp has it
// blanked so the list can grow). Each failed try lands on top.
const RECENT = [
  "Organic eggs",
  "Sourdough bagels",
  "Greek yogurt",
  "Extra virgin olive oil",
  "Salmon fillets",
  "Baby spinach",
  "Oat milk",
  "Cherry tomatoes",
  "Chicken breast",
  "Fresh blueberries",
];
export const historyAt = (tried: string[]) => [...[...tried].reverse(), ...RECENT];

// Screen px (590 × 1280), read off the Figma export.
const sx = (px: number) => `${(px / 590) * 100}%`;
const sy = (px: number) => `${(px / 1280) * 100}%`;

// `grew`: the top item just arrived, so it slides in.
export function RecentScreen({ items, grew }: { items: string[]; grew: boolean }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
      <img src={`${SCREENS}/recent.webp`} alt="" className="absolute inset-0 size-full" />
      <ul
        aria-hidden
        className="absolute inset-x-0 overflow-hidden text-[3.7cqw] text-[#333]"
        style={{ top: sy(196), height: sy(66 * RECENT.length) }}
      >
        {items.slice(0, RECENT.length).map((q, i) => (
          <motion.li
            key={q}
            initial={grew && i === 0 ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <span className="flex items-center" style={{ height: `${(66 / 590) * 100}cqw` }}>
              <svg
                viewBox="0 0 24 24"
                className="shrink-0 text-[#a3abb6]"
                style={{
                  marginLeft: sx(34),
                  width: sx(24),
                  marginRight: sx(21),
                }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="10.5" cy="10.5" r="7" />
                <path d="m16 16 5 5" />
              </svg>
              {q}
            </span>
          </motion.li>
        ))}
      </ul>
    </>
  );
}

function TryScreen({ frame }: { frame: Frame }) {
  const { step, focused, result, pressed } = frame;
  const attempt = ATTEMPTS[step];
  const prev = step > 0 ? ATTEMPTS[step - 1].query : "";
  const typed = attempt.query.slice(0, frame.typed);
  // Later tries start on the last no-result screen until the field is tapped.
  const searching = focused && !result;
  const query = focused ? typed : prev;
  return (
    <div className="@container relative size-full">
      <div className="@container relative aspect-[590/1280] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
        <img src={`${SCREENS}/before.webp`} alt="" className="absolute inset-0 size-full" />
        <motion.div
          initial={false}
          animate={{ opacity: searching ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <RecentScreen
            items={historyAt(ATTEMPTS.slice(0, step).map((a) => a.query))}
            grew={step > 0}
          />
        </motion.div>
        {query && <SearchQuery text={query} caret={searching} />}
      </div>
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10"
        initial={{ y: "100%" }}
        animate={{ y: searching ? "0%" : "100%" }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <IosKeyboard active={pressed ? typed.slice(-1) : undefined} />
      </motion.div>
    </div>
  );
}

// Plays on its own once on screen, on one clock; scrolling while pinned
// speeds it up (see useHeldClock).
function FrustrationScene({ stage }: { stage: React.RefObject<HTMLDivElement | null> }) {
  const { ref, frame } = useHeldClock({ stage, finish: FINISH_S, frameAt, same: sameFrame });

  const { step, result, off } = frame;
  const attempt = ATTEMPTS[step];
  const last = step === ATTEMPTS.length - 1;
  // On the last try the bubble lands with the screen going dark.
  const bubble = last ? off : result;
  return (
    <div
      ref={ref}
      className="grid w-full items-center gap-8 md:grid-cols-[1fr_272px_1fr] md:gap-10"
    >
      {/* What the user is after, the whole time. */}
      <div className="flex flex-col items-center gap-3 text-center md:justify-self-end">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-ink-muted">
          What users want
        </p>
        <div className="relative size-40 overflow-hidden rounded-2xl md:size-44">
          <AnimatePresence initial={false}>
            <motion.img
              key={attempt.want.src}
              src={attempt.want.src}
              alt={attempt.want.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 size-full object-cover"
            />
          </AnimatePresence>
        </div>
        <p className="font-display text-lg font-medium text-ink">{attempt.want.name}</p>
      </div>

      <div className="flex justify-center">
        <PhoneFrame>
          {/* The screen behind the app, once it switches off. */}
          <div aria-hidden className="absolute inset-0 bg-black" />
          <motion.div
            key={step}
            className="absolute inset-0 origin-center overflow-hidden bg-paper"
            initial={false}
            animate={
              off
                ? {
                    scaleY: [1, 0.006, 0.006, 0.006],
                    scaleX: [1, 1, 0.02, 0.02],
                    filter: ["brightness(1)", "brightness(3)", "brightness(4)", "brightness(4)"],
                    opacity: [1, 1, 1, 0],
                  }
                : { scaleY: 1, scaleX: 1, filter: "brightness(1)", opacity: 1 }
            }
            transition={
              off ? { duration: OFF_S, times: [0, 0.45, 0.8, 1], ease: "easeIn" } : { duration: 0 }
            }
          >
            <TryScreen key={step} frame={frame} />
          </motion.div>
        </PhoneFrame>
      </div>

      {/* The try: its number holds still, the rest swaps per step. */}
      <div className="flex min-h-56 flex-col items-center gap-3 md:items-start">
        <p className="text-sm font-medium text-ink-muted">
          {step + 1} / {ATTEMPTS.length}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={attempt.query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="flex flex-col items-center gap-3 md:items-start"
          >
            <QueryCaption type={attempt.type} query={attempt.query} />
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.96 }}
              animate={
                bubble ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -10, scale: 0.96 }
              }
              transition={{
                duration: 0.4,
                ease: EASE_OUT,
                delay: last ? 0 : 0.2,
              }}
              className="mt-4"
            >
              <ThoughtBubble emoji={attempt.emoji} text={attempt.bubble} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Pulled up under the copy: the pinned phone (~574px) is centred in the
// viewport, which otherwise leaves a tall gap above it on arrival. Leaves 3rem
// of that gap, and none is taken on short screens. The pin is short (the
// scene's 140vh is one viewport plus 40vh of scroll): the scene holds the page
// until it finishes, rather than spreading the tries over scroll length.
function FrustrationStage() {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <div ref={stage} className="md:motion-safe:-mt-[max(0px,calc((100svh-574px)/2-3rem))]">
      <StickyScene
        steps={1}
        vh={130}
        still={() => <FrustrationList />}
        label="One user, four searches, no results"
      >
        {() => (
          <div className={wrap}>
            <FrustrationScene stage={stage} />
          </div>
        )}
      </StickyScene>
    </div>
  );
}

// Phones and reduced motion: the four tries as a plain sequence.
function FrustrationList() {
  return (
    <ol className={cn(wrap, "grid gap-4 md:grid-cols-2")}>
      {ATTEMPTS.map((a, i) => (
        <li key={a.query} className="flex flex-col gap-3 rounded-2xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {i + 1}. {a.type}
          </p>
          <div className="flex items-center justify-between gap-3 rounded-full bg-paper-2 px-4 py-2.5">
            <span className="font-mono text-sm text-ink">{a.query}</span>
            <span className="text-xs text-ink-muted">No products found</span>
          </div>
          <ThoughtBubble emoji={a.emoji} text={a.bubble} tail="none" />
        </li>
      ))}
    </ol>
  );
}

// Leadership's safety net, one scroll per beat: their bet, my bet, the click
// rate that settled it. The Bestsellers block lifts out of the no-result screen.
const BET_STEPS = 3;
// Screen px of the Bestsellers block in before.webp (cropped to
// before-bestsellers.webp), and how far it lifts.
const BEST_TOP = 552;
const BEST_SCALE = 1.3;

// The block lifts once the phone is on screen (and stays lifted when still).
function BestsellerPhone({ live }: { live: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const lifted = !live || inView;
  return (
    <div ref={ref} className="relative">
      <PhoneFrame>
        <div className="@container relative aspect-[590/1280] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img src={`${SCREENS}/before.webp`} alt="" className="absolute inset-0 size-full" />
          <motion.div
            aria-hidden
            initial={false}
            animate={{ opacity: lifted ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-ink/40"
          />
        </div>
      </PhoneFrame>
      {/* Over the screen (inside the 9px bezel) but outside its clip. */}
      <div aria-hidden className="@container pointer-events-none absolute inset-[9px] z-30">
        <motion.div
          initial={false}
          animate={
            lifted
              ? {
                  scale: BEST_SCALE,
                  opacity: 1,
                  boxShadow: "0 24px 48px -12px rgba(21,21,21,0.35)",
                }
              : { scale: 1, opacity: 0, boxShadow: "0 0 0 0 rgba(21,21,21,0)" }
          }
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className="absolute inset-x-0 origin-[50%_35%] overflow-hidden rounded-[1cqw] bg-white"
          style={{ top: `${(BEST_TOP / 590) * 100}cqw` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img src={`${SCREENS}/before-bestsellers.webp`} alt="" className="block w-full" />
        </motion.div>
      </div>
    </div>
  );
}

function BestsellerScene({ step, live }: { step: number; live: boolean }) {
  const at = (n: number) => !live || step >= n;
  const beat = (n: number) => ({
    initial: false as const,
    animate: at(n) ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.5, ease: EASE_OUT },
  });
  return (
    <div
      className={cn(
        wrap,
        "grid w-full items-center gap-12 py-10 md:grid-cols-[1fr_auto] md:gap-20 md:py-0",
      )}
    >
      <div className="flex flex-col gap-8">
        <motion.div {...beat(0)} className="flex flex-col gap-3">
          <p className="font-display font-medium tracking-tight text-2xl leading-snug text-ink text-balance md:text-[2rem]">
            Meanwhile, leadership believed the Bestsellers would catch them.
          </p>
          <Body>
            Curation is Kurly’s core value, and customers trust its picks. Even an empty search
            ended on a shelf of bestsellers, so it seemed like enough.
          </Body>
        </motion.div>
        <motion.p
          {...beat(1)}
          className="font-display font-medium tracking-tight text-2xl leading-snug text-ink text-balance md:text-[2rem]"
        >
          But I believed users who came with a goal would scroll right past it.
        </motion.p>
        <motion.div {...beat(2)} className="flex flex-col gap-2">
          <p className="text-lg leading-snug text-ink md:text-xl">
            Based on data analysis, of the 6.8% of searches that found nothing,
          </p>
          <p className="flex flex-wrap items-baseline gap-x-3 text-lg text-ink md:text-xl">
            <span>only</span>
            <CountUp
              to={{ value: 3.83, decimals: 2, suffix: "%" }}
              play={at(2)}
              className="font-display font-medium tracking-tight text-[3.5rem] leading-none md:text-[4.875rem]"
            />
            <span>clicked a product in Bestsellers.</span>
          </p>
        </motion.div>
      </div>
      <div className="flex justify-center">
        <BestsellerPhone live={live} />
      </div>
    </div>
  );
}

// The hook holds on the first line; one scroll brings in the second, and a
// spare step keeps a quick scroll from skipping it (same rhythm as 02 Impact).
const HOOK_STEPS = 3;

export function UserProblem() {
  return (
    <Chapter id="user-problem" label="04 User Problem" className="border-t border-line">
      <StickyScene
        steps={HOOK_STEPS}
        label="Users knew what they wanted; search said it didn't exist"
      >
        {({ step, live }) => (
          <div
            className={cn(wrap, "grid w-full place-items-center", !live && "min-h-[60svh] py-14")}
          >
            <p className="font-display font-medium tracking-tight text-center text-[2rem] leading-[1.15] text-ink text-balance md:text-[3.25rem]">
              <span className="block">Users knew exactly what they wanted.</span>
              <motion.span
                className="block"
                initial={false}
                animate={step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              >
                Search told them it didn’t exist.
              </motion.span>
            </p>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "flex flex-col gap-6")}>
        <SectionHeader label="04 USER PROBLEM" headline="Users Were Punished for Tiny Mistakes" />
        {/* Wide enough for one sentence per line. */}
        <Body className="max-w-[48rem]">
          <span className="block">The old search engine only accepted exact matches.</span>
          <span className="block">
            A typo, an extra space, or a different word for the same thing meant{" "}
            <B>an empty page</B>.
          </span>
          <span className="block">
            Users were left with <B>a frustrating search experience</B>: guess the “right” spelling,
            try again, or simply leave.
          </span>
        </Body>
      </div>

      <FrustrationStage />

      <StickyScene steps={BET_STEPS} label="The Bestsellers under an empty search">
        {({ step, live }) => <BestsellerScene step={step} live={live} />}
      </StickyScene>

      <div className="pb-16 md:pb-24" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Company's Problem                                                */
/* ------------------------------------------------------------------ */

// Small requests drip through one at a time; the rebuild, too big for the
// neck, sits stuck on top. Geometry in SVG units (260 × 340).
const NECK_X = 130;
const TOP_PILE = [
  { y: 102, half: 66 },
  { y: 116, half: 52 },
  { y: 130, half: 38 },
  { y: 144, half: 22 },
  { y: 158, half: 8 },
];
const BOTTOM_PILE = [
  { y: 318, half: 70 },
  { y: 304, half: 50 },
  { y: 290, half: 28 },
];
const DOT_GAP = 15;
const DRIPS = 5;
const DRIP_S = 1.4;

function pileDots(rows: { y: number; half: number }[]) {
  return rows.flatMap(({ y, half }) => {
    const n = Math.floor((half * 2) / DOT_GAP) + 1;
    const x0 = NECK_X - ((n - 1) * DOT_GAP) / 2;
    return Array.from({ length: n }, (_, i) => ({ x: x0 + i * DOT_GAP, y }));
  });
}

function Hourglass({ stuck, live }: { stuck: boolean; live: boolean }) {
  return (
    <svg
      viewBox="34 6 192 328"
      role="img"
      aria-label="An hourglass: small manual keyword fixes drip through the neck one at a time, while the search engine rebuild sits stuck on top, too big to pass."
      className="w-[190px] shrink-0 md:w-[230px]"
    >
      <g className="fill-none stroke-accent" strokeWidth="1" strokeLinecap="round">
        <path
          d="M40 12V80C40 132 118 146 118 170C118 194 40 208 40 260V328"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M220 12V80C220 132 142 146 142 170C142 194 220 208 220 260V328"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {pileDots(TOP_PILE).map((d) => (
        <circle key={`t${d.x}-${d.y}`} cx={d.x} cy={d.y} r="4.5" className="fill-accent/20" />
      ))}
      {pileDots(BOTTOM_PILE).map((d) => (
        <circle key={`b${d.x}-${d.y}`} cx={d.x} cy={d.y} r="4.5" className="fill-accent/20" />
      ))}

      {/* One request at a time through the neck. */}
      {live &&
        Array.from({ length: DRIPS }, (_, i) => (
          <motion.circle
            key={i}
            cx={NECK_X}
            r="4.5"
            className="fill-accent/45"
            initial={{ cy: 166, opacity: 0 }}
            animate={{ cy: [166, 282], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: DRIP_S,
              times: [0, 0.15, 0.85, 1],
              ease: "easeIn",
              repeat: Infinity,
              delay: (i * DRIP_S * 1.4) / DRIPS,
              repeatDelay: DRIP_S * 0.4,
            }}
          />
        ))}

      {/* The rebuild: stuck on top of the pile. */}
      <motion.g
        style={{ transformOrigin: "130px 62px", transformBox: "view-box" }}
        animate={stuck && live ? { rotate: [0, -3, 3, -2, 0] } : { rotate: 0 }}
        transition={
          stuck && live ? { duration: 0.6, repeat: Infinity, repeatDelay: 1.6 } : { duration: 0 }
        }
      >
        <rect x="58" y="38" width="144" height="50" rx="25" className="fill-accent" />
        <text
          x={NECK_X}
          y="58"
          textAnchor="middle"
          className="fill-white text-[15px] font-semibold"
        >
          <tspan x={NECK_X}>Search Engine</tspan>
          <tspan x={NECK_X} dy="17">
            Rebuild
          </tspan>
        </text>
      </motion.g>
    </svg>
  );
}

// Title, copy and hourglass hold together; one scroll adds the cost.
const BOTTLENECK_STEPS = 2;

export function CompanyProblem() {
  return (
    <Chapter id="company-problem" label="05 Company’s Problem" className="border-t border-line">
      <StickyScene steps={BOTTLENECK_STEPS} label="Small fixes dripping through, the rebuild stuck">
        {({ step, live }) => (
          <div className={cn(wrap, "flex w-full flex-col gap-8 py-16 md:gap-10")}>
            <SectionHeader
              label="05 COMPANY’S PROBLEM"
              headline="Small Fixes Kept the Big Fix Waiting"
            />
            <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
              {/* Narrow enough that "…the search engine rebuild," ends the line. */}
              <Body className="max-w-[33rem]">
                <span className="block">
                  When a search found nothing or the wrong products, merchandisers and marketers
                  asked the search engineers to fix it. Each fix was <B>a manual keyword update</B>,
                  one request at a time.
                </span>
                <motion.span
                  aria-hidden
                  className="my-4 flex justify-center text-accent"
                  initial={false}
                  animate={!live || step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <svg viewBox="0 0 16 40" className="h-10 w-4" fill="none" stroke="currentColor">
                    <path
                      d="M8 2V37M2 31l6 6 6-6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
                <motion.span
                  className="block"
                  initial={false}
                  animate={!live || step >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: !live ? 0 : 0.25 }}
                >
                  With the team buried in small fixes, <B>the search engine rebuild</B>, the work
                  that mattered most, kept getting pushed back.
                </motion.span>
              </Body>
              <div className="flex justify-center">
                <Hourglass stuck={!live || step >= 1} live={live} />
              </div>
            </div>
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "pb-28 pt-12 md:pb-36")}>
        <Reveal>
          <p className="font-display font-medium tracking-tight text-center text-[1.4rem] leading-snug text-ink md:text-[1.75rem]">
            So I asked a different question. ↓
          </p>
        </Reveal>
      </div>
    </Chapter>
  );
}
