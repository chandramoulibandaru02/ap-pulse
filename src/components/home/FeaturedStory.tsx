import ArticleCard from "@/components/article/ArticleCard";
import type { Article } from "@/types/article";

interface FeaturedStoryProps {
  article: Article;
  secondary: Article[];
}

export default function FeaturedStory({ article, secondary }: FeaturedStoryProps) {
  return (
    <section aria-labelledby="featured-heading" className="border-b border-[#e5e5e5] pb-8 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main featured */}
        <div className="lg:col-span-2">
          <ArticleCard article={article} variant="featured" />
        </div>
        {/* Secondary stories */}
        <div className="flex flex-col justify-between gap-6">
          {secondary.slice(0, 3).map((a) => (
            <ArticleCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}
