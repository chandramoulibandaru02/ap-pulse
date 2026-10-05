"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { AP_DISTRICTS } from "@/lib/districts";
import { useState } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [districtOpen, setDistrictOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus and block scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-y-0 left-0 w-80 bg-white z-50 md:hidden flex flex-col shadow-xl overflow-y-auto"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#e5e5e5]">
          <span className="font-bold font-serif text-lg">AP PULSE</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 hover:text-[#c0392b] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-[#e5e5e5]">
          <form onSubmit={handleSearch} role="search">
            <div className="flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AP Pulse…"
                className="flex-1 px-3 py-2 text-sm border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c0392b]"
                aria-label="Search news"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#c0392b] text-white text-sm rounded-sm"
              >
                Go
              </button>
            </div>
          </form>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-2">
          <ul>
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="block px-4 py-3 text-sm font-medium border-b border-[#f0f0f0] hover:text-[#c0392b] hover:bg-[#f7f6f4] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/latest"
                onClick={onClose}
                className="block px-4 py-3 text-sm font-medium border-b border-[#f0f0f0] hover:text-[#c0392b] hover:bg-[#f7f6f4] transition-colors"
              >
                Latest News
              </Link>
            </li>
            {CATEGORIES.filter((c) => c.slug !== "latest").map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="block px-4 py-3 text-sm font-medium border-b border-[#f0f0f0] hover:text-[#c0392b] hover:bg-[#f7f6f4] transition-colors"
                >
                  {cat.label}
                </Link>
              </li>
            ))}

            {/* Districts accordion */}
            <li>
              <button
                onClick={() => setDistrictOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium border-b border-[#f0f0f0] hover:text-[#c0392b] hover:bg-[#f7f6f4] transition-colors"
                aria-expanded={districtOpen}
              >
                <span>Districts</span>
                <svg className={`w-4 h-4 transition-transform ${districtOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {districtOpen && (
                <ul className="bg-[#f7f6f4]">
                  {AP_DISTRICTS.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/district/${d.slug}`}
                        onClick={onClose}
                        className="block pl-8 pr-4 py-2.5 text-sm border-b border-[#eeeeee] hover:text-[#c0392b] transition-colors"
                      >
                        {d.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
