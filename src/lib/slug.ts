/**
 * Slug generation utilities.
 * Slugs are generated once at creation time and never changed when a title is edited,
 * to avoid breaking published URLs.
 */

/**
 * Convert a title string to a clean URL slug.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, "-") // spaces/underscores to hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Make a slug unique by appending a timestamp suffix.
 * Call this only when a collision is detected.
 */
export function makeUniqueSlug(baseSlug: string): string {
  const suffix = Date.now().toString(36).slice(-4);
  return `${baseSlug}-${suffix}`;
}
