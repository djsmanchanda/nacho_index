import { AddReviewForm } from "@/components/review/add-review-form";
import { AddReviewLogin } from "@/components/review/add-review-login";
import { isAddReviewAuthenticated } from "@/lib/add-review-auth";

export default async function AddReviewPage({
  searchParams,
}: {
  searchParams?: Promise<{ auth?: string }>;
}) {
  const authenticated = await isAddReviewAuthenticated();
  const params = await searchParams;
  const authError = params?.auth === "failed" || params?.auth === "missing" ? params.auth : undefined;

  return (
    <div>
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400/90">
          New specimen
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-50">Log a review</h2>
        <p className="mt-2 text-zinc-400">
          Scores auto-calculate weighted index. Product image fetches from brand + flavor.
        </p>
      </section>
      {authenticated ? <AddReviewForm /> : <AddReviewLogin error={authError} />}
    </div>
  );
}
