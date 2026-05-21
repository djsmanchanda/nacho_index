import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  brand: text("brand").notNull(),
  flavor: text("flavor").notNull(),
  overall: real("overall").notNull(),
  taste: real("taste").notNull(),
  crunch: real("crunch").notNull(),
  seasoning: real("seasoning").notNull(),
  saltBalance: real("salt_balance").notNull(),
  aftertaste: real("aftertaste").notNull(),
  dustFactor: real("dust_factor").notNull(),
  rebuyValue: real("rebuy_value").notNull(),
  comment: text("comment"),
  weightedScore: real("weighted_score").notNull(),
  imageUrl: text("image_url"),
  verdict: text("verdict").notNull(),
  tags: text("tags").notNull(),
  crunchEfficiency: real("crunch_efficiency").notNull(),
  greasePenalty: real("grease_penalty").notNull(),
  rebuyIndex: real("rebuy_index").notNull(),
  createdAt: text("created_at").notNull(),
});

export const imageCache = sqliteTable("image_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  queryKey: text("query_key").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  createdAt: text("created_at").notNull(),
});

export const recommendations = sqliteTable("recommendations", {
  id: text("id").primaryKey(),
  brand: text("brand").notNull(),
  flavor: text("flavor").notNull(),
  countryOfOrigin: text("country_of_origin").notNull(),
  createdAt: text("created_at").notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;
