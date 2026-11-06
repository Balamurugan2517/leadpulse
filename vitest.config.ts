import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@leadpulse/domain": path.resolve(__dirname, "./packages/domain/src"),
      "@leadpulse/contracts": path.resolve(__dirname, "./packages/contracts/src"),
      "@leadpulse/infrastructure": path.resolve(__dirname, "./packages/infrastructure/src"),
      "@leadpulse/ui": path.resolve(__dirname, "./packages/ui/src"),
    },
  },
});
