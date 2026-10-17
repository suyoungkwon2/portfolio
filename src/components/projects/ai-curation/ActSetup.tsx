"use client";

import { motion, useAnimationFrame, useInView } from "framer-motion";
import { Check, Pencil, RotateCw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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
  textLink,
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
const KEY_S = 0.035;
const LINE_STARTS = [0.4, 0.65, 0.9, 1.15];
const TYPED_S = Math.max(...HERO_THEMES.map((t, i) => LINE_STARTS[i] + t.title.length * KEY_S));
// The dashes run from the note into AI, AI lights, then they run on into the page.
const LINE_S = 0.18;
const LINE_IN_AT = TYPED_S + 0.2;
const AI_AT = LINE_IN_AT + LINE_S;
const LINE_OUT_AT = AI_AT + 0.3;
const FILL_AT = LINE_OUT_AT + LINE_S;
const SECTION_GAP_S = 0.35;
const FILL_KEY_S = 0.07;
const SHOWN = 4; // products in each campaign row
const LOOP_S = FILL_AT + SECTION_GAP_S * 3 + SHOWN * FILL_KEY_S + 3;

type HeroFrame = {
  typed: number[];
  lineIn: boolean;
  ai: boolean;
  lineOut: boolean;
  // Products shown in each campaign; -1 while the campaign isn't on the page.
  filled: number[];
  // The last moments of the loop fade everything back to an empty title card.
  out: boolean;
};

function heroFrame(t: number): HeroFrame {
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

const sameHero = (a: HeroFrame, b: HeroFrame) =>
  a.lineIn === b.lineIn &&
  a.ai === b.ai &&
  a.lineOut === b.lineOut &&
  a.out === b.out &&
  a.typed.every((n, i) => n === b.typed[i]) &&
  a.filled.every((n, i) => n === b.filled[i]);

// Scene geometry (px, inside a 300 × 630 box that scales to its column).
const SCENE_W = 300;
const SCENE_H = 630;
const CARD_H = 172;
const AI_W = 92;
const AI_H = 64;
const AI_Y = 198;
const WEB_TOP = 298;
const WEB_H = SCENE_H - WEB_TOP;
const WEB_BAR_H = 22;
// Kurly's header, from the 01 Context bands, cropped like the window there.
const HEADER_H = Math.round((196 * SCENE_W) / VIEW_W);
// A campaign row: its title, then a row of product cards (about 111px).
const SECTION_H = 120;

// A lavender from Kurly's purple family, for the dashes.
const LAVENDER = "#b9a2f2";
// The AI Search hero's glow: violet into sky blue, blurred, under a card.
const GLOW =
  "pointer-events-none absolute rounded-[1.5rem] bg-[linear-gradient(90deg,rgba(176,114,255,0.75),rgba(91,225,255,0.75))] blur-xl";

function TitleCard({ typed, caret }: { typed: number[]; caret: number }) {
  return (
    <div
      className="absolute inset-x-0 top-0 rounded-xl border border-line bg-paper px-3.5 pb-1.5 pt-2.5"
      style={{ height: CARD_H }}
    >
      <p className="flex items-center gap-1.5 border-b border-line pb-2 text-xs font-medium text-ink-muted">
        Curation Theme Title <Pencil aria-hidden className="size-3" strokeWidth={1.75} />
      </p>
      <ul className="text-sm text-ink">
        {HERO_THEMES.map((theme, i) => (
          <li
            key={theme.title}
            className="flex h-8 items-center gap-2 border-b border-dashed border-line last:border-b-0"
          >
            <span aria-hidden className={cn("transition-opacity", typed[i] === 0 && "opacity-0")}>
              {theme.emoji}
            </span>
            <span className="truncate">{theme.title.slice(0, typed[i])}</span>
            {caret === i && (
              <span aria-hidden className="-ml-1.5 inline-block h-4 w-px animate-pulse bg-ink" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A soft, blurred orb (violet core, warm top, cyan bottom) with “AI” on it,
// in light tints that sit well on white. It swells a little as it works.
function AiNode({ on }: { on: boolean }) {
  const id = useId();
  return (
    <motion.div
      className="absolute left-1/2 -ml-[46px] grid place-items-center"
      style={{ top: AI_Y, width: AI_W, height: AI_H }}
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
// page. Each is revealed along its length by a solid mask.
const LINES = [
  { d: `M${SCENE_W / 2} ${CARD_H + 4} V${AI_Y + 6}`, key: "in" },
  { d: `M${SCENE_W / 2} ${AI_Y + AI_H - 6} V${WEB_TOP - 4}`, key: "out" },
] as const;

function Connectors({ on, still }: { on: [boolean, boolean]; still: boolean }) {
  const id = useId();
  return (
    <svg
      aria-hidden
      width={SCENE_W}
      height={SCENE_H}
      className="pointer-events-none absolute inset-0"
    >
      {LINES.map(({ d, key }, i) => (
        <g key={key}>
          <mask
            id={`${id}-${key}`}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={SCENE_W}
            height={SCENE_H}
          >
            <motion.path
              d={d}
              fill="none"
              stroke="#fff"
              strokeWidth={6}
              initial={false}
              animate={{ pathLength: on[i] ? 1 : 0 }}
              // Drawn quickly; wiped at once when the loop starts over.
              transition={
                still || !on[i] ? { duration: 0 } : { duration: LINE_S, ease: "easeInOut" }
              }
            />
          </mask>
          <path
            d={d}
            mask={`url(#${id}-${key})`}
            fill="none"
            stroke={LAVENDER}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="3 6"
          />
        </g>
      ))}
    </svg>
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
      aria-label="Four curation theme titles are typed into a note: The Ultimate Snack Drop, Spicy Chinese Takeout Vibe, The Sweetest Year-End Vibe and Matcha Core: Trending Now. An AI node lights up, and Kurly’s homepage fills with a campaign of matching products for each title, one after another."
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
    headline: "But the Curation Went Stale",
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

  // Stale, the days tick by and each reload brings back the same page.
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
            stale && day > 0
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
              animate={{ opacity: day === 0 ? 0 : [0, 0.95, 0.95, 0] }}
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

// Lands with the labels, one scroll counts the numbers up, a spare step holds.
const IMPACT: { to: Num; extra?: string; label: string }[] = [
  { to: { value: 25, suffix: "%" }, label: "of Key Homepage Slots Fully Automated by AI" },
  { to: { value: 200, suffix: "+" }, label: "Themed Campaigns Run by AI" },
  { to: { value: 2 }, extra: "days / week", label: "of MD Time Saved" },
];

export const PRESS = [
  {
    outlet: "Economist Korea",
    date: "Feb 2025",
    url: "https://economist.co.kr/article/view/ecn202502140048",
  },
  { outlet: "Viva100", date: "Feb 2025", url: "https://www.viva100.com/article/20250216500401" },
];

// From the homepage's campaigns, out to the two places that asked for the
// same logic. Only Beauty Kurly has shipped (2025).
function BeyondDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const still = useStill();
  const drawn = still || inView;
  const draw = (delay: number) => ({
    initial: still ? false : { pathLength: 0 },
    animate: { pathLength: drawn ? 1 : 0 },
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  });
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Arrows run from the homepage’s themed campaigns to two chips: Search tab, and Beauty Kurly, checked, 2025."
      className="relative grid h-full min-h-[220px] w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-8 md:px-10"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="grid size-16 grid-cols-2 gap-1 rounded-2xl bg-accent p-3">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="rounded-[3px] bg-paper/85" />
          ))}
        </span>
        <span className="text-center text-xs font-medium text-ink">
          Homepage
          <br />
          campaigns
        </span>
      </div>
      <svg aria-hidden viewBox="0 0 120 120" preserveAspectRatio="none" className="h-28 w-full">
        <motion.path
          d="M2 60 C50 60 60 20 120 20"
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
          {...draw(0.1)}
        />
        <motion.path
          d="M2 60 C50 60 60 100 120 100"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={1.75}
          vectorEffect="non-scaling-stroke"
          {...draw(0.3)}
        />
      </svg>
      <div className="flex flex-col gap-8">
        <span className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-muted">
          Search tab
        </span>
        <motion.span
          initial={still ? false : { opacity: 0, scale: 0.9 }}
          animate={drawn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.8 }}
          className="flex items-center gap-1.5 rounded-full border border-accent bg-paper px-4 py-2 text-sm font-medium text-accent"
        >
          <Check aria-hidden className="size-4" strokeWidth={2.5} />
          Beauty Kurly
          <span className="font-normal text-ink-muted">2025</span>
        </motion.span>
      </div>
    </div>
  );
}

function ImpactScene({ step, live }: { step: number; live: boolean }) {
  // Once counted, the numbers stay, even when scrolling back up.
  const [counted, setCounted] = useState(false);
  if (live && step >= 1 && !counted) setCounted(true);
  const play = live ? counted : undefined;
  return (
    <div className={wrap}>
      <SectionHeader label="02 IMPACT" headline="From Hand-Picked to Self-Running" />
      <Reveal>
        <Body className="mt-6">
          Built an AI system that <B>curates as well as Kurly’s expert MDs</B>: in a{" "}
          <span className="whitespace-nowrap">2-week</span> A/B test, its campaigns performed on par
          with theirs.
        </Body>
      </Reveal>

      <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
        {IMPACT.map((m, i) => (
          <Reveal key={m.label} delay={i * 0.1} className="flex flex-col items-center gap-2">
            <MetricCounter
              to={m.to}
              extra={m.extra}
              label={m.label}
              countFrom={0}
              play={play}
              className={CENTERED}
            />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-16 grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
        <div className="overflow-hidden rounded-xl border-[0.5px] border-line bg-paper-2">
          <BeyondDiagram />
        </div>
        <div className="flex flex-col items-start gap-4">
          <h3 className="font-display font-medium tracking-tight text-[1.4rem] leading-tight text-ink md:text-[1.75rem]">
            Proven on the Homepage, Expanded Beyond It
          </h3>
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            Once it proved its value on the homepage, the same AI curation was rolled out to other
            slots across Kurly, including <B>Beauty Kurly</B>.
          </p>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
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
        </div>
      </Reveal>
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
    // The ask came up from the MD team (05): their arrow draws bold.
    cue: "request",
    body: (
      <>
        Defined the problem from the interviews and set the plan:{" "}
        <B>give MDs an internal copilot first</B>, so they could trust the AI and help us improve
        it, then test it with customers, then launch. Framed it as the first step of a homepage
        personalization roadmap.
      </>
    ),
  },
  {
    title: "UX",
    cue: "me",
    body: (
      <>
        Interviewed <B>8 MDs and marketers</B> to map the campaign workflow. Designed the{" "}
        <B>Campaign Copilot UI</B> and the <B>Google Sheet</B> MDs use to launch campaigns, and
        trained MDs on every update with guides I wrote and kept up to date.
      </>
    ),
  },
  {
    title: "Execution",
    cue: "team",
    body: (
      <>
        Designed and ran the internal evaluations and the A/B test, worked with the ML engineer who
        built the curation algorithm, designed the system architecture that connected AI curation to
        Kurly’s <B>inventory and content management tools</B>, and led QA through launch.
      </>
    ),
  },
  {
    title: "Alignment",
    cue: "links",
    body: (
      <>
        Kept the CEO, the MD and marketing teams, and the data team on the same page, from model
        choice to rollout.
      </>
    ),
  },
];

export function Roles() {
  return (
    <RolesChapter
      headline="Turning an MD’s Craft into a System"
      roles={ROLES}
      below={[
        { label: "MD Team", w: 120 },
        { label: "Marketing Team", w: 158 },
        { label: "Data Team", w: 118 },
      ]}
      orgLabel="Team structure: the AI PM (me) reports to and gets approval from the C-level, works in one team with an ML engineer and a backend engineer, and works back and forth with the MD, marketing and data teams. The request came up from the MD team."
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
        first="Customers came to Kurly to discover something new."
        second="The homepage kept showing them the same things."
        label="Customers came to discover; the homepage repeated itself"
      />
    </div>
  );
}
