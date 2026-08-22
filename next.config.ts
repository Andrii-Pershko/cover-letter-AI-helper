import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/adapter-pg", "pg", "unpdf"],
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  // Next 16 builds with Turbopack by default; webpack stays for `next dev --webpack` in Docker.
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev && process.env.WATCHPACK_POLLING === "true") {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

export default nextConfig;
