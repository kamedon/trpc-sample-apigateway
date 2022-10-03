import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      "^/api/*": {
        target: "http://localhost:4100/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          return path.replace("/api", "/");
        },
      },
    },
  },
});
