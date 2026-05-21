"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Review } from "@/lib/db/schema";
import { computeAnalytics } from "@/lib/analytics";
import { CrunchGraph } from "@/components/charts/crunch-graph";
import { HallOfShame } from "@/components/leaderboard/hall-of-shame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#fbbf24", "#fbbf24", "#f87171", "#a78bfa", "#34d399"];

export function AnalyticsDashboard({ reviews }: { reviews: Review[] }) {
  const data = computeAnalytics(reviews);
  const [activeTab, setActiveTab] = useState<"overview" | "brands">("overview");

  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-zinc-400">No data yet. Log your first review to unlock analytics.</p>
      </Card>
    );
  }

  const highlights = [
    { label: "Best crunch", item: data.bestCrunch, metric: (r: Review) => r.crunch },
    { label: "Most rebuyable", item: data.mostRebuyable, metric: (r: Review) => r.rebuyValue },
    {
      label: "Worst aftertaste",
      item: data.worstAftertaste,
      metric: (r: Review) => r.aftertaste,
    },
    {
      label: "Top rated overall",
      item: data.topRated,
      metric: (r: Review) => r.weightedScore,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="inline-flex rounded-xl border border-white/10 bg-black/30 p-1">
        {[
          { id: "overview", label: "Overview" },
          { id: "brands", label: "Brand rankings" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as "overview" | "brands")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-amber-500 text-zinc-950"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" ? (
        <>
          <HallOfShame reviews={reviews} />
          <Card className="border-amber-500/20">
            <CardHeader>
              <CardTitle>Crunch vs taste</CardTitle>
              <p className="text-sm text-zinc-500">The scientific identity of your snack corpus</p>
            </CardHeader>
            <CardContent>
              <CrunchGraph reviews={reviews} />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">Total reviews</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">{data.totalReviews}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">Global average</p>
              <p className="mt-1 text-3xl font-bold text-amber-300">
                {data.globalAverage.toFixed(2)}
              </p>
            </Card>
            <Card className="p-5 sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-wider text-zinc-500">Brands tracked</p>
              <p className="mt-1 text-3xl font-bold text-zinc-50">{data.brandAverages.length}</p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Average score by brand</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.brandAverages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="brand" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="average" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.scoreDistribution}
                      dataKey="count"
                      nameKey="range"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(props) => {
                        const p = props as { range?: string; count?: number };
                        return `${p.range ?? ""}: ${p.count ?? 0}`;
                      }}
                    >
                      {data.scoreDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#18181b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map(({ label, item, metric }) =>
              item ? (
                <Card key={label} className="p-5">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
                  <p className="mt-2 font-semibold text-zinc-100">
                    {item.brand} - {item.flavor}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-300">
                    {metric(item).toFixed(1)}
                  </p>
                </Card>
              ) : null,
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Average ranking by brand</CardTitle>
            <p className="text-sm text-zinc-500">Ranked by weighted average score across reviews</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.brandAverages.map((brand, index) => (
              <div
                key={brand.brand}
                className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-[48px_1fr_92px]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 font-mono text-sm font-bold text-amber-200">
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-semibold text-zinc-100">{brand.brand}</p>
                    <p className="shrink-0 text-xs text-zinc-500">{brand.count} reviews</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${Math.min(100, Math.max(0, brand.average * 10))}%` }}
                    />
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-amber-300">{brand.average.toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">average</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
