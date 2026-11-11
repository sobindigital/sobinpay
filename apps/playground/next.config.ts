import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@sobindigital/pay",
    "@sobindigital/core",
    "@sobindigital/provider-payway",
    "@sobindigital/provider-khqr",
  ],
};

export default nextConfig;

