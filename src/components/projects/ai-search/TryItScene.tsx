"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  CABBAGE,
  JALAPENO,
  PhoneSplit,
  RecentScreen,
  StepChips,
  WantCard,
  historyAt,
  type Want,
} from "./ActConflict";
import { SCREENS, SearchQuery } from "./ActSetup";
import { IosKeyboard } from "./IosKeyboard";
import { EASE_OUT, StickyScene, scrollToStep, useBeatClock } from "./motion";
import { Body, PhoneFrame, SectionHeader, ThoughtBubble, wrap } from "./ui";

// 07B: the same four searches that failed in 04, on the same screens, now
// finding products. One scroll step per find, like 04.

type Product = {
  src: string;
  name?: string;
  blurb?: string;
  was?: string;
  off?: string;
  price?: string;
};

type Find = {
  type: string;
  query: string;
  want: Want;
  emoji: string;
  bubble: string;
  // Coded result cards over after.webp. Left out: after.webp's own cabbage
  // results show as they are.
  products?: Product[];
};

// Kurly's real halapeno results. The second row only peeks out above the
// tab bar, so it needs no text.
const RESULTS = "/images/ai-search/results";
const JALAPENO_RESULTS: Product[] = [
  {
    src: `${RESULTS}/jalapeno-melis.webp`,
    name: "[Melis] Jalapeño 3 types (select 1)",
    blurb: "A pleasantly spicy and charming taste",
    was: "₩4,780",
    off: "52%",
    price: "₩2,270~",
  },
  {
    src: `${RESULTS}/jalapeno-la-costena.webp`,
    name: "[La Costeña] Jalapeño Pepper Slices",
    blurb: "A mouth-watering foreign spicy taste",
    was: "₩6,580",
    off: "45%",
    price: "₩3,580",
  },
  { src: `${RESULTS}/jalapeno-prebe.webp` },
  { src: `${RESULTS}/jalapeno-bowl.webp` },
];

const FINDS: Find[] = [
  {
    type: "Misspelling",
    query: "cabage",
    want: CABBAGE,
    emoji: "😊",
    bubble: "There it is.",
  },
  {
    type: "Spacing",
    query: "ca bbage",
    want: CABBAGE,
    emoji: "😊",
    bubble: "Got it this time.",
  },
  {
    type: "Synonym",
    query: "cole",
    want: CABBAGE,
    emoji: "😮",
    bubble: "Oh, it knew what I meant.",
  },
  {
    type: "Foreign word",
    query: "halapeno",
    want: JALAPENO,
    emoji: "🤩",
    bubble: "Finally!",
    products: JALAPENO_RESULTS,
  },
];

// One find, in seconds from its start: the field is tapped (Recent Searches
// opens with the keyboard), the query types out, and AI results come in.
const KEY_S = 0.11;
const KEY_DOWN_S = 0.09;
const LOAD_S = 0.45;
const BUBBLE_S = 0.4;
const HOLD_S = 2.2;

type Beat = { start: number; focus: number; type: number; result: number; end: number };

const BEATS: Beat[] = (() => {
  let start = 0;
  return FINDS.map((f, i) => {
    const focus = i === 0 ? 0.15 : 0.35;
    const type = i === 0 ? 0.6 : 0.75;
    const result = type + f.query.length * KEY_S + LOAD_S;
    const end = result + HOLD_S;
    const beat = { start, focus, type, result, end };
    start += end;
    return beat;
  });
})();
const FINISH_S = BEATS[BEATS.length - 1].start + BEATS[BEATS.length - 1].end;
// One scroll step per find: where each starts and ends on the timeline.
const STARTS = BEATS.map((b) => b.start);
const ENDS = BEATS.map((b) => b.start + b.end);

type Frame = {
  step: number;
  focused: boolean;
  typed: number;
  pressed: boolean;
  result: boolean;
  bubble: boolean;
};

