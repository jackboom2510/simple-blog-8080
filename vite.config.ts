import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "txm8xk-5173.csb.app",
      "sy4tcp-5173.csb.app",
      "sy4tcp-2222.csb.app",
    ],
  },
});
