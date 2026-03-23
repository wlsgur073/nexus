import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  basePath: "/solutions/codex",
  output: "standalone",
  outputFileTracingRoot: resolve(__dirname, "../../.."),
  turbopack: {
    root: resolve(__dirname, "../../.."),
  },
};

export default nextConfig;
