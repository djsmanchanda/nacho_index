"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import type { Review } from "@/lib/db/schema";
import { CrunchGraph } from "@/components/charts/crunch-graph";
import { RatingRadarChart } from "@/components/charts/radar-chart";
import { EnergyBadge } from "@/components/ui/energy-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTier } from "@/lib/tiers";
import { generateVerdictNarrative, resolveVerdictFromReview } from "@/lib/verdicts";
import { formatDate, parseTags } from "@/lib/utils";

export function ReviewDetail({ review, allReviews }: { review: Review; allReviews?: Review[] }) {
  const ratings = {
    overall: review.overall,
    taste: review.taste,
    crunch: review.crunch,
    saltBalance: review.saltBalance,
    aftertaste: review.aftertaste,
    dustFactor: review.dustFactor,
    rebuyValue: review.rebuyValue,
  };

  const verdict = resolveVerdictFromReview(review);
  const tier = getTier(review.weightedScore);
  const narrative = generateVerdictNarrative(
    ratings,
    review.weightedScore,
    review.brand,
    review.flavor,
    review.comment,
  );

  const breakdown = [
    { label: "Overall", value: review.overall },
    { label: "Taste", value: review.taste },
    { label: "Crunch", value: review.crunch },
    { label: "Salt Balance", value: review.saltBalance },
    { label: "Aftertaste", value: review.aftertaste },
    { label: "Dust Factor", value: review.dustFactor },
    { label: "Rebuy Value", value: review.rebuyValue },
  ];

  const derived = [
    { label: "Crunch Efficiency", value: review.crunchEfficiency },
    { label: "Grease Penalty", value: review.greasePenalty },
    { label: "Rebuy Index", value: review.rebuyIndex },
  ];

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-orange-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to leaderboard
      </Link>

      <div className="relative overflow-hidden rounded-3xl border border-white/10">
        <div className="relative h-56 sm:h-72">
          <Image
            src={review.imageUrl ?? "/placeholder-snack.svg"}
            alt={`${review.brand} ${review.flavor}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
        <div className="relative -mt-16 px-6 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={tier.className}>{tier.label}</Badge>
            <EnergyBadge ratings={ratings} comment={review.comment} />
          </div>
          <h1 className="mt-3 text-3xl font-bold text-zinc-50 sm:text-4xl">{review.brand}</h1>
          <p className="text-lg text-zinc-400">{review.flavor}</p>
          <div className="mt-4">
            <TierBadge score={review.weightedScore} size="lg" className="items-start" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-amber-200/90">{verdict}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(review.createdAt)}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {parseTags(review.tags).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rating radar</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingRadarChart ratings={ratings} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI verdict</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-zinc-300">{narrative}</p>
              {review.comment && (
                <div className="mt-4 space-y-2">
                  <EnergyBadge ratings={ratings} comment={review.comment} />
                  <p className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm italic text-zinc-400">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Derived stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              {derived.map((d) => (
                <div
                  key={d.label}
                  className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-center"
                >
                  <p className="text-lg font-bold text-orange-200">{d.value.toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500">{d.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {allReviews && allReviews.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Crunch vs taste (corpus)</CardTitle>
          </CardHeader>
          <CardContent>
            <CrunchGraph reviews={allReviews} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {breakdown.map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">{item.value.toFixed(1)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
