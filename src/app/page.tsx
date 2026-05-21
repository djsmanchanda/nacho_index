import { getAllReviews } from "@/app/actions/reviews";
import { LeaderboardClient } from "@/components/leaderboard/leaderboard-client";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let reviews: Awaited<ReturnType<typeof getAllReviews>> = [];

  try {
    reviews = await getAllReviews();
  } catch {
    reviews = [];
  }

  return (
    <div>
      <section className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
          Divjot's · Live Index
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-50 sm:text-4xl">
          Nacho Index Leaderboard
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Ranked by weighted snack science. Crunch efficiency, grease penalty, and rebuy index
          included. Based on my unhealthy obsession with Nachos.
        </p>
      </section>

      {reviews.length === 0 ? (
        <EmptyState
          title="The lab is empty"
          description="No reviews logged yet. The index will populate once a protected review is added."
        />
      ) : (
        <LeaderboardClient reviews={reviews} />
      )}
    </div>
  );
}
