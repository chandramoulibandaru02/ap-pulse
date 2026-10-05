"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminArticleCounts, getAdminArticles } from "@/lib/articles";
import type { Article, ArticleStatus } from "@/types/article";
import { formatPublishedDate } from "@/lib/metadata";

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [counts, setCounts] = useState<Record<ArticleStatus, number>>({ draft: 0, published: 0, unpublished: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminArticles(undefined, 8), getAdminArticleCounts()])
      .then(([recentArticles, articleCounts]) => {
        setArticles(recentArticles);
        setCounts(articleCounts);
      })
      .finally(() => setLoading(false));
  }, []);

  const recent = articles.slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-[#c0392b] text-white text-sm hover:bg-[#96281b] transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-[#e5e5e5] p-5">
          <div className="text-2xl font-bold font-serif">{loading ? "—" : counts.published}</div>
          <div className="text-sm text-[#666] mt-1">Published articles</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] p-5">
          <div className="text-2xl font-bold font-serif">{loading ? "—" : counts.draft}</div>
          <div className="text-sm text-[#666] mt-1">Drafts</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] p-5">
          <div className="text-2xl font-bold font-serif">{loading ? "—" : counts.unpublished}</div>
          <div className="text-sm text-[#666] mt-1">Unpublished</div>
        </div>
      </div>

      {/* Recent articles */}
      <div className="bg-white border border-[#e5e5e5]">
        <div className="px-5 py-3 border-b border-[#e5e5e5] flex items-center justify-between">
          <h2 className="font-serif font-bold text-base">Recent Articles</h2>
          <Link href="/admin/articles" className="text-xs text-[#c0392b] hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-[#888] text-sm">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[#888] text-sm">No articles yet.</p>
            <Link
              href="/admin/articles/new"
              className="inline-block mt-3 text-xs text-[#c0392b] hover:underline"
            >
              Create your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f6f4] border-b border-[#e5e5e5]">
                <th className="text-left px-5 py-2.5 font-medium text-[#444] text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-3 py-2.5 font-medium text-[#444] text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-3 py-2.5 font-medium text-[#444] text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-3 py-2.5 font-medium text-[#444] text-xs uppercase tracking-wider">Status</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((article) => {
                const date = article.publishedAt ?? article.createdAt;
                return (
                  <tr key={article.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#f9f9f9]">
                    <td className="px-5 py-3 font-medium text-[#111] line-clamp-1 max-w-xs">
                      {article.title}
                    </td>
                    <td className="px-3 py-3 text-[#666] hidden sm:table-cell capitalize">
                      {article.category}
                    </td>
                    <td className="px-3 py-3 text-[#888] text-xs hidden md:table-cell">
                      {formatPublishedDate(date)}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                        article.status === "published"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : article.status === "draft"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-gray-50 text-gray-600 border border-gray-200"
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-xs text-[#c0392b] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
