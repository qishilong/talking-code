import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:1818",
        changeOrigin: true
      },
      "/static": {
        target: "http://127.0.0.1:1818",
        changeOrigin: true
      },
      "/res": {
        target: "http://127.0.0.1:1818",
        changeOrigin: true
      }
    }
  },
  publicDir: "public"
});
