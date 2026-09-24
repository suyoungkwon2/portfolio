"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { site } from "@/content/site";
import { HeroBackground } from "./hero-bg/HeroBackground";

// All of the hero copy is visible on the first screen, with no scroll
// pinning. The music chip by the nav fades in once the visitor has
// scrolled REVEAL of the way through the hero.
const REVEAL = 0.15;
const CHIP_W = 120;
const CHIP_H = 44;
const CHIP_TOP = (84 - CHIP_H) / 2;
const CHIP_RIGHT = 20;

// One point each for business, impact, scale, and AI depth. Every one is
// backed by a case study on the site; keep these in sync with
// src/content/works.ts.
const proofPoints = [
  { value: "$60K+", unit: "MRR", label: "A sleep-tech startup's first B2B revenue line, built 0 → 1" },
  { value: "K-FDA", unit: "approved", label: "Clinical trial for an insomnia digital therapeutic" },
  { value: "6.8% → 0.22%", unit: "", label: "No-result searches on a 3.5M-MAU grocery platform" },
  // "co‑first" uses a non-breaking hyphen (U+2011) so it never splits across lines.
  { value: "AI research", unit: "", label: "Published at EMNLP 2025 Main Conference, co‑first author" },
];

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
  const [isChipVisible, setIsChipVisible] = useState(false);
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
    setIsChipVisible(v > REVEAL);
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
    <div ref={sectionRef} id="hero" className="relative bg-paper">
      <audio
        ref={audioRef}
        src={site.bgMusicSrc}
        loop
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Music chip beside the nav. Fades in once the visitor starts
          scrolling and only takes clicks once visible. */}
      <motion.div
        style={{
          opacity: chipOpacity,
          width: CHIP_W,
          height: CHIP_H,
          top: CHIP_TOP,
          right: CHIP_RIGHT,
          pointerEvents: isChipVisible ? "auto" : "none",
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

      <section className="relative isolate">
        <HeroBackground paused={isPastHero} className="absolute inset-0 -z-10" />
        {/* Fades the background into the page color at the bottom, so the
            hero blends into the next section instead of ending on a hard
            edge. */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-[30vh] bg-gradient-to-b from-transparent to-paper" />

        {/* Editorial layout on the same max-w-6xl grid as the sections below:
            a left-aligned headline, full-width subcopy, and
            the proof points set as type on a hairline rather than as cards.
            The two italic phrases are the two halves of the thesis (the user
            side and the business side). */}
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pb-16 pt-[84px] md:px-10">
          <h1 className="font-instrument text-[40px] font-normal leading-[1.05] tracking-[-0.01em] text-ink md:text-[70px]">
            I’m Mel.{" "}
            <br />
            I find <em>what people need</em>,{" "}
            <br />
            then make it work as <em>a business</em>.
          </h1>

          <p className="mt-10 text-base leading-relaxed text-ink-muted">
            Product Manager across AI, B2B SaaS, and digital health.{" "}
            {/* Desktop only; phones wrap naturally. */}
            <br className="hidden md:inline" />
            I lead cross-functional teams from user research to launch, toward products
            with lasting social impact.
          </p>

          <div className="mt-16 grid border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
            {proofPoints.map((p) => (
              <div key={p.value} className="border-b border-ink/10 py-5 sm:pr-8 lg:border-b-0">
                <p className="font-instrument text-[32px] leading-none text-ink md:text-[36px]">
                  {p.value}
                  {p.unit && <span className="ml-2 text-[0.65em] italic text-ink-muted">{p.unit}</span>}
                </p>
                <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-ink-muted">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
