import type { RatingInput } from "./scoring";
import { getReviewEnergy } from "./review-energy";

type VerdictRule = {
  test: (r: RatingInput, weighted: number) => boolean;
  line: string;
};

const VERDICT_RULES: VerdictRule[] = [
  {
    test: (r) => r.crunch > 9 && r.taste > 8,
    line: "Structurally elite",
  },
  {
    test: (r) => r.crunch >= 8.5,
    line: "Scientifically crunchy",
  },
  {
    test: (r) => r.aftertaste < 4,
    line: "Chemical warfare finish",
  },
  {
    test: (r) => r.rebuyValue > 8,
    line: "Financially dangerous",
  },
  {
    test: (r) => r.rebuyValue >= 9,
    line: "Rebuy impulse: activated",
  },
  {
    test: (r) => r.saltBalance >= 8.5,
    line: "Salt attack",
  },
  {
    test: (r) => r.saltBalance <= 3,
    line: "Low-salt tragedy",
  },
  {
    test: (r) => r.dustFactor >= 8,
    line: "Dust cloud deployment successful",
  },
  {
    test: (r) => r.crunch >= 9 && r.dustFactor <= 4,
    line: "Crunch-to-noise ratio: illegal",
  },
  {
    test: (r) => r.taste >= 8.5 && r.crunch < 6.5,
    line: "Flavor bomb, weak structure",
  },
  {
    test: (r) => r.crunch >= 8 && r.taste < 6.5,
    line: "High crunch, low flavor",
  },
  {
    test: (_, w) => w >= 9.5,
    line: "Lab-certified snack excellence",
  },
  {
    test: (_, w) => w <= 5,
    line: "Structural integrity questionable",
  },
  {
    test: (r) => r.aftertaste >= 8.5,
    line: "Aftertaste haunts pleasantly",
  },
  {
    test: (r) => r.overall >= 6 && r.overall <= 7.2,
    line: "Mid-tier masquerading as elite",
  },
  {
    test: (r) => r.overall >= 7.5 && r.rebuyValue >= 8,
    line: "Dangerously addictive",
  },
  {
    test: (r) => r.overall >= 7 && r.overall < 8,
    line: "Elite gas station engineering",
  },
];

const FALLBACK_LINES = [
  "Flavor profile: unhinged",
  "Snack tribunal approved",
  "Crunch metrics inconclusive",
  "Flavor balance: chaotic good",
] as const;

function hashPick<T>(items: T[], seed: number): T {
  const idx = Math.abs(Math.floor(seed)) % items.length;
  return items[idx]!;
}

/** Layered verdict: combine 1-3 matching lines */
export function generateVerdict(ratings: RatingInput, weighted: number): string {
  const matched = VERDICT_RULES.filter((rule) => rule.test(ratings, weighted)).map(
    (r) => r.line,
  );

  if (matched.length === 0) {
    const fallback = hashPick(
      [...FALLBACK_LINES],
      weighted * 10 + ratings.taste + ratings.crunch,
    );
    return fallback;
  }

  const seed = weighted * 100 + ratings.crunch * 7 + ratings.taste * 3;
  const count = Math.min(matched.length, matched.length >= 3 ? 3 : matched.length >= 2 ? 2 : 1);

  const selected: string[] = [];
  const pool = [...matched];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = hashPick(
      pool.map((_, j) => j),
      seed + i * 17,
    );
    selected.push(pool.splice(idx, 1)[0]!);
  }

  return selected.join(". ") + (selected.length > 1 ? "." : "");
}

export function generateTags(ratings: RatingInput): string[] {
  const tags: string[] = [];

  if (ratings.crunch >= 8) tags.push("high-crunch");
  if (ratings.dustFactor >= 7) tags.push("dusty");
  if (ratings.rebuyValue >= 8) tags.push("rebuy");
  if (ratings.saltBalance >= 8) tags.push("salty");
  if (ratings.aftertaste <= 4) tags.push("rough-finish");
  if (ratings.taste >= 8.5) tags.push("flavor-king");
  if (ratings.overall >= 9) tags.push("elite");
  if (ratings.crunch >= 8 && ratings.taste < 6.5) tags.push("crunch-trap");
  if (ratings.taste >= 8 && ratings.crunch < 6.5) tags.push("flavor-bomb");

  return tags.slice(0, 5);
}

export function generateVerdictNarrative(
  ratings: RatingInput,
  weighted: number,
  brand: string,
  flavor: string,
  comment?: string | null,
): string {
  const verdict = generateVerdict(ratings, weighted);
  const energy = getReviewEnergy(ratings, comment);

  const crunchNote =
    ratings.crunch >= 8
      ? "The crunch profile registers as structurally dominant."
      : "Crunch metrics sit in a moderate band - acceptable but not legendary.";
  const tasteNote =
    ratings.taste >= 8
      ? "Flavor quality carries the profile with a clear snack identity."
      : "Flavor quality leaves room for a sharper snack identity.";
  const rebuyNote =
    ratings.rebuyValue >= 8
      ? "Rebuy probability exceeds lab safety thresholds."
      : "Purchase intent remains cautious pending further trials.";

  return `${brand} ${flavor} - ${verdict} Review energy: ${energy}. Weighted index: ${weighted.toFixed(2)}/10. ${crunchNote} ${tasteNote} ${rebuyNote}`;
}

/** Resolve display verdict from stored review (recomputed for layered engine) */
export function resolveVerdictFromReview(review: {
  overall: number;
  taste: number;
  crunch: number;
  saltBalance: number;
  aftertaste: number;
  dustFactor: number;
  rebuyValue: number;
  weightedScore: number;
}): string {
  return generateVerdict(
    {
      overall: review.overall,
      taste: review.taste,
      crunch: review.crunch,
      saltBalance: review.saltBalance,
      aftertaste: review.aftertaste,
      dustFactor: review.dustFactor,
      rebuyValue: review.rebuyValue,
    },
    review.weightedScore,
  );
}
