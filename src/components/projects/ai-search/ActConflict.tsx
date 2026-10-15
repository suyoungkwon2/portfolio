"use client";

import { AnimatePresence, motion, useInView, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SCREENS, SearchQuery } from "./ActSetup";
import { IosKeyboard } from "./IosKeyboard";
import { EASE_OUT, Reveal, StickyScene, useTypewriter } from "./motion";
import {
  B,
  Body,
  Chapter,
  CountUp,
  PhoneFrame,
  SectionHeader,
  ThoughtBubble,
  wrap,
} from "./ui";

// Act 2, Conflict: 04 User Problem · 05 Company's Problem (spec §5.4–5.5).

// Shared by 04 (Before) and 07B (After) so the phone sits at exactly the
// same size and place in both: caption left, phone centre, bubble right.
export function PhoneStage({
  caption,
  phone,
  bubble,
}: {
  caption: React.ReactNode;
  phone: React.ReactNode;
  bubble: React.ReactNode;
}) {
  return (
    <div className="grid w-full items-center gap-8 md:grid-cols-[1fr_272px_1fr] md:gap-10">
      <div className="flex flex-col items-center gap-3 md:items-end md:text-right">{caption}</div>
      <div className="flex justify-center">{phone}</div>
      <div className="flex min-h-24 justify-center md:justify-start">{bubble}</div>
    </div>
  );
}

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

type Want = { name: string; src: string };

const CABBAGE: Want = { name: "Cabbage", src: "/images/ai-search/want/cabbage.webp" };
const JALAPENO: Want = { name: "Jalapeño", src: "/images/ai-search/want/jalapeno.webp" };

type Attempt = { type: string; query: string; want: Want; emoji: string; bubble: string };

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
    query: "ca bage",
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
    emoji: "🙄",
    bubble: "Forget it.",
  },
];

// One try on the phone, in seconds from the step's start. The keyboard rises,
// the query types out, the keyboard drops and "No products found." stays.
const KEY_MS = 110;
const typeStart = (step: number) => (step === 0 ? 600 : 750);
const resultAt = (a: Attempt, step: number) =>
  (typeStart(step) + a.query.length * KEY_MS + 350) / 1000;
// The last try ends with the shopper closing the app.
const CLOSE_AFTER = 1.6;
const CLOSE_S = 0.7;

