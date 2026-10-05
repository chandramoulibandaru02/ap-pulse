import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import type { Article } from "@/types/article";

interface LatestNewsProps {
  articles: Article[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="latest-heading" className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <h2
          id="latest-heading"
          className="font-serif text-xl font-bold border-l-4 border-[#c0392b] pl-3"
        >
          Latest News
        </h2>
        <Link
          href="/latest"
          className="text-xs font-medium text-[#c0392b] hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="default" />
        ))}
      </div>
    </section>
  );
}
