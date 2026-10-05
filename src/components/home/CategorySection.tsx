import Link from "next/link";
import ArticleCard from "@/components/article/ArticleCard";
import type { Article } from "@/types/article";

interface CategorySectionProps {
  title: string;
  slug: string;
  articles: Article[];
}

export default function CategorySection({ title, slug, articles }: CategorySectionProps) {
  if (!articles.length) return null;

  const [lead, ...rest] = articles;

  return (
    <section
      aria-labelledby={`section-${slug}`}
      className="mb-10 pb-8 border-b border-[#e5e5e5] last:border-0"
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          id={`section-${slug}`}
          className="font-serif text-xl font-bold border-l-4 border-[#c0392b] pl-3"
        >
          {title}
        </h2>
        <Link
          href={`/category/${slug}`}
          className="text-xs font-medium text-[#c0392b] hover:underline underline-offset-2"
        >
          More {title} →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead article */}
        <div className="lg:col-span-1">
          <ArticleCard article={lead} variant="default" />
        </div>
        {/* Compact list */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
