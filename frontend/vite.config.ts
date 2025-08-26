import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		sourcemap: false,
		minify: "terser",
		chunkSizeWarningLimit: 1600,
		// Configurazioni specifiche per Render
		target: 'esnext',
		commonjsOptions: {
			transformMixedEsModules: true
		},
		rollupOptions: {
			// Assicura che tutte le dipendenze platform-specific siano gestite correttamente
			external: (id) => {
				// Non esternalizzare le dipendenze Rollup platform-specific
				if (id.includes('@rollup/rollup-')) return false;
				return false;
			},
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					router: ["react-router-dom"],
					ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"]
				}
			}
		}
	},
	server: {
		port: 5173,
		host: true,
		proxy: {
			"/api": {
				target: process.env.VITE_API_URL || "http://localhost:5000",
				changeOrigin: true,
				secure: false
			}
		}
	},
	preview: { 
		allowedHosts: ["auralis-vqck.onrender.com"],
		port: 5000,
		host: true
	}
});