function TryScreen({ step }: { step: number }) {
  const attempt = ATTEMPTS[step];
  const prev = step > 0 ? ATTEMPTS[step - 1].query : "";
  const { typed, done } = useTypewriter(attempt.query, {
    speed: KEY_MS,
    startDelay: typeStart(step),
  });
  const [result, setResult] = useState(false);
  // Letters typed so far whose key has already come back up.
  const [released, setReleased] = useState(0);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setResult(true), 350);
    return () => clearTimeout(timer);
  }, [done]);

  // Each key lights up for a moment as its letter lands.
  useEffect(() => {
    if (!typed) return;
    const timer = setTimeout(() => setReleased(typed.length), 90);
    return () => clearTimeout(timer);
  }, [typed]);
  const pressed = typed.length > released ? typed.slice(-1) : undefined;

  // The first try starts on the empty search tab; later ones start on the
  // last no-result screen, its old query still in the field.
  const onResult = step > 0 || result;
  const query = typed || prev;
  return (
    <div className="@container relative size-full">
      <div className="@container relative aspect-[590/1280] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
        <img src={`${SCREENS}/search.webp`} alt="" className="absolute inset-0 size-full" />
        <motion.img
          src={`${SCREENS}/before.webp`}
          alt=""
          initial={false}
          animate={{ opacity: onResult ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 size-full"
        />
        {query && <SearchQuery text={query} caret={!result} />}
      </div>
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10"
        initial={{ y: "100%" }}
        animate={{ y: result ? "100%" : "0%" }}
        transition={{ duration: 0.3, ease: EASE_OUT, delay: result ? 0 : 0.15 }}
      >
        <IosKeyboard active={done ? undefined : pressed} />
      </motion.div>
    </div>
  );
}

function FrustrationScene({ step }: { step: number }) {
  // The scene mounts with the page; hold the first try until it's on screen.
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const run = `${step}-${seen}`;
  const attempt = ATTEMPTS[step];
  const last = step === ATTEMPTS.length - 1;
  const shown = resultAt(attempt, step);
  return (
    <div
      ref={ref}
      className="grid w-full items-center gap-8 md:grid-cols-[1fr_272px_1fr] md:gap-10"
    >
      {/* What the shopper is after, the whole time. */}
      <div className="flex flex-col items-center gap-3 md:items-end">
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
          {/* Home screen behind the app, seen when the shopper gives up. */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-paper-2 to-line" />
          <motion.div
            key={run}
            className="absolute inset-0 origin-center overflow-hidden bg-paper"
            initial={false}
            animate={
              last && seen
                ? { scale: [1, 1, 0.15], opacity: [1, 1, 0], borderRadius: ["0%", "0%", "30%"] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              last && seen
                ? {
                    duration: shown + CLOSE_AFTER + CLOSE_S,
                    times: [0, (shown + CLOSE_AFTER) / (shown + CLOSE_AFTER + CLOSE_S), 1],
                    ease: "easeIn",
                  }
                : { duration: 0 }
            }
          >
            {seen ? (
              <TryScreen step={step} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
              <img src={`${SCREENS}/search.webp`} alt="" className="w-full" />
            )}
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
              animate={seen ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -10, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: shown + 0.2 }}
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

// The hook holds on the first line; one scroll brings in the second, and a
// spare step keeps a quick scroll from skipping it (same rhythm as 02 Impact).
const HOOK_STEPS = 3;

export function UserProblem() {
  return (
    <Chapter id="user-problem" label="04 User Problem" className="border-t border-line">
      <StickyScene steps={HOOK_STEPS} label="Users knew what they wanted; search said it didn't exist">
        {({ step, live }) => (
          <div className={cn(wrap, "grid w-full place-items-center", !live && "min-h-[60svh] py-14")}>
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
        <SectionHeader
          label="04 USER PROBLEM"
          headline="Shoppers Were Punished for Tiny Mistakes"
        />
        {/* Wide enough for one sentence per line. */}
        <Body className="max-w-[48rem]">
          <span className="block">The old search engine only accepted exact matches.</span>
          <span className="block">
            A typo, an extra space, or a different word for the same thing meant{" "}
            <B>an empty page</B>.
          </span>
          <span className="block">
            Shoppers were left with <B>a frustrating search experience</B>: guess the “right”
            spelling, try again, or simply leave.
          </span>
        </Body>
      </div>

      {/* Pulled up under the copy: the pinned phone is centred in the
          viewport, which otherwise leaves a tall gap above it on arrival. */}
      <div className="md:motion-safe:-mt-28">
        <StickyScene
          steps={4}
          vh={85}
          still={() => <FrustrationList />}
          label="One shopper, four searches, no results"
        >
          {({ step }) => (
            <div className={wrap}>
              <FrustrationScene step={step} />
            </div>
          )}
        </StickyScene>
      </div>

      <div
        className={cn(wrap, "flex flex-col items-center gap-10 pb-28 pt-16 text-center md:pb-36")}
      >
        <Reveal className="flex flex-col items-center gap-3">
          <p className="max-w-[24ch] text-xl leading-snug text-ink md:text-2xl">
            In these searches, only{" "}
            <CountUp
              to={{ value: 3.83, decimals: 2, suffix: "%" }}
              className="font-display font-medium tracking-tight block py-3 text-[4rem] leading-none text-ink-muted md:text-[6rem]"
            />{" "}
            of shoppers clicked anything.
          </p>
          <p className="text-xs text-ink-muted">
            Control group of the A/B test, No-Result searches.
          </p>
        </Reveal>
        <Reveal>
          <p className="font-display font-medium tracking-tight text-[1.4rem] leading-snug text-ink-muted md:text-[1.75rem]">
            The shopper wasn’t wrong.{" "}
            <span className="text-ink">The search engine was too strict.</span>
          </p>
        </Reveal>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 05 Company's Problem                                                */
/* ------------------------------------------------------------------ */

const PIPE = [
  "Search Request",
  "Legacy Exact-Match Engine",
  "Daily Leakage",
  "Dual Negative Impact",
];
const GRAINS = 12;
const COINS = 14;

// One query grain flowing left to right along the pipe; every third one
// leaks at "Daily Leakage" and drops to the pile below.
const LEAK_AT = 0.625;

function Grain({ progress, j }: { progress: MotionValue<number>; j: number }) {
  const leaks = j % 3 === 1;
  const t = useTransform(progress, (v) => (v * 2.5 + j / GRAINS) % 1);
  const left = useTransform(t, (u) => `${(leaks ? Math.min(u, LEAK_AT) : u) * 100}%`);
  const top = useTransform(t, (u) =>
    leaks && u > LEAK_AT ? 46 + ((u - LEAK_AT) / (1 - LEAK_AT)) * 180 : 46,
  );
  const opacity = useTransform(t, (u) => Math.min(1, u / 0.05, (1 - u) / 0.05));
  return (
    <motion.span
      aria-hidden
      style={{ left, top, opacity }}
      className={cn("absolute -ml-1 size-2 rounded-full", leaks ? "bg-ink-muted/60" : "bg-ink")}
    />
  );
}

function Coin({ progress, k }: { progress: MotionValue<number>; k: number }) {
  const at = 0.08 + (k / COINS) * 0.8;
  const opacity = useTransform(progress, [at, at + 0.03], [0, 1]);
  const y = useTransform(progress, [at, at + 0.03], [-14, 0]);
  return (
    <motion.span
      aria-hidden
      style={{ opacity, y }}
      className="h-2.5 w-6 rounded-full border border-ink-muted/40 bg-[#d8d8d8]"
    />
  );
}

function LeakDiagram({ progress, live }: { progress: MotionValue<number>; live: boolean }) {
  const cabage = useTransform(progress, [0.88, 0.95], [0, 1]);
  return (
    <div
      role="img"
      aria-label="Searches flow from the request through the legacy exact-match engine; some leak out every day and pile up as lost sales."
      className="relative h-[300px] w-full"
    >
      <ol className="absolute inset-x-0 top-6 grid grid-cols-4 gap-2">
        {PIPE.map((name, i) => (
          <li
            key={name}
            className={cn(
              "flex h-11 items-center justify-center rounded-lg border px-2 text-center text-[11px] font-medium leading-tight md:text-xs",
              i === 2
                ? "border-dashed border-ink-muted/50 text-ink-muted"
                : "border-ink/15 bg-paper text-ink",
            )}
          >
            {name}
          </li>
        ))}
      </ol>
      {live &&
        Array.from({ length: GRAINS }, (_, j) => <Grain key={j} progress={progress} j={j} />)}
      <div
        className="absolute bottom-2 flex w-36 -translate-x-1/2 flex-col items-center gap-1"
        style={{ left: `${LEAK_AT * 100}%` }}
      >
        <motion.span
          style={{ opacity: cabage }}
          className="mb-1 rotate-[-8deg] rounded-full bg-[#dcdcdc] px-3 py-1 text-xs font-medium text-[#4a4a4a]"
        >
          cabage
        </motion.span>
        <div className="flex w-full flex-wrap-reverse justify-center gap-1">
          {Array.from({ length: COINS }, (_, k) => (
            <Coin key={k} progress={progress} k={k} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Roadmap({ progress, live }: { progress: MotionValue<number>; live: boolean }) {
  const x = useTransform(progress, [0.15, 0.9], ["0%", "170%"]);
  const opacity = useTransform(progress, [0.55, 0.9], [1, 0]);
  const skeleton = "h-9 rounded-md bg-paper-2";
  return (
    <div
      role="img"
      aria-label="On the roadmap, the Search Engine Rebuild card keeps getting pushed to the right until it slides off."
      className="relative w-full overflow-hidden rounded-2xl border border-line p-5"
    >
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-ink-muted">
        <span>Roadmap</span>
        <span aria-hidden>→</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <motion.div
            style={live ? { x, opacity } : { x: "75%" }}
            className="flex h-9 w-1/2 shrink-0 items-center rounded-md border border-dashed border-ink/30 bg-paper px-3 text-xs font-semibold text-ink-muted"
          >
            Search Engine Rebuild
          </motion.div>
        </div>
        <div className="flex gap-3">
          <div className={cn(skeleton, "w-1/3")} />
          <div className={cn(skeleton, "w-1/2")} />
        </div>
        <div className="flex gap-3">
          <div className={cn(skeleton, "w-1/2")} />
          <div className={cn(skeleton, "w-1/4")} />
        </div>
        <div className="flex gap-3">
          <div className={cn(skeleton, "w-1/4")} />
          <div className={cn(skeleton, "w-2/3")} />
        </div>
      </div>
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">{children}</p>
  );
}

export function CompanyProblem() {
  return (
    <Chapter
      id="company-problem"
      label="05 Company’s Problem"
      className="border-t border-line pt-24 md:pt-32"
    >
      <div className={wrap}>
        <SectionHeader
          label="05 COMPANY’S PROBLEM"
          headline="A Leak Everyone Saw, and No One Could Fix"
        />
      </div>

      <StickyScene steps={2} label="Searches leaking out of the pipeline">
        {({ progress, live }) => (
          <div className={cn(wrap, "grid items-center gap-10 md:grid-cols-[1fr_1.3fr]")}>
            <div className="flex flex-col gap-4">
              <SubLabel>The leak</SubLabel>
              <Body>
                Every day, <B>6–7% of searches</B> hit a dead end. Each one cost us twice: a
                frustrated shopper, and a sale lost on our biggest revenue channel.
              </Body>
            </div>
            <LeakDiagram progress={progress} live={live} />
          </div>
        )}
      </StickyScene>

      <StickyScene steps={2} label="The rebuild sliding off the roadmap">
        {({ progress, live }) => (
          <div className={cn(wrap, "grid items-center gap-10 md:grid-cols-[1fr_1.3fr]")}>
            <div className="flex flex-col gap-4">
              <SubLabel>The bottleneck</SubLabel>
              <Body>
                Everyone knew the search engine needed a rebuild. But the search team had{" "}
                <B>no capacity to spare</B>, so the fix kept getting pushed back with no date in
                sight.
              </Body>
            </div>
            <Roadmap progress={progress} live={live} />
          </div>
        )}
      </StickyScene>

      <div className={cn(wrap, "pb-28 pt-12 md:pb-36")}>
        <Reveal>
          <p className="font-display font-medium tracking-tight text-[1.4rem] leading-snug text-ink md:text-[1.75rem]">
            We couldn’t wait for a new engine. So I asked a different question. ↓
          </p>
        </Reveal>
      </div>
    </Chapter>
  );
}
