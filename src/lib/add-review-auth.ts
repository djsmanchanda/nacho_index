import { cookies } from "next/headers";

const ADD_REVIEW_AUTH_COOKIE = "nacho_add_review_auth";
const ADD_REVIEW_AUTH_SCOPE = "nacho-index:add-review";

export function getAddReviewPassword() {
  return process.env.NACHO_ADD_REVIEW_PASSWORD?.trim() ?? "";
}

export function isAddReviewPasswordConfigured() {
  return getAddReviewPassword().length > 0;
}

function toBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function authToken(password = getAddReviewPassword()) {
  if (!password) return null;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ADD_REVIEW_AUTH_SCOPE));
  return toBase64Url(signature);
}

export async function isAddReviewAuthenticated() {
  const expected = await authToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADD_REVIEW_AUTH_COOKIE)?.value === expected;
}

export async function setAddReviewAuthenticated() {
  const value = await authToken();
  if (!value) return false;
  const cookieStore = await cookies();
  cookieStore.set(ADD_REVIEW_AUTH_COOKIE, value, {
    httpOnly: true,
    maxAge: 60 * 60 * 12,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

