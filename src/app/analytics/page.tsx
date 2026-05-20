import { getAllReviews } from "@/app/actions/reviews";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  let reviews: Awaited<ReturnType<typeof getAllReviews>> = [];
  try {
    reviews = await getAllReviews();
  } catch {
    reviews = [];
  }

  return (
    <div>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400/90">
          Analytics deck
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-50">Snack analytics</h2>
        <p className="mt-2 text-zinc-400">
          Brand averages, distribution, and category champions from your review corpus.
        </p>
      </section>
      <AnalyticsDashboard reviews={reviews} />
    </div>
  );
}
