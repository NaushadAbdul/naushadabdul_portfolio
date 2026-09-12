import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pin the Turbopack workspace root to this project. Without it Next walks up
   * to the nearest lockfile, which can sit outside the repository and produce a
   * build warning on every run.
   */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
