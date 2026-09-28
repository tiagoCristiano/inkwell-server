import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Same API the KOReader plugin uses by default; INKWELL_API=http://localhost:3001 for a local server.
// The built panel needs none of this: the API serves it at /panel and it calls its own origin.
const target = process.env.INKWELL_API || "https://inkwell-server-0n1p.onrender.com";
const proxy = { target, changeOrigin: true };

export default defineConfig({
  base: "/panel/",
  plugins: [solid()],
  server: {
    proxy: Object.fromEntries(["/db", "/admin", "/auth", "/avatars", "/covers", "/communities"].map((p) => [p, proxy])),
  },
});
