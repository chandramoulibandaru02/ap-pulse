import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { AP_DISTRICTS } from "@/lib/districts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://appulse.in";

export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/latest`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // District pages
  const districtPages: MetadataRoute.Sitemap = AP_DISTRICTS.map((d) => ({
    url: `${SITE_URL}/district/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Article pages
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPublishedSlugs();
    articlePages = slugs.map(({ slug, updatedAt }) => ({
      url: `${SITE_URL}/news/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If Firestore is unavailable, return static pages only
  }

  return [...staticPages, ...categoryPages, ...districtPages, ...articlePages];
}
