"use client";

interface PaginationProps {
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}

export default function Pagination({ onLoadMore, loading, hasMore }: PaginationProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="px-6 py-2.5 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading…" : "Load more"}
      </button>
    </div>
  );
}
