"use client";

import { useEffect, useState } from "react";
import { HeroBackground, MAX_BLUR } from "@/components/hero-bg/HeroBackground";
import { defaultHeroBgParams, type HeroBgParams, type RGB, type Wave } from "@/components/hero-bg/params";

const STORAGE_KEY = "dev-hero-bg-params";

const toHex = (c: RGB) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid grid-cols-[88px_1fr_52px] items-center gap-2 text-xs">
      <span className="text-ink-muted">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full rounded border border-line bg-transparent px-1 py-0.5 text-right tabular-nums"
      />
    </label>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: RGB; onChange: (c: RGB) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs">
      <span className="text-ink-muted">{label}</span>
      <span className="flex items-center gap-2">
        <code className="text-ink-muted">{toHex(value)}</code>
        <input type="color" value={toHex(value)} onChange={(e) => onChange(fromHex(e.target.value))} />
      </span>
    </label>
  );
}

function WaveControls({
  title,
  hint,
  value,
  ranges,
  onChange,
}: {
  title: string;
  hint: string;
  value: Wave;
  ranges: { base: [number, number]; amp: [number, number] };
  onChange: (w: Wave) => void;
}) {
  const set = (k: keyof Wave) => (v: number) => onChange({ ...value, [k]: v });
  return (
    <Group title={title} hint={hint}>
      <Slider label="base" value={value.base} min={ranges.base[0]} max={ranges.base[1]} step={0.01} onChange={set("base")} />
      <Slider label="amp (±)" value={value.amp} min={ranges.amp[0]} max={ranges.amp[1]} step={0.005} onChange={set("amp")} />
      <Slider label="freq (int)" value={value.freq} min={0} max={6} step={1} onChange={set("freq")} />
      <Slider label="phase" value={value.phase} min={0} max={6.28} step={0.01} onChange={set("phase")} />
    </Group>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2 border-t border-line pt-4">
      <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-ink">{title}</h2>
      {hint && <p className="text-[11px] leading-snug text-ink-muted">{hint}</p>}
      {children}
    </section>
  );
}

export function HeroBgPlayground() {
  const [params, setParams] = useState<HeroBgParams>(defaultHeroBgParams);
  const [paused, setPaused] = useState(false);
  // Scrub position while paused; undefined = free-running.
  const [time, setTime] = useState(0);
  const [frame, setFrame] = useState<"landscape" | "portrait">("landscape");
  const [copied, setCopied] = useState(false);

  // Keep tweaks across reloads/HMR while tuning. Restored after mount
  // (not in the useState initializer) so SSR and hydration agree.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from storage
      if (saved) setParams({ ...defaultHeroBgParams, ...JSON.parse(saved) });
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch {}
  }, [params]);

  const patch = (p: Partial<HeroBgParams>) => setParams((prev) => ({ ...prev, ...p }));

  const copy = async () => {
    await navigator.clipboard.writeText(
      `export const defaultHeroBgParams: HeroBgParams = ${JSON.stringify(params, null, 2)};\n`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="flex min-h-screen flex-col bg-paper text-ink lg:flex-row">
      <div className="flex flex-1 items-center justify-center p-6 lg:sticky lg:top-0 lg:h-screen">
        <HeroBackground
          params={params}
          paused={paused}
          time={paused ? time : undefined}
          className={
            frame === "landscape"
              ? "aspect-video w-full max-w-[1200px] rounded-xl shadow-lg"
              : "aspect-[9/19.5] h-[80vh] rounded-[28px] shadow-lg"
          }
        />
      </div>

      <aside className="w-full space-y-4 overflow-y-auto border-line p-6 lg:h-screen lg:w-[360px] lg:border-l">
        <div className="flex flex-wrap gap-2 text-xs">
          <button onClick={() => setPaused((p) => !p)} className="rounded-full border border-line px-3 py-1.5">
            {paused ? "Play" : "Pause"}
          </button>
          <button
            onClick={() => setFrame((f) => (f === "landscape" ? "portrait" : "landscape"))}
            className="rounded-full border border-line px-3 py-1.5"
          >
            {frame === "landscape" ? "Phone frame" : "Desktop frame"}
          </button>
          <button onClick={() => setParams(defaultHeroBgParams)} className="rounded-full border border-line px-3 py-1.5">
            Reset
          </button>
          <button onClick={copy} className="rounded-full bg-ink px-3 py-1.5 text-paper">
            {copied ? "Copied!" : "Copy params"}
          </button>
        </div>
        <p className="text-[11px] leading-snug text-ink-muted">
          Paste copied values into <code>src/components/hero-bg/params.ts</code>.
        </p>

        {paused && (
          <Group title="Scrub" hint="Position in the loop (0 → 1). Last frame flows back into the first.">
            <Slider label="time" value={time} min={0} max={0.999} step={0.001} onChange={setTime} />
          </Group>
        )}

        <Group title="Timing & blur">
          <Slider label="loop (s)" value={params.loopSec} min={2} max={30} step={0.5} onChange={(v) => patch({ loopSec: v })} />
          <Slider label="blur" value={params.blur} min={0} max={MAX_BLUR} step={1} onChange={(v) => patch({ blur: v })} />
        </Group>

        <Group title="Colors">
          <ColorInput label="background" value={params.background} onChange={(c) => patch({ background: c })} />
          {params.layers.map((layer, i) => (
            <ColorInput
              key={i}
              label={`layer ${i + 1}`}
              value={layer.color}
              onChange={(c) => patch({ layers: params.layers.map((l, j) => (j === i ? { ...l, color: c } : l)) })}
            />
          ))}
          <ColorInput label="center" value={params.center} onChange={(c) => patch({ center: c })} />
        </Group>

        <Group title="Layer sizes" hint="Relative to the box, outer → inner.">
          {params.layers.map((layer, i) => (
            <Slider
              key={i}
              label={`layer ${i + 1}`}
              value={layer.scale}
              min={0.1}
              max={1.5}
              step={0.01}
              onChange={(v) => patch({ layers: params.layers.map((l, j) => (j === i ? { ...l, scale: v } : l)) })}
            />
          ))}
          <Slider
            label="center w"
            value={params.centerSize[0]}
            min={0.05}
            max={1.5}
            step={0.01}
            onChange={(v) => patch({ centerSize: [v, params.centerSize[1]] })}
          />
          <Slider
            label="center h"
            value={params.centerSize[1]}
            min={0.05}
            max={1.5}
            step={0.01}
            onChange={(v) => patch({ centerSize: [params.centerSize[0], v] })}
          />
        </Group>

        <WaveControls
          title="Box width"
          hint="Fraction of frame width. freq = cycles per loop."
          value={params.boxW}
          ranges={{ base: [0.05, 1.2], amp: [0, 0.4] }}
          onChange={(w) => patch({ boxW: w })}
        />
        <WaveControls
          title="Box height"
          hint="Fraction of frame height."
          value={params.boxH}
          ranges={{ base: [0.05, 1.2], amp: [0, 0.4] }}
          onChange={(w) => patch({ boxH: w })}
        />
        <WaveControls
          title="Corner radius"
          hint="Fraction of the shorter side; only grows from base by up to amp."
          value={params.radius}
          ranges={{ base: [0, 0.5], amp: [0, 0.5] }}
          onChange={(w) => patch({ radius: w })}
        />
      </aside>
    </main>
  );
}
