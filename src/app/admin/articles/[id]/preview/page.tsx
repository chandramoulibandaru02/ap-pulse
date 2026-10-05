"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/lib/articles";
import type { Article } from "@/types/article";
import Image from "next/image";
import { getCategoryLabel } from "@/lib/categories";
import { getDistrictName } from "@/lib/districts";
import { formatPublishedDate } from "@/lib/metadata";
import Breadcrumbs from "@/components/article/Breadcrumbs";
import ArticleBody from "@/components/article/ArticleBody";
import Link from "next/link";
import { use } from "react";

export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticleById(id).then(setArticle).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-[#888] text-sm">Loading preview…</div>;
  }
  if (!article) {
    return <div className="py-12 text-center text-[#888] text-sm">Article not found.</div>;
  }

  const publishedDate = article.publishedAt ?? article.createdAt;

  return (
    <div>
      {/* Preview banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between text-sm text-yellow-800 mb-6">
        <span className="font-medium">
          Preview — {article.status === "published" ? "Published" : "Draft (not visible to public)"}
        </span>
        <div className="flex gap-3">
          <Link
            href={`/admin/articles/${id}/edit`}
            className="underline underline-offset-2 hover:text-yellow-900"
          >
            ← Edit
          </Link>
          {article.status === "published" && (
            <a
              href={`/news/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-yellow-900"
            >
              View live ↗
            </a>
          )}
        </div>
      </div>

      {/* Article preview */}
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs category={article.category} district={article.district} articleTitle={article.title} />

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
            {getCategoryLabel(article.category)}
          </span>
          {article.district && (
            <span className="text-xs text-[#888]">· {getDistrictName(article.district)}</span>
          )}
          {article.breakingNews && (
            <span className="text-xs font-semibold text-[#c0392b] border border-[#c0392b] px-1.5 py-0.5 rounded-sm uppercase">
              Breaking
            </span>
          )}
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="text-lg text-[#555] leading-relaxed mb-4 font-serif">{article.excerpt}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 text-sm text-[#888] pb-4 border-b border-[#e5e5e5] mb-6">
          <span className="font-medium text-[#444]">By {article.author}</span>
          <time dateTime={publishedDate.toISOString()}>
            {formatPublishedDate(publishedDate)}
          </time>
        </div>

        {article.featuredImage && (
          <figure className="mb-8">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0]">
              <Image
                src={article.featuredImage}
                alt={article.imageCaption || article.title}
                fill
                sizes="800px"
                className="object-cover"
                priority
              />
            </div>
            {article.imageCaption && (
              <figcaption className="mt-2 text-xs text-[#888] text-center">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <ArticleBody content={article.content} />
      </div>
    </div>
  );
}
