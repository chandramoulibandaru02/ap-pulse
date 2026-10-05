import {
  collection,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Article, ArticleDoc, ArticleStatus } from "@/types/article";

const ARTICLES_COLLECTION = "articles";
const PAGE_SIZE = 12;
const ADMIN_PAGE_SIZE = 20;

async function refreshPublicContent(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const token = await user.getIdToken();
    const response = await fetch("/api/content/revalidate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Content revalidation failed with status ${response.status}`);
    }
  } catch (error) {
    // The Firestore write succeeded, so do not present cache refresh trouble as a failed save.
    console.warn("Could not refresh public content:", error);
  }
}

// ─── Converters ─────────────────────────────────────────────────────────────

function toDate(val: unknown): Date {
  if (!val) return new Date();
  if (typeof (val as { toDate?: () => Date }).toDate === "function") {
    return (val as { toDate: () => Date }).toDate();
  }
  if (val instanceof Date) return val;
  const d = new Date(val as string | number);
  return isNaN(d.getTime()) ? new Date() : d;
}

function docToArticle(id: string, data: ArticleDoc): Article {
  return {
    id,
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: data.content || "",
    featuredImage: data.featuredImage || "",
    imageCaption: data.imageCaption || "",
    category: data.category || "andhra-pradesh",
    district: data.district ?? null,
    author: data.author || "Staff Reporter",
    status: data.status || "draft",
    breakingNews: data.breakingNews ?? false,
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    updatedAt: toDate(data.updatedAt),
    createdAt: toDate(data.createdAt),
    seoTitle: data.seoTitle ?? data.title ?? "",
    seoDescription: data.seoDescription ?? data.excerpt ?? "",
    keywords: data.keywords ?? [],
    canonicalUrl: data.canonicalUrl ?? "",
  };
}

function snapshotToArticle(snap: QueryDocumentSnapshot<DocumentData>): Article {
  return docToArticle(snap.id, snap.data() as ArticleDoc);
}

// ─── Public Queries (published articles only) ────────────────────────────────

/** Fetch latest published articles for homepage/latest page */
export async function getLatestArticles(
  pageSize = PAGE_SIZE,
  afterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ articles: Article[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const constraints: QueryConstraint[] = [
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      limit(pageSize),
    ];
    if (afterDoc) constraints.push(startAfter(afterDoc));

    const q = query(col, ...constraints);
    const snap = await getDocs(q);
    const articles = snap.docs.map(snapshotToArticle);
    const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
    return { articles, lastDoc };
  } catch (error) {
    console.warn("Could not fetch latest articles:", error);
    return { articles: [], lastDoc: null };
  }
}

/** Fetch articles by category */
export async function getArticlesByCategory(
  categorySlug: string,
  pageSize = PAGE_SIZE,
  afterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ articles: Article[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const constraints: QueryConstraint[] = [
      where("status", "==", "published"),
      where("category", "==", categorySlug),
      orderBy("publishedAt", "desc"),
      limit(pageSize),
    ];
    if (afterDoc) constraints.push(startAfter(afterDoc));

    const q = query(col, ...constraints);
    const snap = await getDocs(q);
    const articles = snap.docs.map(snapshotToArticle);
    const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
    return { articles, lastDoc };
  } catch (error) {
    console.warn(`Could not fetch articles for category ${categorySlug}:`, error);
    return { articles: [], lastDoc: null };
  }
}

/** Fetch articles by district */
export async function getArticlesByDistrict(
  districtSlug: string,
  pageSize = PAGE_SIZE,
  afterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ articles: Article[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const constraints: QueryConstraint[] = [
      where("status", "==", "published"),
      where("district", "==", districtSlug),
      orderBy("publishedAt", "desc"),
      limit(pageSize),
    ];
    if (afterDoc) constraints.push(startAfter(afterDoc));

    const q = query(col, ...constraints);
    const snap = await getDocs(q);
    const articles = snap.docs.map(snapshotToArticle);
    const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
    return { articles, lastDoc };
  } catch (error) {
    console.warn(`Could not fetch articles for district ${districtSlug}:`, error);
    return { articles: [], lastDoc: null };
  }
}

/** Fetch a single published article by slug */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const q = query(
      col,
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snapshotToArticle(snap.docs[0]);
  } catch (error) {
    console.warn(`Could not fetch article by slug ${slug}:`, error);
    return null;
  }
}

