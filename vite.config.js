import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";
import dynamicImport from "vite-plugin-dynamic-import";

import "react";
import "react-dom";

export default defineConfig({
  base: './',
  root: "./",
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      external: ['react-dom/client'],
    },
  },
  plugins: [
    react(),
    deno(),
    dynamicImport(),
  ],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});