"use client";

import { motion, useAnimationFrame, useInView } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRef, useState } from "react";
import { DashedBorder } from "@/components/Dashed";
import { EASE_OUT, useFitScale, useStill } from "../story/motion";
import {
  AI_H,
  AiNode,
  CARD_H,
  DashLine,
  FILL_AT,
  LAVENDER,
  LINE_S,
  SHOWN,
  TitleCard,
  heroFrame,
  sameHero,
  type HeroFrame,
} from "./ActSetup";
import { HERO_THEMES, type Theme } from "./data";

// The AI Curation card thumbnail, played live from the hero's pieces instead
// of a flat image: the four theme titles type into a frosted note, fine dashes
// run into AI and branch out to four campaign sections, laid out like Kurly's
// web homepage (title ›, a grey subtitle, a row of product cards). They sit
// side by side, sheared up to the right, each one laid over the right end of
// the one before, each in a lavender dashed outline. One branch at a time
// runs down to its campaign, which types its title and fills with products
// one by one. Then it all dissolves
// and plays again while on screen; with reduced motion it shows the finished
// frame.
//
// Drawn on a 720 × 450 canvas (the card's 16:10) that scales to the card, so
// it fits from the landing grid down to the case-study footer, and grows past
// 720 on wide screens so the crop stays the same everywhere.

const W = 720;
const H = 450;
const NOTE_W = 300;
const NOTE_Y = 30;
// The hero's note, near full size; the campaigns below run off the bottom.
const NOTE_SCALE = 0.95;
const AI_TOP = NOTE_Y + CARD_H * NOTE_SCALE + 10;
const BRANCH_Y = AI_TOP + AI_H + 8;
// Room for the sheared sections' raised right corners under the bus.
const CAMPAIGN_Y = BRANCH_Y + 36;
const CAMPAIGN_W = 210;
const CAMPAIGN_STEP = 150;
const CAMPAIGN_X0 = (W - (CAMPAIGN_W + 3 * CAMPAIGN_STEP)) / 2;
const campaignX = (i: number) => CAMPAIGN_X0 + i * CAMPAIGN_STEP;
// Each section's top and bottom edges climb to the right while its sides
// stay upright, like the original key visual's cards. Sheared about its
// center, so the dot above the middle needs no offset.
const SHEAR = "skewY(-9deg)";

// Into AI from the note, then out of AI along a bus with rounded corners,
// down to a dot over each campaign.
const R = 10;
const dotX = (i: number) => campaignX(i) + CAMPAIGN_W / 2;
const dotY = () => CAMPAIGN_Y - 14;
const IN_PATH = `M${W / 2} ${NOTE_Y + CARD_H * NOTE_SCALE + 4} V${AI_TOP + 6}`;
const OUT_PATHS = HERO_THEMES.map((_, i) => {
  const x = dotX(i);
  const dir = Math.sign(x - W / 2);
  return [
    `M${W / 2} ${AI_TOP + AI_H - 6} V${BRANCH_Y - R}`,
    `Q${W / 2} ${BRANCH_Y} ${W / 2 + dir * R} ${BRANCH_Y}`,
    `H${x - dir * R} Q${x} ${BRANCH_Y} ${x} ${BRANCH_Y + R} V${dotY() - 4}`,
  ].join(" ");
});

// Kurly's grey line under each campaign title.
const SUBTITLES: Record<string, string> = {
  [HERO_THEMES[0].title]: "Treats worth stocking up on",
  [HERO_THEMES[1].title]: "Takeout favorites, made at home",
  [HERO_THEMES[2].title]: "Sweets for the holiday table",
  [HERO_THEMES[3].title]: "The green tea everyone’s talking about",
};

// After the hero's timing up to AI, one branch at a time runs down from it;
// as each lands, its campaign types its title, then its products wipe in from
// the top down, one by one.
const BRANCH_AT = FILL_AT - LINE_S;
const BRANCH_S = 0.4;
const CAMPAIGN_GAP_S = 0.6;
const branchAt = (i: number) => BRANCH_AT + i * CAMPAIGN_GAP_S;
const campaignAt = (i: number) => branchAt(i) + BRANCH_S;
const TITLE_KEY_S = 0.02;
const PRODUCT_S = 0.12;
// Split by character, so an emoji never shows half typed.
const chars = (theme: Theme) => Array.from(`${theme.emoji} ${theme.title}`);
const TITLE_S = Math.max(...HERO_THEMES.map((t) => chars(t).length)) * TITLE_KEY_S;
const LOOP_S = campaignAt(3) + TITLE_S + SHOWN * PRODUCT_S + 3;

type ThumbFrame = HeroFrame & {
  // Which branches out of AI have started down.
  branched: boolean[];
  // Title characters typed in each campaign; -1 while it isn't shown.
  titled: number[];
};

function thumbFrame(t: number): ThumbFrame {
  const at = campaignAt;
  return {
    ...heroFrame(t),
    branched: HERO_THEMES.map((_, i) => t >= branchAt(i)),
    titled: HERO_THEMES.map((theme, i) =>
      t < at(i) ? -1 : Math.min(chars(theme).length, Math.floor((t - at(i)) / TITLE_KEY_S)),
    ),
    filled: HERO_THEMES.map((theme, i) => {
      const from = at(i) + chars(theme).length * TITLE_KEY_S;
      return t < from ? 0 : Math.min(SHOWN, Math.floor((t - from) / PRODUCT_S) + 1);
    }),
    out: t >= LOOP_S - 0.5,
  };
}

