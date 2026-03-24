import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  basePath: "/solutions/codex",
  output: "standalone",
  outputFileTracingRoot: resolve(__dirname, "../../.."),
  turbopack: {
    root: resolve(__dirname, "../../.."),
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/solutions/codex",
        permanent: false,
        basePath: false as const,
      },
    ];
  },
};

export default nextConfig;