/** Fetch breaking news articles */
export async function getBreakingNews(): Promise<Article[]> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const q = query(
      col,
      where("status", "==", "published"),
      where("breakingNews", "==", true),
      orderBy("publishedAt", "desc"),
      limit(5)
    );
    const snap = await getDocs(q);
    return snap.docs.map(snapshotToArticle);
  } catch (error) {
    console.warn("Could not fetch breaking news:", error);
    return [];
  }
}

/** Fetch related articles (same category, excluding current) */
export async function getRelatedArticles(
  category: string,
  excludeSlug: string,
  district?: string | null
): Promise<Article[]> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    // Try same category + district first
    if (district) {
      const q = query(
        col,
        where("status", "==", "published"),
        where("category", "==", category),
        where("district", "==", district),
        orderBy("publishedAt", "desc"),
        limit(4)
      );
      const snap = await getDocs(q);
      const filtered = snap.docs
        .map(snapshotToArticle)
        .filter((a) => a.slug !== excludeSlug);
      if (filtered.length >= 3) return filtered.slice(0, 3);
    }

    // Fallback: same category
    const q = query(
      col,
      where("status", "==", "published"),
      where("category", "==", category),
      orderBy("publishedAt", "desc"),
      limit(5)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(snapshotToArticle)
      .filter((a) => a.slug !== excludeSlug)
      .slice(0, 3);
  } catch (error) {
    console.warn("Could not fetch related articles:", error);
    return [];
  }
}

/** Search articles by title (simple prefix search via Firestore) */
export async function searchArticles(searchQuery: string): Promise<Article[]> {
  if (!searchQuery.trim()) return [];
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    // Firestore doesn't support full-text search natively.
    // We fetch recent published articles and filter client-side.
    const q = query(
      col,
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      limit(100)
    );
    const snap = await getDocs(q);
    const term = searchQuery.toLowerCase();
    return snap.docs
      .map(snapshotToArticle)
      .filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.excerpt.toLowerCase().includes(term) ||
          a.author.toLowerCase().includes(term)
      )
      .slice(0, 20);
  } catch (error) {
    console.warn("Could not search articles:", error);
    return [];
  }
}

/** Fetch all published article slugs (for sitemap) */
export async function getAllPublishedSlugs(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const q = query(col, where("status", "==", "published"), orderBy("publishedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as ArticleDoc;
      return { slug: data.slug, updatedAt: toDate(data.updatedAt) };
    });
  } catch (error) {
    console.warn("Could not fetch published slugs:", error);
    return [];
  }
}

// ─── Homepage sections (limited fetches) ────────────────────────────────────

export async function getHomepageArticles(): Promise<{
  featured: Article | null;
  secondary: Article[];
  latest: Article[];
  politics: Article[];
  crime: Article[];
  sports: Article[];
  entertainment: Article[];
}> {
  try {
    // Top 10 latest for featured + secondary + latest strip
    const { articles: top } = await getLatestArticles(10);
    const [featured, ...rest] = top;
    const secondary = rest.slice(0, 3);
    const latest = rest.slice(0, 6);

    const [politics, crime, sports, entertainment] = await Promise.all([
      getArticlesByCategory("politics", 4),
      getArticlesByCategory("crime", 4),
      getArticlesByCategory("sports", 4),
      getArticlesByCategory("entertainment", 4),
    ]);

    return {
      featured: featured ?? null,
      secondary,
      latest,
      politics: politics.articles,
      crime: crime.articles,
      sports: sports.articles,
      entertainment: entertainment.articles,
    };
  } catch (error) {
    console.warn("Could not load homepage articles:", error);
    return {
      featured: null,
      secondary: [],
      latest: [],
      politics: [],
      crime: [],
      sports: [],
      entertainment: [],
    };
  }
}

// ─── Admin Queries (all statuses) ────────────────────────────────────────────

/** Get article by ID (for admin edit) */
export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const ref = doc(db, ARTICLES_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return docToArticle(snap.id, snap.data() as ArticleDoc);
  } catch (error) {
    console.warn(`Could not get article by id ${id}:`, error);
    return null;
  }
}

/** Get all articles for admin (all statuses) */
export async function getAdminArticles(
  statusFilter?: ArticleStatus,
  pageSize = ADMIN_PAGE_SIZE
): Promise<Article[]> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const constraints: QueryConstraint[] = statusFilter
      ? [where("status", "==", statusFilter), orderBy("createdAt", "desc"), limit(pageSize)]
      : [orderBy("createdAt", "desc"), limit(pageSize)];
    const q = query(col, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(snapshotToArticle);
  } catch (error) {
    console.warn("Could not fetch admin articles:", error);
    return [];
  }
}

