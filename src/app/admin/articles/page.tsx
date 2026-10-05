"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { deleteArticle, getAdminArticlePage, publishArticle, unpublishArticle } from "@/lib/articles";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import type { Article, ArticleStatus } from "@/types/article";
import { formatPublishedDate } from "@/lib/metadata";
import { getCategoryLabel } from "@/lib/categories";
import Pagination from "@/components/ui/Pagination";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<ArticleStatus | "all">("all");
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const page = await getAdminArticlePage(filter === "all" ? undefined : filter);
      setArticles(page.articles);
      setLastDoc(page.lastDoc);
      setHasMore(page.hasMore);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void Promise.resolve().then(loadFirstPage);
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await getAdminArticlePage(filter === "all" ? undefined : filter, lastDoc);
      setArticles((current) => [...current, ...page.articles]);
      setLastDoc(page.lastDoc);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [filter, lastDoc, loadingMore]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setActionId(id);
    setActionMessage(null);
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setActionMessage("Article deleted.");
    } catch (error) {
      const code = typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "";
      setActionMessage(
        code === "auth/unauthenticated" || code === "unauthenticated"
          ? "Your session has expired. Please sign in again."
          : code === "permission-denied"
            ? "You do not have permission to delete this article."
            : "Unable to delete article. Please try again."
      );
    } finally {
      setActionId(null);
    }
  }

  async function handlePublish(id: string) {
    setActionId(id);
    try {
      await publishArticle(id);
      await loadFirstPage();
    } finally {
      setActionId(null);
    }
  }

  async function handleUnpublish(id: string) {
    setActionId(id);
    try {
      await unpublishArticle(id);
      await loadFirstPage();
    } finally {
      setActionId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-[#c0392b] text-white text-sm hover:bg-[#96281b] transition-colors"
        >
          + New Article
        </Link>
      </div>

      {actionMessage && (
        <p
          role="status"
          className={`mb-4 px-4 py-3 text-sm border ${
            actionMessage === "Article deleted."
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {actionMessage}
        </p>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e5e5e5]">
        {(["all", "published", "draft", "unpublished"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              filter === f
                ? "border-[#c0392b] text-[#c0392b]"
                : "border-transparent text-[#666] hover:text-[#111]"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#888] text-sm">Loading…</div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[#888] text-sm">No {filter !== "all" ? filter : ""} articles found.</p>
        </div>
      ) : (
        <>
        <div className="bg-white border border-[#e5e5e5]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f6f4] border-b border-[#e5e5e5]">
                <th className="text-left px-5 py-3 font-medium text-[#444] text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-3 py-3 font-medium text-[#444] text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-3 py-3 font-medium text-[#444] text-xs uppercase tracking-wider hidden md:table-cell">Author</th>
                <th className="text-left px-3 py-3 font-medium text-[#444] text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-left px-3 py-3 font-medium text-[#444] text-xs uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-right font-medium text-[#444] text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                const date = article.publishedAt ?? article.createdAt;
                const busy = actionId === article.id;
                return (
                  <tr key={article.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#f9f9f9]">
                    <td className="px-5 py-3 font-medium text-[#111] max-w-xs">
                      <span className="line-clamp-1">{article.title}</span>
                      {article.breakingNews && (
                        <span className="ml-2 text-xs text-[#c0392b] border border-[#c0392b] px-1 rounded-sm">Breaking</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[#666] hidden sm:table-cell">
                      {getCategoryLabel(article.category)}
                    </td>
                    <td className="px-3 py-3 text-[#666] hidden md:table-cell">{article.author}</td>
                    <td className="px-3 py-3 text-[#888] text-xs hidden lg:table-cell">
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
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-xs text-[#c0392b] hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/preview`}
                          className="text-xs text-[#666] hover:underline hidden sm:inline"
                        >
                          Preview
                        </Link>
                        {article.status !== "published" && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={busy}
                            className="text-xs text-green-700 hover:underline disabled:opacity-50"
                          >
                            Publish
                          </button>
                        )}
                        {article.status === "published" && (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            disabled={busy}
                            className="text-xs text-[#888] hover:underline disabled:opacity-50"
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={busy}
                          className="text-xs text-red-600 hover:underline disabled:opacity-50"
                          >
                            {busy ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination onLoadMore={loadMore} loading={loadingMore} hasMore={hasMore} />
        </>
      )}
    </div>
  );
}
