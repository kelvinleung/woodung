import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        room: resolve(root, "room/index.html"),
      },
    },
  },
  server: {
    proxy: {
      "/socket": {
        target: "http://localhost:4399",
        ws: true,
      },
    },
  },
});
