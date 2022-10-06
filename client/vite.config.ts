import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      "^/api/*": {
        // target: "https://d337qn2w5e2li7.cloudfront.net",
        target: "https://ybe6g0d9v2.execute-api.ap-northeast-1.amazonaws.com",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => {
        //   return path.replace("/api", "/");
        // },
      },
    },
  },
});
