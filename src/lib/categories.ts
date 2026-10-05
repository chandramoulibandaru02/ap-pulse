import type { Category } from "@/types/article";

export const CATEGORIES: Category[] = [
  {
    slug: "latest",
    label: "Latest News",
    description: "The latest news from across Andhra Pradesh.",
  },
  {
    slug: "andhra-pradesh",
    label: "Andhra Pradesh",
    description: "State news, government updates, and developments from Andhra Pradesh.",
  },
  {
    slug: "politics",
    label: "Politics",
    description: "Political news, elections, and legislative developments in Andhra Pradesh.",
  },
  {
    slug: "crime",
    label: "Crime",
    description: "Crime reports and law enforcement news from Andhra Pradesh.",
  },
  {
    slug: "sports",
    label: "Sports",
    description: "Sports news, results, and updates from Andhra Pradesh and beyond.",
  },
  {
    slug: "entertainment",
    label: "Entertainment",
    description: "Telugu film, music, and entertainment news.",
  },
  {
    slug: "business",
    label: "Business",
    description: "Business, economy, and industry news from Andhra Pradesh.",
  },
  {
    slug: "education",
    label: "Education",
    description: "Education news, exam results, and academic updates from Andhra Pradesh.",
  },
  {
    slug: "technology",
    label: "Technology",
    description: "Technology, startups, and innovation news from Andhra Pradesh.",
  },
  {
    slug: "health",
    label: "Health",
    description: "Health, medicine, and public health news from Andhra Pradesh.",
  },
  {
    slug: "district-news",
    label: "District News",
    description: "Local news from all 26 districts of Andhra Pradesh.",
  },
];

// Primary nav categories (shown in header)
export const NAV_CATEGORIES = CATEGORIES.filter((c) =>
  ["latest", "politics", "crime", "sports", "entertainment"].includes(c.slug)
);

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategoryBySlug(slug)?.label ?? slug;
}
