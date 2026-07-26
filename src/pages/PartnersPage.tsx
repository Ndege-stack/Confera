import { AppShell, PageHeader } from "@/components/AppShell";
import { CONFERENCE, PARTNERS, type PartnerCategory } from "@/data/conference";
import { faviconUrl, googleFaviconUrl, initialsOf } from "@/lib/partner-logo";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

const CATEGORIES: PartnerCategory[] = [
  "Government & Regulatory",
  "Technology & Private Sector",
  "Development & Global Partners",
];

export default function PartnersPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Partners"
        title={`Institutions powering ${CONFERENCE.shortName}`}
        subtitle="With gratitude to the government, private sector, and development partners standing with Kabarak University to advance innovation-led growth across Kenya and the region."
      />
      <div className="space-y-10">
        {CATEGORIES.map((category) => {
          const items = PARTNERS.filter((p) => p.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category}>
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-xl text-foreground sm:text-2xl">{category}</h2>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="gold-rule mb-5 mt-2 h-px" />
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 card-elev transition-transform duration-200 hover:-translate-y-[3px] hover:border-primary/40"
                  >
                    <PartnerLogo name={p.name} url={p.url} logo={p.logo} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 font-display text-lg text-foreground group-hover:text-primary">
                        {p.name}
                        <ExternalLink className="h-4 w-4 opacity-60" />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}

function PartnerLogo({ name, url, logo }: { name: string; url: string; logo?: string }) {
  const sources = [logo, googleFaviconUrl(url, 128), faviconUrl(url)].filter((s): s is string =>
    Boolean(s),
  );
  const [tier, setTier] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const src = sources[tier];

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5">
      {!loaded && (
        <div className="ribbon absolute inset-0 flex items-center justify-center font-display text-xl text-primary-foreground">
          {initialsOf(name)}
        </div>
      )}
      {src && (
        <img
          key={src}
          src={src}
          alt={name}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setTier((t) => t + 1);
          }}
          className={`h-full w-full object-contain ${loaded ? "" : "invisible"}`}
        />
      )}
    </div>
  );
}
