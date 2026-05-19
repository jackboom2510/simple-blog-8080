import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 3000,
		proxy: {
			"/api": {
				target: "https://w8sp52-8080.csb.app",
				changeOrigin: true,
				configure: (proxy) => {
					proxy.on("proxyReq", (proxyReq, req) => {
						console.log("➡️ Request:", req.url);
					});
					proxy.on("error", (err) => {
						console.log("❌ Proxy error:", err.message);
					});
				},
			},
		},
	},
});