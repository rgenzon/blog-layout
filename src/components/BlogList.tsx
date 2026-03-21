"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogConfig, TemplateBlogPost } from "../types";
import { formatDate } from "../utils";

interface BlogListProps {
  posts: TemplateBlogPost[];
  categories: string[];
  config: BlogConfig;
}

export function BlogList({ posts, categories, config }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const primary = config.colors.primary;
  const primaryDark = config.colors.primaryDark;

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  const featuredPost = filteredPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || p !== featuredPost);

  // Derive a light tint from primary for badges
  const badgeBg = `${primary}20`;

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "text-white"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
            style={
              activeCategory === cat
                ? { backgroundColor: primary }
                : undefined
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="md:col-span-2 group block"
          >
            <article className="rounded-xl border border-border bg-card overflow-hidden card-highlight shadow-sm shadow-black/5 dark:shadow-black/30 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/50 hover:border-input transition-all duration-300">
              <div className="h-72 w-full overflow-hidden">
                {featuredPost.coverImage ? (
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-8"
                    style={{
                      background: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 50%, ${primaryDark} 100%)`,
                    }}
                  >
                    <p className="text-white/90 text-lg md:text-xl font-medium text-center max-w-lg leading-relaxed">
                      {featuredPost.excerpt || featuredPost.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: primary }}
                  >
                    Featured
                  </span>
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: badgeBg, color: primary }}
                  >
                    {featuredPost.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold transition-colors mb-3 text-foreground">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {featuredPost.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featuredPost.readingTime}</span>
                  <span>&middot;</span>
                  <time dateTime={featuredPost.publishedDate}>
                    {formatDate(featuredPost.publishedDate)}
                  </time>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Regular Posts */}
        {regularPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="rounded-xl border border-border bg-card overflow-hidden card-highlight shadow-sm shadow-black/5 dark:shadow-black/30 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/50 hover:border-input transition-all duration-300 h-full flex flex-col">
              <div className="h-48 w-full overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-6"
                    style={{
                      background: `linear-gradient(135deg, ${primary} 0%, ${primary} 50%, ${primaryDark} 100%)`,
                    }}
                  >
                    <p className="text-white/80 text-sm text-center max-w-xs leading-relaxed">
                      {post.excerpt || post.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full self-start mb-3"
                  style={{ backgroundColor: badgeBg, color: primary }}
                >
                  {post.category}
                </span>
                <h3 className="text-lg font-bold transition-colors mb-2 text-foreground">
                  {post.title}
                </h3>
                <p className="text-sm mb-4 line-clamp-2 flex-1 text-muted-foreground">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{post.readingTime}</span>
                  <span>&middot;</span>
                  <time dateTime={post.publishedDate}>
                    {formatDate(post.publishedDate)}
                  </time>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No posts found in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
