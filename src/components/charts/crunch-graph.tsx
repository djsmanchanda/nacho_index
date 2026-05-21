"use client";

import Link from "next/link";
import type { Review } from "@/lib/db/schema";

type Point = {
  id: string;
  brand: string;
  flavor: string;
  crunch: number;
  taste: number;
  weightedScore: number;
};

function toPoints(reviews: Review[]): Point[] {
  return reviews.map((r) => ({
    id: r.id,
    brand: r.brand,
    flavor: r.flavor,
    crunch: r.crunch,
    taste: r.taste,
    weightedScore: r.weightedScore,
  }));
}

function xFor(value: number) {
  return 48 + (value / 13) * 304;
}

function yFor(value: number) {
  return 316 - (value / 10) * 268;
}

export function CrunchGraph({ reviews }: { reviews: Review[] }) {
  const data = toPoints(reviews);

  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">
        Log reviews to plot crunch vs taste.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
        <svg
          viewBox="0 0 400 360"
          role="img"
          aria-label="Crunch versus taste scatter plot"
          className="h-[320px] w-full sm:h-[360px]"
        >
          <defs>
            <linearGradient id="nacho-plot-bg" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(251,191,36,0.08)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.03)" />
            </linearGradient>
          </defs>
          <rect width="400" height="360" fill="url(#nacho-plot-bg)" />
          {[0, 2.5, 5, 7.5, 10, 13].map((tick) => {
            const x = xFor(tick);
            return (
              <g key={tick}>
                <line x1={x} x2={x} y1="48" y2="316" stroke="rgba(255,255,255,0.07)" />
                <text x={x} y="338" textAnchor="middle" className="fill-zinc-500 text-[10px]">
                  {tick}
                </text>
              </g>
            );
          })}
          {[0, 2.5, 5, 7.5, 10].map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line x1="48" x2="352" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" />
                <text x="30" y={y + 3} textAnchor="middle" className="fill-zinc-500 text-[10px]">
                  {tick}
                </text>
              </g>
            );
          })}
          <line x1={xFor(10)} x2={xFor(10)} y1="48" y2="316" stroke="rgba(34,197,94,0.35)" strokeDasharray="5 5" />
          <line x1={xFor(7.5)} x2={xFor(7.5)} y1="48" y2="316" stroke="rgba(251,191,36,0.25)" strokeDasharray="5 5" />
          <line x1="48" x2="352" y1={yFor(7.5)} y2={yFor(7.5)} stroke="rgba(251,191,36,0.35)" strokeDasharray="5 5" />
          <text x="200" y="26" textAnchor="middle" className="fill-zinc-300 text-[11px] uppercase tracking-widest">
            Taste intensity
          </text>
          <text x="200" y="354" textAnchor="middle" className="fill-zinc-300 text-[11px] uppercase tracking-widest">
            Crunch ratio (10 ideal, 13 overloaded)
          </text>
          <text x="278" y="70" className="fill-amber-300 text-[9px] uppercase tracking-widest">
            Elite zone
          </text>
          {data.map((point) => {
            const x = xFor(point.crunch);
            const y = yFor(point.taste);
            const radius = 5 + point.weightedScore / 2.5;
            return (
              <a key={point.id} href={`/review/${point.id}`} aria-label={`${point.brand} ${point.flavor}`}>
                <circle cx={x} cy={y} r={radius + 5} fill="rgba(251,191,36,0.12)" />
                <circle cx={x} cy={y} r={radius} fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
                <text x={x} y={y - radius - 8} textAnchor="middle" className="fill-zinc-100 text-[10px] font-semibold">
                  {point.brand}
                </text>
              </a>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-wider text-zinc-500">
        <span>Flavor bombs: high taste, weak crunch</span>
        <span>Crunch traps: high crunch, low flavor</span>
        <span>Elite quadrant: high taste and crunch</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {data.map((point) => (
          <Link
            key={point.id}
            href={`/review/${point.id}`}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs transition hover:border-amber-500/30 hover:bg-amber-500/5"
          >
            <span className="block font-semibold text-zinc-100">{point.brand}</span>
            <span className="text-zinc-500">
              Crunch {point.crunch.toFixed(1)} / Taste {point.taste.toFixed(1)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
