import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@theme",
        replacement: resolve(
          __dirname,
          "node_modules",
          "@doctools",
          "gw-theme-classic",
          "src",
          "theme"
        ),
      },
    ],
  },
});
