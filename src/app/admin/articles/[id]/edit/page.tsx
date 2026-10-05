"use client";

import { useEffect, useState } from "react";
import { getArticleById } from "@/lib/articles";
import type { Article } from "@/types/article";
import ArticleForm from "@/components/admin/ArticleForm";
import { use } from "react";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getArticleById(id)
      .then((a) => {
        if (!a) setNotFound(true);
        else setArticle(a);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-12 text-center text-[#888] text-sm">Loading article…</div>;
  }
  if (notFound || !article) {
    return <div className="py-12 text-center text-[#888] text-sm">Article not found.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">Edit Article</h1>
        <p className="text-sm text-[#888] mt-1 truncate">{article.title}</p>
      </div>
      <ArticleForm article={article} />
    </div>
  );
}
