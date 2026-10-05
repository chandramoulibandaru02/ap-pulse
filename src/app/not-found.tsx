import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl font-serif font-bold text-[#e5e5e5] mb-4">404</div>
      <h1 className="font-serif text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-[#666] mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-[#c0392b] text-white text-sm font-medium hover:bg-[#96281b] transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/latest"
          className="px-5 py-2.5 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors"
        >
          Latest News
        </Link>
        <Link
          href="/search"
          className="px-5 py-2.5 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
