import type { RatingInput } from "./scoring";

export type ReviewEnergy =
  | "Calculated"
  | "Violent"
  | "Unstable"
  | "Scientifically objective"
  | "Late-night gas station energy";

const ENERGY_STYLES: Record<
  ReviewEnergy,
  { className: string; description: string }
> = {
  Calculated: {
    className: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
    description: "Low variance, controlled ratings",
  },
  Violent: {
    className: "border-red-500/50 bg-red-500/15 text-red-300",
    description: "Extreme highs and lows",
  },
  Unstable: {
    className: "border-purple-500/40 bg-purple-500/15 text-purple-200",
    description: "Wild score spread",
  },
  "Scientifically objective": {
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    description: "Balanced, methodical review",
  },
  "Late-night gas station energy": {
    className: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    description: "Chaotic comment + extreme ratings",
  },
};

function ratingValues(r: RatingInput): number[] {
  return [
    r.overall,
    r.taste,
    r.crunch,
    r.saltBalance,
    r.aftertaste,
    r.dustFactor,
    r.rebuyValue,
  ];
}

function variance(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
}

function hasExtremeRatings(values: number[]): boolean {
  return values.some((v) => v >= 9.5 || v <= 2);
}

export function getReviewEnergy(
  ratings: RatingInput,
  comment?: string | null,
): ReviewEnergy {
  const values = ratingValues(ratings);
  const var_ = variance(values);
  const commentLen = (comment ?? "").trim().length;
  const extremes = hasExtremeRatings(values);
  const spread = Math.max(...values) - Math.min(...values);

  if (commentLen > 120 && extremes) return "Late-night gas station energy";
  if (var_ > 4 || spread >= 5) return "Unstable";
  if (extremes && var_ > 2) return "Violent";
  if (var_ < 1.2 && spread <= 2.5) return "Scientifically objective";
  if (var_ < 2 && !extremes) return "Calculated";

  if (commentLen > 80) return "Late-night gas station energy";
  return "Calculated";
}

export function getReviewEnergyStyle(energy: ReviewEnergy) {
  return ENERGY_STYLES[energy];
}
