import { useState } from "react";
import { AppShell, PageHeader, isConfiguredExternalUrl } from "@/components/AppShell";
import { CONFERENCE, SCHEDULE } from "@/data/conference";
import { drivePdfDownloadUrl, drivePdfEmbedUrl } from "@/lib/api/client";
import { CalendarClock, Download, ExternalLink } from "lucide-react";

const pdfConfigured = isConfiguredExternalUrl(CONFERENCE.schedulePdfUrl);
const pdfEmbed = pdfConfigured ? drivePdfEmbedUrl(CONFERENCE.schedulePdfUrl) : null;
const pdfDownload = pdfConfigured ? drivePdfDownloadUrl(CONFERENCE.schedulePdfUrl) : null;

type SessionStatus = "upcoming" | "ongoing" | "past";

function getSessionStatus(
  dateISO: string,
  time: string,
  nextTime: string | undefined,
  now: Date,
): SessionStatus {
  const start = new Date(`${dateISO}T${time}:00`);
  const end = nextTime
    ? new Date(`${dateISO}T${nextTime}:00`)
    : new Date(start.getTime() + 60 * 60_000);
  if (now < start) return "upcoming";
  if (now < end) return "ongoing";
  return "past";
}

const STATUS_LABEL: Record<SessionStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  past: "Past",
};

const STATUS_STYLE: Record<SessionStatus, string> = {
  upcoming: "bg-gold text-gold-foreground",
  ongoing: "bg-forest text-forest-foreground",
  past: "bg-muted text-muted-foreground",
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(0);
  const now = new Date();
  const day = SCHEDULE[activeDay];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Program"
        title="Conference schedule"
        subtitle={`Official ${CONFERENCE.shortName} program. Last-minute changes will be reflected in the PDF below.`}
      />

      {SCHEDULE.length > 0 && day && (
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
            {SCHEDULE.map((d, i) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDay(i)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                  activeDay === i
                    ? "rounded-t-lg border-primary bg-primary text-primary-foreground"
                    : "border-transparent text-foreground/70 hover:border-gold hover:text-foreground"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {day.items.map((it, idx) => {
              const status = getSessionStatus(day.date, it.time, day.items[idx + 1]?.time, now);
              return (
                <div
                  key={it.time}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 card-elev transition-transform duration-200 hover:-translate-y-[3px]"
                >
                  <div className="w-16 shrink-0 font-display text-lg text-primary">{it.time}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground">{it.title}</div>
                    <div className="text-xs text-muted-foreground">{it.room}</div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLE[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {SCHEDULE.length > 0 && <div className="gold-rule mb-10 h-px" />}

      {pdfConfigured && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <a
            href={CONFERENCE.schedulePdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground hover:border-primary/40"
          >
            Open PDF in new tab <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {pdfDownload && (
            <a
              href={pdfDownload}
              download={`${CONFERENCE.shortName}-Program.pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground hover:border-primary/40"
            >
              Download PDF <Download className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}

      {pdfEmbed ? (
        <section className="overflow-hidden rounded-2xl border border-border bg-card card-elev">
          <iframe
            src={pdfEmbed}
            title={`${CONFERENCE.shortName} Conference Program`}
            className="block min-h-[85vh] w-full border-0 bg-background"
            loading="lazy"
            allow="autoplay"
          />
        </section>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center card-elev">
          <CalendarClock className="h-10 w-10 text-muted-foreground/60" />
          <p className="max-w-md text-sm text-muted-foreground">
            The full program has not been published yet. Check back closer to {CONFERENCE.dates}.
          </p>
        </div>
      )}
    </AppShell>
  );
}
