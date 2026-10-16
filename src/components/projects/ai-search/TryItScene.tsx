"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CABBAGE, JALAPENO, RecentScreen, historyAt, type Want } from "./ActConflict";
import { SCREENS, SearchQuery } from "./ActSetup";
import { IosKeyboard } from "./IosKeyboard";
import { EASE_OUT, StickyScene, useHeldClock } from "./motion";
import { PhoneFrame, ThoughtBubble, wrap } from "./ui";

// 07B: the same four searches that failed in 04, on the same screens, now
// finding products. Plays on its own like 04; scrolling speeds it up.

type Product = { src: string; name: string; was: string; off: string; price: string };

type Find = {
  type: string;
  query: string;
  want: Want;
  emoji: string;
  bubble: string;
  // Coded result cards over after.webp. Left out: after.webp's own cabbage
  // results show as they are.
  products?: Product[];
  // Shown until the real result screen is in.
  standIn?: boolean;
};

// TODO(user): real jalapeño results (product photos, names, prices).
const JALAPENO_STAND_IN: Product[] = [
  { src: JALAPENO.src, name: "Jalapeño", was: "₩0,000", off: "0%", price: "₩0,000" },
  { src: JALAPENO.src, name: "Jalapeño", was: "₩0,000", off: "0%", price: "₩0,000" },
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
    products: JALAPENO_STAND_IN,
    standIn: true,
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
      className="absolute inset-x-0 bg-white"
      style={{ top: c(292), height: c(1150 - 292) }}
    >
      {products.slice(0, 2).map((p, i) => (
        <div
          key={i}
          className="absolute flex flex-col text-[#333]"
          style={{ left: c(CARD_X[i]), top: c(6), width: c(266) }}
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
          <span className="text-[#a6a6a6]" style={{ marginTop: c(14), fontSize: c(17) }}>
            Early-morning delivery
          </span>
          <span style={{ marginTop: c(4), fontSize: c(21), lineHeight: c(28) }}>{p.name}</span>
          <span
            className="text-[#b5b5b5] line-through"
            style={{ marginTop: c(6), fontSize: c(17) }}
          >
            {p.was}
          </span>
          <span className="font-bold" style={{ fontSize: c(22) }}>
            <span className="text-[#fa622f]">{p.off}</span> {p.price}
          </span>
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
            {shown.standIn && (
              <span className="absolute bottom-[14%] left-2 rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] text-paper">
                placeholder · halapeno results
              </span>
            )}
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

// The four query types, type on top and its example under it. They track
// the scene rather than take clicks.
function FindChips({ step }: { step?: number }) {
  return (
    <ol aria-label="Four query types" className="flex flex-wrap justify-center gap-2 md:gap-3">
      {FINDS.map((f, i) => {
        const on = i === step;
        return (
          <li
            key={f.query}
            aria-current={on ? "step" : undefined}
            className={cn(
              "flex min-w-36 flex-col items-start gap-1 rounded-xl border px-4 py-2.5 transition-colors duration-300",
              on ? "border-accent bg-accent text-paper" : "border-line bg-paper text-ink",
            )}
          >
            <span className="font-display text-base font-semibold leading-tight md:text-lg">
              {f.type}
            </span>
            <span className={cn("font-mono text-sm", on ? "text-paper/75" : "text-ink-muted")}>
              {f.query}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function FindScene({ stage }: { stage: React.RefObject<HTMLDivElement | null> }) {
  const { ref, frame } = useHeldClock({ stage, finish: FINISH_S, frameAt, same: sameFrame });
  const find = FINDS[frame.step];
  return (
    <div ref={ref} className="flex w-full flex-col gap-10">
      <FindChips step={frame.step} />
      <div className="grid w-full items-center gap-8 md:grid-cols-[1fr_272px_1fr] md:gap-10">
        {/* What the user is after, as in 04. */}
        <div className="flex flex-col items-center gap-3 text-center md:justify-self-end">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-ink-muted">
            What users want
          </p>
          <div className="relative size-40 overflow-hidden rounded-2xl md:size-44">
            <AnimatePresence initial={false}>
              <motion.img
                key={find.want.src}
                src={find.want.src}
                alt={find.want.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 size-full object-cover"
              />
            </AnimatePresence>
          </div>
          <p className="font-display text-lg font-medium text-ink">{find.want.name}</p>
        </div>

        <div className="flex justify-center">
          <PhoneFrame>
            <FindScreen key={frame.step} frame={frame} />
          </PhoneFrame>
        </div>

        <div className="flex min-h-24 justify-center md:justify-start">
          <motion.div
            key={frame.step}
            initial={{ opacity: 0, x: -10, scale: 0.96 }}
            animate={
              frame.bubble ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -10, scale: 0.96 }
            }
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <ThoughtBubble emoji={find.emoji} text={find.bubble} />
          </motion.div>
        </div>
      </div>
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

// Pulled up under the copy like 04's scene: the pinned block (chips + phone,
// ~680px) is centred in the viewport, which otherwise leaves a tall gap.
export function TryItStage() {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <div ref={stage} className="md:motion-safe:-mt-[max(0px,calc((100svh-680px)/2-3rem))]">
      <StickyScene
        steps={1}
        vh={130}
        still={() => <FindList />}
        label="The same four searches, now finding products"
      >
        {() => (
          <div className={wrap}>
            <FindScene stage={stage} />
          </div>
        )}
      </StickyScene>
    </div>
  );
}
