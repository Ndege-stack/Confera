import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { CONFERENCE, SPEAKERS, ANNOUNCEMENTS, SCHEDULE, PARTNERS } from "@/data/conference";
import { faviconUrl, googleFaviconUrl, initialsOf } from "@/lib/partner-logo";
import {
  ArrowRight,
  CalendarClock,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import kabarakLogo from "@/public/images/Kabarak_University_Logo.png";
import { useState } from "react";

const MS_PER_DAY = 86_400_000;

function EventCountdown() {
  const now = new Date();
  const start = new Date(`${CONFERENCE.startDate}T00:00:00`);
  const end = new Date(`${CONFERENCE.endDate}T23:59:59`);

  if (now < start) {
    const days = Math.ceil((start.getTime() - now.getTime()) / MS_PER_DAY);
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gold-foreground">
        <CalendarClock className="h-3.5 w-3.5" />
        {days} {days === 1 ? "day" : "days"} to go
      </div>
    );
  }

  if (now <= end) {
    const dayNumber = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY) + 1;
    const totalDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-forest px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-forest-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest-foreground" />
        Live now · Day {dayNumber} of {totalDays}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
      {CONFERENCE.shortName} concluded — see you next year
    </div>
  );
}

function PartnerLogoThumb({ name, url, logo }: { name: string; url: string; logo: string }) {
  const sources = [logo, googleFaviconUrl(url, 64), faviconUrl(url)].filter((s): s is string =>
    Boolean(s),
  );
  const [tier, setTier] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const src = sources[tier];

  return (
    <>
      {!loaded && (
        <span
          title={name}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-xs font-semibold text-primary"
        >
          {initialsOf(name)}
        </span>
      )}
      {src && (
        <img
          key={src}
          src={src}
          alt={name}
          title={name}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setTier((t) => t + 1);
          }}
          className={`h-10 w-auto max-w-[96px] object-contain grayscale transition hover:grayscale-0 ${loaded ? "" : "hidden"}`}
        />
      )}
    </>
  );
}

