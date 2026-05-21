"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, Medal, Sparkles } from "lucide-react";
import type { Review } from "@/lib/db/schema";
import { EnergyBadge } from "@/components/ui/energy-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { Badge } from "@/components/ui/badge";
import { getTier } from "@/lib/tiers";
import { resolveVerdictFromReview } from "@/lib/verdicts";
import { cn, parseTags } from "@/lib/utils";

const podiumOrder = [1, 0, 2] as const;
const rankStyles = [
  { ring: "ring-amber-400/60", glow: "shadow-amber-500/30", height: "md:-mt-6 md:scale-110" },
  { ring: "ring-zinc-400/40", glow: "shadow-zinc-500/20", height: "" },
  { ring: "ring-amber-700/40", glow: "shadow-amber-900/30", height: "md:mt-2" },
];

export function Podium({ topThree }: { topThree: Review[] }) {
  if (topThree.length === 0) return null;

  const slots = podiumOrder.map((i) => topThree[i]).filter(Boolean) as Review[];

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400/90">
          Top 3 — Podium
        </h2>
      </div>
      <div className="grid items-end gap-4 md:grid-cols-3">
        {slots.map((review, displayIndex) => {
          const rank = topThree.indexOf(review) + 1;
          const isFirst = rank === 1;
          const style = rankStyles[rank - 1] ?? rankStyles[1];
          const tier = getTier(review.weightedScore);
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
              key={review.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-amber-500/30 hover:bg-white/[0.06]",
                style.height,
                isFirst && "z-10 border-amber-400/25 shadow-[0_0_25px_rgba(251,191,36,0.08)]",
              )}
            >
              {/* Stationary cyber grid & ambient lighting */}
              <div
                className={cn(
                  "absolute inset-0 opacity-40 pointer-events-none",
                  isFirst
                    ? "bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent"
                    : "bg-gradient-to-b from-white/5 to-transparent",
                )}
              />
              <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />
              
              <div className="relative h-full w-full">
                <Link href={`/review/${review.id}`} className="relative block">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex w-full justify-center">
                      <div className="flex flex-col items-center gap-1">
                      <Badge variant={isFirst ? "default" : "secondary"} className="text-xs font-mono">
                        #{rank}
                      </Badge>
                      <span className={cn(
                        "text-[8px] font-mono tracking-widest uppercase px-1 py-0.5 rounded border leading-none mt-1",
                        isFirst 
                          ? "text-amber-400 border-amber-400/20 bg-amber-400/5 animate-pulse" 
                          : "text-zinc-500 border-zinc-500/15 bg-zinc-500/5"
                      )}>
                        {isFirst ? "ELITE" : "STABLE"}
                      </span>
                      </div>
                    </div>
                    {isFirst ? (
                      <Crown className="absolute right-0 top-0 h-6 w-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    ) : (
                      <Medal className="absolute right-0 top-0 h-5 w-5 text-zinc-500" />
                    )}
                  </div>

                  <div className="mt-5 flex flex-col items-center text-center">
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-2xl border-2 ring-4 transition group-hover:scale-105",
                        isFirst ? "h-32 w-32" : "h-24 w-24",
                        style.ring,
                        style.glow,
                        "shadow-2xl",
                      )}
                    >
                      <Image
                        src={review.imageUrl ?? "/placeholder-snack.svg"}
                        alt={`${review.brand} ${review.flavor}`}
                        fill
                        className="object-cover"
                        sizes={isFirst ? "128px" : "96px"}
                      />
                      {/* Sci-fi scanner laser overlay */}
                      <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-amber-500/35 to-transparent scanner-beam pointer-events-none" />
                      
                      <div
                        className={cn(
                          "absolute bottom-0 left-0 right-0 overflow-hidden py-1 text-center text-[9px] font-bold uppercase tracking-wider z-10",
                          tier.className,
                        )}
                      >
                        <span className="absolute inset-0 bg-black/40 pointer-events-none" />
                        <span className="relative z-10 text-white">{tier.label}</span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-bold text-zinc-50">{review.brand}</h3>
                    <p className="text-sm text-zinc-400">{review.flavor}</p>

                    <div className="mt-3 flex w-full justify-center">
                      <TierBadge
                        score={review.weightedScore}
                        size={isFirst ? "lg" : "md"}
                        className="items-center text-center"
                      />
                    </div>

                    <EnergyBadge
                      ratings={ratings}
                      comment={review.comment}
                      className="mt-3"
                    />

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-amber-200/90 font-medium">
                      {verdict}
                    </p>

                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {parseTags(review.tags).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
