import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@sobin/core": path.resolve(__dirname, "packages/core/src/index.ts"),
      "@sobin/provider-khqr": path.resolve(__dirname, "packages/provider-khqr/src/index.ts"),
      "@sobin/provider-payway": path.resolve(__dirname, "packages/provider-payway/src/index.ts"),
      "@sobin/pay": path.resolve(__dirname, "packages/pay/src/index.ts"),
    },
  },
});
