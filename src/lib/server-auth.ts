import type { NextRequest } from "next/server";
import { isAuthorizedAdminEmail } from "@/lib/admin";

const IDENTITY_TOOLKIT_URL = "https://identitytoolkit.googleapis.com/v1/accounts:lookup";

interface FirebaseAccount {
  email?: string;
  customAttributes?: string;
}

interface FirebaseLookupResponse {
  users?: FirebaseAccount[];
}

export type FirebaseAdminSession =
  | { authenticated: true; admin: true }
  | { authenticated: true; admin: false }
  | { authenticated: false; admin: false };

/**
 * Verifies an ID token with Firebase and checks the server-issued admin custom
 * claim. This deliberately does not trust a claim decoded in the browser.
 */
export async function getFirebaseAdminSession(request: NextRequest): Promise<FirebaseAdminSession> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!apiKey || !token) return { authenticated: false, admin: false };

  try {
    const response = await fetch(`${IDENTITY_TOOLKIT_URL}?key=${apiKey}`, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });
    if (!response.ok) return { authenticated: false, admin: false };

    const body = (await response.json()) as FirebaseLookupResponse;
    const attributes = body.users?.[0]?.customAttributes;
    if (!attributes) return { authenticated: true, admin: false };

    const claims = JSON.parse(attributes) as Record<string, unknown>;
    return {
      authenticated: true,
      admin: claims.admin === true && isAuthorizedAdminEmail(body.users?.[0]?.email),
    };
  } catch {
    return { authenticated: false, admin: false };
  }
}

export async function hasFirebaseAdminSession(request: NextRequest): Promise<boolean> {
  const session = await getFirebaseAdminSession(request);
  return session.authenticated && session.admin;
}
