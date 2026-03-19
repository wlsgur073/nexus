import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  basePath: "/solutions/codex",
  turbopack: {
    root: resolve(__dirname, "../../.."),
  },
};

export default nextConfig;
