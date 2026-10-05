import type { Metadata } from "next";
import { getLatestArticles } from "@/lib/articles";
import ArticleCard from "@/components/article/ArticleCard";
import EmptyState from "@/components/ui/EmptyState";
import { SITE_URL } from "@/lib/metadata";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Latest News",
  description: "The latest news from across Andhra Pradesh.",
  alternates: { canonical: `${SITE_URL}/latest` },
};

export default async function LatestPage() {
  const { articles } = await getLatestArticles(24);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="border-b border-[#e5e5e5] pb-6 mb-8">
        <h1 className="font-serif text-3xl font-bold">Latest News</h1>
        <p className="text-[#666] mt-2 text-sm">
          The most recent news from across Andhra Pradesh.
        </p>
      </header>

      {articles.length === 0 ? (
        <EmptyState
          message="No news published yet."
          description="Check back soon for updates."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}
