import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/articles";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { buildCategoryUrl, SITE_NAME } from "@/lib/metadata";
import ArticleCard from "@/components/article/ArticleCard";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  const url = buildCategoryUrl(slug);
  return {
    title: `${category.label} News`,
    description: category.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${category.label} News | ${SITE_NAME}`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const { articles } = await getArticlesByCategory(slug, 20);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.label} News | ${SITE_NAME}`,
    description: category.description,
    url: buildCategoryUrl(slug),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="border-b border-[#e5e5e5] pb-6 mb-8">
          <h1 className="font-serif text-3xl font-bold">{category.label}</h1>
          <p className="text-[#666] mt-2 text-sm">{category.description}</p>
        </header>

        {articles.length === 0 ? (
          <EmptyState
            message={`No news available in ${category.label} yet.`}
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
    </>
  );
}
