import type { Review } from "@/lib/db/schema";
import { distanceFromPerfect } from "@/lib/scoring";

export type ShameCategory = {
  id: string;
  title: string;
  subtitle: string;
  review: Review | null;
  metric: string;
  icon: "skull" | "salt" | "dust" | "crunch" | "disappoint";
};

export function computeHallOfShame(reviews: Review[]): ShameCategory[] {
  if (reviews.length === 0) return [];

  const pickMin = (fn: (r: Review) => number) =>
    [...reviews].sort((a, b) => fn(a) - fn(b))[0] ?? null;

  const pickMax = (fn: (r: Review) => number) =>
    [...reviews].sort((a, b) => fn(b) - fn(a))[0] ?? null;

  const worstAftertasteRaw = pickMin((r) => r.aftertaste);
  const worstAftertaste = worstAftertasteRaw && worstAftertasteRaw.aftertaste < 5 ? worstAftertasteRaw : null;

  const saltOverloadRaw = pickMax((r) => distanceFromPerfect(r.saltBalance));
  const saltOverload = saltOverloadRaw && distanceFromPerfect(saltOverloadRaw.saltBalance) > 0 ? saltOverloadRaw : null;

  const dustOverloadRaw = pickMax((r) => distanceFromPerfect(r.dustFactor));
  const dustOverload = dustOverloadRaw && distanceFromPerfect(dustOverloadRaw.dustFactor) > 0 ? dustOverloadRaw : null;

  const crunchOverloadRaw = pickMax((r) => distanceFromPerfect(r.crunch));
  const crunchOverload = crunchOverloadRaw && distanceFromPerfect(crunchOverloadRaw.crunch) > 0 ? crunchOverloadRaw : null;

  const mostDisappointingRaw = pickMax((r) => r.overall - r.weightedScore);
  const mostDisappointing =
    mostDisappointingRaw && mostDisappointingRaw.overall - mostDisappointingRaw.weightedScore >= 1
      ? mostDisappointingRaw
      : null;

  return [
    {
      id: "aftertaste",
      title: "Worst Aftertaste",
      subtitle: "Chemical warfare finish",
      review: worstAftertaste,
      metric: worstAftertaste ? `${worstAftertaste.aftertaste.toFixed(1)}/10` : "-",
      icon: "skull",
    },
    {
      id: "disappointing",
      title: "Most Disappointing",
      subtitle: "Hype exceeded reality",
      review: mostDisappointing,
      metric: mostDisappointing
        ? `-${(mostDisappointing.overall - mostDisappointing.weightedScore).toFixed(1)} gap`
        : "-",
      icon: "disappoint",
    },
    {
      id: "salt",
      title: "Salt Imbalance",
      subtitle: "Farthest from ideal 10",
      review: saltOverload,
      metric: saltOverload
        ? `${distanceFromPerfect(saltOverload.saltBalance).toFixed(1)} gap`
        : "-",
      icon: "salt",
    },
    {
      id: "crunch",
      title: "Crunch Imbalance",
      subtitle: "Farthest from ideal 10",
      review: crunchOverload,
      metric: crunchOverload
        ? `${distanceFromPerfect(crunchOverload.crunch).toFixed(1)} gap`
        : "-",
      icon: "crunch",
    },
    {
      id: "dust",
      title: "Dust Imbalance",
      subtitle: "Farthest from ideal 10",
      review: dustOverload,
      metric: dustOverload
        ? `${distanceFromPerfect(dustOverload.dustFactor).toFixed(1)} gap`
        : "-",
      icon: "dust",
    },
  ];
}
