import Link from "next/link";
import type { Article } from "@/types/article";

interface BreakingNewsBannerProps {
  articles: Article[];
}

export default function BreakingNewsBanner({ articles }: BreakingNewsBannerProps) {
  if (!articles.length) return null;

  return (
    <div className="bg-[#c0392b] text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-hidden">
        <span className="flex-shrink-0 text-xs font-bold uppercase tracking-widest border border-white/50 px-2 py-0.5 rounded-sm">
          Breaking
        </span>
        <div className="overflow-hidden flex-1">
          <ul className="flex gap-6 text-sm overflow-x-auto scrollbar-none">
            {articles.map((article) => (
              <li key={article.id} className="flex-shrink-0">
                <Link
                  href={`/news/${article.slug}`}
                  className="hover:underline underline-offset-2"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
