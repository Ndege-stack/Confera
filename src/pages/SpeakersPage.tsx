import { AppShell, PageHeader } from "@/components/AppShell";
import { CONFERENCE, SPEAKERS, type Speaker } from "@/data/conference";
import { Mail, Mic2, X, ExternalLink } from "lucide-react";
import { useState } from "react";

function initialsOf(name: string) {
  const parts = name
    .replace(/,.*$/, "")
    .trim()
    .split(/\s+/)
    .filter((p) => !/^(dr\.?|prof(essor)?\.?|mr\.?|mrs\.?|ms\.?|ogw)$/i.test(p));
  const picks = [parts[0], parts[parts.length - 1]].filter(Boolean);
  return (
    picks
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || name.slice(0, 2).toUpperCase()
  );
}
function searchUrl(name: string) {
  return `https://www.linkedin.com/pub/dir/?firstAndLast=${encodeURIComponent(name)}`;
}

export default function SpeakersPage() {
  const [selected, setSelected] = useState<Speaker | null>(null);

  const keynotes = SPEAKERS.filter((s) => s.role !== "Speaker / Presenter");
  const presenters = SPEAKERS.filter((s) => s.role === "Speaker / Presenter");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Speakers"
        title={`Distinguished voices at ${CONFERENCE.shortName}`}
        subtitle="Tap any speaker to view their full profile. Presenters can claim their card to upload a photo and edit their bio."
      />

      {SPEAKERS.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center card-elev">
          <Mic2 className="h-10 w-10 text-muted-foreground/60" />
          <p className="max-w-md text-sm text-muted-foreground">
            The speaker lineup for {CONFERENCE.shortName} will be announced soon. Check back closer
            to {CONFERENCE.dates}.
          </p>
        </div>
      ) : (
        <>
          {keynotes.length > 0 && (
            <section className="mb-12">
              <h2 className="font-display text-xl text-foreground sm:text-2xl">
                Keynote & Guest Speakers
              </h2>
              <div className="gold-rule mb-5 mt-2 h-px" />
              <div className="grid gap-6 md:grid-cols-2">
                {keynotes.map((s) => (
                  <SpeakerCard key={s.name} s={s} large onClick={() => setSelected(s)} />
                ))}
              </div>
            </section>
          )}

          {keynotes.length > 0 && presenters.length > 0 && <div className="gold-rule mb-12 h-px" />}

          {presenters.length > 0 && (
            <section>
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-xl text-foreground sm:text-2xl">
                  Oral & Poster Presenters
                </h2>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {presenters.length}
                </span>
              </div>
              <div className="gold-rule mb-5 mt-2 h-px" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {presenters.map((s) => (
                  <SpeakerCard key={s.name} s={s} onClick={() => setSelected(s)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {selected && <SpeakerModal s={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  );
}

function SpeakerCard({
  s,
  large = false,
  onClick,
}: {
  s: Speaker;
  large?: boolean;
  onClick?: () => void;
}) {
  const tone =
    s.accent === "primary"
      ? "bg-primary text-primary-foreground"
      : s.accent === "gold"
        ? "bg-gold text-gold-foreground"
        : "bg-forest text-forest-foreground";

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left card-elev transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/40 hover:shadow-md"
    >
      <div className={`flex items-center gap-4 p-5 ${tone}`}>
        {s.photo ? (
          <img
            src={s.photo}
            alt={s.name}
            className={`${large ? "h-24 w-24" : "h-16 w-16"} flex-shrink-0 rounded-full border-2 border-background/40 object-cover ${s.photoPosition === "center" ? "object-center" : "object-top"} shadow-sm`}
          />
        ) : (
          <div
            className={`${large ? "h-24 w-24 text-2xl" : "h-16 w-16 text-lg"} flex flex-shrink-0 items-center justify-center rounded-full border-2 border-background/40 bg-background/15 font-display font-semibold tracking-wider backdrop-blur`}
          >
            {initialsOf(s.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] opacity-80">{s.role}</div>
          <div className={`font-display ${large ? "text-xl" : "text-lg"} leading-tight`}>
            {s.name}
          </div>
          <div className="text-xs opacity-90 sm:text-sm">{s.title}</div>
        </div>
      </div>
      {large && <div className="ribbon h-1.5 w-full" />}
      <div className="space-y-3 p-5">
        <div className="text-[11px] font-medium uppercase tracking-wider text-primary">
          {s.session}
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">{s.bio}</p>
        <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
          <span className="ml-auto text-primary opacity-0 transition group-hover:opacity-100">
            View profile →
          </span>
        </div>
      </div>
    </button>
  );
}

function SpeakerModal({ s, onClose }: { s: Speaker; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="ribbon h-24" />
        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-12 flex items-end gap-4">
            {s.photo ? (
              <img
                src={s.photo}
                alt={s.name}
                className={`h-28 w-28 rounded-2xl border-4 border-card object-cover ${s.photoPosition === "center" ? "object-center" : "object-top"} shadow-md`}
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-card bg-primary/10 font-display text-3xl font-semibold tracking-wider text-primary shadow-md">
                {initialsOf(s.name)}
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary">{s.role}</div>
            <h2 className="font-display text-2xl text-foreground">
              <a
                href={searchUrl(s.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary hover:underline"
                title="Search the web for this speaker"
              >
                {s.name}
                <ExternalLink className="h-4 w-4 opacity-60" />
              </a>
            </h2>
            <div className="text-sm text-muted-foreground">{s.title}</div>
            <div className="text-xs text-muted-foreground">{s.affiliation}</div>
          </div>

          <div className="mt-5 rounded-xl border border-gold/40 bg-gold/10 p-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary/80">
              Session
            </div>
            <div className="text-sm text-foreground">{s.session}</div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Bio
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">{s.bio}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {s.email && (
              <a
                href={`mailto:${s.email}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" /> {s.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
