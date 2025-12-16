import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // Required for static export
  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
