"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import { site } from "@/content/site";

const HERO_SCROLL_VH = 170;
const CHIP_W = 120;
const CHIP_H = 44;
const CHIP_TOP = (84 - CHIP_H) / 2;
const CHIP_RIGHT = 20;

const HEADLINE = "Heal the World";

// Deterministic pseudo-random in [-1, 1], stable across renders.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function DisintegrateChar({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { start, end, dx, dy, rot } = useMemo(() => {
    const start = (index / total) * 0.55;
    return {
      start,
      end: start + 0.45,
      dx: seeded(index, 1) * 60,
      dy: seeded(index, 2) * 90 - 20,
      rot: seeded(index, 3) * 30,
    };
  }, [index, total]);

  const t = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(t, [0, 1], [1, 0]);
  const x = useTransform(t, [0, 1], [0, dx]);
  const y = useTransform(t, [0, 1], [0, dy]);
  const rotate = useTransform(t, [0, 1], [0, rot]);
  const blur = useTransform(t, [0, 1], [0, 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  if (char === " ") {
    return <span className="inline-block w-[0.28em]" aria-hidden />;
  }

  return (
    <motion.span
      className="hero-word"
      style={{ opacity, x, y, rotate, filter }}
    >
      {char}
    </motion.span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDocked, setIsDocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsDocked(v > 0.55);
  });

  const chars = useMemo(() => HEADLINE.split(""), []);

  const width = useTransform(scrollYProgress, [0, 0.55], ["100vw", `${CHIP_W}px`]);
  const height = useTransform(scrollYProgress, [0, 0.55], ["100vh", `${CHIP_H}px`]);
  const top = useTransform(scrollYProgress, [0, 0.55], ["0px", `${CHIP_TOP}px`]);
  const right = useTransform(scrollYProgress, [0, 0.55], ["0px", `${CHIP_RIGHT}px`]);
  const radius = useTransform(scrollYProgress, [0, 0.55], ["0px", "999px"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [0.35, 0]);
  const controlsOpacity = useTransform(scrollYProgress, [0.5, 0.62], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
  }

  const circumference = 2 * Math.PI * 15;

  return (
    <div ref={sectionRef} id="hero" style={{ height: `${HERO_SCROLL_VH}vh` }} className="relative bg-ink">
      <motion.div
        style={{ width, height, top, right, borderRadius: radius }}
        className="fixed z-40 overflow-hidden bg-ink shadow-lg"
      >
        <video
          ref={videoRef}
          src={site.heroVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full object-cover"
        />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60"
        />

        <motion.button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
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

      <div className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display flex flex-wrap justify-center text-[13vw] font-medium leading-[0.95] text-paper sm:text-[10vw] md:text-[8rem]">
          {chars.map((char, i) => (
            <DisintegrateChar
              key={i}
              char={char}
              index={i}
              total={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </h1>

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