const sameThumb = (a: ThumbFrame, b: ThumbFrame) =>
  sameHero(a, b) &&
  a.branched.every((on, i) => on === b.branched[i]) &&
  a.titled.every((n, i) => n === b.titled[i]);

const FINAL = thumbFrame(LOOP_S - 1);

export function AiCurationThumbnail() {
  const still = useStill();
  const { ref, scale } = useFitScale(W, Infinity);
  const inView = useInView(ref, { amount: 0.3 });
  const clock = useRef(0);
  const [frame, setFrame] = useState(() => (still ? FINAL : thumbFrame(0)));
  useAnimationFrame((_, delta) => {
    if (still || !inView) return;
    clock.current = (clock.current + delta / 1000) % LOOP_S;
    const next = thumbFrame(clock.current);
    setFrame((f) => (sameThumb(f, next) ? f : next));
  });
  const shown = still ? FINAL : frame;
  const typing = shown.typed.map((n, i) => n > 0 && n < HERO_THEMES[i].title.length);
  const caret = typing.lastIndexOf(true);
  const dash = { still, w: W, h: H, width: 1.25, dash: "4 4" };

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <motion.div
        initial={false}
        animate={{ opacity: shown.out ? 0 : 1 }}
        transition={{ duration: 0.45 }}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: W, height: H, scale }}
      >
        <div
          className="absolute"
          style={{
            left: (W - NOTE_W) / 2,
            top: NOTE_Y,
            width: NOTE_W,
            scale: NOTE_SCALE,
            transformOrigin: "top center",
          }}
        >
          <TitleCard typed={shown.typed} caret={caret} glass />
        </div>
        <svg width={W} height={H} className="pointer-events-none absolute inset-0">
          <DashLine d={IN_PATH} on={shown.lineIn} {...dash} />
          {OUT_PATHS.map((d, i) => (
            <DashLine key={d} d={d} on={shown.branched[i]} duration={BRANCH_S} {...dash} />
          ))}
          {HERO_THEMES.map((theme, i) => (
            <motion.circle
              key={theme.title}
              cx={dotX(i)}
              cy={dotY()}
              r={3}
              fill={LAVENDER}
              initial={false}
              animate={{ opacity: shown.titled[i] >= 0 ? 1 : 0 }}
              transition={{ duration: shown.titled[i] >= 0 ? 0.2 : 0 }}
            />
          ))}
        </svg>
        <AiNode on={shown.ai} top={AI_TOP} />
        {HERO_THEMES.map((theme, i) => (
          <Campaign
            key={theme.title}
            theme={theme}
            x={campaignX(i)}
            y={CAMPAIGN_Y}
            titled={shown.titled[i]}
            filled={shown.filled[i]}
          />
        ))}
      </motion.div>
    </div>
  );
}

// A campaign section, lifted out of Kurly's web homepage: the title typed in
// with its ›, the grey subtitle, then four product cards (photo, Add to cart,
// name, price, Kurly Only). It runs off the card's bottom edge.
function Campaign({
  theme,
  x,
  y,
  titled,
  filled,
}: {
  theme: Theme;
  x: number;
  y: number;
  titled: number;
  filled: number;
}) {
  const on = titled >= 0;
  const done = titled >= chars(theme).length;
  return (
    <div className="absolute" style={{ left: x, top: y, width: CAMPAIGN_W, transform: SHEAR }}>
      <motion.div
        initial={false}
        animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={on ? { duration: 0.3, ease: EASE_OUT } : { duration: 0 }}
        className="relative rounded-lg bg-paper px-3 pb-3 pt-2.5 shadow-[-10px_10px_24px_-8px_rgba(0,0,0,0.5)]"
      >
        <DashedBorder radius={13} width={1.25} dash="3 4" offset={5} color={LAVENDER} />
        <p className="h-4 whitespace-nowrap text-[12px] font-medium leading-4 text-[#333]">
          {chars(theme).slice(0, Math.max(0, titled)).join("")}
          {done && <span className="ml-1 text-[#999]">›</span>}
        </p>
        <motion.p
          initial={false}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: done ? 0.25 : 0 }}
          className="mt-0.5 text-center text-[7px] leading-3 text-[#999]"
        >
          {SUBTITLES[theme.title]}
        </motion.p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {theme.products.slice(0, SHOWN).map((product, j) => (
            <motion.div
              key={product.id}
              initial={false}
              // Stays put and wipes in from its top edge down.
              animate={{
                clipPath: j < filled ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
              }}
              transition={j < filled ? { duration: 0.3, ease: EASE_OUT } : { duration: 0 }}
              className="flex min-w-0 flex-col"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized WebP */}
              <img
                src={product.src}
                alt=""
                className="aspect-[4/5] w-full rounded-[2px] bg-[#f4f1ea] object-cover"
              />
              <span className="mt-1 flex h-3 items-center justify-center gap-0.5 rounded-[2px] border border-[#ddd] text-[5px] text-[#333]">
                <ShoppingCart className="size-[6px]" strokeWidth={2} />
                Add to cart
              </span>
              <span className="mt-1 line-clamp-2 text-[5.5px] leading-[7px] text-[#333]">
                {product.name}
              </span>
              <span className="mt-0.5 text-[6.5px] font-bold leading-[8px] text-[#333]">
                {product.price}
              </span>
              <span className="mt-0.5 self-start rounded-[2px] bg-[#f4f1fb] px-[3px] text-[4.5px] leading-[7px] text-[#5f0080]">
                Kurly Only
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
