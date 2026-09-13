"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import { site } from "@/content/site";

const HERO_SCROLL_VH = 170;
const CHIP_W = 120;
const CHIP_H = 44;
const CHIP_TOP = (84 - CHIP_H) / 2;
const CHIP_RIGHT = 20;
// The video stays full-bleed until DOCK_START, then snaps into the nav chip
// by DOCK_END instead of shrinking gradually the whole way down — a quick
// "pop" at a threshold rather than a linear shrink.
//   - Both are scroll progress fractions from 0 to 1 across the hero's full
//     scrollable height (HERO_SCROLL_VH, i.e. 170vh), not pixels.
//   - DOCK_START = where the snap begins (raise it to delay the snap later
//     into the scroll; lower it to start snapping sooner).
//   - The GAP between them (DOCK_END − DOCK_START) is the snap's speed: a
//     bigger gap = slower/smoother, a smaller gap = faster/snappier. E.g.
//     0.35 → 0.42 (a 0.07 gap) is quite fast; 0.35 → 0.50 (0.15) is slower.
const DOCK_START = 0.35;
const DOCK_END = 0.5;

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controlButtonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [progress, setProgress] = useState(0);
  // Framer Motion can't interpolate between mismatched CSS units (vw/vh vs
  // px) — it silently collapses to the raw number, so the chip's full-bleed
  // start size has to be measured in px too.
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    function updateViewport() {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    }
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Browsers refuse to autoplay audible media with no prior user gesture —
  // there is no way to force real sound-on-load, on any site. Muted
  // autoplay, though, is always allowed, so we start muted immediately
  // (the timeline and progress ring are already moving from the first
  // frame) and unmute on the very first interaction anywhere on the page,
  // which is as close to "plays the moment you land" as the platform
  // allows.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = site.bgMusicStartSeconds;
    audio.muted = true;
    safePlay(audio, setIsPlaying);
  }, []);

  useEffect(() => {
    function unmuteOnInteraction(e: Event) {
      // The chip's own button already toggles play/pause (and unmutes)
      // explicitly — if this page-wide listener also reacted to the same
      // gesture, a click's mousedown would fire this first and the
      // following click would then immediately toggle playback off again.
      if (e.target instanceof Node && controlButtonRef.current?.contains(e.target)) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.muted = false;
      if (audio.paused) {
        safePlay(audio, setIsPlaying);
      }
    }
    // Correction from an earlier version of this file: `wheel`/`scroll`
    // were listed here on the assumption that scrolling counts as a user
    // gesture. It doesn't — per the HTML spec, browsers only grant "user
    // activation" (which unmuted audio requires) from a short, fixed list
    // of discrete inputs: mousedown/pointerdown, keydown, and touchend.
    // Scroll and wheel are explicitly excluded, on every browser, on every
    // site — no code here can change that, so they're removed rather than
    // left in as dead weight that quietly never fires.
    const events = ["pointerdown", "keydown", "touchend"] as const;
    events.forEach((e) => window.addEventListener(e, unmuteOnInteraction, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, unmuteOnInteraction));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsDocked(v > DOCK_END);
  });

  // Once docked, the hero video pauses and a static photo crossfades over
  // it, matching the calm "album art" look of the docked chip instead of
  // keeping a distracting loop going in the corner for the rest of the page.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isDocked) {
      v.pause();
    } else {
      safePlay(v);
    }
  }, [isDocked]);

  // A slow pan/zoom on the video itself during the "dead zone" before the
  // dock threshold — otherwise the whole hero looks frozen for a large
  // chunk of scroll distance and feels broken/unresponsive. This has to be
  // fully back to neutral (0 / scale 1) BY DOCK_START, not merely by
  // DOCK_END — the shrink-to-chip animation (DOCK_START to DOCK_END) needs
  // a perfectly neutral video the whole way through, because a still-active
  // pan/zoom combined with the container rapidly shrinking to 120x44 can
  // momentarily push the video's covering frame past the container's edge,
  // showing empty space (the container's own background) at the bottom.
  // Keeping the two effects in separate, non-overlapping scroll ranges
  // avoids that interaction entirely.
  const videoPan = useTransform(scrollYProgress, [0, DOCK_START * 0.6, DOCK_START], [0, -100, 0]);
  const videoZoom = useTransform(scrollYProgress, [0, DOCK_START * 0.6, DOCK_START], [1, 1.15, 1]);
  const width = useTransform(scrollYProgress, [DOCK_START, DOCK_END], [`${viewport.w}px`, `${CHIP_W}px`]);
  const height = useTransform(scrollYProgress, [DOCK_START, DOCK_END], [`${viewport.h}px`, `${CHIP_H}px`]);
  const top = useTransform(scrollYProgress, [DOCK_START, DOCK_END], ["0px", `${CHIP_TOP}px`]);
  const right = useTransform(scrollYProgress, [DOCK_START, DOCK_END], ["0px", `${CHIP_RIGHT}px`]);
  const radius = useTransform(scrollYProgress, [DOCK_START, DOCK_END], ["0px", "999px"]);
  const overlayOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, 0, 0.3, 0.35, 0));
  const controlsOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, DOCK_END, DOCK_END + 0.05, 0, 1));
  const cueOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, 0, 0.12, 1, 0));
  // The headline sits in a `sticky` box the height of one viewport, inside a
  // section HERO_SCROLL_VH tall — sticky naturally releases it once scrolled
  // (HERO_SCROLL_VH - 100)vh in, well before scrollYProgress reaches 1. The
  // color swap has to land before that release point or it happens off-screen.
  const stickyRelease = (HERO_SCROLL_VH - 100) / HERO_SCROLL_VH;
  const headlineColor = useTransform(
    scrollYProgress,
    [0.15, stickyRelease * 0.9],
    ["#ffffff", "rgb(26, 26, 26)"],
  );

  function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    a.muted = false;
    if (a.paused) {
      safePlay(a, setIsPlaying);
    } else {
      a.pause();
      setIsPlaying(false);
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
      <audio ref={audioRef} src={site.bgMusicSrc} loop onTimeUpdate={handleTimeUpdate} />

      <motion.div
        style={{ width, height, top, right, borderRadius: radius }}
        className="fixed z-[55] overflow-hidden bg-ink shadow-lg"
      >
        <motion.video
          ref={videoRef}
          src={site.heroVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          style={{ y: videoPan, scale: videoZoom }}
          className="h-full w-full object-cover"
        />
        {/* Once docked, this crossfades over the (now paused) video so the
            chip settles on a calm, static photo instead of a frozen video
            frame. */}
        <motion.img
          src="/images/mj-chip.png"
          alt=""
          style={{ opacity: controlsOpacity }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60"
        />

        <motion.button
          ref={controlButtonRef}
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          style={{ opacity: controlsOpacity, pointerEvents: isDocked ? "auto" : "none" }}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/30"
        >
          <span className="relative flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 36 36" className="absolute h-8 w-8 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgba(247,243,236,0.25)"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#F7F3EC"
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
        </motion.button>
      </motion.div>

      <div className="pointer-events-none sticky top-0 z-[65] flex h-screen w-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          style={{ color: headlineColor }}
          className="font-instrument text-[94px] font-normal not-italic leading-[103px]"
        >
          {HEADLINE}
        </motion.h1>

        <motion.p
          style={{ opacity: cueOpacity }}
          className="mt-10 text-xs font-medium uppercase tracking-[0.3em] text-paper/70"
        >
          Scroll — {site.role}
        </motion.p>
      </div>
    </div>
  );
}
