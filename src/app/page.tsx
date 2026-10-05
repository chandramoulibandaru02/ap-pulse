import type { Metadata } from "next";
import { getHomepageArticles, getBreakingNews } from "@/lib/articles";
import BreakingNewsBanner from "@/components/layout/BreakingNewsBanner";
import FeaturedStory from "@/components/home/FeaturedStory";
import LatestNews from "@/components/home/LatestNews";
import CategorySection from "@/components/home/CategorySection";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AP Pulse — Andhra Pradesh News",
  description:
    "AP Pulse covers breaking news, politics, crime, sports, entertainment, and district news from across Andhra Pradesh.",
};

export default async function HomePage() {
  const [breakingNews, homeData] = await Promise.all([
    getBreakingNews(),
    getHomepageArticles(),
  ]);

  const { featured, secondary, latest, politics, crime, sports, entertainment } = homeData;

  const hasContent = featured || latest.length > 0;

  return (
    <>
      <BreakingNewsBanner articles={breakingNews} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!hasContent ? (
          <EmptyState
            message="No news published yet."
            description="Check back soon — the latest Andhra Pradesh news will appear here."
          />
        ) : (
          <>
            {featured && (
              <FeaturedStory article={featured} secondary={secondary} />
            )}
            <LatestNews articles={latest} />
            <CategorySection title="Politics" slug="politics" articles={politics} />
            <CategorySection title="Crime" slug="crime" articles={crime} />
            <CategorySection title="Sports" slug="sports" articles={sports} />
            <CategorySection title="Entertainment" slug="entertainment" articles={entertainment} />
          </>
        )}
      </div>
    </>
  );
}