function frameAt(t: number): Frame {
  let step = 0;
  while (step < BEATS.length - 1 && t >= BEATS[step].start + BEATS[step].end) step++;
  const beat = BEATS[step];
  const local = t - beat.start;
  const len = FINDS[step].query.length;
  const into = local - beat.type;
  const typed = into < 0 ? 0 : Math.min(len, Math.floor(into / KEY_S) + 1);
  return {
    step,
    focused: local >= beat.focus,
    typed,
    pressed: typed > 0 && typed <= len && into < len * KEY_S && into % KEY_S < KEY_DOWN_S,
    result: local >= beat.result,
    bubble: local >= beat.result + BUBBLE_S,
  };
}

const sameFrame = (a: Frame, b: Frame) =>
  (Object.keys(a) as (keyof Frame)[]).every((k) => a[k] === b[k]);

// Screen px (590 wide), read off after.webp.
const c = (px: number) => `${(px / 590) * 100}cqw`;
const CARD_X = [24, 300];
// Top of the second row of cards, under the first row's text.
const ROW_2 = 640;

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: c(26), height: c(26) }}
    >
      <path d="M2.5 4h2.6l2.3 10.2h10.4L20 7H6.2" />
      <circle cx="9" cy="18.6" r="1.4" />
      <circle cx="16.4" cy="18.6" r="1.4" />
    </svg>
  );
}

