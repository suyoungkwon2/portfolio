"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

// Slow mesh-gradient shader behind a card thumbnail. A CSS gradient in the
// same colors sits underneath, so the card is never blank while WebGL
// starts up (or if it can't). The shader pauses itself offscreen and in
// background tabs; with reduced motion it renders one still frame.
//
// `seed` (the card's slug) gives each card its own start point and a
// slightly different speed, so a grid of cards doesn't move in lockstep.
export type MeshSettings = { distortion?: number; swirl?: number; offsetY?: number };

const BASE_SPEED = 0.45;

// A stable 0–1 number per seed (FNV-1a), so the variation survives reloads.
function unit(seed: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return (h >>> 0) / 2 ** 32;
}

export function GradientBackdrop({
  colors,
  mesh,
  seed = "",
  className,
}: {
  colors: string[];
  // Per-card overrides of the default shape below.
  mesh?: MeshSettings;
  seed?: string;
  className?: string;
}) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className={className}
      style={{ backgroundImage: `linear-gradient(135deg, ${colors.join(", ")})` }}
    >
      <MeshGradient
        colors={colors}
        distortion={mesh?.distortion ?? 0.7}
        swirl={mesh?.swirl ?? 0.2}
        offsetY={mesh?.offsetY ?? 0}
        // Start up to 100s into the loop; run at 80–120% of the base speed.
        frame={unit(seed, 1) * 100_000}
        speed={reduceMotion ? 0 : BASE_SPEED * (0.8 + 0.4 * unit(seed, 2))}
        className="h-full w-full"
      />
    </div>
  );
}
