import { eq } from "drizzle-orm";
import type { AppDatabase } from "@/lib/db";
import { imageCache } from "@/lib/db/schema";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1613919113640-25732cd5da56?w=600&h=600&fit=crop&q=80";

function cacheKey(brand: string, flavor: string): string {
  return `${brand.trim().toLowerCase()}::${flavor.trim().toLowerCase()}`;
}

type OffProduct = {
  image_front_url?: string;
  image_url?: string;
};

type OffSearchResponse = {
  products?: OffProduct[];
};

/** Helper to run fetch with a timeout using AbortController */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { next?: { revalidate?: number } } = {},
  timeoutMs = 3500,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal as AbortSignal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

async function searchOpenFoodFacts(query: string): Promise<string | null> {
  const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  url.searchParams.set("search_terms", query);
  url.searchParams.set("json", "1");
  url.searchParams.set("page_size", "5");
  url.searchParams.set("fields", "image_front_url,image_url,product_name");

  try {
    const res = await fetchWithTimeout(url.toString(), {
      headers: { "User-Agent": "NachoIndex/1.0 (snack review app)" },
      next: { revalidate: 86400 },
    }, 3500);

    if (!res.ok) return null;

    const data = (await res.json()) as OffSearchResponse;
    for (const product of data.products ?? []) {
      const candidate = product.image_front_url ?? product.image_url;
      if (candidate?.startsWith("http")) return candidate;
    }
  } catch (error) {
    console.error("OpenFoodFacts search error:", error);
  }
  return null;
}

async function searchWikimedia(query: string): Promise<string | null> {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", `${query} chips snack`);
  url.searchParams.set("gsrlimit", "3");
  url.searchParams.set("prop", "pageimages");
  url.searchParams.set("piprop", "thumbnail");
  url.searchParams.set("pithumbsize", "600");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  try {
    const res = await fetchWithTimeout(url.toString(), {
      next: { revalidate: 86400 },
    }, 3500);
    if (!res.ok) return null;

    const data = (await res.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source?: string } }> };
    };
    const pages = data.query?.pages ?? {};
    for (const page of Object.values(pages)) {
      if (page.thumbnail?.source) return page.thumbnail.source;
    }
  } catch (error) {
    console.error("Wikimedia search error:", error);
  }
  return null;
}

export async function fetchProductImage(
  brand: string,
  flavor: string,
  db?: AppDatabase,
): Promise<string> {
  const key = cacheKey(brand, flavor);

  if (db) {
    const cached = await db
      .select()
      .from(imageCache)
      .where(eq(imageCache.queryKey, key))
      .limit(1);
    if (cached[0]?.imageUrl) return cached[0].imageUrl;
  }

  const query = `${brand} ${flavor} chips nachos`;
  const off = await searchOpenFoodFacts(query);
  const image = off ?? (await searchWikimedia(query)) ?? PLACEHOLDER;

  if (db) {
    await db
      .insert(imageCache)
      .values({
        queryKey: key,
        imageUrl: image,
        createdAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: imageCache.queryKey,
        set: { imageUrl: image, createdAt: new Date().toISOString() },
      });
  }

  return image;
}

export function getPlaceholderImage(): string {
  return PLACEHOLDER;
}
