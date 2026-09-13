import nextConfig from "eslint-config-next";

const config = [
  {
    ignores: ["legacy-jekyll/**", ".next/**", "node_modules/**"],
  },
  ...nextConfig,
];

export default config;
