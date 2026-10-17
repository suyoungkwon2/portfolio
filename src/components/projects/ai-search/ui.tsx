"use client";

import { useInView } from "framer-motion";
import { createContext, useContext, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useStill } from "../story/motion";
import { ASSETS, type AssetId, type ResolvedAssets } from "./assets";

// AI Search's asset slots (spec §6). The rest of the case-study kit lives in
// ../story.

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

const AssetContext = createContext<ResolvedAssets>({});

export function AssetProvider({
  assets,
  children,
}: {
  assets: ResolvedAssets;
  children: React.ReactNode;
}) {
  return <AssetContext.Provider value={assets}>{children}</AssetContext.Provider>;
}

export function useAsset(id: AssetId) {
  return useContext(AssetContext)[id] ?? {};
}

// Stand-in until the file exists: the manifest id plus what it should show.
export function AssetPlaceholder({ id, className }: { id: AssetId; className?: string }) {
  return (
    <div
      role="img"
      aria-label={ASSETS[id].alt}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/15 bg-paper-2 p-4 text-center",
        className,
      )}
    >
      <span className="font-mono text-[11px] font-medium text-ink">{id}</span>
      <span className="max-w-[28ch] text-[11px] leading-snug text-ink-muted">{ASSETS[id].alt}</span>
    </div>
  );
}

// Small corner tag on a coded stand-in scene, naming the recording that
// will replace it.
export function StandInTag({ id, className }: { id: AssetId; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[9px] text-paper",
        className,
      )}
    >
      placeholder · {id}
    </span>
  );
}

// `▶ Video` (muted, looping, lazy, paused off screen) or an image, or the
// placeholder when the file isn't in yet. Fills its parent.
export function AssetMedia({
  id,
  priority = false,
  fit = "cover",
  className,
  fallback,
}: {
  id: AssetId;
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  // Rendered instead of the grey placeholder when the file is missing.
  fallback?: React.ReactNode;
}) {
  const asset = useAsset(id);
  const still = useStill();
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: "200px 0px" });
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (near) video.play().catch(() => {});
    else video.pause();
  }, [near]);

  if (!asset.src) return <>{fallback ?? <AssetPlaceholder id={id} className={className} />}</>;

  if (!asset.isVideo || (still && asset.poster)) {
    const src = asset.isVideo ? asset.poster! : asset.src;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, files are pre-sized
      <img
        src={src}
        alt={ASSETS[id].alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("h-full w-full", fitClass, className)}
      />
    );
  }

  // Sources only mount once the video is near the viewport (or right away
  // for the hero), so off-screen clips cost nothing.
  const load = priority || near;
  return (
    <video
      ref={ref}
      aria-label={ASSETS[id].alt}
      poster={asset.poster}
      muted
      loop
      playsInline
      autoPlay={!still}
      preload={priority ? "auto" : "none"}
      className={cn("h-full w-full", fitClass, className)}
    >
      {load && asset.webm && <source src={asset.webm} type="video/webm" />}
      {load && <source src={asset.src} type="video/mp4" />}
    </video>
  );
}
