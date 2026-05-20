import { z } from "zod";

const score = z.coerce.number().min(0).max(10);
const overloadScore = z.coerce.number().min(0).max(13);

export const reviewFormSchema = z.object({
  brand: z.string().min(1, "Brand is required").max(80),
  flavor: z.string().min(1, "Flavor is required").max(120),
  overall: score,
  taste: score,
  crunch: overloadScore,
  saltBalance: overloadScore,
  aftertaste: score,
  dustFactor: overloadScore,
  rebuyValue: score,
  comment: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
