"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Frown, Skull, Zap } from "lucide-react";
import type { Review } from "@/lib/db/schema";
import { computeHallOfShame, type ShameCategory } from "@/lib/hall-of-shame";
import { TierBadge } from "@/components/ui/tier-badge";

const ICONS = {
  skull: Skull,
  salt: Zap,
  dust: AlertTriangle,
  disappoint: Frown,
};

function ShameCard({ category }: { category: ShameCategory }) {
  const Icon = ICONS[category.icon];
  const review = category.review;
  if (!review) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/15 via-zinc-950/95 to-red-950/5 p-4 backdrop-blur-xl transition duration-300 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.06)] animate-hazard-glow"
    >
      {/* Industrial Caution Striped Top Ribbon */}
      <div className="absolute top-0 inset-x-0 h-1 hazard-stripes opacity-60 pointer-events-none" />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-[0.02] pointer-events-none" />
      
      <Link href={`/review/${review.id}`} className="relative block">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/25 group-hover:bg-red-500/20 transition duration-300">
              <Icon className="h-4.5 w-4.5 text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
            </div>
            <div>
              <p className="font-semibold text-red-200 group-hover:text-red-100 transition duration-200">{category.title}</p>
              <p className="text-[9px] font-mono uppercase tracking-wider text-red-400/60">
                {category.subtitle}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 font-mono">
            <span className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-300">
              {category.metric}
            </span>
            <span className="text-[7px] tracking-widest text-red-500/50 uppercase scale-90">
              [CON_FAIL]
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-red-500/20 bg-zinc-950">
            <Image
              src={review.imageUrl ?? "/placeholder-snack.svg"}
              alt={review.brand}
              fill
              className="object-cover grayscale group-hover:grayscale-[20%] transition duration-500"
              sizes="64px"
            />
            {/* Active red warning scanner line */}
            <div className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-red-500/35 to-transparent scanner-beam pointer-events-none" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-100 group-hover:text-red-200/80 transition duration-200">{review.brand}</p>
            <p className="text-xs text-zinc-500">{review.flavor}</p>
            <div className="mt-2.5">
              <TierBadge score={review.weightedScore} size="sm" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function HallOfShame({ reviews }: { reviews: Review[] }) {
  const categories = computeHallOfShame(reviews);
  if (categories.every((c) => !c.review)) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400/90">
            Public record
          </p>
          <h2 className="mt-1 text-2xl font-bold text-zinc-50">Hall of Shame</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Worst offenders — shareable snack disasters
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <ShameCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}
