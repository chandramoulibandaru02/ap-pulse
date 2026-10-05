"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { AP_DISTRICTS } from "@/lib/districts";
import { generateSlug, makeUniqueSlug } from "@/lib/slug";
import { createArticle, updateArticle, isSlugTaken } from "@/lib/articles";
import type { Article, ArticleStatus } from "@/types/article";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";

interface ArticleFormProps {
  article?: Article; // If provided, editing mode
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageCaption: string;
  category: string;
  district: string;
  author: string;
  breakingNews: boolean;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  status: ArticleStatus;
}

const EMPTY: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  imageCaption: "",
  category: "andhra-pradesh",
  district: "",
  author: "",
  breakingNews: false,
  seoTitle: "",
  seoDescription: "",
  keywords: "",
  status: "draft",
};

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.title.trim()) errors.title = "Headline is required.";
  if (!form.slug.trim()) errors.slug = "URL slug is required.";
  if (!form.excerpt.trim()) errors.excerpt = "Excerpt is required.";
  if (!form.content.trim() || form.content === "<br>") errors.content = "Article content is required.";
  if (!form.author.trim()) errors.author = "Author name is required.";
  if (!form.category) errors.category = "Category is required.";
  return errors;
}

export default function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!article;

  const [form, setForm] = useState<FormState>(
    article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          featuredImage: article.featuredImage,
          imageCaption: article.imageCaption,
          category: article.category,
          district: article.district ?? "",
          author: article.author,
          breakingNews: article.breakingNews,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          keywords: article.keywords?.join(", ") ?? "",
          status: article.status,
        }
      : EMPTY
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState<ArticleStatus | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(isEditing);
  const saveInFlight = useRef(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function setTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: slugManual ? current.slug : generateSlug(title),
    }));
    setErrors((current) => ({ ...current, title: "", slug: "" }));
  }

  async function save(targetStatus: ArticleStatus) {
    if (saveInFlight.current) return;

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    saveInFlight.current = true;
    setSaving(true);
    setSavingStatus(targetStatus);
    setSaveMessage(null);
    try {
      // Check slug uniqueness
      const taken = await isSlugTaken(form.slug, article?.id);
      let finalSlug = form.slug;
      if (taken) {
        finalSlug = makeUniqueSlug(form.slug);
        setForm((f) => ({ ...f, slug: finalSlug }));
      }

      const payload = {
        title: form.title.trim(),
        slug: finalSlug,
        excerpt: form.excerpt.trim(),
        content: form.content,
        featuredImage: form.featuredImage,
        imageCaption: form.imageCaption.trim(),
        category: form.category,
        district: form.district || null,
        author: form.author.trim(),
        status: targetStatus,
        breakingNews: form.breakingNews,
        publishedAt: targetStatus === "published" ? new Date() : null,
        seoTitle: form.seoTitle.trim() || form.title.trim(),
        seoDescription: form.seoDescription.trim() || form.excerpt.trim(),
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${finalSlug}`,
      };

      if (isEditing && article) {
        await updateArticle(article.id, payload);
        setForm((current) => ({ ...current, status: targetStatus, slug: finalSlug }));
        setSaveMessage(targetStatus === "published" ? "Article published successfully." : "Article saved as a draft.");
        router.refresh();
      } else {
        const id = await createArticle(payload);
        setForm((current) => ({ ...current, status: targetStatus, slug: finalSlug }));
        setSaveMessage(targetStatus === "published" ? "Article published. Redirecting…" : "Draft saved. Redirecting…");
        setTimeout(() => router.push(`/admin/articles/${id}/edit`), 1000);
      }
    } catch (err) {
      console.error(err);
      setSaveMessage(targetStatus === "published" ? "Publishing failed. Please try again." : "Saving failed. Please try again.");
    } finally {
      setSaving(false);
      setSavingStatus(null);
      saveInFlight.current = false;
    }
  }

  const fieldClass = (name: string) =>
    `w-full px-3 py-2.5 border text-sm focus:outline-none focus:border-[#c0392b] ${
      errors[name] ? "border-red-400" : "border-[#e5e5e5]"
    }`;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      {saveMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 px-4 py-3 text-sm border ${
            saveMessage.includes("wrong") || saveMessage.includes("error") || saveMessage.includes("failed")
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Headline */}
          <div>
            <label htmlFor="title" className="block text-xs font-medium text-[#444] mb-1">
              Headline <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${fieldClass("title")} text-lg font-serif`}
              placeholder="Article headline…"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600" role="alert">{errors.title}</p>}
          </div>

          {/* Excerpt / subheadline */}
          <div>
            <label htmlFor="excerpt" className="block text-xs font-medium text-[#444] mb-1">
              Excerpt / Subheadline <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              className={`${fieldClass("excerpt")} resize-none`}
              rows={3}
              placeholder="A brief summary of the article (also shown in listings and SEO)…"
            />
            {errors.excerpt && <p className="mt-1 text-xs text-red-600" role="alert">{errors.excerpt}</p>}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-xs font-medium text-[#444] mb-2">
              Featured Image
            </label>
            <ImageUpload
              value={form.featuredImage}
              onChange={(url) => set("featuredImage", url)}
              onCaptionChange={(cap) => set("imageCaption", cap)}
              caption={form.imageCaption}
            />
          </div>

          {/* Article content */}
          <div>
            <label className="block text-xs font-medium text-[#444] mb-2">
              Article Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(val) => set("content", val)}
            />
            {errors.content && <p className="mt-1 text-xs text-red-600" role="alert">{errors.content}</p>}
          </div>

          {/* SEO section */}
          <div className="border border-[#e5e5e5] p-5">
            <h2 className="font-medium text-sm mb-4 text-[#444]">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="seoTitle" className="block text-xs font-medium text-[#444] mb-1">
                  SEO Title
                </label>
                <input
                  id="seoTitle"
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  className={fieldClass("seoTitle")}
                  placeholder="Defaults to article headline if left blank"
                  maxLength={70}
                />
                <p className="mt-1 text-xs text-[#888]">{form.seoTitle.length}/70</p>
              </div>
              <div>
                <label htmlFor="seoDescription" className="block text-xs font-medium text-[#444] mb-1">
                  Meta Description
                </label>
                <textarea
                  id="seoDescription"
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  className={`${fieldClass("seoDescription")} resize-none`}
                  rows={2}
                  placeholder="Defaults to excerpt if left blank"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-[#888]">{form.seoDescription.length}/160</p>
              </div>
              <div>
                <label htmlFor="keywords" className="block text-xs font-medium text-[#444] mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  id="keywords"
                  type="text"
                  value={form.keywords}
                  onChange={(e) => set("keywords", e.target.value)}
                  className={fieldClass("keywords")}
                  placeholder="e.g. Visakhapatnam, crime, arrest"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Publish actions */}
          <div className="bg-white border border-[#e5e5e5] p-5">
            <h2 className="font-medium text-sm mb-4 text-[#444]">Publish</h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => save("published")}
                disabled={saving || form.status === "published"}
                className="w-full py-2.5 bg-[#c0392b] text-white text-sm font-medium hover:bg-[#96281b] transition-colors disabled:opacity-60"
              >
                {savingStatus === "published" ? "Publishing…" : form.status === "published" ? "Published" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => save("draft")}
                disabled={saving}
                className="w-full py-2.5 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-60"
              >
                {savingStatus === "draft" ? "Saving draft…" : "Save Draft"}
              </button>
              {isEditing && article && (
                <a
                  href={`/admin/articles/${article.id}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 border border-[#e5e5e5] text-sm text-[#444] hover:border-[#c0392b] hover:text-[#c0392b] transition-colors text-center block"
                >
                  Preview ↗
                </a>
              )}
            </div>
            {isEditing && (
              <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                <div className="text-xs text-[#888] space-y-1">
                  <div>Status: <span className="text-[#444] font-medium capitalize">{form.status}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-white border border-[#e5e5e5] p-5">
            <label htmlFor="category" className="block text-xs font-medium text-[#444] mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={`${fieldClass("category")} bg-white`}
            >
              <option value="">— Select category —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-600" role="alert">{errors.category}</p>}
          </div>

          {/* District */}
          <div className="bg-white border border-[#e5e5e5] p-5">
            <label htmlFor="district" className="block text-xs font-medium text-[#444] mb-2">
              District (optional)
            </label>
            <select
              id="district"
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#c0392b] bg-white"
            >
              <option value="">— Not district-specific —</option>
              {AP_DISTRICTS.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="bg-white border border-[#e5e5e5] p-5">
            <label htmlFor="author" className="block text-xs font-medium text-[#444] mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              id="author"
              type="text"
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              className={fieldClass("author")}
              placeholder="Reporter / Editor name"
            />
            {errors.author && <p className="mt-1 text-xs text-red-600" role="alert">{errors.author}</p>}
          </div>

          {/* URL Slug */}
          <div className="bg-white border border-[#e5e5e5] p-5">
            <label htmlFor="slug" className="block text-xs font-medium text-[#444] mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                set("slug", generateSlug(e.target.value));
              }}
              className={fieldClass("slug")}
              placeholder="auto-generated-from-title"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-600" role="alert">{errors.slug}</p>}
            <p className="mt-1 text-xs text-[#888]">
              /news/{form.slug || "slug"}
            </p>
            {isEditing && (
              <p className="mt-1 text-xs text-yellow-600">
                ⚠ Changing the slug on a published article will break existing links.
              </p>
            )}
          </div>

          {/* Breaking news */}
          <div className="bg-white border border-[#e5e5e5] p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.breakingNews}
                onChange={(e) => set("breakingNews", e.target.checked)}
                className="w-4 h-4 accent-[#c0392b]"
              />
              <span className="text-sm text-[#444] font-medium">Mark as Breaking News</span>
            </label>
            <p className="text-xs text-[#888] mt-1 ml-7">
              Shows in the breaking news banner on the homepage.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
