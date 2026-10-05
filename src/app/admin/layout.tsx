"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && (!user || !isAdmin) && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [user, isAdmin, loading, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f4]">
        <p className="text-[#888] text-sm">Loading…</p>
      </div>
    );
  }

  if ((!user || !isAdmin) && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f4] flex flex-col">
      {/* Admin top bar */}
      <header className="bg-[#111111] text-white border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-serif font-bold text-sm">
              AP Pulse Admin
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/admin"
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/articles"
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Articles
              </Link>
              <Link
                href="/admin/articles/new"
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                + New
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{user?.email}</span>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              View site ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}
