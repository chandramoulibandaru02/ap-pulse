import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { AP_DISTRICTS } from "@/lib/districts";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AP Pulse";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerCategories = CATEGORIES.slice(0, 6);
  const footerDistricts = AP_DISTRICTS.slice(0, 8);

  return (
    <footer className="border-t border-[#e5e5e5] bg-[#111111] text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#c0392b] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm font-serif">AP</span>
              </div>
              <span className="text-white font-bold font-serif text-lg tracking-tight">AP PULSE</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Andhra in every Pulse. Covering news from across Andhra Pradesh — politics, crime, sports, entertainment, and district news.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/latest" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Latest News
                </Link>
              </li>
              {footerCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Districts */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Districts</h3>
            <ul className="space-y-2">
              {footerDistricts.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/district/${d.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Andhra Pradesh, India
          </p>
        </div>
      </div>
    </footer>
  );
}
