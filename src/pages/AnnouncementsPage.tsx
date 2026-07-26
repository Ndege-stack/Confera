import { AppShell, PageHeader } from "@/components/AppShell";
import { ANNOUNCEMENTS } from "@/data/conference";
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";

export default function AnnouncementsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Announcements"
        title="Live conference updates"
        subtitle="The latest from the organizing committee — pinned in chronological order."
      />
      <div className="space-y-3">
        {ANNOUNCEMENTS.map((a) => {
          const Icon =
            a.level === "urgent" ? AlertTriangle : a.level === "success" ? CheckCircle2 : Bell;
          const tone =
            a.level === "urgent"
              ? "bg-destructive text-destructive-foreground"
              : a.level === "success"
                ? "bg-forest text-forest-foreground"
                : "bg-primary text-primary-foreground";
          return (
            <article
              key={a.id}
              className="relative flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 card-elev transition-transform duration-200 hover:-translate-y-[3px]"
            >
              {a.level === "urgent" && (
                <span className="absolute inset-y-0 left-0 w-1.5 bg-destructive" />
              )}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {a.when}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tone}`}
                  >
                    {a.level}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-lg text-foreground">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">{a.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
