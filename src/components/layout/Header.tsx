"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NAV_CATEGORIES, CATEGORIES } from "@/lib/categories";
import { AP_DISTRICTS } from "@/lib/districts";
import MobileNav from "./MobileNav";

export default function Header() {
  const [districtOpen, setDistrictOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [districtFilter, setDistrictFilter] = useState("");
  const districtRef = useRef<HTMLLIElement>(null);
  const moreRef = useRef<HTMLLIElement>(null);
  const router = useRouter();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (districtRef.current && !districtRef.current.contains(e.target as Node)) {
        setDistrictOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  }

  const filteredDistricts = AP_DISTRICTS.filter((d) =>
    d.name.toLowerCase().includes(districtFilter.toLowerCase())
  );

  const MORE_CATEGORIES = ["andhra-pradesh", "business", "education", "technology", "health", "district-news"];

  return (
    <header className="border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
      {/* Publication bar */}
      <div className="border-b border-[#e5e5e5] bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="text-xs text-gray-400 italic">Andhra in every Pulse</span>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop: Logo + Nav */}
        <div className="hidden md:flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#c0392b] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm font-serif">AP</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-serif text-[#111111] group-hover:text-[#c0392b] transition-colors">
                AP PULSE
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1 text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="px-3 py-2 hover:text-[#c0392b] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/latest"
                  className="px-3 py-2 hover:text-[#c0392b] transition-colors"
                >
                  Latest
                </Link>
              </li>
              {NAV_CATEGORIES.filter((c) => c.slug !== "latest").map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="px-3 py-2 hover:text-[#c0392b] transition-colors capitalize"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}

              {/* Districts dropdown */}
              <li ref={districtRef} className="relative">
                <button
                  onClick={() => { setDistrictOpen((o) => !o); setMoreOpen(false); }}
                  aria-expanded={districtOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1 px-3 py-2 hover:text-[#c0392b] transition-colors"
                >
                  Districts
                  <svg className={`w-3 h-3 transition-transform ${districtOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {districtOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#e5e5e5] shadow-lg z-50 rounded-sm">
                    <div className="p-2 border-b border-[#e5e5e5]">
                      <input
                        type="search"
                        placeholder="Search district…"
                        value={districtFilter}
                        onChange={(e) => setDistrictFilter(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c0392b]"
                        aria-label="Search districts"
                      />
                    </div>
                    <ul className="max-h-64 overflow-y-auto py-1" role="listbox" aria-label="Districts">
                      {filteredDistricts.map((d) => (
                        <li key={d.slug}>
                          <Link
                            href={`/district/${d.slug}`}
                            onClick={() => { setDistrictOpen(false); setDistrictFilter(""); }}
                            className="block px-4 py-2 text-sm hover:bg-[#f7f6f4] hover:text-[#c0392b] transition-colors"
                          >
                            {d.name}
                          </Link>
                        </li>
                      ))}
                      {filteredDistricts.length === 0 && (
                        <li className="px-4 py-3 text-sm text-gray-500">No districts found</li>
                      )}
                    </ul>
                  </div>
                )}
              </li>

              {/* More dropdown */}
              <li ref={moreRef} className="relative">
                <button
                  onClick={() => { setMoreOpen((o) => !o); setDistrictOpen(false); }}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1 px-3 py-2 hover:text-[#c0392b] transition-colors"
                >
                  More
                  <svg className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {moreOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-[#e5e5e5] shadow-lg z-50 rounded-sm">
                    <ul className="py-1">
                      {MORE_CATEGORIES.map((slug) => {
                        const cat = CATEGORIES.find((c) => c.slug === slug);
                        if (!cat) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/category/${slug}`}
                              onClick={() => setMoreOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-[#f7f6f4] hover:text-[#c0392b] transition-colors"
                            >
                              {cat.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>

              {/* Search */}
              <li className="relative">
                <button
                  onClick={() => setSearchOpen((o) => !o)}
                  aria-label="Search"
                  className="p-2 hover:text-[#c0392b] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {searchOpen && (
                  <div className="absolute top-full right-0 mt-1 w-72 bg-white border border-[#e5e5e5] shadow-lg z-50 rounded-sm p-3">
                    <form onSubmit={handleSearch} role="search">
                      <div className="flex gap-2">
                        <input
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search AP Pulse…"
                          className="flex-1 px-3 py-2 text-sm border border-[#e5e5e5] rounded-sm focus:outline-none focus:border-[#c0392b]"
                          aria-label="Search news"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-[#c0392b] text-white text-sm rounded-sm hover:bg-[#96281b] transition-colors"
                        >
                          Go
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between py-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="p-1 -ml-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-[#c0392b] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs font-serif">AP</span>
            </div>
            <span className="text-lg font-bold tracking-tight font-serif">AP PULSE</span>
          </Link>

          <button
            onClick={() => router.push("/search")}
            aria-label="Search"
            className="p-1 -mr-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
