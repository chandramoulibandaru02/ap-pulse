import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByDistrict } from "@/lib/articles";
import { getDistrictBySlug, AP_DISTRICTS } from "@/lib/districts";
import { buildDistrictUrl, SITE_NAME } from "@/lib/metadata";
import ArticleCard from "@/components/article/ArticleCard";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return AP_DISTRICTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);
  if (!district) return { title: "District Not Found" };
  const url = buildDistrictUrl(slug);
  return {
    title: `${district.name} News`,
    description: `Latest news from ${district.name} district, Andhra Pradesh.`,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${district.name} News | ${SITE_NAME}`,
      description: `Latest news from ${district.name} district, Andhra Pradesh.`,
    },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);
  if (!district) notFound();

  const { articles } = await getArticlesByDistrict(slug, 20);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="border-b border-[#e5e5e5] pb-6 mb-8">
        <div className="text-xs text-[#888] mb-1">District</div>
        <h1 className="font-serif text-3xl font-bold">{district.name}</h1>
        <p className="text-[#888] text-sm mt-1">{district.telugu}</p>
        <p className="text-[#666] text-sm mt-2">
          Latest news from {district.name} district, Andhra Pradesh.
        </p>
      </header>

      {articles.length === 0 ? (
        <EmptyState
          message={`No news found for ${district.name} yet.`}
          description="District news will appear here as it is published."
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
