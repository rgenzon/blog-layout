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
  const { brand, domain } = config;

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Hero */}
        <header className="pt-8 pb-8 md:pt-12 md:pb-12 bg-background">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8 text-muted-foreground">
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="font-medium truncate text-foreground">
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
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {post.readingTime}
              </span>
              <span className="text-sm text-muted-foreground">
                &middot;
              </span>
              <span className="text-sm text-muted-foreground">
                {post.wordCount.toLocaleString()} words
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl mb-8 max-w-3xl text-muted-foreground">
              {post.description}
            </p>

            {/* Author + Date */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm bg-primary text-primary-foreground">
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">
                  {post.author.name}
                </div>
                <time
                  dateTime={post.publishedDate}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(post.publishedDate)}
                </time>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="py-12 md:py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="rounded-xl border border-border bg-card p-6 md:p-10 lg:p-12 shadow-lg shadow-black/5 dark:shadow-black/40">
              {children}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-muted-foreground">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground"
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
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-input transition-all duration-300 h-full flex flex-col justify-between">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          &larr; Previous Article
                        </span>
                        <h3 className="mt-3 font-bold transition-colors line-clamp-2 text-foreground">
                          {olderPost.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
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
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-input transition-all duration-300 h-full flex flex-col justify-between text-right">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          Next Article &rarr;
                        </span>
                        <h3 className="mt-3 font-bold transition-colors line-clamp-2 text-foreground">
                          {newerPost.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
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
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-primary"
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
