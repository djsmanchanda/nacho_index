"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import {
  createReview,
  deleteReview,
  previewProductImage,
  previewWeightedScore,
  updateReview,
} from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EnergyBadge } from "@/components/ui/energy-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import type { Review } from "@/lib/db/schema";
import type { ReviewEnergy } from "@/lib/review-energy";
import type { Tier } from "@/lib/tiers";
import type { ReviewFormValues } from "@/lib/validations";
import { getPlaceholderImage } from "@/lib/image-fetch";
import { maxRatingFor, isOverloadRating } from "@/lib/scoring";

const defaultRatings = {
  overall: 7,
  taste: 7,
  crunch: 7,
  saltBalance: 7,
  aftertaste: 7,
  dustFactor: 5,
  rebuyValue: 7,
};

type RatingKey = keyof typeof defaultRatings;

const ratingFields: { key: RatingKey; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "taste", label: "Taste" },
  { key: "crunch", label: "Crunch" },
  { key: "saltBalance", label: "Salt Balance" },
  { key: "aftertaste", label: "Aftertaste" },
  { key: "dustFactor", label: "Dust Factor" },
  { key: "rebuyValue", label: "Rebuy Value" },
];

type Props = {
  review?: Review;
  mode?: "create" | "edit";
};

export function AddReviewForm({ review, mode = "create" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const editing = mode === "edit" && review;
  const [brand, setBrand] = useState(review?.brand ?? "");
  const [flavor, setFlavor] = useState(review?.flavor ?? "");
  const [comment, setComment] = useState(review?.comment ?? "");
  const [imageUrl, setImageUrl] = useState(review?.imageUrl ?? "");
  const [manualImage, setManualImage] = useState(Boolean(review?.imageUrl));
  const [ratings, setRatings] = useState(
    review
      ? {
          overall: review.overall,
          taste: review.taste,
          crunch: review.crunch,
          saltBalance: review.saltBalance,
          aftertaste: review.aftertaste,
          dustFactor: review.dustFactor,
          rebuyValue: review.rebuyValue,
        }
      : defaultRatings,
  );
  const [preview, setPreview] = useState<{
    weightedScore: number;
    verdict: string;
    tags: string[];
    tier: Tier;
    energy: ReviewEnergy;
  } | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const formValues = (): ReviewFormValues => ({
    brand,
    flavor,
    comment,
    imageUrl: manualImage ? imageUrl : undefined,
    ...ratings,
  });

  const fetchPreviewImage = useCallback(async () => {
    if (!brand.trim() || !flavor.trim() || manualImage) return;
    setImageLoading(true);
    try {
      const { imageUrl: url } = await previewProductImage(brand, flavor);
      if (url) setImageUrl(url);
    } catch {
      setImageUrl(getPlaceholderImage());
    } finally {
      setImageLoading(false);
    }
  }, [brand, flavor, manualImage]);

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchPreviewImage();
    }, 500);
    return () => clearTimeout(t);
  }, [fetchPreviewImage]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!brand || !flavor) return;
      void previewWeightedScore(formValues()).then(setPreview).catch(() => null);
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, flavor, ratings, comment, imageUrl]);

  function updateRating(key: RatingKey, value: number[]) {
    setRatings((r) => ({ ...r, [key]: value[0] ?? 0 }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = editing
          ? await updateReview(review.id, formValues())
          : await createReview(formValues());
        toast.success(
          editing
            ? `Review updated - score ${result.weightedScore.toFixed(2)}`
            : `Review logged - score ${result.weightedScore.toFixed(2)}`,
        );
        router.push(editing ? "/edit" : `/review/${result.id}`);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save review");
      }
    });
  }

  function handleDelete() {
    if (!editing) return;
    startTransition(async () => {
      try {
        await deleteReview(review.id);
        toast.success("Review deleted");
        router.push("/edit");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete review");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product identity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Brand name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flavor">Flavor</Label>
              <Input
                id="flavor"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                placeholder="Flavor name"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {ratingFields.map(({ key, label }) => (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{label}</Label>
                  <span className="font-mono text-sm text-orange-300">
                    {ratings[key].toFixed(1)}
                    {isOverloadRating(key) ? "/13" : "/10"}
                  </span>
                </div>
                <Slider
                  aria-label={`${label} rating`}
                  value={[ratings[key]]}
                  onValueChange={(v) => updateRating(key, v)}
                  min={0}
                  max={maxRatingFor(key)}
                  step={0.5}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Short lab notes..."
              maxLength={500}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-orange-400" />
              Live preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40">
              {imageLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
                </div>
              )}
              <Image
                src={imageUrl || "/placeholder-snack.svg"}
                alt="Preview"
                fill
                className="object-cover"
                sizes="340px"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageOverride">Image URL override</Label>
              <Input
                id="imageOverride"
                value={imageUrl}
                onChange={(e) => {
                  setManualImage(true);
                  setImageUrl(e.target.value);
                }}
                placeholder="https://..."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setManualImage(false);
                  void fetchPreviewImage();
                }}
              >
                Re-fetch from brand + flavor
              </Button>
            </div>
            {preview && (
              <div className="space-y-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                <TierBadge score={preview.weightedScore} size="md" className="items-start" />
                <EnergyBadge ratings={ratings} comment={comment} energy={preview.energy} />
                <p className="text-sm leading-relaxed text-amber-200">{preview.verdict}</p>
                <div className="flex flex-wrap gap-1">
                  {preview.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Log review to index"
              )}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-red-500/30 text-red-200 hover:bg-red-500/10"
                disabled={pending}
                onClick={handleDelete}
              >
                Delete review
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
