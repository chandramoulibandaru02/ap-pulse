import Link from "next/link";
import { AP_DISTRICTS } from "@/lib/districts";

export default function DistrictSelector() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {AP_DISTRICTS.map((d) => (
        <Link
          key={d.slug}
          href={`/district/${d.slug}`}
          className="px-3 py-2 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors text-center"
        >
          {d.name}
        </Link>
      ))}
    </div>
  );
}
