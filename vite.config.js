import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";

import "react";
import "react-dom";

export default defineConfig({
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
  ],
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});