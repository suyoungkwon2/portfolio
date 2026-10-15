// Asset manifest for the AI Search case study (docs/projects/ai-search-web-spec.md §6).
// None of these files exist yet. Drop a file in under its id and the build
// picks it up (assets.server.ts); until then the page shows a placeholder
// tagged with the id, so this list doubles as the shot list.
//
//   videos  public/videos/ai-search/<id>.mp4  (+ optional <id>.webm)
//           public/videos/ai-search/<id>-poster.webp|jpg|png
//   images  public/images/ai-search/<id>.webp|png|jpg
//
// `nr-*` can be either: a video wins over an image.

export type AssetSpec = {
  kind: "video" | "image";
  // What the finished file shows. Also the alt text / aria-label.
  alt: string;
};

export const ASSETS = {
  "hero-cabage-loop": {
    kind: "video",
    alt: "Typing “cabage” into Kurly search returns no products; the same search then shows cabbage results marked Beta.",
  },
  "summit-stage-clip": {
    kind: "video",
    alt: "Kurly’s CEO presenting AI Search on stage at Google Cloud Summit Seoul 2024.",
  },
  "summit-stage-photo": {
    kind: "image",
    alt: "Kurly’s CEO on stage at Google Cloud Summit Seoul 2024.",
  },
  "beta-label-ui": {
    kind: "image",
    alt: "Search results screen with the Beta notice that marks results found by AI.",
  },
  "arch-thumb": { kind: "image", alt: "AI Search system architecture, thumbnail." },
  "dashboard-thumb": { kind: "image", alt: "AI Search monitoring dashboard, thumbnail." },
  "nr-cabage": { kind: "video", alt: "Searching “cabage” returns “No products found”." },
  "nr-ca-bbage": { kind: "video", alt: "Searching “ca bbage” returns “No products found”." },
  "nr-lettuce": { kind: "video", alt: "Searching “lettuce” returns “No products found”." },
  "nr-granma-padano": {
    kind: "video",
    alt: "Searching “granma padano” returns “No products found”.",
  },
  "datasource-showdown": {
    kind: "video",
    alt: "Demo page comparing three result sets for “granma padano”: Kurly search, web-crawled data, and structured product data.",
  },
  "demo-cabage": { kind: "video", alt: "“cabage”: no results, then AI results marked Beta." },
  "demo-ca-bbage": { kind: "video", alt: "“ca bbage”: no results, then AI results marked Beta." },
  "demo-lettuce": { kind: "video", alt: "“lettuce”: no results, then AI results marked Beta." },
  "demo-granma-padano": {
    kind: "video",
    alt: "“granma padano”: no results, then AI results marked Beta.",
  },
  "demo-contextual": { kind: "video", alt: "Contextual query: no results, then AI results." },
  "arch-vertex-full": { kind: "image", alt: "Full AI Search architecture on Vertex AI." },
  "arch-sequence": {
    kind: "image",
    alt: "Sequence diagram of a search request through AI Search.",
  },
  "ab-split-screen": {
    kind: "video",
    alt: "A/B test side by side: the control shows “No products found”, the experiment shows AI results for the same query.",
  },
  "dashboard-pan": {
    kind: "video",
    alt: "Slow pan across the Looker monitoring dashboard, figures blurred.",
  },
  "slack-bot": {
    kind: "image",
    alt: "Daily Slack bot message listing the searches losing the most clicks.",
  },
} as const satisfies Record<string, AssetSpec>;

export type AssetId = keyof typeof ASSETS;

// What the build found on disk for one id. No `src` means "show the placeholder".
export type ResolvedAsset = {
  src?: string;
  webm?: string;
  poster?: string;
  isVideo?: boolean;
};

export type ResolvedAssets = Partial<Record<AssetId, ResolvedAsset>>;
