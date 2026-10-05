import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { formatPublishedDate } from "@/lib/metadata";

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles.length) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-10 pt-8 border-t border-[#e5e5e5]">
      <h2 id="related-heading" className="font-serif text-xl font-bold mb-6">
        Related News
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {articles.map((article) => {
          const date = article.publishedAt ?? article.createdAt;
          return (
            <article key={article.id} className="group">
              <Link href={`/news/${article.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0] mb-3">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.imageCaption || article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e8e6e3]" />
                  )}
                </div>
                <h3 className="font-serif font-bold text-sm leading-snug group-hover:text-[#c0392b] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <time className="text-xs text-[#888] mt-1 block" dateTime={date.toISOString()}>
                  {formatPublishedDate(date)}
                </time>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
