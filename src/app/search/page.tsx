"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchArticles } from "@/lib/articles";
import ArticleCard from "@/components/article/ArticleCard";
import type { Article } from "@/types/article";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!initialQuery) return;
    void Promise.resolve().then(async () => {
      setLoading(true);
      setSearched(true);
      try {
        setResults(await searchArticles(initialQuery));
      } finally {
        setLoading(false);
      }
    });
  }, [initialQuery]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchArticles(q);
      setResults(res);
    } finally {
      setLoading(false);
    }
    // Update URL without navigation
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Search</h1>

      <form onSubmit={handleSearch} role="search" className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for news…"
            className="flex-1 px-4 py-3 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#c0392b]"
            aria-label="Search news"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#c0392b] text-white text-sm font-medium hover:bg-[#96281b] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-[#888] text-sm" aria-live="polite">Searching…</p>
      )}

      {!loading && searched && query && (
        <p className="text-sm text-[#888] mb-6" aria-live="polite">
          {results.length > 0
            ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
            : `No articles matched "${query}".`}
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && query && (
        <div className="py-10 text-center">
          <p className="text-[#444] font-medium">No articles matched your search.</p>
          <p className="text-[#888] text-sm mt-1">Try different keywords or browse categories.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-8"><p className="text-[#888]">Loading search…</p></div>}>
      <SearchContent />
    </Suspense>
  );
}
