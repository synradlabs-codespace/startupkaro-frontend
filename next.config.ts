import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable Turbopack filesystem cache for dev — it grows unboundedly in
    // memory (12GB+ observed) because Turbopack loads the full .next cache
    // into RAM and keeps accumulating compiled module state across requests.
    // Trade-off: slightly slower cold starts, but no OOM crash after ~1 hour.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
