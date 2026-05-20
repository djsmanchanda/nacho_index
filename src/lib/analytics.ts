import type { Review } from "@/lib/db/schema";

export type BrandAverage = { brand: string; average: number; count: number };

export type AnalyticsSnapshot = {
  brandAverages: BrandAverage[];
  bestCrunch: Review | null;
  mostRebuyable: Review | null;
  worstAftertaste: Review | null;
  topRated: Review | null;
  totalReviews: number;
  globalAverage: number;
  scoreDistribution: { range: string; count: number }[];
};

export function computeAnalytics(reviews: Review[]): AnalyticsSnapshot {
  if (reviews.length === 0) {
    return {
      brandAverages: [],
      bestCrunch: null,
      mostRebuyable: null,
      worstAftertaste: null,
      topRated: null,
      totalReviews: 0,
      globalAverage: 0,
      scoreDistribution: [],
    };
  }

  const byBrand = new Map<string, { sum: number; count: number }>();
  for (const r of reviews) {
    const entry = byBrand.get(r.brand) ?? { sum: 0, count: 0 };
    entry.sum += r.weightedScore;
    entry.count += 1;
    byBrand.set(r.brand, entry);
  }

  const brandAverages: BrandAverage[] = [...byBrand.entries()]
    .map(([brand, { sum, count }]) => ({
      brand,
      average: Math.round((sum / count) * 100) / 100,
      count,
    }))
    .sort((a, b) => b.average - a.average);

  const pickMax = (key: keyof Review) =>
    [...reviews].sort((a, b) => (b[key] as number) - (a[key] as number))[0] ?? null;

  const pickClosestToIdeal = (key: keyof Review, ideal: number) =>
    [...reviews].sort(
      (a, b) => Math.abs((a[key] as number) - ideal) - Math.abs((b[key] as number) - ideal),
    )[0] ?? null;

  const pickMinAftertaste = () =>
    [...reviews].sort((a, b) => a.aftertaste - b.aftertaste)[0] ?? null;

  const globalAverage =
    Math.round(
      (reviews.reduce((s, r) => s + r.weightedScore, 0) / reviews.length) * 100,
    ) / 100;

  const buckets = [
    { range: "9–10", min: 9, max: 10 },
    { range: "8–9", min: 8, max: 9 },
    { range: "7–8", min: 7, max: 8 },
    { range: "6–7", min: 6, max: 7 },
    { range: "<6", min: 0, max: 6 },
  ];

  const scoreDistribution = buckets.map(({ range, min, max }) => ({
    range,
    count: reviews.filter((r) => {
      if (range === "<6") return r.weightedScore < 6;
      if (range === "9–10") return r.weightedScore >= min && r.weightedScore <= max;
      return r.weightedScore >= min && r.weightedScore < max;
    }).length,
  }));

  return {
    brandAverages,
    bestCrunch: pickClosestToIdeal("crunch", 10),
    mostRebuyable: pickMax("rebuyValue"),
    worstAftertaste: pickMinAftertaste(),
    topRated: pickMax("weightedScore"),
    totalReviews: reviews.length,
    globalAverage,
    scoreDistribution,
  };
}
