import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@sobin/pay",
    "@sobin/core",
    "@sobin/provider-payway",
    "@sobin/provider-khqr",
  ],
};

export default nextConfig;

