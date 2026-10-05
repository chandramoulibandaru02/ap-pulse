import { format, formatDistanceToNow, isAfter, subDays } from "date-fns";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AP Pulse";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://appulse.in";

/**
 * Format a date for display.
 * Shows relative time if within 24h, otherwise the full date.
 */
export function formatPublishedDate(date: Date): string {
  if (isAfter(date, subDays(new Date(), 1))) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return format(date, "dd MMM yyyy, hh:mm a");
}

/**
 * Format a date for the <time> datetime attribute (ISO).
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Build canonical URL for an article.
 */
export function buildArticleUrl(slug: string, base = SITE_URL): string {
  return `${base}/news/${slug}`;
}

/**
 * Build canonical URL for a category.
 */
export function buildCategoryUrl(slug: string, base = SITE_URL): string {
  return `${base}/category/${slug}`;
}

/**
 * Build canonical URL for a district.
 */
export function buildDistrictUrl(slug: string, base = SITE_URL): string {
  return `${base}/district/${slug}`;
}

export { SITE_NAME, SITE_URL };
