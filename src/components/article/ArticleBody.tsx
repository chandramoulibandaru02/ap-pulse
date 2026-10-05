import sanitizeHtml from "sanitize-html";

interface ArticleBodyProps {
  content: string;
}

const ARTICLE_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
];

function sanitizeArticleContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: ARTICLE_ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

/**
 * Renders the article body HTML safely.
 * Content is stored as HTML from the rich text editor.
 * Styled via the .article-body class in globals.css.
 */
export default function ArticleBody({ content }: ArticleBodyProps) {
  if (!content) {
    return (
      <p className="text-[#888] italic">No content available.</p>
    );
  }

  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(content) }}
    />
  );
}
