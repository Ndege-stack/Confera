import { AppShell, PageHeader } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { loadProfile, saveProfile, clearProfile, profileToCsv, type Profile } from "@/lib/profile";
import { Camera, Download, Trash2, CheckCircle2, BadgeCheck } from "lucide-react";

export default function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setP(loadProfile());
  }, []);

  if (!p)
    return (
      <AppShell>
        <div className="h-40" />
      </AppShell>
    );

  const update = <K extends keyof Profile>(k: K, v: Profile[K]) => setP({ ...p, [k]: v });

  const onPhoto = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", String(reader.result));
    reader.readAsDataURL(f);
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onCheckIn = () => {
    const next = {
      ...p,
      checkedIn: !p.checkedIn,
      checkedInAt: !p.checkedIn ? new Date().toISOString() : undefined,
    };
    setP(next);
    saveProfile(next);
  };

  const onExport = () => {
    const blob = new Blob([profileToCsv(p)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(p.name || "ahc2026-profile").replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onClear = () => {
    if (!confirm("Clear your saved profile from this device?")) return;
    clearProfile();
    setP(loadProfile());
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Profile & Bio"
        title="Your conference identity"
        subtitle="Saved locally on this device. Upload a photo, write your bio, and check in when you arrive at the venue."
      />

      <form onSubmit={onSave} className="grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* Photo + Check-in */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 card-elev transition-transform duration-200 hover:-translate-y-[3px]">
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-muted">
              {p.photo ? (
                <img src={p.photo} alt={p.name || "You"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl">🧑‍⚕️</div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              <Camera className="h-4 w-4" /> Upload photo
            </button>
            {p.photo && (
              <button
                type="button"
                onClick={() => update("photo", "")}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground hover:text-destructive"
              >
                Remove photo
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onCheckIn}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-medium card-elev transition-transform duration-200 hover:-translate-y-[3px] ${
              p.checkedIn
                ? "border-forest bg-forest text-forest-foreground"
                : "border-gold bg-gold text-gold-foreground hover:opacity-95"
            }`}
          >
            <BadgeCheck className="h-5 w-5" />
            {p.checkedIn ? "Checked in ✓" : "Check in to conference"}
          </button>
          {p.checkedIn && p.checkedInAt && (
            <div className="text-center text-[11px] uppercase tracking-wider text-muted-foreground">
              {new Date(p.checkedInAt).toLocaleString()}
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6 card-elev transition-transform duration-200 hover:-translate-y-[3px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={p.name}
              onChange={(v) => update("name", v)}
              placeholder="e.g. Dr. Jane Doe"
            />
            <Field
              label="Email"
              type="email"
              value={p.email}
              onChange={(v) => update("email", v)}
              placeholder="you@institution.ac.ke"
            />
            <Field
              label="Phone"
              value={p.phone}
              onChange={(v) => update("phone", v)}
              placeholder="+254 7…"
            />
            <Field
              label="Institution"
              value={p.institution}
              onChange={(v) => update("institution", v)}
              placeholder="Kabarak University"
            />
            <SelectField
              label="Role"
              value={p.role}
              onChange={(v) => update("role", v)}
              options={[
                "Delegate",
                "Speaker / Presenter",
                "Student",
                "Faculty",
                "Partner",
                "Organizer",
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Bio
            </label>
            <textarea
              value={p.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={5}
              placeholder="A short professional bio that other attendees will see…"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              Save profile
            </button>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-primary/40"
            >
              <Download className="h-4 w-4" /> Export as .csv
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-destructive/50 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" /> Clear
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-forest">
                <CheckCircle2 className="h-4 w-4" /> Saved on this device
              </span>
            )}
          </div>
        </div>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "— Select —"}
          </option>
        ))}
      </select>
    </div>
  );
}
