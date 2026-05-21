import { LockKeyhole } from "lucide-react";
import { authenticateAddReview } from "@/app/actions/add-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddReviewLogin({
  error,
  redirectTo = "/add",
  submitLabel = "Unlock add review",
}: {
  error?: "failed" | "missing";
  redirectTo?: "/add" | "/edit";
  submitLabel?: string;
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 text-amber-400" />
          Review access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={authenticateAddReview} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="space-y-2">
            <Label htmlFor="add-review-password">Password</Label>
            <Input
              id="add-review-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error === "failed" && (
            <p className="text-sm text-red-300">That password does not unlock review entry.</p>
          )}
          {error === "missing" && (
            <p className="text-sm text-red-300">
              Set NACHO_ADD_REVIEW_PASSWORD in the environment before adding reviews.
            </p>
          )}
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
