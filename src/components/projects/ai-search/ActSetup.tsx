"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChipGroup } from "@/components/project/ChipGroup";
import { cn } from "@/lib/utils";
import type { Num } from "./ui";
import { Reveal, StickyScene, useStill, useTypewriter } from "./motion";
import { AssetMedia, B, Body, Chapter, MetricCounter, PhoneFrame, SectionHeader, wrap } from "./ui";

// Act 1, Setup: Hero · 01 Context · 02 Impact · 03 R&R (spec §5.0–5.3).
// The reader learns what was achieved before learning how.

export const TALK_URL = "https://youtu.be/qv0YMg7kwuM?si=km0mZKGjRI3rPVdX&t=2333";

// One entry per line, like the other project heroes.
const META: [string, string[]][] = [
  ["Period", ["May 2024", "- August 2024"]],
  ["Role", ["AI Product Manager", "A/B Test Design", "CEO Communication", "QA"]],
  ["Team", ["AI PM (Me)", "1 ML Engineer", "1 Backend Engineer"]],
  ["Org", ["Kurly"]],
];

type HeroState = "before" | "after";
const HERO_HOLD: Record<HeroState, number> = { before: 4300, after: 5400 };

// Kurly app screens exported from Figma at 590 × 1280, with one status bar
// and one search header (field + cart) composited onto all three so only the
// content changes. "Cabage" is typed over the search tab's placeholder, then
// the real result screen takes over and its key part lifts out of the device.
const SCREENS = "/images/ai-search/hero";
const TYPED = "Cabage";
const SCREEN_W = 590;
const SCREEN_H = 1280;
const x = (px: number) => `${(px / SCREEN_W) * 100}%`;
const y = (px: number) => `${(px / SCREEN_H) * 100}%`;
// Screen px → container width units (the screen is width-fitted).
const cq = (px: number) => `${(px / SCREEN_W) * 100}cqw`;

// Crops of the result screens that pop out (screen px; see public/images/ai-search/hero):
// everything between the search header and the next section (Before) or the
// tab bar (After). Before lifts from its centre; After stays pinned under the
// search bar and grows downward.
const POP: Record<HeroState, { top: number; origin: string }> = {
  before: { top: 160, origin: "50% 50%" },
  after: { top: 160, origin: "50% 0%" },
};
// Same corner radius as the product photos in the screens.
const POP_RADIUS = 6;
// How far the lifted crop reaches past the device's outer edge on each side
// (CSS px): the 9px bezel plus 8px.
const POP_OVERHANG = 9 + 8;
const TYPE_DELAY: Record<HeroState, number> = { before: 500, after: 1000 };
const POP_DELAY = 400;

// The Before → After wipe, in the "Kurly Only" chip's border gradient.
const SWEEP_GRADIENT = "linear-gradient(180deg, #b072ff, #78c4fe, #5be1ff)";
const SWEEP_S = 0.8;

// "Cabage" in the search field, in our type. Drawn over every screen
// (including the baked-in query on before/after.webp) so it never changes font.
function SearchQuery({ text, caret = false }: { text: string; caret?: boolean }) {
  return (
    <div
      aria-hidden
      className="absolute flex items-center bg-[#f3f5f7] text-[#292b2b] text-[4.07cqw]"
      style={{ left: x(150), width: x(250), top: y(100), height: y(44) }}
    >
      {text}
      {caret && <span className="ml-px inline-block h-[1.1em] w-px animate-pulse bg-[#292b2b]" />}
    </div>
  );
}

