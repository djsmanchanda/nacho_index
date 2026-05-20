import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export type AppDatabase = ReturnType<typeof createDb>;

export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export async function getDb(): Promise<AppDatabase> {
  const { env } = await getCloudflareContext({ async: true });
  const db = env.DB as D1Database | undefined;
  if (!db) {
    throw new Error(
      "D1 binding DB not found. Run with `npm run preview` or deploy to Cloudflare.",
    );
  }
  return createDb(db);
}
