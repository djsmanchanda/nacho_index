import { getAllReviews } from "@/app/actions/reviews";
import { AddReviewForm } from "@/components/review/add-review-form";
import { AddReviewLogin } from "@/components/review/add-review-login";
import { EmptyState } from "@/components/ui/empty-state";
import { isAddReviewAuthenticated } from "@/lib/add-review-auth";

export const dynamic = "force-dynamic";

export default async function EditReviewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ auth?: string }>;
}) {
  const authenticated = await isAddReviewAuthenticated();
  const params = await searchParams;
  const authError = params?.auth === "failed" || params?.auth === "missing" ? params.auth : undefined;

  let reviews: Awaited<ReturnType<typeof getAllReviews>> = [];
  if (authenticated) {
    try {
      reviews = await getAllReviews();
    } catch {
      reviews = [];
    }
  }

  return (
    <div>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400/90">
          Protected index
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-50">Edit reviews</h2>
        <p className="mt-2 text-zinc-400">
          Update prior entries, refresh scoring, or remove reviews from the index.
        </p>
      </section>

      {!authenticated ? (
        <AddReviewLogin error={authError} redirectTo="/edit" submitLabel="Unlock edit reviews" />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews to edit"
          description="The index is empty. Add a protected review before editing entries."
        />
      ) : (
        <div className="space-y-10">
          {reviews.map((review) => (
            <section key={review.id} className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Editing</p>
                <h3 className="text-2xl font-bold text-zinc-50">
                  {review.brand} - {review.flavor}
                </h3>
              </div>
              <AddReviewForm review={review} mode="edit" />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