/** Fetch exact dashboard status totals without reading every article document. */
export async function getAdminArticleCounts(): Promise<Record<ArticleStatus, number>> {
  const emptyCounts: Record<ArticleStatus, number> = { draft: 0, published: 0, unpublished: 0 };
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const [draft, published, unpublished] = await Promise.all([
      getCountFromServer(query(col, where("status", "==", "draft"))),
      getCountFromServer(query(col, where("status", "==", "published"))),
      getCountFromServer(query(col, where("status", "==", "unpublished"))),
    ]);
    return { draft: draft.data().count, published: published.data().count, unpublished: unpublished.data().count };
  } catch (error) {
    console.warn("Could not fetch admin article counts:", error);
    return emptyCounts;
  }
}

export interface AdminArticlePage {
  articles: Article[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

/** Fetch one cursor-paginated page for the admin article list. */
export async function getAdminArticlePage(
  statusFilter?: ArticleStatus,
  afterDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize = ADMIN_PAGE_SIZE
): Promise<AdminArticlePage> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const constraints: QueryConstraint[] = statusFilter
      ? [where("status", "==", statusFilter), orderBy("createdAt", "desc")]
      : [orderBy("createdAt", "desc")];
    if (afterDoc) constraints.push(startAfter(afterDoc));
    constraints.push(limit(pageSize + 1));

    const snap = await getDocs(query(col, ...constraints));
    const docs = snap.docs.slice(0, pageSize);
    return {
      articles: docs.map(snapshotToArticle),
      lastDoc: docs[docs.length - 1] ?? null,
      hasMore: snap.docs.length > pageSize,
    };
  } catch (error) {
    console.warn("Could not fetch admin article page:", error);
    return { articles: [], lastDoc: null, hasMore: false };
  }
}

/** Get article by slug for admin (any status — for preview) */
export async function getArticleBySlugAdmin(slug: string): Promise<Article | null> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const q = query(col, where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snapshotToArticle(snap.docs[0]);
  } catch (error) {
    console.warn(`Could not get admin article by slug ${slug}:`, error);
    return null;
  }
}

/** Check if a slug is already in use */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const col = collection(db, ARTICLES_COLLECTION);
    const q = query(col, where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    if (excludeId && snap.docs[0].id === excludeId) return false;
    return true;
  } catch (error) {
    console.warn(`Could not check if slug taken for ${slug}:`, error);
    return false;
  }
}

// ─── Admin Mutations ─────────────────────────────────────────────────────────

export interface CreateArticleInput {
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
  publishedAt: Date | null;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  canonicalUrl: string;
}

export async function createArticle(input: CreateArticleInput): Promise<string> {
  const col = collection(db, ARTICLES_COLLECTION);
  const now = serverTimestamp();
  const ref = await addDoc(col, {
    ...input,
    publishedAt: input.publishedAt ? Timestamp.fromDate(input.publishedAt) : null,
    createdAt: now,
    updatedAt: now,
  });
  await refreshPublicContent();
  return ref.id;
}

export async function updateArticle(
  id: string,
  input: Partial<CreateArticleInput>
): Promise<void> {
  const ref = doc(db, ARTICLES_COLLECTION, id);
  await updateDoc(ref, {
    ...input,
    ...(input.publishedAt !== undefined
      ? { publishedAt: input.publishedAt ? Timestamp.fromDate(input.publishedAt) : null }
      : {}),
    updatedAt: serverTimestamp(),
  });
  await refreshPublicContent();
}

export async function deleteArticle(id: string): Promise<void> {
  const ref = doc(db, ARTICLES_COLLECTION, id);
  await deleteDoc(ref);
  await refreshPublicContent();
}

export async function publishArticle(id: string): Promise<void> {
  const ref = doc(db, ARTICLES_COLLECTION, id);
  await updateDoc(ref, {
    status: "published",
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await refreshPublicContent();
}

export async function unpublishArticle(id: string): Promise<void> {
  const ref = doc(db, ARTICLES_COLLECTION, id);
  await updateDoc(ref, {
    status: "unpublished",
    updatedAt: serverTimestamp(),
  });
  await refreshPublicContent();
}
