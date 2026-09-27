import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const api = "http://localhost:3001";

export default defineConfig({
  base: "/panel/",
  plugins: [solid()],
  server: { proxy: { "/db": api, "/admin": api, "/auth": api, "/avatars": api, "/covers": api, "/communities": api } },
});
