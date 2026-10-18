"use client";

import { motion, useAnimationFrame, useInView } from "framer-motion";
import { Pencil, RotateCw } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT, Reveal, StickyScene, useFitScale, useStill } from "../story/motion";
import { RolesChapter, type Role } from "../story/OrgChart";
import {
  B,
  BeatCopy,
  Body,
  CENTERED,
  Chapter,
  HookLines,
  MetricCounter,
  SectionHeader,
  StoryHero,
  wrap,
  type CopyBeat,
  type Num,
} from "../story/ui";
import { HERO_THEMES, type Theme } from "./data";
import { ProductImage } from "./ui";

// Act 1, Setup: Hero · 01 Context · 02 Impact · 03 R&R, and the hook into
// 04 (spec §5.0–5.4). The reader learns what was achieved before learning how.

const META = [
  ["Period", ["June 2024", "– December 2024"]],
  ["Role", ["AI Product Manager", "UX Research", "A/B Test Design", "CEO Communication", "QA"]],
  ["Team", ["AI PM (Me)", "1 ML Engineer", "1 Backend Engineer"]],
  ["Org", ["Kurly"]],
] as const;

// Kurly's homepage, rebuilt in Figma at 1440 wide and cut into bands: the
// header, the banner, then five themed campaigns. Heights are in page px.
const HOME = "/images/ai-curation/homepage";
const PAGE_W = 1440;
// The window crops the page's empty sides: it shows x 130…1310.
const CROP_X = 130;
const VIEW_W = 1180;

/* ------------------------------------------------------------------ */
/* Hero: ThemeToCampaigns                                              */
/* ------------------------------------------------------------------ */

// One loop, in seconds: the four titles type out, overlapping, the AI node
// lights, and Kurly's homepage fills with a campaign for each title, one
// after another.
export const KEY_S = 0.035;
const LINE_STARTS = [0.4, 0.65, 0.9, 1.15];
const TYPED_S = Math.max(...HERO_THEMES.map((t, i) => LINE_STARTS[i] + t.title.length * KEY_S));
// The dashes run from the note into AI, AI lights, then they run on into the page.
export const LINE_S = 0.18;
const LINE_IN_AT = TYPED_S + 0.2;
const AI_AT = LINE_IN_AT + LINE_S;
const LINE_OUT_AT = AI_AT + 0.3;
export const FILL_AT = LINE_OUT_AT + LINE_S;
const SECTION_GAP_S = 0.35;
const FILL_KEY_S = 0.07;
export const SHOWN = 4; // products in each campaign row
const LOOP_S = FILL_AT + SECTION_GAP_S * 3 + SHOWN * FILL_KEY_S + 3;

export type HeroFrame = {
  typed: number[];
  lineIn: boolean;
  ai: boolean;
  lineOut: boolean;
  // Products shown in each campaign; -1 while the campaign isn't on the page.
  filled: number[];
  // The last moments of the loop fade everything back to an empty title card.
  out: boolean;
};

export function heroFrame(t: number): HeroFrame {
  return {
    typed: HERO_THEMES.map((theme, i) =>
      Math.max(0, Math.min(theme.title.length, Math.floor((t - LINE_STARTS[i]) / KEY_S))),
    ),
    lineIn: t >= LINE_IN_AT,
    ai: t >= AI_AT,
    lineOut: t >= LINE_OUT_AT,
    filled: HERO_THEMES.map((_, i) => {
      const at = FILL_AT + i * SECTION_GAP_S;
      return t < at ? -1 : Math.min(SHOWN, Math.floor((t - at) / FILL_KEY_S));
    }),
    out: t >= LOOP_S - 0.5,
  };
}

export const sameHero = (a: HeroFrame, b: HeroFrame) =>
  a.lineIn === b.lineIn &&
  a.ai === b.ai &&
  a.lineOut === b.lineOut &&
  a.out === b.out &&
  a.typed.every((n, i) => n === b.typed[i]) &&
  a.filled.every((n, i) => n === b.filled[i]);

