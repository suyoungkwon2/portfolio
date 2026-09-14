"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import { site } from "@/content/site";

// Total scroll length of the hero section, in vh. Everything below is
// tunable in vh (real scroll distance) rather than raw 0-1 fractions, so
// it's easier to reason about and adjust:
//   - DOCK_START_VH / DOCK_END_VH: the video stays full-bleed until
//     DOCK_START_VH, then snaps into the nav chip by DOCK_END_VH instead of
//     shrinking the whole way down — a quick "pop" at a threshold rather
//     than a linear shrink. Raise DOCK_START_VH to delay the snap; widen
//     the gap between the two to slow the snap down, narrow it to speed it
//     up.
//   - HERO_SCROLL_VH also controls how long the hero stays pinned on screen
//     AFTER the chip finishes docking, before the page finally releases
//     into the next section — that "dwell" is (HERO_SCROLL_VH - 100 -
//     DOCK_END_VH) of scroll. Raise HERO_SCROLL_VH to give the hero (e.g.
//     a headline plus supporting copy) more comfortable reading room
//     before it scrolls away; the video/chip mechanics above don't need to
//     change since they're pinned to DOCK_START_VH/DOCK_END_VH, not to a
//     fraction of this value.
const HERO_SCROLL_VH = 260;
const DOCK_START_VH = 50;
const DOCK_END_VH = 75;
const DOCK_START = DOCK_START_VH / HERO_SCROLL_VH;
const DOCK_END = DOCK_END_VH / HERO_SCROLL_VH;
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

  // A slow zoom-in on the video during the "dead zone" before the dock
  // threshold — otherwise the whole hero looks frozen for a large chunk of
  // scroll distance and feels broken/unresponsive. Zoom-in only (no pan):
  // scaling up always leaves the video larger than its box, so it keeps
  // fully covering — and thus never exposes a gap — however much the
  // container shrinks during the DOCK_START→DOCK_END snap afterward. A pan
  // (translateY) doesn't have that guarantee, which is what caused the
  // empty space seen at the bottom of the chip previously.
  const videoZoom = useTransform(scrollYProgress, [0, DOCK_START], [1, 1.12]);
  // Width shrinks over the full DOCK_START→DOCK_END window, but height/top/
  // radius finish early (by SNAP_ASPECT_END, partway through that window) —
  // otherwise, since the two dimensions shrink from very different starting
  // ratios (full viewport vs. a short wide pill) at the same linear rate,
  // the box spends most of the snap looking like a shrinking fat rectangle
  // and only becomes pill-shaped right at the very end. Finishing the
  // height/roundness early makes it read as a shrinking pill for more of
  // the animation instead.
  const SNAP_ASPECT_END = DOCK_START + (DOCK_END - DOCK_START) * 0.4;
  const width = useTransform(scrollYProgress, [DOCK_START, DOCK_END], [`${viewport.w}px`, `${CHIP_W}px`]);
  const height = useTransform(scrollYProgress, [DOCK_START, SNAP_ASPECT_END], [`${viewport.h}px`, `${CHIP_H}px`]);
  const top = useTransform(scrollYProgress, [DOCK_START, SNAP_ASPECT_END], ["0px", `${CHIP_TOP}px`]);
  const right = useTransform(scrollYProgress, [DOCK_START, DOCK_END], ["0px", `${CHIP_RIGHT}px`]);
  const radius = useTransform(scrollYProgress, [DOCK_START, SNAP_ASPECT_END], ["0px", "999px"]);
  const overlayOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, 0, DOCK_START, 0.35, 0));
  const controlsOpacity = useTransform(scrollYProgress, (v) => lerpClamped(v, DOCK_END, DOCK_END + 0.05, 0, 1));
  // White while it's sitting over the video, ink once the video's gone
  // (docked into the chip) — timed to DOCK_START/DOCK_END, the same
  // threshold the video itself snaps at, so the two always stay in sync
  // regardless of how HERO_SCROLL_VH is tuned. The headline sits in a
  // `sticky` box the height of one viewport, inside a section
  // HERO_SCROLL_VH tall — it only naturally releases once scrolled
  // (HERO_SCROLL_VH - 100)vh in, comfortably after DOCK_END, so the color
  // swap always finishes while the headline is still on screen.
  const headlineColor = useTransform(
    scrollYProgress,
    [DOCK_START, DOCK_END],
    ["#ffffff", "rgb(26, 26, 26)"],
  );

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
          style={{ scale: videoZoom }}
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
        </motion.button>
      </motion.div>

      {/* z-index flips once docked: while the video is still full-bleed the
          headline must sit above the Nav bar (Hero > video > Nav), but once
          the video has shrunk away into the chip, the Nav bar should win
          instead (Nav > Hero) so its links/logo are never covered by the
          headline/intro text overlapping the top of the viewport. */}
      <div
        className={`pointer-events-none sticky top-0 flex h-screen w-full flex-col items-center justify-center px-6 pt-16 text-center ${
          isDocked ? "z-40" : "z-[65]"
        }`}
      >
        {/* "Heal the World" never unmounts and never moves — the intro lines
            and subtext are positioned absolutely (out of normal flow) around
            it, so their appearing/disappearing can't change this wrapper's
            layout height and shove the headline's own position around. */}
        <div className="relative flex w-full flex-col items-center">
          <AnimatePresence>
            {isDocked && (
              <motion.div
                key="hero-intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ color: headlineColor }}
                className="pointer-events-auto absolute inset-x-0 bottom-full font-instrument text-[94px] font-normal not-italic leading-[103px]"
              >
                I’m Mel,
                <br />
                building products to
              </motion.div>
            )}
          </AnimatePresence>

          <motion.h1
            style={{ color: headlineColor }}
            className="pointer-events-auto font-instrument text-[94px] font-normal not-italic leading-[103px]"
          >
            {HEADLINE}
          </motion.h1>

          <AnimatePresence>
            {isDocked && (
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
