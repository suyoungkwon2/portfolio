import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export, deployed to GitHub Pages (suyoungkwon.com) by
  // .github/workflows/deploy.yml.
  output: "export",
  // Pages serves /work/mars/index.html at /work/mars/ without extra config.
  trailingSlash: true,
  // No image-optimization server on a static host; images in public/ are
  // pre-sized WebP instead.
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
