"use client";

import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AssetId } from "./assets";
import { EASE_OUT, Reveal, StickyScene } from "./motion";
import { SearchSequence } from "./SearchSequence";
import {
  AssetMedia,
  B,
  Body,
  Chapter,
  CountUp,
  PhoneFrame,
  SectionHeader,
  StandInTag,
  ThoughtBubble,
  useAsset,
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
      {note && <p className="text-xs font-medium text-ink-muted">{note}</p>}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{type}</p>
      <p className="font-mono text-2xl text-ink md:text-[1.75rem]">{query}</p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 04 User Problem                                                     */
/* ------------------------------------------------------------------ */

type Attempt = { type: string; query: string; asset: AssetId; emoji: string; bubble: string };

const ATTEMPTS: Attempt[] = [
  {
    type: "Misspelling",
    query: "cabage",
    asset: "nr-cabage",
    emoji: "🤔",
    bubble: "Huh, no cabbage today?",
  },
  {
    type: "Spacing",
    query: "ca bbage",
    asset: "nr-ca-bbage",
    emoji: "😕",
    bubble: "Maybe I typed it wrong…",
  },
  {
    type: "Synonym",
    query: "lettuce",
    asset: "nr-lettuce",
    emoji: "😤",
    bubble: "I know you sell this.",
  },
  {
    type: "Foreign word",
    query: "granma padano",
    asset: "nr-granma-padano",
    emoji: "🙄",
    bubble: "Forget it.",
  },
];

function NoResultScreen({ attempt }: { attempt: Attempt }) {
  const has = !!useAsset(attempt.asset).src;
  return (
    <>
      <AssetMedia id={attempt.asset} fallback={<SearchSequence query={attempt.query} emoji="" />} />
      {!has && <StandInTag id={attempt.asset} className="bottom-3 left-3" />}
    </>
  );
}

function FrustrationScene({ step }: { step: number }) {
  const attempt = ATTEMPTS[step];
  const last = step === ATTEMPTS.length - 1;
  return (
    <PhoneStage
      caption={
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={attempt.query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="flex flex-col items-center gap-3 md:items-end"
          >
            <QueryCaption type={attempt.type} query={attempt.query} note={`${step + 1} / 4`} />
          </motion.div>
        </AnimatePresence>
      }
      phone={
        <PhoneFrame>
          {/* Home screen behind the app, seen when the shopper gives up. */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-paper-2 to-line" />
          <motion.div
            key={attempt.query}
            className="absolute inset-0 origin-center bg-paper"
            initial={false}
            animate={
              last
                ? { scale: [1, 1, 0.15], opacity: [1, 1, 0], borderRadius: ["0%", "0%", "30%"] }
                : { scale: 1, opacity: 1 }
            }
            transition={
              last ? { duration: 3.2, times: [0, 0.8, 1], ease: "easeIn" } : { duration: 0 }
            }
          >
            <NoResultScreen attempt={attempt} />
          </motion.div>
        </PhoneFrame>
      }
      bubble={
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={attempt.query}
            initial={{ opacity: 0, x: -10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15, delay: 0 } }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.9 }}
          >
            <ThoughtBubble emoji={attempt.emoji} text={attempt.bubble} />
          </motion.div>
        </AnimatePresence>
      }
    />
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

export function UserProblem() {
  return (
    <Chapter id="user-problem" label="04 User Problem" className="border-t border-line">
      <div className={cn(wrap, "grid min-h-[80svh] place-items-center py-24")}>
        <Reveal>
          <p className="font-display font-medium tracking-tight max-w-[20ch] text-center text-[2rem] leading-[1.15] text-ink text-balance md:text-[3.25rem]">
            They knew exactly what they wanted. Search told them it didn’t exist.
          </p>
        </Reveal>
      </div>

      <div className={cn(wrap, "flex flex-col gap-6 pb-10")}>
        <SectionHeader
          label="04 USER PROBLEM"
          headline="Shoppers Were Punished for Tiny Mistakes"
        />
        <Body>
          The old engine only accepted exact matches. A typo, an extra space, or a different word
          for the same thing meant <B>an empty page</B>. Shoppers had to guess the “right” spelling,
          try again, or simply leave.
        </Body>
      </div>

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
