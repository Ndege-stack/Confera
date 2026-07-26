/** Google's favicon lookup — finds a site's icon by domain without needing to guess its file path. */
export function googleFaviconUrl(pageUrl: string, size = 128): string | null {
  try {
    const domain = new URL(pageUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
  } catch {
    return null;
  }
}

/** Direct favicon URL for a partner's site, used as a last-resort fallback. */
export function faviconUrl(pageUrl: string): string | null {
  try {
    return `https://${new URL(pageUrl).hostname}/favicon.ico`;
  } catch {
    return null;
  }
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}
