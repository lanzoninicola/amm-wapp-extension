import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: resolve(__dirname, "public/content.tsx"),
      },
      output: {
        format: "iife",
        entryFileNames: "[name].js",
      },
    },
  },
});
