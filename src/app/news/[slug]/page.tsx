import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { getCategoryLabel } from "@/lib/categories";
import { getDistrictName } from "@/lib/districts";
import { formatPublishedDate, formatDateISO, buildArticleUrl, SITE_NAME, SITE_URL } from "@/lib/metadata";
import Breadcrumbs from "@/components/article/Breadcrumbs";
import ArticleBody from "@/components/article/ArticleBody";
import RelatedArticles from "@/components/article/RelatedArticles";
import ShareButtons from "@/components/article/ShareButtons";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  const publishedDate = article.publishedAt ?? article.createdAt;
  const articleUrl = buildArticleUrl(slug);

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    keywords: article.keywords,
    alternates: { canonical: articleUrl },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      publishedTime: formatDateISO(publishedDate),
      modifiedTime: formatDateISO(article.updatedAt),
      authors: [article.author],
      siteName: SITE_NAME,
      images: article.featuredImage
        ? [{ url: article.featuredImage, alt: article.imageCaption || article.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.category, slug, article.district);
  const publishedDate = article.publishedAt ?? article.createdAt;
  const articleUrl = buildArticleUrl(slug);

  // NewsArticle structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: formatDateISO(publishedDate),
    dateModified: formatDateISO(article.updatedAt),
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    keywords: article.keywords?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            category={article.category}
            district={article.district}
            articleTitle={article.title}
          />

          {/* Category + breaking tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c0392b]">
              {getCategoryLabel(article.category)}
            </span>
            {article.district && (
              <>
                <span className="text-[#ccc]" aria-hidden="true">·</span>
                <span className="text-xs text-[#888]">
                  {getDistrictName(article.district)}
                </span>
              </>
            )}
            {article.breakingNews && (
              <span className="text-xs font-semibold text-[#c0392b] border border-[#c0392b] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                Breaking
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
            {article.title}
          </h1>

          {/* Excerpt / subheadline */}
          {article.excerpt && (
            <p className="text-lg text-[#555] leading-relaxed mb-4 font-serif">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#888] pb-4 border-b border-[#e5e5e5] mb-6">
            <span className="font-medium text-[#444]">By {article.author}</span>
            <time dateTime={formatDateISO(publishedDate)}>
              Published {formatPublishedDate(publishedDate)}
            </time>
            {article.updatedAt > publishedDate && (
              <time dateTime={formatDateISO(article.updatedAt)}>
                Updated {formatPublishedDate(article.updatedAt)}
              </time>
            )}
          </div>

          {/* Featured image */}
          {article.featuredImage && (
            <figure className="mb-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#f0f0f0]">
                <Image
                  src={article.featuredImage}
                  alt={article.imageCaption || article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
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

          {/* Article body */}
          <ArticleBody content={article.content} />

          {/* Share */}
          <ShareButtons url={articleUrl} title={article.title} />

          {/* Related articles */}
          <RelatedArticles articles={related} />
        </div>
      </div>
    </>
  );
}
