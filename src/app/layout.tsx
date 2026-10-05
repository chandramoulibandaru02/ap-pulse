import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AP Pulse";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://appulse.in";
const SITE_TAGLINE = process.env.NEXT_PUBLIC_SITE_TAGLINE ?? "Andhra in every Pulse";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "AP Pulse covers breaking news, politics, crime, sports, entertainment, and district news from across Andhra Pradesh.",
  keywords: ["Andhra Pradesh news", "AP news", "Telugu news", "AP Pulse"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "AP Pulse covers breaking news, politics, crime, sports, entertainment, and district news from across Andhra Pradesh.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "AP Pulse covers breaking news, politics, crime, sports, entertainment, and district news from across Andhra Pradesh.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/rss.xml` },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white text-[#111111]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
