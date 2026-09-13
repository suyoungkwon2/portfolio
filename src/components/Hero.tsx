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

  // Background music starts on load from site.bgMusicStartSeconds and loops
  // back to that same point (not 0) when it ends. Browsers block unmuted
  // autoplay without a user gesture, so if the initial play() is rejected we
  // retry on the first interaction — real playback may not start until then.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function startFrom(time: number) {
      audio!.currentTime = time;
      safePlay(audio!, setIsPlaying);
    }

    function handleEnded() {
      startFrom(site.bgMusicStartSeconds);
    }

    audio.addEventListener("ended", handleEnded);
    startFrom(site.bgMusicStartSeconds);

    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    if (isPlaying) return;
    function retryPlay(e: Event) {
      // The chip's own button already toggles play/pause explicitly — if a
      // page-wide interaction listener also fires play() for the same
      // gesture, the click that follows a mousedown sees `paused === false`
      // (play() flips it synchronously) and immediately pauses again,
      // making the button feel like a "press and hold" control. Skip
      // gestures that originate on the button itself.
      if (e.target instanceof Node && controlButtonRef.current?.contains(e.target)) return;
      const audio = audioRef.current;
      if (!audio) return;
      safePlay(audio, (ok) => ok && setIsPlaying(true));
    }
    // No `{ once: true }` here: cleanup already re-runs (removing these
    // listeners) whenever `isPlaying` flips true, and using `once` per
    // event would let a guarded no-op (see above) burn through a listener
    // without ever actually starting playback.
    const events = ["pointerdown", "keydown", "wheel"] as const;
    events.forEach((e) => window.addEventListener(e, retryPlay));
    return () => events.forEach((e) => window.removeEventListener(e, retryPlay));
  }, [isPlaying]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsDocked(v > 0.55);
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

  const width = useTransform(scrollYProgress, [0, 0.55], [`${viewport.w}px`, `${CHIP_W}px`]);
  const height = useTransform(scrollYProgress, [0, 0.55], [`${viewport.h}px`, `${CHIP_H}px`]);
  const top = useTransform(scrollYProgress, [0, 0.55], ["0px", `${CHIP_TOP}px`]);
  const right = useTransform(scrollYProgress, [0, 0.55], ["0px", `${CHIP_RIGHT}px`]);
  const radius = useTransform(scrollYProgress, [0, 0.55], ["0px", "999px"]);
  const overlayOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, 0, 0.3, 0.35, 0));
  const controlsOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, 0.5, 0.62, 0, 1));
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
    const span = a.duration - site.bgMusicStartSeconds;
    const elapsed = a.currentTime - site.bgMusicStartSeconds;
    setProgress(span > 0 ? Math.max(0, Math.min(1, elapsed / span)) : 0);
  }

  const circumference = 2 * Math.PI * 15;

  return (
    <div ref={sectionRef} id="hero" style={{ height: `${HERO_SCROLL_VH}vh` }} className="relative bg-paper">
      <audio ref={audioRef} src={site.bgMusicSrc} onTimeUpdate={handleTimeUpdate} />

      <motion.div
        style={{ width, height, top, right, borderRadius: radius }}
        className="fixed z-[55] overflow-hidden bg-ink shadow-lg"
      >
        <video
          ref={videoRef}
          src={site.heroVideoSrc}
          autoPlay
          muted
          loop
          playsInline
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
