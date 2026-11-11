import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@sobindigital/core": path.resolve(__dirname, "packages/core/src/index.ts"),
      "@sobindigital/provider-khqr": path.resolve(__dirname, "packages/provider-khqr/src/index.ts"),
      "@sobindigital/provider-payway": path.resolve(__dirname, "packages/provider-payway/src/index.ts"),
      "@sobindigital/pay": path.resolve(__dirname, "packages/pay/src/index.ts"),
    },
  },
});
