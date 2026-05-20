"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { fetchProductImage } from "@/lib/image-fetch";
import {
  calculateWeightedScore,
  crunchEfficiency,
  greasePenalty,
  rebuyIndex,
} from "@/lib/scoring";
import { getReviewEnergy } from "@/lib/review-energy";
import { getTier } from "@/lib/tiers";
import { generateTags, generateVerdict } from "@/lib/verdicts";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations";
import { isAddReviewAuthenticated } from "@/lib/add-review-auth";

export async function getAllReviews() {
  const db = await getDb();
  return db.select().from(reviews).orderBy(desc(reviews.weightedScore));
}

export async function getReviewById(id: string) {
  const db = await getDb();
  const rows = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createReview(input: ReviewFormValues) {
  if (!(await isAddReviewAuthenticated())) {
    throw new Error("Review entry is locked");
  }

  const parsed = reviewFormSchema.parse(input);
  const db = await getDb();

  const ratings = {
    overall: parsed.overall,
    taste: parsed.taste,
    crunch: parsed.crunch,
    saltBalance: parsed.saltBalance,
    aftertaste: parsed.aftertaste,
    dustFactor: parsed.dustFactor,
    rebuyValue: parsed.rebuyValue,
  };

  const weightedScore = calculateWeightedScore(ratings);
  const imageUrl =
    parsed.imageUrl && parsed.imageUrl.length > 0
      ? parsed.imageUrl
      : await fetchProductImage(parsed.brand, parsed.flavor, db);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(reviews).values({
    id,
    brand: parsed.brand.trim(),
    flavor: parsed.flavor.trim(),
    ...ratings,
    seasoning: parsed.taste,
    comment: parsed.comment?.trim() || null,
    weightedScore,
    imageUrl,
    verdict: generateVerdict(ratings, weightedScore),
    tags: JSON.stringify(generateTags(ratings)),
    crunchEfficiency: crunchEfficiency(ratings.crunch, ratings.dustFactor),
    greasePenalty: greasePenalty(ratings.dustFactor, ratings.aftertaste),
    rebuyIndex: rebuyIndex(ratings.rebuyValue, ratings.taste, ratings.overall),
    createdAt: now,
  });

  revalidatePath("/");
  revalidatePath("/analytics");
  revalidatePath(`/review/${id}`);

  return { id, weightedScore };
}

export async function updateReview(id: string, input: ReviewFormValues) {
  if (!(await isAddReviewAuthenticated())) {
    throw new Error("Review editing is locked");
  }

  const parsed = reviewFormSchema.parse(input);
  const db = await getDb();
  const existing = await getReviewById(id);

  if (!existing) {
    throw new Error("Review not found");
  }

  const ratings = {
    overall: parsed.overall,
    taste: parsed.taste,
    crunch: parsed.crunch,
    saltBalance: parsed.saltBalance,
    aftertaste: parsed.aftertaste,
    dustFactor: parsed.dustFactor,
    rebuyValue: parsed.rebuyValue,
  };

  const weightedScore = calculateWeightedScore(ratings);
  const imageUrl =
    parsed.imageUrl && parsed.imageUrl.length > 0
      ? parsed.imageUrl
      : await fetchProductImage(parsed.brand, parsed.flavor, db);

  await db
    .update(reviews)
    .set({
      brand: parsed.brand.trim(),
      flavor: parsed.flavor.trim(),
      ...ratings,
      seasoning: parsed.taste,
      comment: parsed.comment?.trim() || null,
      weightedScore,
      imageUrl,
      verdict: generateVerdict(ratings, weightedScore),
      tags: JSON.stringify(generateTags(ratings)),
      crunchEfficiency: crunchEfficiency(ratings.crunch, ratings.dustFactor),
      greasePenalty: greasePenalty(ratings.dustFactor, ratings.aftertaste),
      rebuyIndex: rebuyIndex(ratings.rebuyValue, ratings.taste, ratings.overall),
    })
    .where(eq(reviews.id, id));

  revalidatePath("/");
  revalidatePath("/analytics");
  revalidatePath("/edit");
  revalidatePath(`/review/${id}`);

  return { id, weightedScore };
}

export async function deleteReview(id: string) {
  if (!(await isAddReviewAuthenticated())) {
    throw new Error("Review editing is locked");
  }

  const db = await getDb();
  await db.delete(reviews).where(eq(reviews.id, id));

  revalidatePath("/");
  revalidatePath("/analytics");
  revalidatePath("/edit");
  revalidatePath(`/review/${id}`);

  return { id };
}

export async function previewProductImage(brand: string, flavor: string) {
  if (!brand.trim() || !flavor.trim()) {
    return { imageUrl: null as string | null };
  }
  try {
    const db = await getDb();
    const imageUrl = await fetchProductImage(brand, flavor, db);
    return { imageUrl };
  } catch {
    const { fetchProductImage: fetchImg } = await import("@/lib/image-fetch");
    const imageUrl = await fetchImg(brand, flavor);
    return { imageUrl };
  }
}

export async function previewWeightedScore(input: ReviewFormValues) {
  const parsed = reviewFormSchema.parse(input);
  const ratings = {
    overall: parsed.overall,
    taste: parsed.taste,
    crunch: parsed.crunch,
    saltBalance: parsed.saltBalance,
    aftertaste: parsed.aftertaste,
    dustFactor: parsed.dustFactor,
    rebuyValue: parsed.rebuyValue,
  };
  const weightedScore = calculateWeightedScore(ratings);
  return {
    weightedScore,
    verdict: generateVerdict(ratings, weightedScore),
    tags: generateTags(ratings),
    tier: getTier(weightedScore),
    energy: getReviewEnergy(ratings, parsed.comment),
  };
}
