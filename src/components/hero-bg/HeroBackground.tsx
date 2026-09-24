"use client";

import { useEffect, useRef } from "react";
import { defaultHeroBgParams, type HeroBgParams, type RGB, type Wave } from "./params";

// The picture is nothing but big blurred shapes, so it's drawn into a
// canvas at 1/DOWNSCALE of its display size and stretched up by the
// browser. The upscale is itself a soft blur, and blurring ~1/36th of the
// pixels keeps this cheap enough to run every frame.
const DOWNSCALE = 6;
export const MAX_BLUR = 150;

const rgb = ([r, g, b]: RGB) => `rgb(${r} ${g} ${b})`;
const wave = (w: Wave, ph: number) => w.base + w.amp * Math.sin(ph * w.freq + w.phase);

// Draws one frame at loop position t ∈ [0, 1). Mirrors the draft's
// per-frame math: sharp shapes first, then one blur over the whole
// composite (blurring shape by shape would blend the layers differently).
function drawFrame(
  ctx: CanvasRenderingContext2D,
  scratch: CanvasRenderingContext2D,
  p: HeroBgParams,
  t: number,
  canvasBlur: boolean,
) {
  const { width: W, height: H } = ctx.canvas;
  const ph = 2 * Math.PI * t;
  const bw = W * wave(p.boxW, ph);
  const bh = H * wave(p.boxH, ph);
  const rad = p.radius.base + p.radius.amp * (0.5 + 0.5 * Math.sin(ph * p.radius.freq + p.radius.phase));

  // The composite is drawn into a scratch canvas padded by `pad` on every
  // side, so the blur samples solid background past the frame's edges
  // instead of transparency (which leaves a pale band along the border).
  const pad = scratch.canvas.width - W > 0 ? (scratch.canvas.width - W) / 2 : 0;
  scratch.setTransform(1, 0, 0, 1, pad, pad);
  scratch.fillStyle = rgb(p.background);
  scratch.fillRect(-pad, -pad, W + 2 * pad, H + 2 * pad);
  for (const { color, scale } of p.layers) {
    const w = bw * scale;
    const h = bh * scale;
    scratch.fillStyle = rgb(color);
    scratch.beginPath();
    scratch.roundRect(W / 2 - w / 2, H / 2 - h / 2, w, h, Math.min(w, h) * rad);
    scratch.fill();
  }
  scratch.fillStyle = rgb(p.center);
  scratch.beginPath();
  scratch.ellipse(W / 2, H / 2, (bw * p.centerSize[0]) / 2, (bh * p.centerSize[1]) / 2, 0, 0, 2 * Math.PI);
  scratch.fill();

  ctx.filter = canvasBlur ? `blur(${blurPx(p, W, H)}px)` : "none";
  ctx.drawImage(scratch.canvas, -pad, -pad);
  ctx.filter = "none";
}

// Draft blur is in px at 1920×1080; scale by the shorter side so a phone
// in portrait gets the same softness as a desktop.
function blurPx(p: HeroBgParams, W: number, H: number) {
  return (p.blur * Math.min(W, H)) / 1080;
}

export function HeroBackground({
  params = defaultHeroBgParams,
  paused = false,
  time,
  className = "",
}: {
  params?: HeroBgParams;
  paused?: boolean;
  // Pins the loop to this position (0–1) and stops it — for scrubbing on
  // the tuning page.
  time?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Read through a ref so live param tweaks don't restart the loop.
  const paramsRef = useRef(params);
  // Loop position is kept across pause/resume so it continues where it
  // stopped instead of jumping.
  const tRef = useRef(0);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const scratch = document.createElement("canvas").getContext("2d");
    if (!canvas || !ctx || !scratch) return;

    // Older Safari has no ctx.filter. There, fall back to a CSS blur on the
    // element — same look, just more work for the compositor.
    const canvasBlur = typeof ctx.filter === "string";

    // Pad = 3σ of the largest blur the tuning page allows, so the edges stay
    // clean however the blur is tuned.
    const resizeScratch = () => {
      const pad = Math.ceil(3 * blurPx({ ...paramsRef.current, blur: MAX_BLUR }, canvas.width, canvas.height));
      scratch.canvas.width = canvas.width + 2 * pad;
      scratch.canvas.height = canvas.height + 2 * pad;
    };

    const redraw = () => {
      drawFrame(ctx, scratch, paramsRef.current, tRef.current, canvasBlur);
      canvas.style.filter = canvasBlur
        ? ""
        : `blur(${blurPx(paramsRef.current, canvas.width, canvas.height) * DOWNSCALE}px)`;
    };
    redrawRef.current = redraw;

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth / DOWNSCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight / DOWNSCALE));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      resizeScratch();
      redraw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || time !== undefined || reduceMotion) {
      redrawRef.current();
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      tRef.current = (tRef.current + (now - last) / (paramsRef.current.loopSec * 1000)) % 1;
      last = now;
      redrawRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, time]);

  // While stopped, still reflect param edits and scrubbing (the tuning page
  // relies on it).
  useEffect(() => {
    paramsRef.current = params;
    if (time !== undefined) tRef.current = time;
    if (paused || time !== undefined) redrawRef.current();
  }, [params, paused, time]);

  return (
    <div className={`overflow-hidden ${className}`} style={{ backgroundColor: rgb(params.background) }}>
      <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />
    </div>
  );
}
