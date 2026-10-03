import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// base: "./" so the build works on GitHub Pages project sites (blockchains.github.io/<repo>/)
export default defineConfig({ plugins: [react()], base: "./" });