export default function HomePage() {
  const next = SCHEDULE[0]?.items.slice(0, 3) ?? [];
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card bg-paper card-elev">
        <div className="ribbon absolute inset-x-0 top-0 h-24 opacity-95" />
        <div className="relative px-6 pb-8 pt-6 sm:px-10 sm:pb-10 sm:pt-8">
          <div className="mb-4 flex items-center gap-3">
            <img
              src={kabarakLogo}
              alt="Kabarak University"
              width={96}
              height={96}
              className="h-20 w-20 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-black/5 sm:h-24 sm:w-24"
            />
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary-foreground/85">
              <span className="rounded-full bg-primary-foreground/10 px-2.5 py-1 backdrop-blur">
                {CONFERENCE.faculty}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary-foreground/85">
            <span className="rounded-full bg-gold px-2.5 py-1 text-gold-foreground">
              {CONFERENCE.editionOrdinal}
            </span>
          </div>
          <h1 className="mt-8 max-w-3xl font-display text-4xl leading-[1.05] text-foreground sm:mt-24 sm:text-5xl">
            {CONFERENCE.edition}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Kabarak University, Nakuru
            </span>
            <span>·</span>
            <span>{CONFERENCE.dates}</span>
          </div>

          <div className="mt-4">
            <EventCountdown />
          </div>

          <div className="mt-6 max-w-2xl rounded-2xl border border-border/70 bg-background/70 p-4 backdrop-blur">
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              Theme
            </div>
            <p className="mt-1 font-display text-lg leading-snug text-foreground">
              "{CONFERENCE.theme}"
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {CONFERENCE.tagline}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              View full schedule <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dates + ISO certification banner */}
      <section className="mt-6 flex flex-col overflow-hidden rounded-2xl shadow-sm sm:flex-row">
        <div className="flex items-center gap-2 bg-forest px-6 py-4 text-forest-foreground sm:[clip-path:polygon(0_0,100%_0,92%_100%,0%_100%)] sm:pr-14">
          <span className="font-display text-lg font-semibold tracking-wide sm:text-xl">
            {CONFERENCE.dates}
          </span>
        </div>
        <div className="flex flex-1 items-center gap-2 bg-primary px-6 py-4 text-primary-foreground sm:-ml-6 sm:pl-16">
          <ShieldCheck className="h-4 w-4 shrink-0 text-gold" />
          <span className="text-sm">{CONFERENCE.isoCertification}</span>
        </div>
      </section>

      {/* About */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6 card-elev transition-transform duration-200 hover:-translate-y-[3px] sm:p-8">
        <h2 className="font-display text-2xl text-forest sm:text-3xl">{CONFERENCE.edition}</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85 sm:text-[15px]">
          {CONFERENCE.about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="gold-rule my-10 h-px" />

      {/* Two-column highlights */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 card-elev transition-transform duration-200 hover:-translate-y-[3px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Up next</h2>
            <Link to="/schedule" className="text-xs font-medium text-primary hover:underline">
              Full agenda →
            </Link>
          </div>
          {next.length > 0 ? (
            <ul className="mt-4 divide-y divide-border">
              {next.map((it) => (
                <li key={it.time} className="flex items-start gap-4 py-3">
                  <div className="w-14 shrink-0 font-display text-lg text-primary">{it.time}</div>
                  <div>
                    <div className="font-medium text-foreground">{it.title}</div>
                    <div className="text-xs text-muted-foreground">{it.room}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              The full program will be published here closer to the event.
            </p>
          )}
        </div>

        <Link
          to="/announcements"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 pl-7 card-elev transition-transform duration-200 hover:-translate-y-[3px] hover:border-primary/40"
        >
          <span className="ribbon absolute inset-y-0 left-0 w-1.5" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-foreground">Latest news</h2>
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-medium text-destructive-foreground">
              LIVE
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {ANNOUNCEMENTS.slice(0, 2).map((a) => (
              <div key={a.id}>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {a.when}
                </div>
                <div className="text-sm font-medium text-foreground group-hover:text-primary">
                  {a.title}
                </div>
              </div>
            ))}
          </div>
        </Link>
      </section>

      <div className="gold-rule my-10 h-px" />

      {/* Partners strip */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              Partners
            </div>
            <h2 className="font-display text-2xl text-foreground">
              Institutions powering {CONFERENCE.shortName}
            </h2>
          </div>
          <Link to="/partners" className="text-xs font-medium text-primary hover:underline">
            All partners →
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-5 card-elev transition-transform duration-200 hover:-translate-y-[3px]">
          {PARTNERS.slice(0, 12).map((p) => (
            <PartnerLogoThumb key={p.name} name={p.name} url={p.url} logo={p.logo} />
          ))}
          <Link
            to="/partners"
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            +{PARTNERS.length - 12} more <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>

      <div className="gold-rule my-10 h-px" />

      {/* Speakers preview */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              Speakers
            </div>
            <h2 className="font-display text-2xl text-foreground">
              Voices shaping {CONFERENCE.shortName}
            </h2>
          </div>
          <Link to="/speakers" className="text-xs font-medium text-primary hover:underline">
            All speakers →
          </Link>
        </div>
        {SPEAKERS.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPEAKERS.map((s) => (
              <article
                key={s.name}
                className="rounded-2xl border border-border bg-card p-5 card-elev transition-transform duration-200 hover:-translate-y-[3px]"
              >
                <div
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    s.accent === "primary"
                      ? "bg-primary text-primary-foreground"
                      : s.accent === "gold"
                        ? "bg-gold text-gold-foreground"
                        : "bg-forest text-forest-foreground"
                  }`}
                >
                  {s.role}
                </div>
                <div className="mt-3 font-display text-lg text-foreground">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.title}</div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-primary">
                  {s.session}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center card-elev">
            <p className="text-sm text-muted-foreground">
              The speaker lineup will be announced soon — check back closer to the event.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