// Result cards in the app's layout, over after.webp's own (and its Buy It
// Again row, which belongs to cabbage), stopping above the tab bar.
function ProductCards({ products }: { products: Product[] }) {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 overflow-hidden bg-white"
      style={{ top: c(292), height: c(1150 - 292) }}
    >
      {products.slice(0, 4).map((p, i) => (
        <div
          key={i}
          className="absolute flex flex-col text-[#333]"
          style={{ left: c(CARD_X[i % 2]), top: c(i < 2 ? 6 : ROW_2), width: c(266) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img
            src={p.src}
            alt=""
            className="aspect-[266/346] w-full object-cover"
            style={{ borderRadius: c(4) }}
          />
          <span
            className="flex items-center justify-center border border-[#ddd]"
            style={{
              marginTop: c(9),
              height: c(48),
              gap: c(4),
              fontSize: c(19),
              borderRadius: c(4),
            }}
          >
            <CartIcon />
            Add to Cart
          </span>
          {p.name && (
            <>
              <span className="text-[#a6a6a6]" style={{ marginTop: c(14), fontSize: c(17) }}>
                Next-morning delivery
              </span>
              <span style={{ marginTop: c(4), fontSize: c(21), lineHeight: c(28) }}>{p.name}</span>
              <span
                className="text-[#a6a6a6]"
                style={{ marginTop: c(4), fontSize: c(17), lineHeight: c(23) }}
              >
                {p.blurb}
              </span>
              <span
                className="text-[#b5b5b5] line-through"
                style={{ marginTop: c(6), fontSize: c(17) }}
              >
                {p.was}
              </span>
              <span className="font-bold" style={{ fontSize: c(22) }}>
                <span className="text-[#fa622f]">{p.off}</span> {p.price}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// What the phone shows for one find at one moment.
function FindScreen({ frame }: { frame: Frame }) {
  const { step, focused, result, pressed } = frame;
  const find = FINDS[step];
  const prev = step > 0 ? FINDS[step - 1] : undefined;
  const typed = find.query.slice(0, frame.typed);
  const searching = focused && !result;
  // Before the tap, later finds still show the previous find's results.
  const shown = result ? find : prev;
  const query = focused ? typed : (prev?.query ?? "");
  return (
    <div className="@container relative size-full">
      <div className="@container relative aspect-[590/1280] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
        <img src={`${SCREENS}/search.webp`} alt="" className="absolute inset-0 size-full" />
        {shown && (
          <motion.div
            key={shown.query}
            initial={result ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img src={`${SCREENS}/after.webp`} alt="" className="absolute inset-0 size-full" />
            {shown.products && <ProductCards products={shown.products} />}
          </motion.div>
        )}
        <motion.div
          initial={false}
          animate={{ opacity: searching ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <RecentScreen
            items={historyAt(FINDS.slice(0, step).map((f) => f.query))}
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

function FindScene({ step: scrollStep, goTo }: { step: number; goTo: (i: number) => void }) {
  const { ref, frame } = useBeatClock({
    step: scrollStep,
    starts: STARTS,
    ends: ENDS,
    frameAt,
    same: sameFrame,
  });
  const find = FINDS[frame.step];
  return (
    <div ref={ref} className="w-full">
      <PhoneSplit
        header={<TryItHeader />}
        copy={<TryItBody />}
        phone={
          <div className="relative">
            {/* The hero's After glow, each time results come in. */}
            {frame.result && (
              <motion.div
                key={`glow-${frame.step}`}
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, times: [0, 0.35, 1] }}
                className="pointer-events-none absolute -inset-4 rounded-[3rem] bg-[linear-gradient(90deg,rgba(176,114,255,0.75),rgba(91,225,255,0.75))] blur-[20px]"
              />
            )}
            <PhoneFrame>
              <FindScreen key={frame.step} frame={frame} />
            </PhoneFrame>
          </div>
        }
        side={
          <>
            {/* What the user is after, as in 04. */}
            <WantCard want={find.want} />
            <StepChips items={FINDS} step={frame.step} onPick={goTo} tone="pass" />
            <div className="min-h-24">
              <motion.div
                key={frame.step}
                initial={{ opacity: 0, x: -10, scale: 0.96 }}
                animate={
                  frame.bubble
                    ? { opacity: 1, x: 0, scale: 1 }
                    : { opacity: 0, x: -10, scale: 0.96 }
                }
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <ThoughtBubble emoji={find.emoji} text={find.bubble} />
              </motion.div>
            </div>
          </>
        }
      />
    </div>
  );
}

// Phones and reduced motion: the four finds as a plain list.
function FindList() {
  return (
    <ol className={cn(wrap, "grid gap-4 md:grid-cols-2")}>
      {FINDS.map((f) => (
        <li key={f.query} className="flex flex-col gap-3 rounded-2xl border border-line p-5">
          <div className="flex flex-col gap-1">
            <p className="font-display text-lg font-semibold text-accent">{f.type}</p>
            <p className="font-mono text-sm text-ink-muted">{f.query}</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-paper-2 p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img src={f.want.src} alt="" className="size-12 rounded-lg object-cover" />
            <span className="text-sm text-ink">{f.want.name} found</span>
          </div>
          <ThoughtBubble emoji={f.emoji} text={f.bubble} tail="none" />
        </li>
      ))}
    </ol>
  );
}

function TryItHeader() {
  return <SectionHeader as="h3" headline="Test Results: Same Typos, Products Found" />;
}

function TryItBody() {
  return (
    <Body>
      Qualitative checks showed clearly better results for all four query types. That was enough to
      ask for a full A/B test.
    </Body>
  );
}

// One scroll step per find; the title and body stay pinned with the phone.
export function TryItStage() {
  const stage = useRef<HTMLDivElement>(null);
  // The StickyScene is the stage's only child.
  const goTo = (i: number) => {
    const scene = stage.current?.firstElementChild;
    if (scene instanceof HTMLElement) scrollToStep(scene, i, FINDS.length);
  };
  return (
    <div ref={stage} id="try-it" className="pt-16 md:pt-24">
      <StickyScene
        steps={FINDS.length}
        vh={100}
        still={() => (
          <div className="flex flex-col gap-10">
            <div className={cn(wrap, "flex flex-col gap-5")}>
              <TryItHeader />
              <TryItBody />
            </div>
            <FindList />
          </div>
        )}
        label="The same four searches, now finding products"
      >
        {({ step }) => <FindScene step={step} goTo={goTo} />}
      </StickyScene>
    </div>
  );
}
