/** Google Drive folders can be embedded; Google Photos share pages cannot (403 in iframes). */

export function isSynologySharingUrl(url: string): boolean {
  return /quickconnect\.to/i.test(url);
}

export function isGooglePhotosUrl(url: string): boolean {
  return /photos\.(google\.com|app\.goo\.gl)/i.test(url);
}

export function isGoogleDriveFolderUrl(url: string): boolean {
  return /drive\.google\.com\/drive\/folders\//i.test(url);
}

export function toDriveFolderEmbedUrl(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return `https://drive.google.com/embeddedfolderview?id=${match[1]}#grid`;
}

export function galleryLinkLabel(url: string): string {
  if (isSynologySharingUrl(url)) return "Open full KABU gallery";
  if (isGooglePhotosUrl(url)) return "Open full Google Photos album";
  if (isGoogleDriveFolderUrl(url)) return "Open full Google Drive gallery";
  return "Open full gallery";
}

/** Only Google Drive folders embed reliably; Synology blocks cross-origin iframes. */
export function isEmbeddedGalleryUrl(url: string): boolean {
  return isGoogleDriveFolderUrl(url);
}

export function embeddedGalleryUrl(url: string): string | null {
  if (isGoogleDriveFolderUrl(url)) return toDriveFolderEmbedUrl(url);
  return null;
}
