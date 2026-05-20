CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`brand` text NOT NULL,
	`flavor` text NOT NULL,
	`overall` real NOT NULL,
	`taste` real NOT NULL,
	`crunch` real NOT NULL,
	`seasoning` real NOT NULL,
	`salt_balance` real NOT NULL,
	`aftertaste` real NOT NULL,
	`dust_factor` real NOT NULL,
	`rebuy_value` real NOT NULL,
	`comment` text,
	`weighted_score` real NOT NULL,
	`image_url` text,
	`verdict` text NOT NULL,
	`tags` text NOT NULL,
	`crunch_efficiency` real NOT NULL,
	`grease_penalty` real NOT NULL,
	`rebuy_index` real NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `image_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`query_key` text NOT NULL,
	`image_url` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `image_cache_query_key_unique` ON `image_cache` (`query_key`);
