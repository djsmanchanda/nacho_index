import { RecommendationForm } from "@/components/recommendations/recommendation-form";

export const dynamic = "force-dynamic";

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400/90">
          Snack Intel
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-50 sm:text-4xl">
          Recommendations
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Tell me what should be tested next.
        </p>
      </section>
      <RecommendationForm />
    </div>
  );
}
