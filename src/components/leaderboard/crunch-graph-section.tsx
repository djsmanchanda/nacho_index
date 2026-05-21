"use client";

import type { Review } from "@/lib/db/schema";
import { CrunchGraph } from "@/components/charts/crunch-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CrunchGraphSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length < 2) return null;

  return (
    <section className="mb-12">
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-transparent">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/80">
            Snack science
          </p>
          <CardTitle>Crunch vs Taste</CardTitle>
          <p className="text-sm text-zinc-500">
            Discover crunch traps, flavor bombs, and the elite quadrant.
          </p>
        </CardHeader>
        <CardContent>
          <CrunchGraph reviews={reviews} />
        </CardContent>
      </Card>
    </section>
  );
}
