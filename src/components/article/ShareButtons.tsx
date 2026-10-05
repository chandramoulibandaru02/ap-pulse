"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 pt-6 border-t border-[#e5e5e5]">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">
        Share
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#e5e5e5] rounded hover:border-[#25D366] hover:text-[#25D366] transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#e5e5e5] rounded hover:border-[#1877f2] hover:text-[#1877f2] transition-colors"
      >
        Facebook
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#e5e5e5] rounded hover:border-[#111] hover:text-[#111] transition-colors"
      >
        X
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#e5e5e5] rounded hover:border-[#c0392b] hover:text-[#c0392b] transition-colors"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
