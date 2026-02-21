import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dynamicImport from "vite-plugin-dynamic-import";

export default defineConfig({
  base: '/',
  root: "./",
  server: {
    port: 4173,
  },
  plugins: [
    react({ jsxRuntime: 'classic' }),
    dynamicImport(),
  ],
});