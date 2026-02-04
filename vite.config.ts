
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Security enhancements for production builds
    rollupOptions: {
      output: {
        // Prevent chunk names from revealing internal structure
        manualChunks: undefined,
      }
    },
    // Enable source maps for production debugging but exclude sensitive files
    sourcemap: false,
  }
}));