function HeroScreen({
  state,
  result,
  sweep,
  onTyped,
}: {
  state: HeroState;
  result: boolean;
  sweep: boolean;
  onTyped: () => void;
}) {
  const { typed, done } = useTypewriter(TYPED, { speed: 110, startDelay: TYPE_DELAY[state] });
  const report = useRef(onTyped);
  useEffect(() => {
    report.current = onTyped;
  });
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => report.current(), 350);
    return () => clearTimeout(timer);
  }, [done]);
  const wipe = { duration: SWEEP_S, ease: "easeInOut" } as const;
  return (
    <motion.div
      initial={sweep ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="@container relative aspect-[590/1280] w-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
      <img src={`${SCREENS}/search.webp`} alt="" className="absolute inset-0 size-full" />
      <motion.img
        src={`${SCREENS}/${state}.webp`}
        alt=""
        initial={false}
        animate={{ opacity: result ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 size-full"
      />
      {/* Covers the placeholder (and the baked-in query); 24px type in the 590px screen. */}
      {typed && <SearchQuery text={typed} caret={!done} />}
      {sweep && (
        <>
          {/* The Before screen, wiped away left to right behind the line. */}
          <motion.div
            initial={{ clipPath: "inset(0 0 0 0%)" }}
            animate={{ clipPath: "inset(0 0 0 100%)" }}
            transition={wipe}
            className="absolute inset-0 z-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img src={`${SCREENS}/before.webp`} alt="" className="absolute inset-0 size-full" />
            <SearchQuery text={TYPED} />
          </motion.div>
          <motion.span
            aria-hidden
            initial={{ left: "0%", opacity: 1 }}
            animate={{ left: "100%", opacity: [1, 1, 0] }}
            transition={{ left: wipe, opacity: { duration: SWEEP_S, times: [0, 0.85, 1] } }}
            className="absolute inset-y-0 z-20 -ml-px w-[3px] rounded-full shadow-[0_0_14px_3px_rgba(120,196,254,0.75)]"
            style={{ background: SWEEP_GRADIENT }}
          />
        </>
      )}
    </motion.div>
  );
}

// Two clearly separate states on one device: "Cabage" dead-ends (Before), a
// gradient line sweeps the screen, and the same search finds cabbage (After).
// Each result lifts out of the device for a beat.
function HeroDevice() {
  const still = useStill();
  const [state, setState] = useState<HeroState>("before");
  const [cycle, setCycle] = useState(0);
  const [result, setResult] = useState(false);
  const [popped, setPopped] = useState(false);
  const [popScale, setPopScale] = useState(1.12);
  const layer = useRef<HTMLDivElement>(null);
  const shown: HeroState = still ? "after" : state;

  useEffect(() => {
    if (still) return;
    // Let the lifted crop settle back fully before the next state (and its
    // sweep) starts, so the line never crosses it.
    const settle = setTimeout(() => setPopped(false), HERO_HOLD[state] - 700);
    const next = setTimeout(() => {
      if (state === "after") setCycle((c) => c + 1);
      setResult(false);
      setPopped(false);
      setState(state === "before" ? "after" : "before");
    }, HERO_HOLD[state]);
    return () => {
      clearTimeout(settle);
      clearTimeout(next);
    };
  }, [state, still]);

  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => {
      const w = layer.current?.offsetWidth;
      if (w) setPopScale((w + POP_OVERHANG * 2) / w);
      setPopped(true);
    }, POP_DELAY);
    return () => clearTimeout(timer);
  }, [result]);

  const sweeping = shown === "after" && !still;
  const pop = POP[shown];
  const flush = { scale: 1, boxShadow: "0 0 0 0 rgba(21,21,21,0)" };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-6 w-full">
        <AnimatePresence initial={false}>
          <motion.p
            key={shown}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "font-display absolute inset-0 text-center text-base font-medium uppercase tracking-[0.2em]",
              shown === "after" ? "text-accent" : "text-ink-muted",
            )}
          >
            {shown === "before" ? "Before" : "After"}
          </motion.p>
        </AnimatePresence>
      </div>

      <div
        className="relative"
        role="img"
        aria-label="Before: typing “Cabage” into Kurly search returns “No products found.” After: the same search shows cabbage results, suggested by AI (Beta)."
      >
        {sweeping && (
          <motion.div
            key={`glow-${cycle}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, times: [0, 0.35, 1] }}
            className="pointer-events-none absolute -inset-8 rounded-[3.5rem] bg-[linear-gradient(90deg,rgba(176,114,255,0.75),rgba(91,225,255,0.75))] blur-2xl"
          />
        )}
        <PhoneFrame muted={shown === "before"}>
          {still ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
            <img src={`${SCREENS}/after.webp`} alt="" className="w-full" />
          ) : (
            <HeroScreen
              key={`${cycle}-${shown}`}
              state={shown}
              result={result}
              sweep={sweeping}
              onTyped={() => setResult(true)}
            />
          )}
        </PhoneFrame>
        {/* Over the screen area (inside the 9px bezel) but outside its clip, so
            the lifted crop can spill past the device. */}
        <div
          ref={layer}
          aria-hidden
          className="@container pointer-events-none absolute inset-[9px] z-30"
        >
          <AnimatePresence>
            {popped && !still && (
              <motion.div
                key={`${cycle}-${shown}`}
                initial={flush}
                animate={{ scale: popScale, boxShadow: "0 24px 48px -12px rgba(21,21,21,0.35)" }}
                exit={{ ...flush, transition: { duration: 0.3, ease: "easeOut" } }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute inset-x-0 overflow-hidden"
                style={{
                  top: cq(pop.top),
                  borderRadius: cq(POP_RADIUS),
                  transformOrigin: pop.origin,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
                <img src={`${SCREENS}/${shown}-pop.webp`} alt="" className="block w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <div className="border-b border-line">
      <div className={cn(wrap, "pb-16 pt-10 md:pb-24 md:pt-16")}>
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent-3"
        >
          <span aria-hidden>←</span> Selected Works
        </Link>

        <div className="mt-10 grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          <div className="order-2 flex flex-col items-start md:order-1">
            <ChipGroup
              chips={{ type: "AI Transformation", domain: "Commerce", proof: "A/B Validated" }}
            />
            <h1 className="font-display font-medium tracking-tight mt-6 text-[2.25rem] leading-[1.1] text-ink text-balance md:text-[3.25rem]">
              AI Search: <br />
              Recovering Lost Revenue
            </h1>
            <p className="mt-4 text-lg italic text-ink-muted md:text-xl">
              “Just type it out. We’ll find what you need.”
            </p>
            <Body className="mt-6">
              On Kurly, one typo could end a shopping trip. I led an AI search that catches what the
              old engine missed, so every search can lead to a cart.
            </Body>

            <dl className="mt-10 grid w-full grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 lg:grid-cols-4">
              {META.map(([term, value]) => (
                <div key={term}>
                  <dt className="text-xs font-medium uppercase tracking-[0.15em] text-ink-muted">
                    {term}
                  </dt>
                  <dd className="font-display mt-1.5 text-sm font-medium text-ink">
                    {value.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href="#context"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent-3"
            >
              Follow one typo
              <motion.span
                aria-hidden
                animate={useStill() ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
            </a>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <HeroDevice />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 Context                                                          */
/* ------------------------------------------------------------------ */

// Everyday grocery searches, not real query data (spec §5.1). While the
// first headline is up, they play on their own: each query is typed into the
// bar and the product drops into the cart. The one scroll step after that
// types "cabage", which can't get through: the bar turns red.
const PRODUCTS = [
  { query: "cherry tomatoes", src: "/images/ai-search/context/cherry-tomatoes.webp" },
  { query: "melon", src: "/images/ai-search/context/melon.webp" },
  { query: "eggs", src: "/images/ai-search/context/eggs.webp" },
  { query: "steak", src: "/images/ai-search/context/steak.webp" },
];
const PROBLEM_STEP = 1;
const TYPO = "cabage";

// Scene geometry (px, inside a 520 × 500 box that scales down to fit narrow
// columns). Like a photo folder: white-framed product photos fan out from
// behind a frosted glass card with a cart engraved on it.
const SCENE_W = 520;
const SCENE_H = 500;
const BAR_TOP = 60;
const BAR_H = 56;
const BACK_TOP = 196;
const GLASS_TOP = 334;
const TILE = 150;
const DROP = 70;
const TILES = [
  { x: -132, top: 214, tilt: -11 },
  { x: -46, top: 192, tilt: -4 },
  { x: 44, top: 190, tilt: 4 },
  { x: 130, top: 210, tilt: 11 },
];

function CartItem({ i, inCart }: { i: number; inCart: boolean }) {
  const tile = TILES[i];
  return (
    <motion.img
      src={PRODUCTS[i].src}
      alt=""
      initial={false}
      animate={
        inCart
          ? { y: 0, opacity: 1, rotate: tile.tilt }
          : { y: -DROP, opacity: 0, rotate: tile.tilt }
      }
      // A short fall from just above its slot, landing with a small bounce.
      transition={
        inCart
          ? {
              y: { type: "spring", stiffness: 420, damping: 14 },
              opacity: { duration: 0.15 },
            }
          : { duration: 0.2 }
      }
      style={{
        top: tile.top,
        width: TILE,
        height: TILE,
        marginLeft: tile.x - TILE / 2,
        zIndex: i + 1,
      }}
      className="absolute left-1/2 rounded-[22px] border-[6px] border-white object-cover shadow-[0_12px_28px_-10px_rgba(21,21,21,0.35)]"
    />
  );
}

// The folder's back panel, behind the photos.
function CartBack() {
  return (
    <div
      aria-hidden
      className="absolute left-1/2 h-[210px] w-[360px] -translate-x-1/2 rounded-[28px] bg-paper-2"
      style={{ top: BACK_TOP }}
    />
  );
}

// Frosted glass front with a cart pressed into it.
function CartGlass() {
  return (
    <div
      aria-hidden
      className="absolute left-1/2 z-10 grid h-[150px] w-[400px] -translate-x-1/2 place-items-center rounded-[28px] border border-white/80 bg-white/45 shadow-[0_24px_48px_-24px_rgba(21,21,21,0.3),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl"
      style={{ top: GLASS_TOP }}
    >
      <ShoppingCart
        strokeWidth={1.25}
        className="size-14 text-ink/25 [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.9))]"
      />
    </div>
  );
}

// Types one query, then reports back. Remount (key) for the next one.
// `fast` fast-forwards: the rest of the query appears at once.
function TypedQuery({
  text,
  onDone,
  fast = false,
}: {
  text: string;
  onDone?: () => void;
  fast?: boolean;
}) {
  const typing = useTypewriter(text, { speed: 65, startDelay: 150 });
  const typed = fast ? text : typing.typed;
  const done = fast || typing.done;
  // Latest callback in a ref, so parent re-renders don't restart the pause.
  const report = useRef(onDone);
  useEffect(() => {
    report.current = onDone;
  });
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => report.current?.(), fast ? 140 : 300);
    return () => clearTimeout(timer);
  }, [done, fast]);
  return (
    <>
      {typed}
      {!done && (
        <span
          aria-hidden
          className="ml-px inline-block h-5 w-px animate-pulse bg-ink align-middle"
        />
      )}
    </>
  );
}

function SearchRain({
  problem,
  hurry,
  live,
  onFilled,
}: {
  problem: boolean;
  hurry: boolean;
  live: boolean;
  onFilled: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  // The box keeps its height through aspect-ratio (no layout shift); only the
  // drawing inside scales once the column is narrower than the scene.
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(Math.min(1, entry.contentRect.width / SCENE_W)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const [inCart, setInCart] = useState(live ? 0 : PRODUCTS.length);
  if (!live && inCart < PRODUCTS.length) setInCart(PRODUCTS.length);
  const filled = inCart >= PRODUCTS.length;
  useEffect(() => {
    if (filled) onFilled();
  }, [filled, onFilled]);
  const typing = live && inView && !filled ? PRODUCTS[inCart] : null;
  const [typoDone, setTypoDone] = useState(false);
  if (!problem && typoDone && live) setTypoDone(false);
  const failed = problem && (typoDone || !live);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Searches for cherry tomatoes, melon, eggs and steak are typed into the search bar and drop into a shopping cart, a frosted card with a cart icon. Then “cabage” is typed and the search bar turns red."
      className="relative mx-auto aspect-[520/500] w-full max-w-[520px]"
    >
      <div
        className="absolute left-1/2 top-0 origin-top"
        style={{
          width: SCENE_W,
          height: SCENE_H,
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        <motion.div
          animate={failed && live ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
          className={cn(
            "absolute left-1/2 -ml-[160px] flex w-[320px] items-center gap-2.5 rounded-full border bg-paper px-5 shadow-sm transition-colors duration-300",
            failed ? "border-alert ring-2 ring-alert/15" : "border-ink/15",
          )}
          style={{ top: BAR_TOP, height: BAR_H }}
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-[18px] shrink-0 text-ink-muted">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M11 11l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className={cn("truncate text-lg", failed ? "text-alert" : "text-ink")}>
            {problem ? (
              live ? (
                <TypedQuery key={TYPO} text={TYPO} onDone={() => setTypoDone(true)} />
              ) : (
                TYPO
              )
            ) : typing ? (
              <TypedQuery
                key={typing.query}
                text={typing.query}
                fast={hurry}
                onDone={() => setInCart((n) => n + 1)}
              />
            ) : (
              <span className="text-ink-muted">Search</span>
            )}
          </span>
        </motion.div>
        <CartBack />
        {PRODUCTS.map((p, i) => (
          <CartItem key={p.query} i={i} inCart={i < inCart} />
        ))}
        <CartGlass />
      </div>
    </div>
  );
}

// One more scroll after the rain swaps the headline and body: the front
// door has a leak. Both beats share one grid cell, so nothing reflows.
// Phones and reduced motion read them one after the other.
const CONTEXT_BEATS = [
  {
    headline: "Search Was Where Kurly Made the Most Money",
    body: (
      <>
        Kurly is Korea’s premium fresh-grocery unicorn with <B>3.5M monthly active users</B>. People
        who search already know what they want, so search drove{" "}
        <B>more revenue than any other part of the app</B>.
      </>
    ),
  },
  {
    headline: (
      <>
        <span className="text-alert">But</span> 6–7% of Searches Ended in “No&nbsp;Result” Every Day
      </>
    ),
    body: (
      <>
        Each “No Result” left a shopper who was ready to buy with two choices:{" "}
        <B>search again and again</B>, or <B>give up on the purchase</B>.
      </>
    ),
  },
];

function ContextCopy({ problem, live }: { problem: boolean; live: boolean }) {
  const active = problem ? 1 : 0;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">01 CONTEXT</p>
      <div className={live ? "grid" : "flex flex-col gap-10"}>
        {CONTEXT_BEATS.map((beat, i) => {
          const shown = !live || i === active;
          return (
            <motion.div
              key={i}
              aria-hidden={!shown || undefined}
              initial={false}
              animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: i < active ? -16 : 16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "flex flex-col gap-6",
                live && "[grid-area:1/1]",
                !shown && "pointer-events-none",
              )}
            >
              <SectionHeader headline={beat.headline} as={i === 0 ? "h2" : "h3"} />
              <Body>{beat.body}</Body>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// The problem beat waits for the cart: scrolling on early fast-forwards the
// remaining products, then the title and "cabage" change together. The scene
// holds one extra step on the problem beat so a quick scroll can't skip it.
function ContextScene({ step, live }: { step: number; live: boolean }) {
  const [filled, setFilled] = useState(false);
  const onFilled = useCallback(() => setFilled(true), []);
  const problem = !live || (step >= PROBLEM_STEP && filled);
  const hurry = live && step >= PROBLEM_STEP && !filled;
  return (
    <div className={cn(wrap, "grid items-center gap-10 md:grid-cols-[1fr_1.1fr]")}>
      <ContextCopy problem={problem} live={live} />
      <SearchRain problem={problem} hurry={hurry} live={live} onFilled={onFilled} />
    </div>
  );
}

export function Context() {
  return (
    <Chapter id="context" label="01 Context">
      <StickyScene steps={PROBLEM_STEP + 2} label="Searches flowing into the search bar">
        {({ step, live }) => <ContextScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Impact                                                           */
/* ------------------------------------------------------------------ */

// Number and label centred in their column.
const CENTERED = "items-center text-center [&>p:first-child]:justify-center";

// The scene holds on arrival with the old values only; one scroll counts the
// new ones up from zero, and a spare step keeps a quick scroll from skipping it.
const IMPACT_STEPS = 3;
const IMPACT: { from?: Num; to: Num; extra?: string; label: string }[] = [
  {
    from: { value: 6.8, decimals: 2, suffix: "%" },
    to: { value: 0.22, decimals: 2, suffix: "%" },
    label: "No-Result Search Rate",
  },
  {
    from: { value: 58.6, decimals: 2, suffix: "%" },
    to: { value: 60.14, decimals: 2, suffix: "%" },
    label: "Search Click-Through Rate",
  },
  {
    to: { value: 3.6, decimals: 1, prefix: "$", suffix: "M" },
    extra: "(₩5B)",
    label: "New Monthly Revenue from Former Dead Ends",
  },
];

function ImpactScene({ step, live }: { step: number; live: boolean }) {
  // Once counted, the numbers stay, even when scrolling back up.
  const [counted, setCounted] = useState(false);
  if (live && step >= 1 && !counted) setCounted(true);
  const play = live ? counted : undefined;
  return (
    <div className={wrap}>
      <SectionHeader label="02 IMPACT" headline="From Dead Ends to Discoveries" />

      <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
        {IMPACT.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.1}>
            <MetricCounter {...m} countFrom={0} play={play} className={CENTERED} />
          </Reveal>
        ))}
      </div>

      {/* No card: the clip and its caption sit straight on the page. */}
      <Reveal className="mt-20 grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
        <div className="relative aspect-video overflow-hidden rounded-xl border-[0.5px] border-line bg-paper-2">
          <AssetMedia id="summit-stage-clip" />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]">
            Featured at
            <br />
            Google Cloud Summit Seoul 2024
          </h3>
          <p className="text-base leading-relaxed text-ink-muted">
            Google selected this project as a leading enterprise case of AI innovation on GCP.
            Kurly’s CEO presented it on stage, and I built the presentation.
          </p>
          <a
            href={TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent-3 hover:decoration-accent-3"
          >
            Watch the talk →
          </a>
        </div>
      </Reveal>
    </div>
  );
}

export function Impact() {
  return (
    <Chapter id="impact" label="02 Impact">
      <StickyScene steps={IMPACT_STEPS} label="Results, counting up">
        {({ step, live }) => <ImpactScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Role and Responsibility                                          */
/* ------------------------------------------------------------------ */

// What each role lights up in the org chart while it's the newest one.
type RoleCue = "me" | "team" | "links";

const ROLES: { title: string; cue: RoleCue; body: React.ReactNode }[] = [
  {
    title: "Strategy",
    cue: "me",
    body: (
      <>
        Defined the problem and set the project scope. Proposed a simple rule:{" "}
        <B>AI steps in only when the old search finds nothing</B>, so we could ship without touching
        what already worked.
      </>
    ),
  },
  {
    title: "UX",
    cue: "me",
    body: (
      <>
        Designed the <B>“Beta” notice</B> that tells shoppers which results come from AI, so a new
        kind of result felt honest, not confusing.
      </>
    ),
  },
  {
    title: "Execution",
    cue: "team",
    body: (
      <>
        Designed the system architecture with the engineers, built a demo page to choose the right
        data source, designed the A/B test and KPIs, built the monitoring dashboard, and led QA
        through launch.
      </>
    ),
  },
  {
    title: "Alignment",
    cue: "links",
    body: (
      <>Kept the CEO, the search engine team, and the product management team on the same page.</>
    ),
  },
];
// Arrives on the header and chart alone, then one role per scroll, plus a
// spare step so a quick scroll can't skip the last.
const ROLE_STEPS = ROLES.length + 2;

// Who I worked between: the C-level above, the project team around me, and
// the search engine and product management teams below. Drawn in a
// 500 × 440 box that scales with its column. Both groups keep the same 24px
// padding on every side of their chips.
type OrgNode = { label: string; cx: number; cy: number; w: number; me?: boolean; team?: boolean };
const NODE_H = 52;
const GROUP_PAD = 24;
const GROUP_H = NODE_H + GROUP_PAD * 2;
const TEAM_Y = 200;
const BELOW_Y = 380;
const ORG_NODES: OrgNode[] = [
  { label: "C-Level", cx: 110, cy: 46, w: 160 },
  { label: "AI PM (Me)", cx: 110, cy: TEAM_Y, w: 160, me: true, team: true },
  { label: "ML Engineer", cx: 270, cy: TEAM_Y, w: 136, team: true },
  { label: "BE Engineer", cx: 410, cy: TEAM_Y, w: 120, team: true },
  { label: "Search Engine Team", cx: 124, cy: BELOW_Y, w: 188 },
  { label: "Product Management Team", cx: 342, cy: BELOW_Y, w: 224 },
];
// Groups around a row of chips: x from the first chip's left to the last's right.
const ORG_GROUPS = [
  { x1: 30, x2: 470, cy: TEAM_Y, filled: true },
  { x1: 30, x2: 454, cy: BELOW_Y, filled: false },
];
// Two-way links, each a pair of dashed arrows (down, up) either side of AI PM.
const ORG_LINKS = [
  { y1: 46 + NODE_H / 2, y2: TEAM_Y - NODE_H / 2 },
  { y1: TEAM_Y + NODE_H / 2, y2: BELOW_Y - GROUP_H / 2 },
];
const LINK_X = [86, 134];
const DASH = 8;

const BLINK = { opacity: [1, 0.3, 1, 0.3, 1] };

function OrgChart({ cue, beat }: { cue?: RoleCue; beat: number }) {
  const blinks = (n: OrgNode) => (cue === "me" && n.me) || (cue === "team" && n.team);
  return (
    <svg
      viewBox="0 0 500 440"
      role="img"
      aria-label="Team structure: the AI PM (me) reports to and gets approval from the C-level, works in one team with an ML engineer and a backend engineer, and works back and forth with the search engine team and the product management team."
      className="font-display w-full text-ink"
    >
      <defs>
        <marker
          id="org-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1 1 9 5 1 9" fill="none" stroke="var(--color-ink-muted)" strokeWidth="1.5" />
        </marker>
      </defs>

      {ORG_GROUPS.map(({ x1, x2, cy, filled }) => (
        <motion.rect
          key={`${beat}-${cy}`}
          initial={{ opacity: 1 }}
          animate={cue === "team" && filled ? BLINK : { opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          x={x1 - GROUP_PAD}
          y={cy - GROUP_H / 2}
          width={x2 - x1 + GROUP_PAD * 2}
          height={GROUP_H}
          rx={GROUP_H / 2}
          fill={filled ? "var(--color-paper-2)" : "none"}
          stroke={filled ? "none" : "var(--color-line)"}
          strokeWidth="1.5"
        />
      ))}

      {/* Alignment: the dashes run the way each arrow points, briefly. */}
      {ORG_LINKS.map(({ y1, y2 }) =>
        [
          [LINK_X[0], y1 + 4, y2 - 4],
          [LINK_X[1], y2 - 4, y1 + 4],
        ].map(([x, from, to]) => (
          <motion.line
            key={`${beat}-${x}-${y1}`}
            x1={x}
            y1={from}
            x2={x}
            y2={to}
            stroke="var(--color-ink-muted)"
            strokeWidth="1.5"
            strokeDasharray={`${DASH / 2} ${DASH / 2}`}
            markerEnd="url(#org-arrow)"
            initial={{ strokeDashoffset: 0 }}
            animate={cue === "links" ? { strokeDashoffset: -DASH * 6 } : { strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        )),
      )}

      {ORG_NODES.map((n) => (
        <motion.g
          key={`${beat}-${n.label}`}
          initial={{ opacity: 1 }}
          animate={blinks(n) ? BLINK : { opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <rect
            x={n.cx - n.w / 2}
            y={n.cy - NODE_H / 2}
            width={n.w}
            height={NODE_H}
            rx={NODE_H / 2}
            fill={n.me ? "var(--color-accent)" : "var(--color-paper)"}
            stroke={n.me ? "none" : "var(--color-ink)"}
            strokeWidth="1.25"
          />
          <text
            x={n.cx}
            y={n.cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="15"
            fontWeight="500"
            fill={n.me ? "var(--color-paper)" : "currentColor"}
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function RolesScene({ step, live }: { step: number; live: boolean }) {
  // Step 0 is the empty arrival; step n shows roles 1…n. The newest role
  // cues the chart, and the spare last step cues nothing new.
  const revealed = live ? step : ROLES.length;
  const current = live && step >= 1 && step <= ROLES.length ? step - 1 : -1;
  return (
    <div className={wrap}>
      <SectionHeader
        label="03 ROLE AND RESPONSIBILITY"
        headline="A Three-Person Team, a Company-Wide Change"
      />
      <div className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
        <ol className="flex flex-col gap-7">
          {ROLES.map((role, i) => {
            const shown = i < revealed;
            return (
              <motion.li
                key={role.title}
                aria-hidden={!shown || undefined}
                initial={false}
                animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex flex-col gap-1.5"
              >
                <h3 className="font-display text-lg font-medium text-ink">{role.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">{role.body}</p>
              </motion.li>
            );
          })}
        </ol>
        <Reveal>
          <OrgChart cue={ROLES[current]?.cue} beat={current} />
        </Reveal>
      </div>
    </div>
  );
}

export function Roles() {
  return (
    <Chapter id="roles" label="03 Role and Responsibility" className="border-t border-line">
      <StickyScene steps={ROLE_STEPS} label="My roles, one at a time">
        {({ step, live }) => <RolesScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}
