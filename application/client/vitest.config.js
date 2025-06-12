// ./applications/client/vitest.config.js

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/__tests__/**/*.test.js"],
    globals: true,
    environment: "jsdom",
  },
});
