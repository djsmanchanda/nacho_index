import { notFound } from "next/navigation";
import { getAllReviews, getReviewById } from "@/app/actions/reviews";
import { ReviewDetail } from "@/components/review/review-detail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ReviewPage({ params }: Props) {
  const { id } = await params;
  let review = null;
  try {
    review = await getReviewById(id);
  } catch {
    notFound();
  }
  if (!review) notFound();

  let allReviews: Awaited<ReturnType<typeof getAllReviews>> = [];
  try {
    allReviews = await getAllReviews();
  } catch {
    allReviews = [];
  }

  return <ReviewDetail review={review} allReviews={allReviews} />;
}
