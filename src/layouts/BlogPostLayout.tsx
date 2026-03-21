import Link from "next/link";
import type { BlogConfig, TemplateBlogPost } from "../types";
import { BlogPostCTA } from "../components/BlogPostCTA";
import { formatDate } from "../utils";

interface BlogPostLayoutProps {
  post: TemplateBlogPost;
  config: BlogConfig;
  olderPost: TemplateBlogPost | null;
  newerPost: TemplateBlogPost | null;
  children: React.ReactNode;
}

export function BlogPostLayout({
  post,
  config,
  olderPost,
  newerPost,
  children,
}: BlogPostLayoutProps) {
  const { colors, brand, domain, theme } = config;
  const isDark = theme === "dark";

  const jsonLdGraph: object[] = [
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedDate,
      dateModified: post.modifiedDate,
      author: {
        "@type": "Organization",
        name: post.author.name,
      },
      publisher: {
        "@type": "Organization",
        name: brand.name,
        url: `https://${domain}`,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://${domain}/blog/${post.slug}`,
      },
      wordCount: post.wordCount,
      articleSection: post.category,
      keywords: post.tags.join(", "),
      url: `https://${domain}/blog/${post.slug}`,
      image:
        post.coverImage ??
        `https://${domain}/blog/${post.slug}/opengraph-image`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `https://${domain}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `https://${domain}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `https://${domain}/blog/${post.slug}`,
        },
      ],
    },
  ];

  if (post.faqData && post.faqData.length > 0) {
    jsonLdGraph.push({
      "@type": "FAQPage",
      mainEntity: post.faqData.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": jsonLdGraph,
  };

  const cssVars = {
    "--blog-primary-light": `${colors.primary}30`,
  } as React.CSSProperties;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article style={cssVars}>
        {/* Hero */}
        <header
          className="pt-32 pb-12 md:pt-40 md:pb-16"
          style={{ backgroundColor: colors.background }}
        >
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <nav className={`flex items-center gap-2 text-sm mb-8 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <Link
                href="/"
                className={`transition-colors ${isDark ? "hover:text-gray-300" : "hover:text-gray-700"}`}
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className={`transition-colors ${isDark ? "hover:text-gray-300" : "hover:text-gray-700"}`}
              >
                Blog
              </Link>
              <span>/</span>
              <span className={`font-medium truncate ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                {post.title}
              </span>
            </nav>

            {/* Cover Image Hero */}
            {post.coverImage && (
              <div className="relative w-full aspect-[1200/630] rounded-xl overflow-hidden mb-8">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            {/* Category + Read Time */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {post.category}
              </span>
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {post.readingTime}
              </span>
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                &middot;
              </span>
              <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {post.wordCount.toLocaleString()} words
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {post.title}
            </h1>

            {/* Description */}
            <p className={`text-lg md:text-xl mb-8 max-w-3xl ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {post.description}
            </p>

            {/* Author + Date */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: colors.primary }}
              >
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className={`font-medium text-sm ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                  {post.author.name}
                </div>
                <time
                  dateTime={post.publishedDate}
                  className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  {formatDate(post.publishedDate)}
                </time>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="py-12 md:py-16" style={{ backgroundColor: colors.background }}>
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div
              className={`rounded-2xl border p-6 md:p-10 lg:p-12 ${
                isDark
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {children}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10">
                <h3
                  className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-sm px-3 py-1 rounded-full ${
                        isDark
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <BlogPostCTA config={config} />

            {/* Prev / Next Navigation */}
            {(olderPost || newerPost) && (
              <div className="mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {olderPost ? (
                    <Link
                      href={`/blog/${olderPost.slug}`}
                      className="group block"
                    >
                      <div
                        className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between ${
                          isDark
                            ? "border-gray-700 bg-gray-900 hover:border-gray-600"
                            : "border-gray-200 bg-white hover:border-[var(--blog-primary-light)]"
                        }`}
                      >
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          &larr; Previous Article
                        </span>
                        <h3
                          className={`mt-3 font-bold transition-colors line-clamp-2 ${
                            isDark ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {olderPost.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {olderPost.readingTime}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {newerPost ? (
                    <Link
                      href={`/blog/${newerPost.slug}`}
                      className="group block"
                    >
                      <div
                        className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between text-right ${
                          isDark
                            ? "border-gray-700 bg-gray-900 hover:border-gray-600"
                            : "border-gray-200 bg-white hover:border-[var(--blog-primary-light)]"
                        }`}
                      >
                        <span className="text-xs text-gray-400 uppercase tracking-wider">
                          Next Article &rarr;
                        </span>
                        <h3
                          className={`mt-3 font-bold transition-colors line-clamp-2 ${
                            isDark ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {newerPost.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {newerPost.readingTime}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: colors.primary }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
