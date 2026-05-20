import { getReviewEnergy, getReviewEnergyStyle, type ReviewEnergy } from "@/lib/review-energy";
import type { RatingInput } from "@/lib/scoring";
import { cn } from "@/lib/utils";

type Props = {
  ratings: RatingInput;
  comment?: string | null;
  energy?: ReviewEnergy;
  className?: string;
};

export function EnergyBadge({ ratings, comment, energy: energyProp, className }: Props) {
  const energy = energyProp ?? getReviewEnergy(ratings, comment);
  const style = getReviewEnergyStyle(energy);

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        style.className,
        className,
      )}
      title={style.description}
    >
      {energy}
    </span>
  );
}
