"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const { user, isAdmin, loading, error, signIn, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [user, isAdmin, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      const isAuthorized = await signIn(email, password);
      if (isAuthorized) {
        router.replace("/admin");
      }
    } catch {
      // error is set in useAuth
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#888]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-[#e5e5e5] p-8">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-[#c0392b] rounded-sm flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold font-serif">AP</span>
          </div>
          <h1 className="font-serif text-xl font-bold">AP Pulse Admin</h1>
          <p className="text-xs text-[#888] mt-1">Sign in to manage content</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-xs font-medium text-[#444] mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2.5 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#c0392b]"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-xs font-medium text-[#444] mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#c0392b]"
            />
          </div>

          {(error || (user && !isAdmin)) && (
            <div role="alert" className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-sm text-red-700">
              {error || "This account is not authorized to manage content."}
            </div>
          )}

          {user && !isAdmin && (
            <button
              type="button"
              onClick={() => void logout()}
              className="mb-4 w-full py-2.5 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors"
            >
              Sign out
            </button>
          )}

          <button
            type="submit"
            disabled={submitting || Boolean(user && !isAdmin)}
            className="w-full py-2.5 bg-[#c0392b] text-white text-sm font-medium hover:bg-[#96281b] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
