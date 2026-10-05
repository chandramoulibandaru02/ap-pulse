// TypeScript types for AP Pulse

export type ArticleStatus = "draft" | "published" | "unpublished";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageCaption: string;
  category: string; // category slug
  district: string | null; // district slug or null
  author: string;
  status: ArticleStatus;
  breakingNews: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  canonicalUrl: string;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageCaption: string;
  category: string;
  district: string;
  author: string;
  status: ArticleStatus;
  breakingNews: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  publishedAt: string; // ISO string for the form
}

export interface Category {
  slug: string;
  label: string;
  description: string;
}

export interface District {
  slug: string;
  name: string;
  telugu: string;
}

// Firestore raw document shape (timestamps come as Firestore Timestamp)
export interface ArticleDoc {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageCaption: string;
  category: string;
  district: string | null;
  author: string;
  status: ArticleStatus;
  breakingNews: boolean;
  publishedAt: { toDate: () => Date } | null;
  updatedAt: { toDate: () => Date };
  createdAt: { toDate: () => Date };
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  canonicalUrl: string;
}
