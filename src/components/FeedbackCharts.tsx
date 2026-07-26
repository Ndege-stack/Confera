import type { ChoiceItem, FeedbackChart, ScaleDistribution } from "@/lib/feedback.server";

const RATING_LABELS: Record<keyof ScaleDistribution, string> = {
  5: "Excellent",
  4: "Good",
  3: "Satisfactory",
  2: "Poor",
  1: "Very poor",
};

const CHART_COLORS = [
  "bg-primary",
  "bg-gold",
  "bg-forest",
  "bg-primary/80",
  "bg-gold/80",
  "bg-forest/80",
];

export function FeedbackChartCard({ chart }: { chart: FeedbackChart }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 card-elev">
      {chart.kind === "scale-grid" && <ScaleGridChart chart={chart} />}
      {chart.kind === "scale-single" && <SingleScaleChart chart={chart} />}
      {chart.kind === "choice" && <ChoiceChart chart={chart} />}
      {chart.kind === "text" && <TextChart chart={chart} />}
    </article>
  );
}

function ScaleGridChart({
  chart,
}: {
  chart: Extract<FeedbackChart, { kind: "scale-grid" }>;
}) {
  const maxAvg = Math.max(...chart.items.map((item) => item.average), 1);

  return (
    <>
      <ChartHeader title={chart.title} subtitle={`Group average ${chart.average}/5`} />
      <ul className="mt-4 space-y-3">
        {chart.items.map((item, index) => (
          <li key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground/90">{item.label}</span>
              <span className="font-medium text-foreground">{item.average}/5</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${CHART_COLORS[index % CHART_COLORS.length]}`}
                style={{ width: `${(item.average / maxAvg) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function SingleScaleChart({
  chart,
}: {
  chart: Extract<FeedbackChart, { kind: "scale-single" }>;
}) {
  return (
    <>
      <ChartHeader title={chart.title} subtitle={`Average ${chart.average}/5 · ${chart.count} ratings`} />
      <DistributionBars distribution={chart.distribution} className="mt-4" />
    </>
  );
}

function ChoiceChart({
  chart,
}: {
  chart: Extract<FeedbackChart, { kind: "choice" }>;
}) {
  const max = Math.max(...chart.choices.map((choice) => choice.count), 1);

  return (
    <>
      <ChartHeader title={chart.title} subtitle={`${chart.choices.reduce((sum, c) => sum + c.count, 0)} responses`} />
      <ul className="mt-4 space-y-2.5">
        {chart.choices.map((choice, index) => (
          <li key={choice.label}>
            <ChoiceBar choice={choice} max={max} colorClass={CHART_COLORS[index % CHART_COLORS.length]} />
          </li>
        ))}
      </ul>
    </>
  );
}

function TextChart({
  chart,
}: {
  chart: Extract<FeedbackChart, { kind: "text" }>;
}) {
  return (
    <>
      <ChartHeader title={chart.title} subtitle={`${chart.responseCount} written responses`} />
      <ul className="mt-4 space-y-3">
        {chart.samples.map((sample) => (
          <li
            key={sample}
            className="rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm leading-relaxed text-foreground/85"
          >
            “{sample}”
          </li>
        ))}
      </ul>
    </>
  );
}

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h3 className="font-display text-base text-foreground">{title}</h3>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function DistributionBars({
  distribution,
  className = "",
}: {
  distribution: ScaleDistribution;
  className?: string;
}) {
  const max = Math.max(...Object.values(distribution), 1);

  return (
    <ul className={`space-y-2 ${className}`}>
      {(["5", "4", "3", "2", "1"] as const).map((score) => (
        <li key={score}>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>
              {score} — {RATING_LABELS[score]}
            </span>
            <span>{distribution[score]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${(distribution[score] / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ChoiceBar({
  choice,
  max,
  colorClass,
}: {
  choice: ChoiceItem;
  max: number;
  colorClass: string;
}) {
  return (
    <>
      <div className="mb-1 flex justify-between gap-3 text-xs">
        <span className="text-foreground/90">{choice.label}</span>
        <span className="text-muted-foreground">{choice.count}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${(choice.count / max) * 100}%` }}
        />
      </div>
    </>
  );
}