import { parseCsv } from "@/lib/csv";

export type ScaleDistribution = Record<"1" | "2" | "3" | "4" | "5", number>;

export type ScaleItem = {
  label: string;
  average: number;
  count: number;
  distribution: ScaleDistribution;
};

export type ChoiceItem = {
  label: string;
  count: number;
};

export type FeedbackChart =
  | {
      id: string;
      kind: "scale-grid";
      title: string;
      average: number;
      items: ScaleItem[];
    }
  | {
      id: string;
      kind: "scale-single";
      title: string;
      average: number;
      count: number;
      distribution: ScaleDistribution;
    }
  | {
      id: string;
      kind: "choice";
      title: string;
      choices: ChoiceItem[];
    }
  | {
      id: string;
      kind: "text";
      title: string;
      responseCount: number;
      samples: string[];
    };

export type FeedbackStats = {
  formTitle: string | null;
  totalResponses: number;
  overallAverage: number | null;
  charts: FeedbackChart[];
  updatedAt: string;
  source: "sheet" | "unavailable";
  message?: string;
};

type CacheEntry = { stats: FeedbackStats; expires: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 1000;

const EMPTY_DISTRIBUTION = (): ScaleDistribution => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match?.[1] ?? null;
}

function extractFormId(url: string): string | null {
  const match = url.match(/\/forms\/d\/e\/([^/]+)/);
  return match?.[1] ?? null;
}

export function toFeedbackEmbedUrl(formUrl: string): string {
  const formId = extractFormId(formUrl);
  if (!formId) return formUrl;
  return `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
}

function parseRating(value: string): number | null {
  const trimmed = value.trim();
  if (!/^[1-5]$/.test(trimmed)) return null;
  return Number(trimmed);
}

function parseHeader(header: string): { group: string; item: string } {
  const bracket = header.match(/^(.+?)\s*\[(.+)\]\s*$/);
  if (bracket) {
    return { group: bracket[1].trim(), item: bracket[2].trim() };
  }
  return { group: header.trim(), item: header.trim() };
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function classifyColumn(values: string[]): "scale" | "choice" | "text" {
  const nonEmpty = values.map((v) => v.trim()).filter(Boolean);
  if (nonEmpty.length === 0) return "text";

  const scaleHits = nonEmpty.filter((v) => parseRating(v) !== null).length;
  if (scaleHits / nonEmpty.length >= 0.7) return "scale";

  const unique = new Set(nonEmpty);
  if (unique.size <= 12 && unique.size <= Math.max(2, Math.ceil(nonEmpty.length * 0.6))) {
    return "choice";
  }

  return "text";
}

function buildScaleItem(label: string, values: string[]): ScaleItem {
  const distribution = EMPTY_DISTRIBUTION();
  let sum = 0;
  let count = 0;

  for (const value of values) {
    const rating = parseRating(value);
    if (rating === null) continue;
    sum += rating;
    count++;
    distribution[String(rating) as keyof ScaleDistribution]++;
  }

  return {
    label,
    average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
    count,
    distribution,
  };
}

function buildChoiceItems(values: string[]): ChoiceItem[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function emptyStats(message: string): FeedbackStats {
  return {
    formTitle: null,
    totalResponses: 0,
    overallAverage: null,
    charts: [],
    updatedAt: new Date().toISOString(),
    source: "unavailable",
    message,
  };
}

function computeStats(rows: string[][]): Omit<FeedbackStats, "formTitle"> {
  if (rows.length < 2) {
    return emptyStats("No responses recorded yet.");
  }

  const headers = rows[0];
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim()));

  const columns = headers
    .map((header, index) => ({ header: header.trim(), index }))
    .filter(({ header, index }) => index > 0 && header && !/^timestamp$/i.test(header));

  const scaleGroups = new Map<string, { title: string; items: ScaleItem[] }>();
  const charts: FeedbackChart[] = [];

  let ratingSum = 0;
  let ratingCount = 0;

  for (const { header, index } of columns) {
    const values = dataRows.map((row) => row[index] ?? "");
    const kind = classifyColumn(values);
    const { group, item } = parseHeader(header);

    if (kind === "scale") {
      const scaleItem = buildScaleItem(item, values);
      for (const rating of values) {
        const parsed = parseRating(rating);
        if (parsed !== null) {
          ratingSum += parsed;
          ratingCount++;
        }
      }

      const existing = scaleGroups.get(group);
      if (existing) {
        existing.items.push(scaleItem);
      } else {
        scaleGroups.set(group, { title: group, items: [scaleItem] });
      }
      continue;
    }

    if (kind === "choice") {
      const choices = buildChoiceItems(values);
      if (choices.length > 0) {
        charts.push({
          id: slugify(header),
          kind: "choice",
          title: header,
          choices,
        });
      }
      continue;
    }

    const samples = values
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(-3)
      .reverse();

    if (samples.length > 0) {
      charts.push({
        id: slugify(header),
        kind: "text",
        title: header,
        responseCount: values.filter((v) => v.trim()).length,
        samples,
      });
    }
  }

  for (const [group, { title, items }] of scaleGroups) {
    const activeItems = items.filter((item) => item.count > 0);
    if (activeItems.length === 0) continue;

    if (activeItems.length === 1) {
      const item = activeItems[0];
      charts.unshift({
        id: slugify(group),
        kind: "scale-single",
        title,
        average: item.average,
        count: item.count,
        distribution: item.distribution,
      });
      continue;
    }

    const groupSum = activeItems.reduce((sum, item) => sum + item.average * item.count, 0);
    const groupCount = activeItems.reduce((sum, item) => sum + item.count, 0);

    charts.unshift({
      id: slugify(group),
      kind: "scale-grid",
      title,
      average: groupCount > 0 ? Math.round((groupSum / groupCount) * 10) / 10 : 0,
      items: activeItems.sort((a, b) => b.average - a.average),
    });
  }

  return {
    totalResponses: dataRows.length,
    overallAverage: ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : null,
    charts,
    updatedAt: new Date().toISOString(),
    source: "sheet",
  };
}

async function fetchSheetCsv(spreadsheetId: string): Promise<string> {
  const urls = [
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`,
  ];

  let lastError: unknown;
  for (const url of urls) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (!response.ok) continue;
      const csv = await response.text();
      if (!csv.includes(",") || csv.startsWith("<!DOCTYPE")) continue;
      return csv;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Could not load responses spreadsheet");
}

export async function fetchFeedbackStats(
  formUrl: string,
  responsesSheetUrl: string,
  formTitle?: string | null,
): Promise<FeedbackStats> {
  const spreadsheetId = extractSpreadsheetId(responsesSheetUrl);
  if (!spreadsheetId) {
    return emptyStats(
      "Add the linked Google Sheets responses URL to enable live stats (Form → Responses → Link to Sheets, then share the sheet).",
    );
  }

  const cacheKey = `${formUrl}::${spreadsheetId}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.stats;

  try {
    const csv = await fetchSheetCsv(spreadsheetId);
    const stats: FeedbackStats = {
      ...computeStats(parseCsv(csv)),
      formTitle: formTitle ?? null,
    };
    cache.set(cacheKey, { stats, expires: Date.now() + CACHE_TTL_MS });
    return stats;
  } catch {
    return emptyStats(
      "Could not read the responses sheet. Ensure the form is linked to Google Sheets and the sheet is shared as “Anyone with the link can view”.",
    );
  }
}
