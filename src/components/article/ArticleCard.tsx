import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/article";
import { formatPublishedDate } from "@/lib/metadata";
import { getCategoryLabel } from "@/lib/categories";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "featured" | "horizontal";
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const publishedDate = article.publishedAt ?? article.createdAt;

  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={`/news/${article.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0]">
            {article.featuredImage ? (
              <Image
                src={article.featuredImage}
                alt={article.imageCaption || article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                className="object-cover group-hover:opacity-95 transition-opacity"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[#e8e6e3] flex items-center justify-center">
                <span className="text-[#999] text-sm">No image</span>
              </div>
            )}
          </div>
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
                {getCategoryLabel(article.category)}
              </span>
              {article.breakingNews && (
                <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b] border border-[#c0392b] px-1.5 py-0.5 rounded-sm">
                  Breaking
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight group-hover:text-[#c0392b] transition-colors">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mt-2 text-[#555] text-base leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-[#888]">
              <span>{article.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={publishedDate.toISOString()}>
                {formatPublishedDate(publishedDate)}
              </time>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-4">
        {article.featuredImage && (
          <Link href={`/news/${article.slug}`} className="flex-shrink-0">
            <div className="relative w-24 h-20 overflow-hidden bg-[#f0f0f0]">
              <Image
                src={article.featuredImage}
                alt={article.imageCaption || article.title}
                fill
                sizes="96px"
                className="object-cover group-hover:opacity-90 transition-opacity"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
            {getCategoryLabel(article.category)}
          </span>
          <h3 className="font-serif font-bold text-sm leading-snug mt-0.5 group-hover:text-[#c0392b] transition-colors line-clamp-2">
            <Link href={`/news/${article.slug}`}>{article.title}</Link>
          </h3>
          <time className="text-xs text-[#888] mt-1 block" dateTime={publishedDate.toISOString()}>
            {formatPublishedDate(publishedDate)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group border-b border-[#e5e5e5] pb-3 last:border-0 last:pb-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
          {getCategoryLabel(article.category)}
        </span>
        <h3 className="font-serif font-bold text-sm leading-snug mt-0.5 group-hover:text-[#c0392b] transition-colors">
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        <time className="text-xs text-[#888] mt-1 block" dateTime={publishedDate.toISOString()}>
          {formatPublishedDate(publishedDate)}
        </time>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group">
      <Link href={`/news/${article.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0] mb-3">
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.imageCaption || article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:opacity-95 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-[#e8e6e3] flex items-center justify-center">
              <span className="text-[#999] text-sm">No image</span>
            </div>
          )}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
          {getCategoryLabel(article.category)}
        </span>
        <h3 className="font-serif font-bold text-base md:text-lg leading-snug mt-1 group-hover:text-[#c0392b] transition-colors line-clamp-3">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#888]">
          <span>{article.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedDate.toISOString()}>
            {formatPublishedDate(publishedDate)}
          </time>
        </div>
      </Link>
    </article>
  );
}
