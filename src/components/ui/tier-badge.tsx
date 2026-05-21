import { getTier } from "@/lib/tiers";
import { cn } from "@/lib/utils";

type Props = {
  score: number;
  size?: "sm" | "md" | "lg";
  showScore?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: { score: "text-lg", tier: "text-[10px] px-2 py-0.5" },
  md: { score: "text-2xl", tier: "text-xs px-2.5 py-1" },
  lg: { score: "text-5xl", tier: "text-sm px-3 py-1.5" },
};

export function TierBadge({ score, size = "md", showScore = true, className }: Props) {
  const tier = getTier(score);
  const s = sizeClasses[size];

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      {showScore && (
        <span
          className={cn(
            "font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-200",
            s.score,
          )}
        >
          {score.toFixed(2)}
        </span>
      )}
      <span
        className={cn(
          "rounded-full border font-bold uppercase tracking-wider",
          tier.className,
          s.tier,
        )}
        title={tier.description}
      >
        {tier.label}
      </span>
    </div>
  );
}
