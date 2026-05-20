export const SCORE_WEIGHTS = {
  overall: 0.25,
  taste: 0.35,
  crunch: 0.15,
  aftertaste: 0.1,
  rebuyValue: 0.1,
  saltBalance: 0.05,
} as const;

export type RatingInput = {
  overall: number;
  taste: number;
  crunch: number;
  saltBalance: number;
  aftertaste: number;
  dustFactor: number;
  rebuyValue: number;
};

const OVERLOAD_LIMIT = 13;
const IDEAL_PEAK = 10;

export function isOverloadRating(key: keyof RatingInput): boolean {
  return key === "crunch" || key === "saltBalance" || key === "dustFactor";
}

export function maxRatingFor(key: keyof RatingInput): number {
  return isOverloadRating(key) ? OVERLOAD_LIMIT : IDEAL_PEAK;
}

export function peakAdjustedRating(value: number): number {
  if (value <= IDEAL_PEAK) return value;
  return Math.max(0, IDEAL_PEAK - (value - IDEAL_PEAK) * 2);
}

export function calculateWeightedScore(ratings: RatingInput): number {
  const crunchScore = peakAdjustedRating(ratings.crunch);
  const saltBalanceScore = peakAdjustedRating(ratings.saltBalance);
  const dustOverloadPenalty = Math.max(0, ratings.dustFactor - IDEAL_PEAK) * 0.15;
  const score =
    ratings.overall * SCORE_WEIGHTS.overall +
    ratings.taste * SCORE_WEIGHTS.taste +
    crunchScore * SCORE_WEIGHTS.crunch +
    ratings.aftertaste * SCORE_WEIGHTS.aftertaste +
    ratings.rebuyValue * SCORE_WEIGHTS.rebuyValue +
    saltBalanceScore * SCORE_WEIGHTS.saltBalance -
    dustOverloadPenalty;

  return Math.max(0, Math.round(score * 100) / 100);
}

/** Crunch per unit of mess — higher dust lowers efficiency */
export function crunchEfficiency(crunch: number, dustFactor: number): number {
  const overloadPenalty = Math.max(0, crunch - IDEAL_PEAK) * 0.4;
  return Math.round(((peakAdjustedRating(crunch) - overloadPenalty) / (1 + dustFactor * 0.35)) * 100) / 100;
}

/** Finger-grease / powder tax */
export function greasePenalty(dustFactor: number, aftertaste: number): number {
  const dustScore = peakAdjustedRating(dustFactor);
  const dustOverload = Math.max(0, dustFactor - IDEAL_PEAK);
  return Math.round(((dustScore * 0.6 + dustOverload * 1.1) + (10 - aftertaste) * 0.15) * 100) / 100;
}

/** Composite purchase intent */
export function rebuyIndex(rebuyValue: number, taste: number, overall: number): number {
  return Math.round((rebuyValue * 0.5 + taste * 0.3 + overall * 0.2) * 100) / 100;
}

export function ratingCategories(ratings: RatingInput) {
  return [
    { key: "overall", label: "Overall", value: ratings.overall },
    { key: "taste", label: "Taste", value: ratings.taste },
    { key: "crunch", label: "Crunch", value: ratings.crunch },
    { key: "saltBalance", label: "Salt Balance", value: ratings.saltBalance },
    { key: "aftertaste", label: "Aftertaste", value: ratings.aftertaste },
    { key: "dustFactor", label: "Dust Factor", value: ratings.dustFactor },
    { key: "rebuyValue", label: "Rebuy Value", value: ratings.rebuyValue },
  ];
}
