"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

// Slow mesh-gradient shader behind a card thumbnail. A CSS gradient in the
// same colors sits underneath, so the card is never blank while WebGL
// starts up (or if it can't). The shader pauses itself offscreen and in
// background tabs; with reduced motion it renders one still frame.
export type MeshSettings = { distortion?: number; swirl?: number; offsetY?: number };

export function GradientBackdrop({
  colors,
  mesh,
  className,
}: {
  colors: string[];
  // Per-card overrides of the default shape below.
  mesh?: MeshSettings;
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
        speed={reduceMotion ? 0 : 0.45}
        className="h-full w-full"
      />
    </div>
  );
}
