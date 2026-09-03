import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // See the stub for why this alias is required.
      "server-only": path.resolve(__dirname, "./src/test/server-only.stub.ts"),
    },
  },
});
