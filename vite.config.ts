import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function galleryApiDevPlugin(): Plugin {
  return {
    name: "gallery-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/gallery")) {
          next();
          return;
        }

        try {
          const requestUrl = new URL(req.url, "http://localhost");
          const albumUrl = requestUrl.searchParams.get("url");
          const mod = await server.ssrLoadModule("/src/lib/gallery-fetch.ts");
          if (!albumUrl || !mod.isAllowedGalleryUrl(albumUrl)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid or missing gallery URL" }));
            return;
          }
          const images = await mod.fetchGalleryImagesFromShare(albumUrl);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              images,
              source: images.length > 0 ? "share" : "empty",
            }),
          );
        } catch (error) {
          console.error("[api/gallery]", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Failed to load gallery" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), galleryApiDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: path.resolve(__dirname, "./src/public"),
});
