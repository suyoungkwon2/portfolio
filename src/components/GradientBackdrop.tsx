"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

// Slow mesh-gradient shader behind a card thumbnail. A CSS gradient in the
// same colors sits underneath, so the card is never blank while WebGL
// starts up (or if it can't). The shader pauses itself offscreen and in
// background tabs; with reduced motion it renders one still frame.
export function GradientBackdrop({ colors, className }: { colors: string[]; className?: string }) {
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
        distortion={0.7}
        swirl={0.2}
        speed={reduceMotion ? 0 : 0.35}
        className="h-full w-full"
      />
    </div>
  );
}
