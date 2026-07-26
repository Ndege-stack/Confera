export type Profile = {
  name: string;
  email: string;
  phone: string;
  institution: string;
  role: string;
  bio: string;
  photo: string; // data URL
  checkedIn: boolean;
  checkedInAt?: string;
};

const KEY = "ahc2026.profile";

export const emptyProfile: Profile = {
  name: "",
  email: "",
  phone: "",
  institution: "",
  role: "Delegate",
  bio: "",
  photo: "",
  checkedIn: false,
};

export function loadProfile(): Profile {
  if (typeof window === "undefined") return emptyProfile;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyProfile, ...JSON.parse(raw) } : emptyProfile;
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export function profileToCsv(p: Profile): string {
  const fields: (keyof Profile)[] = ["name", "email", "phone", "institution", "role", "bio", "checkedIn", "checkedInAt"];
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const header = fields.join(",");
  const row = fields.map((f) => esc(p[f])).join(",");
  return `${header}\n${row}\n`;
}

// Per-speaker profile overrides keyed by speaker name
const SPK_KEY = "ahc2026.speakerProfiles";

export type SpeakerOverride = {
  bio?: string;
  photo?: string; // data URL
  claimedEmail?: string;
};

export function loadSpeakerOverrides(): Record<string, SpeakerOverride> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(SPK_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveSpeakerOverride(name: string, patch: SpeakerOverride) {
  const all = loadSpeakerOverrides();
  all[name] = { ...all[name], ...patch };
  localStorage.setItem(SPK_KEY, JSON.stringify(all));
}