// Scene geometry (px, inside a 300 × 630 box that scales to its column).
const SCENE_W = 300;
const SCENE_H = 630;
export const CARD_H = 172;
const AI_W = 92;
export const AI_H = 64;
const AI_Y = 198;
const WEB_TOP = 298;
const WEB_H = SCENE_H - WEB_TOP;
const WEB_BAR_H = 22;
// Kurly's header, from the 01 Context bands, cropped like the window there.
const HEADER_H = Math.round((196 * SCENE_W) / VIEW_W);
// A campaign row: its title, then a row of product cards (about 111px).
const SECTION_H = 120;

// A lavender from Kurly's purple family, for the dashes.
export const LAVENDER = "#b9a2f2";
// The AI Search hero's glow: violet into sky blue, blurred, under a card.
const GLOW =
  "pointer-events-none absolute rounded-[1.5rem] bg-[linear-gradient(90deg,rgba(176,114,255,0.75),rgba(91,225,255,0.75))] blur-xl";

export function TitleCard({
  typed,
  caret,
  glass = false,
}: {
  typed: number[];
  caret: number;
  // Frosted and see-through, for a dark backdrop (the card thumbnail).
  glass?: boolean;
}) {
  const rule = glass ? "border-white/25" : "border-line";
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 rounded-xl border px-3.5 pb-1.5 pt-2.5",
        glass ? "border-white/30 bg-white/15 backdrop-blur-md" : "border-line bg-paper",
      )}
      style={{ height: CARD_H }}
    >
      <p
        className={cn(
          "flex items-center gap-1.5 border-b pb-2 text-xs font-medium",
          rule,
          glass ? "text-white/70" : "text-ink-muted",
        )}
      >
        Campaign Theme Title <Pencil aria-hidden className="size-3" strokeWidth={1.75} />
      </p>
      <ul className={cn("text-sm", glass ? "text-white" : "text-ink")}>
        {HERO_THEMES.map((theme, i) => (
          <li
            key={theme.title}
            className={cn(
              "flex h-8 items-center gap-2 border-b border-dashed last:border-b-0",
              rule,
            )}
          >
            <span aria-hidden className={cn("transition-opacity", typed[i] === 0 && "opacity-0")}>
              {theme.emoji}
            </span>
            <span className="truncate">{theme.title.slice(0, typed[i])}</span>
            {caret === i && (
              <span
                aria-hidden
                className={cn(
                  "-ml-1.5 inline-block h-4 w-px animate-pulse",
                  glass ? "bg-white" : "bg-ink",
                )}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A soft, blurred orb (violet core, warm top, cyan bottom) with “AI” on it,
// in light tints that sit well on white. It swells a little as it works.
export function AiNode({ on, top = AI_Y }: { on: boolean; top?: number }) {
  const id = useId();
  return (
    <motion.div
      className="absolute left-1/2 -ml-[46px] grid place-items-center"
      style={{ top, width: AI_W, height: AI_H }}
      initial={false}
      animate={{ scale: on ? 1.08 : 1 }}
      transition={on ? { duration: 0.4, ease: EASE_OUT } : { duration: 0 }}
    >
      <svg aria-hidden viewBox="0 0 62 43" className="absolute inset-0 size-full">
        <defs>
          <filter id={`${id}-blur`} x="0" y="0" width="62" height="43" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <radialGradient
            id={`${id}-core`}
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(5.11243 22.0562 -34.0296 3.31361 25.8876 16.9438)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FDE6FF" />
            <stop offset="0.697" stopColor="#9B5CF6" />
          </radialGradient>
          <linearGradient
            id={`${id}-cool`}
            x1="30.26"
            y1="16.78"
            x2="30.57"
            y2="39.01"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF8A8A" stopOpacity="0" />
            <stop offset="1" stopColor="#7FF0FF" />
          </linearGradient>
          <linearGradient
            id={`${id}-warm`}
            x1="28.87"
            y1="6.54"
            x2="28.49"
            y2="18.91"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF6A8" />
            <stop offset="1" stopColor="#FF8A8A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g filter={`url(#${id}-blur)`}>
          <ellipse cx="31" cy="21.5" rx="27" ry="17.5" fill={`url(#${id}-core)`} />
          <ellipse
            cx="31"
            cy="21.5"
            rx="27"
            ry="17.5"
            fill={`url(#${id}-cool)`}
            fillOpacity="0.6"
          />
          <ellipse
            cx="31"
            cy="21.5"
            rx="27"
            ry="17.5"
            fill={`url(#${id}-warm)`}
            fillOpacity="0.4"
          />
        </g>
      </svg>
      <span className="relative font-display text-xl font-bold tracking-tight text-white">AI</span>
    </motion.div>
  );
}

// Kurly-purple dashes: from the note down into AI, and from AI on into the
// page.
const LINES = [
  { d: `M${SCENE_W / 2} ${CARD_H + 4} V${AI_Y + 6}`, key: "in" },
  { d: `M${SCENE_W / 2} ${AI_Y + AI_H - 6} V${WEB_TOP - 4}`, key: "out" },
] as const;

function Connectors({ on, still }: { on: [boolean, boolean]; still: boolean }) {
  return (
    <svg
      aria-hidden
      width={SCENE_W}
      height={SCENE_H}
      className="pointer-events-none absolute inset-0"
    >
      {LINES.map(({ d, key }, i) => (
        <DashLine key={key} d={d} on={on[i]} still={still} w={SCENE_W} h={SCENE_H} />
      ))}
    </svg>
  );
}

// One lavender dashed line, revealed along its length by a solid mask. Goes
// in an SVG of size w × h.
export function DashLine({
  d,
  on,
  still,
  w,
  h,
  width = 2,
  dash = "3 6",
  duration = LINE_S,
}: {
  d: string;
  on: boolean;
  still: boolean;
  w: number;
  h: number;
  width?: number;
  dash?: string;
  duration?: number;
}) {
  const id = useId();
  return (
    <g>
      <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
        <motion.path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={6}
          initial={false}
          animate={{ pathLength: on ? 1 : 0 }}
          // Drawn quickly; wiped at once when the loop starts over.
          transition={still || !on ? { duration: 0 } : { duration, ease: "easeInOut" }}
        />
      </mask>
      <path
        d={d}
        mask={`url(#${id})`}
        fill="none"
        stroke={LAVENDER}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
    </g>
  );
}

// A campaign row on Kurly's web homepage: its title, then products with
// placeholder name and price lines.
function WebCampaign({ theme, shown }: { theme: Theme; shown: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className="flex flex-col gap-1.5 px-3 pt-2.5"
      style={{ height: SECTION_H }}
    >
      <p className="truncate text-center text-[10px] font-semibold text-ink">
        {theme.emoji} {theme.title} ›
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {theme.products.slice(0, SHOWN).map((product, j) => (
          <motion.div
            key={product.id}
            initial={false}
            animate={{ opacity: j < shown ? 1 : 0, scale: j < shown ? 1 : 0.85 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="flex flex-col gap-1"
          >
            <ProductImage product={product} />
            <span className="h-1 w-full rounded-full bg-line" />
            <span className="h-1 w-2/3 rounded-full bg-line" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function KurlyWeb({ filled }: { filled: number[] }) {
  const sections = filled.filter((n) => n >= 0).length;
  // As campaigns pile up, the page scrolls to keep the newest one in view.
  const y = Math.min(0, WEB_H - WEB_BAR_H - HEADER_H - sections * SECTION_H);
  return (
    <div
      className="absolute inset-x-0 overflow-hidden rounded-xl border border-line bg-paper"
      style={{ top: WEB_TOP, height: WEB_H }}
    >
      <div
        className="relative z-10 flex items-center gap-1 border-b border-line bg-paper-2 px-2.5"
        style={{ height: WEB_BAR_H }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 rounded-full bg-line" />
        ))}
        <span className="ml-2 rounded bg-paper px-2 text-[8px] leading-[14px] text-ink-muted">
          kurly.com
        </span>
      </div>
      <motion.div initial={false} animate={{ y }} transition={{ duration: 0.45, ease: EASE_OUT }}>
        <div className="overflow-hidden" style={{ height: HEADER_H }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img
            src={`${HOME}/header.webp`}
            alt=""
            className="block max-w-none"
            style={{
              width: (PAGE_W * SCENE_W) / VIEW_W,
              marginLeft: -(CROP_X * SCENE_W) / VIEW_W,
            }}
          />
        </div>
        {HERO_THEMES.map(
          (theme, i) =>
            filled[i] >= 0 && <WebCampaign key={theme.title} theme={theme} shown={filled[i]} />,
        )}
      </motion.div>
    </div>
  );
}

function ThemeToCampaigns() {
  const still = useStill();
  const { ref, scale } = useFitScale(SCENE_W);
  const inView = useInView(ref, { amount: 0.3 });
  const clock = useRef(0);
  const [frame, setFrame] = useState(() => heroFrame(still ? LOOP_S - 1 : 0));
  useAnimationFrame((_, delta) => {
    if (still || !inView) return;
    clock.current = (clock.current + delta / 1000) % LOOP_S;
    const next = heroFrame(clock.current);
    setFrame((f) => (sameHero(f, next) ? f : next));
  });
  // Reduced motion: the finished state, held.
  const shown = still ? heroFrame(LOOP_S - 1) : frame;
  // The caret sits on the last line still being typed.
  const typing = shown.typed.map((n, i) => n > 0 && n < HERO_THEMES[i].title.length);
  const caret = typing.lastIndexOf(true);
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Four campaign theme titles are typed into a note: The Ultimate Snack Drop, Spicy Chinese Takeout Vibe, The Sweetest Year-End Vibe and Matcha Core: Trending Now. An AI node lights up, and Kurly’s homepage fills with a campaign of matching products for each title, one after another."
      className="relative w-[300px] max-w-full"
      style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}` }}
    >
      <motion.div
        initial={false}
        animate={{ opacity: shown.out ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: SCENE_W, height: SCENE_H, scale }}
      >
        {/* Colorful glows under the note and, once its campaigns arrive,
            under the page. */}
        <div
          aria-hidden
          className={cn(GLOW, "inset-x-2 top-4 opacity-50")}
          style={{ height: CARD_H - 8 }}
        />
        <motion.div
          aria-hidden
          className={cn(GLOW, "inset-x-2")}
          style={{ top: WEB_TOP + 16, height: SCENE_H - WEB_TOP - 24 }}
          initial={false}
          animate={{ opacity: shown.filled[0] >= 0 ? 0.7 : 0 }}
          transition={shown.filled[0] >= 0 ? { duration: 0.8 } : { duration: 0 }}
        />
        <TitleCard typed={shown.typed} caret={caret} />
        <Connectors on={[shown.lineIn, shown.lineOut]} still={still} />
        <AiNode on={shown.ai} />
        <KurlyWeb filled={shown.filled} />
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <StoryHero
      chips={{ type: "AI Transformation", domain: "Commerce", proof: "A/B Validated" }}
      title={
        <>
          AI Curation: <br />
          Scaling Themed Campaigns
        </>
      }
      tagline="“You name the theme. AI does the rest.”"
      body={
        <>
          At Kurly, every themed campaign on the homepage was picked by hand. When the team behind
          them shrank, the homepage went stale. I led an AI system that turns a theme into a full
          campaign and keeps it fresh on its own.
        </>
      }
      meta={META}
      device={<ThemeToCampaigns />}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 01 Context: KurlyHomepage                                           */
/* ------------------------------------------------------------------ */

const CONTEXT_BEATS: CopyBeat[] = [
  {
    headline: "Curation Is What Kurly Sells",
    body: [
      <>
        Kurly built its brand on picks: customers trust that if Kurly shows a product, it’s worth
        buying.
      </>,
      <>
        On the homepage, <B>themed campaigns</B> bring a new theme and a fresh mix of products every
        day. It’s where customers discover something new and enjoy shopping.
      </>,
    ],
  },
  {
    headline: "But the Campaigns Went Stale",
    body: [
      <>
        A space meant to show something new and good every day started showing{" "}
        <B>the same campaigns and products, day after day</B>.
      </>,
      <>
        With fewer merchandisers (MDs) on the curation team, keeping the campaigns fresh kept
        getting pushed back.
      </>,
    ],
  },
];

const TOP_BANDS = [
  { src: `${HOME}/header.webp`, h: 196 },
  { src: `${HOME}/banner.webp`, h: 370 },
];
const CAMPAIGNS = [
  { src: `${HOME}/fruit.webp`, h: 722, title: "This week’s fruit specials" },
  { src: `${HOME}/gourmet.webp`, h: 698, title: "An autumn gourmet journey" },
  { src: `${HOME}/hydration.webp`, h: 722, title: "Seasonal hydration" },
  { src: `${HOME}/kitchenware.webp`, h: 696, title: "The hottest kitchenware right now" },
  { src: `${HOME}/snacks.webp`, h: 702, title: "Snacks everyone loves" },
];
const CAMPAIGNS_Y = TOP_BANDS.reduce((y, b) => y + b.h, 0);
const CAMPAIGN_TOPS = CAMPAIGNS.reduce<number[]>(
  (tops, c, i) => [...tops, i === 0 ? CAMPAIGNS_Y : tops[i - 1] + CAMPAIGNS[i - 1].h],
  [],
);
// The window shows this much of the page, in page px.
const WINDOW_H = 1000;
// Once nobody refreshes it, the page reloads day after day onto this same
// lineup, its autumn campaign and all.
const STUCK = 1;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_S = 2.2;
// The pop-out card shows the campaign from x 150 to 1290, then grows past
// the window's edges.
const CARD_X = 150;
const CARD_W = 1140;
const POP = 1.1;
// The tour plays on its own: a short look at the top of the page, then a
// stop per campaign.
const TOP_S = 1.2;
const STOP_S = 2.8;
// Within a stop, in seconds: the page glides, the card pops, holds, settles.
const POP_TIMES = [0, 0.8, 0.85, 1.25, 2.2, 2.55, 2.65].map((t) => t / STOP_S);
const SHADOW_OFF = "0 0 0 0 rgba(0,0,0,0)";
const SHADOW_ON = "0 24px 48px -12px rgba(0,0,0,0.35)";

function KurlyHomepage({ step, live }: { step: number; live: boolean }) {
  const { ref, scale } = useFitScale(VIEW_W);
  const inView = useInView(ref, { amount: 0.5 });
  const stale = live && step >= 1;
  const touring = live && !stale && inView;
  // -1 is the top of the page; 0…4 stop on each campaign.
  const [stop, setStop] = useState(-1);
  useEffect(() => {
    if (!touring) return;
    const timer = setTimeout(
      () => setStop((s) => (s + 1 >= CAMPAIGNS.length ? -1 : s + 1)),
      (stop < 0 ? TOP_S : STOP_S) * 1000,
    );
    return () => clearTimeout(timer);
  }, [touring, stop]);
  // Leaving the tour starts it over from the top next time.
  if (!touring && stop !== -1) setStop(-1);

  // Stale, the days tick by and each reload brings back the same page. The
  // first day reloads too, so the beat is even from the start.
  const [day, setDay] = useState(0);
  const reloading = stale && inView;
  useEffect(() => {
    if (!reloading) return;
    const timer = setInterval(() => setDay((d) => d + 1), DAY_S * 1000);
    return () => clearInterval(timer);
  }, [reloading]);

  const focus = touring ? stop : -1;
  const centered = focus >= 0 ? focus : stale ? STUCK : -1;
  const y =
    centered >= 0 ? -(CAMPAIGN_TOPS[centered] + CAMPAIGNS[centered].h / 2 - WINDOW_H / 2) : 0;
  const card = focus >= 0 ? CAMPAIGNS[focus] : null;

  return (
    <div
      role="img"
      aria-label={
        stale
          ? `Kurly’s homepage, greyed out, reloads day after day, Monday to Sunday, and shows the same “${CAMPAIGNS[STUCK].title}” campaign every time.`
          : `Kurly’s homepage scrolls past its themed campaigns, each one lifting out of the page in turn: ${CAMPAIGNS.map((c) => `“${c.title}”`).join(", ")}.`
      }
      className="mx-auto w-full max-w-[640px] rounded-xl border border-line bg-paper shadow-[0_12px_40px_-16px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center gap-1.5 rounded-t-xl border-b border-line bg-paper-2 px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-line" />
        ))}
        <span className="ml-3 truncate rounded-md bg-paper px-3 py-0.5 text-[11px] text-ink-muted">
          kurly.com
        </span>
        {/* Reload: pressed and turned once with every new day. */}
        <motion.span
          key={`reload-${stale ? day : -1}`}
          aria-hidden
          className="ml-1.5 grid size-5 place-items-center rounded-full"
          initial={false}
          animate={
            stale
              ? {
                  rotate: [0, 360],
                  scale: [1, 0.85, 1],
                  backgroundColor: ["rgba(0,0,0,0.12)", "rgba(0,0,0,0)"],
                }
              : {}
          }
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <RotateCw className="size-3 text-ink-muted" strokeWidth={2.25} />
        </motion.span>
        {stale && (
          <motion.span
            key={`day-${day}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-auto text-[11px] font-medium text-ink-muted"
          >
            {DAYS[day % DAYS.length]}
          </motion.span>
        )}
      </div>
      <div className="relative">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-b-xl"
          style={{ height: WINDOW_H * scale }}
        >
          <motion.div
            className={cn(
              "absolute left-0 top-0 origin-top-left transition-[filter,opacity] duration-700",
              stale && "opacity-70 grayscale",
            )}
            style={{ width: PAGE_W, scale, x: -CROP_X * scale }}
            initial={false}
            // The page is scaled about its top-left, so moves are in screen px.
            animate={{ y: y * scale }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          >
            {TOP_BANDS.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP
              <img key={b.src} src={b.src} alt="" width={PAGE_W} height={b.h} className="block" />
            ))}
            {CAMPAIGNS.map((c, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: focus < 0 || i === focus ? 1 : 0.4 }}
                transition={{ duration: 0.5 }}
                className="bg-paper"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
                <img src={c.src} alt="" width={PAGE_W} height={c.h} className="block" />
              </motion.div>
            ))}
          </motion.div>
          {/* Each reload blanks the page for a beat, then the same page returns. */}
          {stale && (
            <motion.div
              key={day}
              aria-hidden
              className="absolute inset-0 bg-paper"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0.95, 0] }}
              transition={{ duration: 1.1, times: [0, 0.25, 0.45, 1], ease: "easeInOut" }}
            />
          )}
        </div>

        {/* The campaign in focus, lifted out of the page: a copy laid exactly
            over it that grows past the window's edges, then settles back. */}
        {card && (
          <motion.div
            key={focus}
            aria-hidden
            className="pointer-events-none absolute z-10 overflow-hidden bg-paper"
            style={{
              left: (CARD_X - CROP_X) * scale,
              top: ((WINDOW_H - card.h) / 2) * scale,
              width: CARD_W * scale,
              height: card.h * scale,
              borderRadius: 16,
            }}
            initial={{ scale: 1, opacity: 0, boxShadow: SHADOW_OFF }}
            animate={{
              scale: [1, 1, 1, POP, POP, 1, 1],
              opacity: [0, 0, 1, 1, 1, 1, 0],
              boxShadow: [
                SHADOW_OFF,
                SHADOW_OFF,
                SHADOW_OFF,
                SHADOW_ON,
                SHADOW_ON,
                SHADOW_OFF,
                SHADOW_OFF,
              ],
            }}
            transition={{ duration: STOP_S, times: POP_TIMES, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
            <img
              src={card.src}
              alt=""
              width={PAGE_W}
              height={card.h}
              className="block max-w-none"
              style={{ width: PAGE_W * scale, marginLeft: -CARD_X * scale }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function Context() {
  return (
    <Chapter id="context" label="01 Context">
      {/* Step 0 plays the homepage tour on its own; one scroll turns it stale. */}
      <StickyScene
        steps={3}
        label="Kurly’s homepage, campaign by campaign, then the same campaign again and again"
      >
        {({ step, live }) => (
          <div
            className={cn(wrap, "grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.2fr]")}
          >
            <BeatCopy
              label="01 CONTEXT"
              beats={CONTEXT_BEATS}
              active={live && step >= 1 ? 1 : 0}
              live={live}
            />
            <KurlyHomepage step={step} live={live} />
          </div>
        )}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 02 Impact                                                           */
/* ------------------------------------------------------------------ */

const IMPACT_IMG = "/images/ai-curation/impact";

// Lands with the labels, one scroll counts the numbers up, a spare step holds.
const IMPACT: { to: Num; extra?: string; label: string }[] = [
  { to: { value: 25, suffix: "%" }, label: "of Key Homepage Slots Fully Automated by AI" },
  { to: { value: 200, suffix: "+" }, label: "Themed Campaigns Run by AI" },
  { to: { value: 2 }, extra: "days / week", label: "of MD Time Saved" },
];

// The MD sits in place from the start, the AI tucked behind her; on scroll the
// AI slides out to the right as it fades in, then the numbers rise between.
function useSlideOut() {
  const grid = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const [dx, setDx] = useState(0);
  useLayoutEffect(() => {
    const g = grid.current;
    if (!g) return;
    // offsetLeft ignores transforms, so this reads the resting spots.
    const mid = (el: HTMLElement | null) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0);
    const measure = () => setDx(mid(left.current) - mid(right.current));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(g);
    return () => ro.disconnect();
  }, []);
  const still = useStill();
  const slide = (open: boolean) => ({
    initial: still ? false : { opacity: 0, x: 0 },
    animate: open ? { opacity: 1, x: 0 } : { opacity: 0, x: dx },
    transition: open ? { duration: 1.2, ease: EASE_OUT } : { duration: 0 },
  });
  return { grid, left, right, slide };
}

function ImpactScene({ step, live }: { step: number; live: boolean }) {
  // Once opened, the figures and numbers stay, even when scrolling back up.
  const [counted, setCounted] = useState(false);
  if (live && step >= 1 && !counted) setCounted(true);
  // Unpinned (phones), the spread runs when the figures scroll into view.
  const still = useStill();
  const { grid, left, right, slide } = useSlideOut();
  const inView = useInView(grid, { once: true, amount: 0.4 });
  const open = still || (live ? counted : inView);
  return (
    <div className={wrap}>
      <SectionHeader label="02 IMPACT" headline="From Hand-Picked to Self-Running" />
      <Reveal>
        {/* A line per sentence from md up, never wrapping once there is room (xl). */}
        <Body className="mt-6 max-w-none [&>span]:md:block [&>span]:xl:whitespace-nowrap">
          <span>
            Implemented an AI system that <B>curates as well as Kurly’s expert MDs</B>.
          </span>{" "}
          <span>
            In an A/B test, its campaigns matched their hand-picked ones on clicks and purchases.
          </span>{" "}
          <span>
            With curation handed to the AI, MDs could{" "}
            <B>focus on the work that needs their judgment most</B>.
          </span>
        </Body>
      </Reveal>

      {/* The MD and the AI face each other, the results between them. */}
      <div
        ref={grid}
        className="relative mt-12 grid grid-cols-2 items-center gap-x-6 gap-y-10 md:grid-cols-[1fr_auto_1fr] md:gap-4"
      >
        {/* One desk under both figures, its edge at their lowest fingertips (~80%
            down each image), fading out at the ends. */}
        <div
          aria-hidden
          className="pointer-events-none col-span-full row-start-1 h-[20.5%] self-end"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent)",
            maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        />
        <div ref={left} className="relative z-10 col-start-1 row-start-1 justify-self-end">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img
            src={`${IMPACT_IMG}/md.webp`}
            alt="A Kurly MD, pen in hand"
            width={560}
            height={751}
            className="block w-full max-w-[320px]"
          />
        </div>
        <div className="col-span-2 row-start-2 flex flex-col gap-10 md:col-span-1 md:col-start-2 md:row-start-1 md:pb-16">
          {IMPACT.map((m, i) => (
            <motion.div
              key={m.label}
              initial={still ? false : { opacity: 0, y: 16 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: open ? 0.7 + i * 0.12 : 0 }}
              className="flex flex-col items-center gap-2"
            >
              <MetricCounter
                to={m.to}
                extra={m.extra}
                label={m.label}
                countFrom={0}
                play={open}
                className={CENTERED}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          ref={right}
          className="relative col-start-2 row-start-1 justify-self-start md:col-start-3"
          {...slide(open)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
          <img
            src={`${IMPACT_IMG}/ai.webp`}
            alt="The AI, in the same pose"
            width={560}
            height={751}
            className="block w-full max-w-[320px]"
          />
        </motion.div>
      </div>
    </div>
  );
}

export function Impact() {
  return (
    <Chapter id="impact" label="02 Impact">
      <StickyScene steps={3} label="Results, counting up">
        {({ step, live }) => <ImpactScene step={step} live={live} />}
      </StickyScene>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* 03 Role and Responsibility                                          */
/* ------------------------------------------------------------------ */

const ROLES: Role[] = [
  {
    title: "Strategy",
    cue: "me",
    body: (
      <>
        Set the plan from the interviews: <B>give MDs an internal copilot first</B>, then test with
        customers, then launch. Framed it as step one of homepage personalization.
      </>
    ),
  },
  {
    title: "UX",
    cue: "me",
    body: (
      <>
        Interviewed <B>8 MDs and marketers</B> to map the workflow. Designed the{" "}
        <B>Campaign Copilot UI</B> and the <B>Google Sheet</B> MDs launch campaigns from, and
        trained MDs on every update.
      </>
    ),
  },
  {
    title: "Execution",
    cue: "team",
    body: (
      <>
        Ran the internal evaluations and the A/B test, connected AI curation to Kurly’s{" "}
        <B>inventory and content management systems</B>, and led QA through launch.
      </>
    ),
  },
  {
    title: "Alignment",
    cue: "links",
    body: (
      <>Kept the CEO and the MD, marketing, and data teams aligned from model choice to rollout.</>
    ),
  },
];

export function Roles() {
  return (
    <RolesChapter
      headline="Turning an MD’s Craft into a System"
      roles={ROLES}
      below={[
        { label: "MD/Marketing Team", w: 182 },
        { label: "CMS/IMS Team", w: 150 },
      ]}
      orgLabel="Team structure: the AI PM (me) reports to and gets approval from the C-level, works in one team with an ML engineer and a backend engineer, and works back and forth with the MD/marketing team and the CMS/IMS team."
    />
  );
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function Hook() {
  return (
    <div className="border-t border-line">
      <HookLines
        first={
          <>
            Customers came to Kurly
            <br />
            to discover <span className="whitespace-nowrap">something new 👀</span>
          </>
        }
        second={
          <>
            The homepage kept showing them
            <br />
            <span className="whitespace-nowrap">the same things 🙁</span>
          </>
        }
        label="Customers came to discover; the homepage repeated itself"
      />
    </div>
  );
}
