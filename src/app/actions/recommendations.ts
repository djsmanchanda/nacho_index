"use server";

import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { recommendations } from "@/lib/db/schema";
import {
  recommendationFormSchema,
  type RecommendationFormValues,
} from "@/lib/validations";

export async function getAllRecommendations() {
  const db = await getDb();
  return db.select().from(recommendations).orderBy(desc(recommendations.createdAt));
}

export async function createRecommendation(input: RecommendationFormValues) {
  const parsed = recommendationFormSchema.parse(input);
  const db = await getDb();
  const id = crypto.randomUUID();

  await db.insert(recommendations).values({
    id,
    brand: parsed.brand,
    flavor: parsed.flavor,
    countryOfOrigin: parsed.countryOfOrigin,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/recommendations");
  return { id };
}
