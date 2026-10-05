import Link from "next/link";
import { getCategoryLabel } from "@/lib/categories";
import { getDistrictName } from "@/lib/districts";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  category?: string;
  district?: string | null;
  articleTitle?: string;
}

export default function Breadcrumbs({ category, district, articleTitle }: BreadcrumbsProps) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];

  if (category) {
    crumbs.push({ label: getCategoryLabel(category), href: `/category/${category}` });
  }
  if (district) {
    crumbs.push({ label: getDistrictName(district), href: `/district/${district}` });
  }
  if (articleTitle) {
    crumbs.push({ label: articleTitle });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-[#888] flex flex-wrap items-center gap-1.5 mb-4">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-[#ccc]">›</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-[#c0392b] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#444] line-clamp-1" aria-current="page">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
