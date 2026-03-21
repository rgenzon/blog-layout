import type { BlogConfig, TemplateBlogPost } from "../types";
import { BlogList } from "../components/BlogList";
import { BlogPostCTA } from "../components/BlogPostCTA";

interface BlogListingLayoutProps {
  posts: TemplateBlogPost[];
  categories: string[];
  config: BlogConfig;
}

export function BlogListingLayout({ posts, categories, config }: BlogListingLayoutProps) {
  const { brand, domain, cta } = config;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: `${brand.name} Blog`,
        description: brand.tagline,
        url: `https://${domain}/blog`,
        publisher: {
          "@type": "Organization",
          name: brand.name,
          url: `https://${domain}`,
        },
      },
      {
        "@type": "CollectionPage",
        name: `${brand.name} Blog`,
        url: `https://${domain}/blog`,
        description: brand.tagline,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://${domain}/blog/${post.slug}`,
            name: post.title,
          })),
        },
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
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold tracking-wider uppercase mb-4 text-primary">
              {brand.blogTitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
              {brand.tagline}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Posts Column */}
            <div className="lg:col-span-2">
              <BlogList posts={posts} categories={categories} config={config} />
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* CTA Card */}
              <div className="blog-cta border border-border bg-card p-6">
                <h3 className="text-lg font-bold mb-3 tracking-tight text-foreground">
                  {cta.heading}
                </h3>
                <p className="text-sm mb-5 leading-relaxed text-muted-foreground">
                  {cta.description}
                </p>
                <a
                  href={cta.buttonUrl}
                  className="blog-cta-button inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-sm transition-all bg-primary text-primary-foreground hover:opacity-90"
                >
                  {cta.buttonText}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>

              {/* Categories Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-foreground">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const count = posts.filter((p) => p.category === cat).length;
                    return (
                      <div
                        key={cat}
                        className="flex items-center justify-between py-2 border-b last:border-0 border-border"
                      >
                        <span className="text-sm text-muted-foreground">
                          {cat}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16">
            <BlogPostCTA config={config} />
          </div>
        </div>
      </section>
    </>
  );
}
