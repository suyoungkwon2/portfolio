"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { site } from "@/content/site";
import { HeroBackground } from "./hero-bg/HeroBackground";

// Total scroll length of the hero section, in vh. The background and
// headline stay pinned for (HERO_SCROLL_VH - 100)vh of scroll before the
// page releases into the next section:
//   - REVEAL_VH: how far in the intro lines and subtext fade in around the
//     headline, and the music chip fades in by the nav.
//   - Raise HERO_SCROLL_VH to give the revealed copy more reading room
//     before the hero scrolls away.
const HERO_SCROLL_VH = 260;
const REVEAL_VH = 75;
const REVEAL = REVEAL_VH / HERO_SCROLL_VH;
const CHIP_W = 120;
const CHIP_H = 44;
const CHIP_TOP = (84 - CHIP_H) / 2;
const CHIP_RIGHT = 20;

const HEADLINE = "Heal the World";

// useTransform's (value, inputRange[], outputRange[]) array-range overload
// silently freezes at its initial value for these plain-number opacity
// transforms and never updates again on scroll — a real, reproducible issue
// in this app. The (value, mixerFn) overload doesn't have that problem, so
// scroll-linked opacities are built on a small manual lerp instead.
function lerpClamped(t: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const p = Math.min(Math.max((t - inMin) / (inMax - inMin), 0), 1);
  return outMin + p * (outMax - outMin);
}

// HTMLMediaElement.play() returns a Promise in real browsers but not in
// jsdom (used by the test suite), so calling .then/.catch on it unguarded
// throws there. This normalizes both cases.
function safePlay(el: HTMLMediaElement, onSettled?: (ok: boolean) => void) {
  const result = el.play();
  if (result && typeof result.then === "function") {
    result.then(
      () => onSettled?.(true),
      () => onSettled?.(false),
    );
  } else {
    onSettled?.(true);
  }
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  // The background stops animating once the hero has scrolled off screen.
  const [isPastHero, setIsPastHero] = useState(false);
  const [progress, setProgress] = useState(0);
  // Music never autoplays, muted or otherwise — it only starts when the
  // visitor explicitly presses the docked chip's play button (toggleMusic
  // below). This just seeks the track to its custom start point up front
  // so the first press begins at the right spot instead of from 0.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = site.bgMusicStartSeconds;
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsRevealed(v > REVEAL);
    setIsPastHero(v >= 1);
  });

  const chipOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, REVEAL, REVEAL + 0.05, 0, 1));

  // isPlaying mirrors the <audio> element's own play/pause events (below)
  // rather than being set here directly — play() returns a promise that
  // can resolve after a quick follow-up pause(), and setting state from
  // that stale resolution would silently flip the icon back to "playing"
  // even though the element is actually paused.
  function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    a.muted = false;
    if (a.paused) {
      safePlay(a);
    } else {
      a.pause();
    }
  }

  function handleTimeUpdate() {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    // The ring tracks the full track length, not just the span from the
    // custom start point — so on the very first play it starts partway
    // around, then wraps to 0 with every loop from there on.
    setProgress(a.currentTime / a.duration);
  }

  const circumference = 2 * Math.PI * 15;

  return (
    <div ref={sectionRef} id="hero" style={{ height: `${HERO_SCROLL_VH}vh` }} className="relative bg-paper">
      <audio
        ref={audioRef}
        src={site.bgMusicSrc}
        loop
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Music chip beside the nav. Fades in with the intro copy and only
          takes clicks once visible. */}
      <motion.div
        style={{
          opacity: chipOpacity,
          width: CHIP_W,
          height: CHIP_H,
          top: CHIP_TOP,
          right: CHIP_RIGHT,
          pointerEvents: isRevealed ? "auto" : "none",
        }}
        className="fixed z-[55] overflow-hidden rounded-full bg-ink shadow-lg"
      >
        <Image src="/images/mj-chip.png" alt="" fill sizes={`${CHIP_W}px`} className="pointer-events-none object-cover" />

        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/30"
        >
          <span className="relative flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 36 36" className="absolute h-8 w-8 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgba(250,250,250,0.25)"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#fafafa"
                strokeWidth="2"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
              />
            </svg>
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-paper text-paper" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-paper text-paper" />
            )}
          </span>
        </button>
      </motion.div>

      <div className="pointer-events-none sticky top-0 z-40 flex h-screen w-full flex-col items-center justify-center px-6 pt-16 text-center">
        <HeroBackground paused={isPastHero} className="absolute inset-0 -z-10" />
        {/* Fades the background into the page color at the bottom, so the
            hero blends into the next section instead of ending on a hard
            edge when it scrolls away. */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-[30vh] bg-gradient-to-b from-transparent to-paper" />
        {/* "Heal the World" never unmounts and never moves — the intro lines
            and subtext are positioned absolutely (out of normal flow) around
            it, so their appearing/disappearing can't change this wrapper's
            layout height and shove the headline's own position around. */}
        <div className="relative flex w-full flex-col items-center">
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                key="hero-intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="pointer-events-auto absolute inset-x-0 bottom-full font-instrument text-ink text-[94px] font-normal not-italic leading-[103px]"
              >
                I’m Mel,
                <br />
                building products to
              </motion.div>
            )}
          </AnimatePresence>

          <motion.h1
            className="pointer-events-auto font-instrument text-ink text-[94px] font-normal not-italic leading-[103px]"
          >
            {HEADLINE}
          </motion.h1>

          <AnimatePresence>
            {isRevealed && (
              <motion.div
                key="hero-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="pointer-events-auto absolute inset-x-0 top-full mt-8 space-y-4 font-sans text-lg leading-relaxed text-ink"
              >
                <p className="mx-auto max-w-2xl">
                  I love building sustainable, scalable, and universally
                  inclusive solutions that foster meaningful human change.
                </p>
                <p className="mx-auto max-w-2xl">
                  As a Product Manager, UX Designer, and HCI Researcher, I
                  bridge adaptive technology with empathetic design to
                  solve complex problems.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
