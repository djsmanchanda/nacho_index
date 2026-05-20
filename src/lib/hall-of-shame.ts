import type { Review } from "@/lib/db/schema";

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

  const saltOverloadRaw = pickMax((r) => r.saltBalance);
  const saltOverload = saltOverloadRaw && saltOverloadRaw.saltBalance > 10 ? saltOverloadRaw : null;

  const dustOverloadRaw = pickMax((r) => r.dustFactor);
  const dustOverload = dustOverloadRaw && dustOverloadRaw.dustFactor > 10 ? dustOverloadRaw : null;

  const crunchOverloadRaw = pickMax((r) => r.crunch);
  const crunchOverload = crunchOverloadRaw && crunchOverloadRaw.crunch > 10 ? crunchOverloadRaw : null;

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
      title: "Salt Overload",
      subtitle: "Sodium incident report",
      review: saltOverload,
      metric: saltOverload ? `${saltOverload.saltBalance.toFixed(1)}/13` : "-",
      icon: "salt",
    },
    {
      id: "crunch",
      title: "Crunch Overload",
      subtitle: "Jaw fatigue threshold breached",
      review: crunchOverload,
      metric: crunchOverload ? `${crunchOverload.crunch.toFixed(1)}/13` : "-",
      icon: "crunch",
    },
    {
      id: "dust",
      title: "Dust Overload",
      subtitle: "Powder cloud incident",
      review: dustOverload,
      metric: dustOverload ? `${dustOverload.dustFactor.toFixed(1)}/13` : "-",
      icon: "dust",
    },
  ];
}
