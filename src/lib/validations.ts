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

export const recommendationFormSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required").max(80),
  flavor: z.string().trim().min(1, "Flavour is required").max(120),
  countryOfOrigin: z.string().trim().min(1, "Country of origin is required").max(80),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
export type RecommendationFormValues = z.infer<typeof recommendationFormSchema>;
