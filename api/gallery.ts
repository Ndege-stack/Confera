export const config = { runtime: "edge" };

import { fetchGalleryImagesFromShare, isAllowedGalleryUrl } from "../src/lib/gallery-fetch";

export default async function handler(request: Request): Promise<Response> {
  const albumUrl = new URL(request.url).searchParams.get("url");
continue

  if (!albumUrl || !isAllowedGalleryUrl(albumUrl)) {
    return Response.json({ error: "Invalid or missing gallery URL" }, { status: 400 });
  }

  try {
    const images = await fetchGalleryImagesFromShare(albumUrl);
    return Response.json(
      { images, source: images.length > 0 ? "share" : "empty" },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } },
    );
  } catch (error) {
    console.error("[api/gallery]", error);
    return Response.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
