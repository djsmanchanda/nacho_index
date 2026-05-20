"use client";

import { maxRatingFor, ratingCategories, type RatingInput } from "@/lib/scoring";

export function RatingRadarChart({ ratings }: { ratings: RatingInput }) {
  const data = ratingCategories(ratings).map((c) => ({
    key: c.key as keyof RatingInput,
    category: c.label,
    score: c.value,
  }));
  const center = 160;
  const maxRadius = 112;
  const points = data.map((item, index) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const radius = (item.score / maxRatingFor(item.key)) * maxRadius;
    return {
      ...item,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 28),
      labelY: center + Math.sin(angle) * (maxRadius + 28),
    };
  });
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="h-[320px] w-full">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label="Rating radar chart"
        className="h-full w-full"
      >
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={maxRadius * scale}
            fill="none"
            stroke="rgba(249,115,22,0.14)"
          />
        ))}
        {points.map((p) => (
          <line
            key={p.category}
            x1={center}
            y1={center}
            x2={p.labelX}
            y2={p.labelY}
            stroke="rgba(249,115,22,0.1)"
          />
        ))}
        <polygon points={polygon} fill="rgba(249,115,22,0.28)" stroke="#f97316" strokeWidth="2" />
        {points.map((p) => (
          <g key={p.category}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#fbbf24" stroke="#f97316" />
            <text
              x={p.labelX}
              y={p.labelY}
              textAnchor={p.labelX < center - 8 ? "end" : p.labelX > center + 8 ? "start" : "middle"}
              dominantBaseline="middle"
              className="fill-zinc-400 text-[9px] uppercase tracking-wider"
            >
              {p.category}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
