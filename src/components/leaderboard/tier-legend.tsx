import { TIERS } from "@/lib/tiers";

export function TierLegend() {
  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Tier index
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-white/5 px-3 py-2"
          >
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${tier.className}`}
            >
              {tier.label}
            </span>
            <span className="font-mono text-xs text-zinc-500">
              {tier.id === "structural-failure" ? "<5" : `${tier.minScore}+`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

