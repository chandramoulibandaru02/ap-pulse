import Link from "next/link";

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export default function EmptyState({
  message = "No articles found",
  description = "Check back soon for updates.",
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <p className="text-[#444] font-medium text-lg">{message}</p>
      <p className="text-[#888] text-sm mt-2">{description}</p>
      <Link
        href="/"
        className="inline-block mt-6 px-4 py-2 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
