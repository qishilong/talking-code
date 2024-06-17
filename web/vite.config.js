import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 以api开头的请求
      "/api": {
        target: "http://127.0.0.1:1818",
        changeOrigin: true
      },
      // 以static开头的请求
      "/static": {
        target: "http://127.0.0.1:1818",
        changeOrigin: true
      },
      // 以res开头的请求
      "/res": {
        target: "http://127.0.0.1:1818",
        changeOrigin: true
      }
    }
  },
  publicDir: "public"
});
