import { useQuery } from "@tanstack/react-query";
import { AppShell, PageHeader, isConfiguredExternalUrl } from "@/components/AppShell";
import { CONFERENCE } from "@/data/conference";
import { fetchGalleryImages } from "@/lib/api/client";
import {
  embeddedGalleryUrl,
  galleryLinkLabel,
  isEmbeddedGalleryUrl,
  isSynologySharingUrl,
} from "@/lib/gallery";
import { ExternalLink, ImageIcon, Loader2 } from "lucide-react";

export default function GalleryPage() {
  const albumUrl = CONFERENCE.driveGalleryUrl;
  const albumConfigured = isConfiguredExternalUrl(albumUrl);
  const galleryEmbed = embeddedGalleryUrl(albumUrl);
  const useEmbed = isEmbeddedGalleryUrl(albumUrl);
  const isSynologyGallery = isSynologySharingUrl(albumUrl);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gallery-images", albumUrl],
    queryFn: () => fetchGalleryImages(),
    staleTime: 60 * 60 * 1000,
    enabled: !useEmbed && !isSynologyGallery && albumConfigured,
  });

  const images = useEmbed || isSynologyGallery ? [] : (data?.images ?? []);
  const fromShare = data?.source === "share";

  return (
    <AppShell>
      <PageHeader
        eyebrow="Gallery"
        title={`Photos from ${CONFERENCE.shortName}`}
        subtitle={
          isSynologyGallery
            ? "Conference photos are hosted on the KABU shared gallery. Open the link below to browse the full album."
            : "Browse conference photos below from the official shared gallery."
        }
      />

      {isSynologyGallery ? (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center card-elev transition-transform duration-200 hover:-translate-y-[3px]">
          <ImageIcon className="h-12 w-12 text-primary/70" />
          <p className="max-w-md text-sm text-muted-foreground">
            Photos from {CONFERENCE.shortName} are available in the official KABU Backup Drive
            gallery.
          </p>
          <a
            href={albumUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/50"
          >
            {galleryLinkLabel(albumUrl)} <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      ) : (
        <>
          {albumConfigured && (
            <a
              href={albumUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground hover:border-primary/40"
            >
              {galleryLinkLabel(albumUrl)} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          {useEmbed && galleryEmbed && (
            <section className="mb-8 overflow-hidden rounded-2xl border border-border bg-card card-elev">
              <iframe
                src={galleryEmbed}
                title={`${CONFERENCE.shortName} photo gallery`}
                className="block min-h-[75vh] w-full border-0 bg-background"
                loading="lazy"
                allow="autoplay"
              />
            </section>
          )}

          {!useEmbed && isLoading && (
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading photos from the shared album…
            </div>
          )}

          {!useEmbed && !isLoading && isError && albumConfigured && (
            <p className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Could not load the shared album right now. Try opening the album link above.
            </p>
          )}

          {!useEmbed && !isLoading && images.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
              <p className="max-w-md text-sm text-muted-foreground">
                {albumConfigured
                  ? "No photos are available yet. Check back after the conference or open the shared album link above."
                  : "No photos are available yet. Check back after the conference."}
              </p>
            </div>
          )}

          {!useEmbed && images.length > 0 && (
            <>
              {fromShare && (
                <p className="mb-4 text-xs text-muted-foreground">
                  Showing {images.length} photo{images.length === 1 ? "" : "s"} from the shared
                  album.
                </p>
              )}
              <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
                {images.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card card-elev transition-transform duration-200 hover:-translate-y-[3px]"
                  >
                    <img
                      src={src}
                      alt={`Conference moment ${i + 1}`}
                      loading="lazy"
                      className="block w-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </AppShell>
  );
}
