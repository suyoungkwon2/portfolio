import { existsSync } from "node:fs";
import path from "node:path";
import { ASSETS, type AssetId, type ResolvedAsset, type ResolvedAssets } from "./assets";

// Runs at build time (static export): looks for each manifest id under
// public/ and reports what's there, so adding a file is the whole job.
const PUBLIC = path.join(process.cwd(), "public");
const VIDEO_DIR = "/videos/ai-search";
const IMAGE_DIR = "/images/ai-search";
const IMAGE_EXTS = ["webp", "png", "jpg"];

const find = (dir: string, names: string[]) =>
  names.map((n) => `${dir}/${n}`).find((p) => existsSync(path.join(PUBLIC, p)));

function resolve(id: AssetId): ResolvedAsset {
  const mp4 = find(VIDEO_DIR, [`${id}.mp4`]);
  if (mp4) {
    return {
      src: mp4,
      webm: find(VIDEO_DIR, [`${id}.webm`]),
      poster: find(
        VIDEO_DIR,
        IMAGE_EXTS.map((ext) => `${id}-poster.${ext}`),
      ),
      isVideo: true,
    };
  }
  const image = find(
    IMAGE_DIR,
    IMAGE_EXTS.map((ext) => `${id}.${ext}`),
  );
  return image ? { src: image } : {};
}

export function resolveAssets(): ResolvedAssets {
  return Object.fromEntries(
    (Object.keys(ASSETS) as AssetId[]).map((id) => [id, resolve(id)]),
  ) as ResolvedAssets;
}
