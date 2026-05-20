"use server";

import { redirect } from "next/navigation";
import {
  getAddReviewPassword,
  isAddReviewPasswordConfigured,
  setAddReviewAuthenticated,
} from "@/lib/add-review-auth";

export async function authenticateAddReview(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/add");
  const safeRedirect = redirectTo === "/edit" ? "/edit" : "/add";

  if (!isAddReviewPasswordConfigured()) {
    redirect(`${safeRedirect}?auth=missing`);
  }

  const submitted = String(formData.get("password") ?? "");
  if (submitted !== getAddReviewPassword()) {
    redirect(`${safeRedirect}?auth=failed`);
  }

  await setAddReviewAuthenticated();
  redirect(safeRedirect);
}
