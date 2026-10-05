"use client";

import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold">New Article</h1>
        <p className="text-sm text-[#888] mt-1">Fill in all required fields before publishing.</p>
      </div>
      <ArticleForm />
    </div>
  );
}
