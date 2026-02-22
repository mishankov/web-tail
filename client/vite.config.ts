import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      "/sources": "http://localhost:4444",
      "/logstream": {
        target: "ws://localhost:4444",
        ws: true,
      },
    },
  },
});
