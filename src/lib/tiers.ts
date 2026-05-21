export type TierId =
  | "legendary"
  | "dangerous"
  | "certified"
  | "mid-shelf"
  | "structural-failure";

export type Tier = {
  id: TierId;
  label: string;
  minScore: number;
  description: string;
  className: string;
  glowClassName: string;
};

export const TIERS: Tier[] = [
  {
    id: "legendary",
    label: "Legendary",
    minScore: 9.5,
    description: "9.5+ — lab-defying excellence",
    className: "border-amber-400/50 bg-amber-500/15 text-amber-200",
    glowClassName: "shadow-amber-500/40",
  },
  {
    id: "dangerous",
    label: "Dangerous",
    minScore: 8.5,
    description: "8.5+ — financially irresponsible",
    className: "border-amber-500/50 bg-amber-500/15 text-amber-200",
    glowClassName: "shadow-amber-500/40",
  },
  {
    id: "certified",
    label: "Certified Crunch",
    minScore: 7,
    description: "7+ — structurally sound snack",
    className: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
    glowClassName: "shadow-yellow-500/30",
  },
  {
    id: "mid-shelf",
    label: "Mid Shelf",
    minScore: 5,
    description: "5+ — acceptable gas station tier",
    className: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
    glowClassName: "shadow-zinc-500/20",
  },
  {
    id: "structural-failure",
    label: "Structural Failure",
    minScore: 0,
    description: "<5 — snack engineering collapse",
    className: "border-red-500/50 bg-red-500/15 text-red-300",
    glowClassName: "shadow-red-500/40",
  },
];

export function getTier(weightedScore: number): Tier {
  if (weightedScore >= 9.5) return TIERS[0];
  if (weightedScore >= 8.5) return TIERS[1];
  if (weightedScore >= 7) return TIERS[2];
  if (weightedScore >= 5) return TIERS[3];
  return TIERS[4];
}
