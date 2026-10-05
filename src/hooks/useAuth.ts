"use client";

import { useState, useEffect } from "react";
import { onIdTokenChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { isAuthorizedAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/firebase";

export interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let tokenCheck = 0;
    const unsub = onIdTokenChanged(auth, async (u) => {
      // Keep the admin shell in its loading state until both identity and role
      // are known. Exposing `user` while `isAdmin` is still false caused the
      // layout to redirect immediately after a successful sign-in.
      setLoading(true);
      const check = ++tokenCheck;
      let nextIsAdmin = false;
      if (u) {
        try {
          const token = await u.getIdTokenResult();
          nextIsAdmin = token.claims.admin === true && isAuthorizedAdminEmail(token.claims.email ?? u.email);
        } catch {
          nextIsAdmin = false;
        }
      }

      // A forced token refresh can trigger another callback while this lookup
      // is pending. Only the newest token may update the authorization state.
      if (!mounted || check !== tokenCheck) return;
      setUser(u);
      setIsAdmin(nextIsAdmin);
      setLoading(false);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<boolean> {
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // Fetch a fresh token before navigation. This makes an admin claim that
      // was assigned before sign-in available to the following admin request.
      const token = await credential.user.getIdTokenResult(true);
      const nextIsAdmin = token.claims.admin === true && isAuthorizedAdminEmail(token.claims.email ?? credential.user.email);
      setUser(credential.user);
      setIsAdmin(nextIsAdmin);
      if (!nextIsAdmin) {
        await signOut(auth);
        setError("Admin access required. This account is not authorized to manage content.");
      }
      return nextIsAdmin;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      if (msg.includes("invalid-credential") || msg.includes("wrong-password")) {
        setError("Invalid email or password.");
      } else if (msg.includes("too-many-requests")) {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Sign-in failed. Please try again.");
      }
      throw err;
    }
  }

  async function logout() {
    setError(null);
    await signOut(auth);
  }

  return { user, isAdmin, loading, error, signIn, logout };
}
