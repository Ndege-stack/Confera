const PHOTO_ID_RE = /https:\/\/lh3\.googleusercontent\.com\/pw\/(AP1Gcz[A-Za-z0-9_-]+)/g;
const USERCONTENT_RE = /https:\/\/lh3\.googleusercontent\.com\/[^"'\\\s<>)]+/g;
const DRIVE_FILE_RE = /https:\/\/drive\.google\.com\/(?:file\/d\/|uc\?[^"']*id=)([a-zA-Z0-9_-]+)/g;

export function isAllowedGalleryUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith("google.com") ||
      host.endsWith("googleusercontent.com") ||
      host === "photos.app.goo.gl"
    );
  } catch {
    return false;
  }
}

function normalizeShareUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const shareMatch = parsed.pathname.match(/\/share\/([^/]+)/);
    if (shareMatch) {
      const key = parsed.searchParams.get("key");
      const base = `https://photos.google.com/share/${shareMatch[1]}`;
      return key ? `${base}?key=${encodeURIComponent(key)}` : base;
    }
    return url;
  } catch {
    return url;
  }
}

function decodeGoogleUrl(raw: string): string {
  return raw.replaceAll("\\u003d", "=").replaceAll("\\u0026", "&").replaceAll("\\/", "/");
}

function sizedPhotoUrl(id: string): string {
  return `https://lh3.googleusercontent.com/pw/${id}=w1600-h1200`;
}

function sizedUserContentUrl(url: string): string {
  const clean = decodeGoogleUrl(url.split(/[ "'\\]/)[0] ?? url);
  if (/=w\d+/i.test(clean)) return clean.replace(/=w\d+[^"']*/, "=w1200-h900");
  return `${clean}=w1200-h900`;
}

function extractGooglePhotosUrls(html: string): string[] {
  const ids = new Set<string>();
  for (const match of html.matchAll(PHOTO_ID_RE)) ids.add(match[1]);

  if (ids.size > 0) {
    return [...ids].map(sizedPhotoUrl);
  }

  const urls = new Set<string>();
  for (const match of html.matchAll(USERCONTENT_RE)) {
    const imageUrl = sizedUserContentUrl(match[0]);
    if (!imageUrl.includes("googleusercontent.com")) continue;
    urls.add(imageUrl);
  }
  return [...urls];
}

function extractGoogleDriveUrls(html: string): string[] {
  const fileIds = new Set<string>();
  for (const match of html.matchAll(DRIVE_FILE_RE)) fileIds.add(match[1]);
  return [...fileIds].map((id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`);
}

function isGooglePhotosUrl(url: string): boolean {
  return /photos\.(google\.com|app\.goo\.gl)/i.test(url);
}

function isGoogleDriveUrl(url: string): boolean {
  return /drive\.google\.com/i.test(url);
}

export async function fetchGalleryImagesFromShare(shareUrl: string): Promise<string[]> {
  const targetUrl = isGooglePhotosUrl(shareUrl) ? normalizeShareUrl(shareUrl) : shareUrl;

  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AHC2026Gallery/1.0)",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Gallery fetch failed (${response.status})`);
  }

  const html = await response.text();
  return isGoogleDriveUrl(shareUrl)
    ? extractGoogleDriveUrls(html)
    : extractGooglePhotosUrls(html);
}
