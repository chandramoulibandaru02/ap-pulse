import { getLatestArticles } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import { getCategoryLabel } from "@/lib/categories";

export const revalidate = 3600;

export async function GET() {
  const { articles } = await getLatestArticles(50);

  const items = articles
    .map((article) => {
      const date = article.publishedAt ?? article.createdAt;
      const url = `${SITE_URL}/news/${article.slug}`;
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <category>${getCategoryLabel(article.category)}</category>
      <author>${article.author}</author>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Andhra Pradesh News — ${SITE_NAME}</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
