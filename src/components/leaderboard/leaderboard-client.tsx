"use client";

import { useMemo, useState } from "react";
import type { Review } from "@/lib/db/schema";
import { LeaderboardCard } from "./leaderboard-card";
import { LeaderboardFilters, type SortOption } from "./leaderboard-filters";
import { HallOfShame } from "./hall-of-shame";
import { Podium } from "./podium";
import { CrunchGraphSection } from "./crunch-graph-section";
import { TierLegend } from "./tier-legend";

export function LeaderboardClient({ reviews }: { reviews: Review[] }) {
  const [sort, setSort] = useState<SortOption>("score-desc");
  const [brandFilter, setBrandFilter] = useState<string>("all");

  const brands = useMemo(
    () => [...new Set(reviews.map((r) => r.brand))].sort(),
    [reviews],
  );

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (brandFilter !== "all") {
      list = list.filter((r) => r.brand === brandFilter);
    }
    switch (sort) {
      case "score-asc":
        return list.sort((a, b) => a.weightedScore - b.weightedScore);
      case "newest":
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "brand":
        return list.sort((a, b) => a.brand.localeCompare(b.brand));
      default:
        return list.sort((a, b) => b.weightedScore - a.weightedScore);
    }
  }, [reviews, sort, brandFilter]);

  const isStandardRank = sort === "score-desc" && brandFilter === "all";

  const topThree = isStandardRank ? filtered.slice(0, 3) : [];
  const rest = isStandardRank ? filtered.slice(3) : filtered;
  const listStartIndex = isStandardRank ? 4 : 1;

  return (
    <>
      <TierLegend />
      <Podium topThree={topThree} />
      <CrunchGraphSection reviews={reviews} />
      <HallOfShame reviews={reviews} />
      <LeaderboardFilters
        brands={brands}
        sort={sort}
        brandFilter={brandFilter}
        onSortChange={setSort}
        onBrandChange={setBrandFilter}
      />
      <div className="space-y-3">
        {rest.map((review, i) => (
          <LeaderboardCard key={review.id} review={review} rank={i + listStartIndex} />
        ))}
      </div>
    </>
  );
}
