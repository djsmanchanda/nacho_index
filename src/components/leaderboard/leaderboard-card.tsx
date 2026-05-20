"use client";

import Image from "next/image";
import Link from "next/link";
import type { Review } from "@/lib/db/schema";
import { EnergyBadge } from "@/components/ui/energy-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { Badge } from "@/components/ui/badge";
import { resolveVerdictFromReview } from "@/lib/verdicts";
import { parseTags } from "@/lib/utils";

export function LeaderboardCard({ review, rank }: { review: Review; rank: number }) {
  const tags = parseTags(review.tags);
  const verdict = resolveVerdictFromReview(review);
  const ratings = {
    overall: review.overall,
    taste: review.taste,
    crunch: review.crunch,
    saltBalance: review.saltBalance,
    aftertaste: review.aftertaste,
    dustFactor: review.dustFactor,
    rebuyValue: review.rebuyValue,
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/25 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(249,115,22,0.03)]"
    >
      {/* Background cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />
      
      <Link href={`/review/${review.id}`} className="flex gap-4 relative">
        <div className="flex w-12 shrink-0 flex-col items-center justify-center border-r border-white/5 pr-4">
          <span className="font-mono text-2xl font-bold tracking-tighter text-zinc-600 transition-all duration-300 group-hover:text-orange-400 group-hover:text-glow-orange">
            {String(rank).padStart(2, "0")}
          </span>
          <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-widest mt-1 scale-90 group-hover:text-orange-500/50">
            SPEC_ID
          </span>
        </div>
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
          <Image
            src={review.imageUrl ?? "/placeholder-snack.svg"}
            alt={`${review.brand} ${review.flavor}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="80px"
          />
          {/* Active diagnostic scanner-beam */}
          <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent scanner-beam opacity-30 group-hover:opacity-100 group-hover:via-orange-500/40 transition-all duration-300 pointer-events-none" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-zinc-50 group-hover:text-orange-300 transition duration-200">{review.brand}</h3>
              <p className="text-sm text-zinc-400">{review.flavor}</p>
            </div>
            <TierBadge score={review.weightedScore} size="sm" />
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-amber-200/80 leading-relaxed font-medium">{verdict}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <EnergyBadge ratings={ratings} comment={review.comment} />
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
