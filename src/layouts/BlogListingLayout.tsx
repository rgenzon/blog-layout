import type { BlogConfig, TemplateBlogPost } from "../types";
import { BlogList } from "../components/BlogList";
import { BlogPostCTA } from "../components/BlogPostCTA";

interface BlogListingLayoutProps {
  posts: TemplateBlogPost[];
  categories: string[];
  config: BlogConfig;
}

export function BlogListingLayout({ posts, categories, config }: BlogListingLayoutProps) {
  const { brand, colors, domain, cta } = config;

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

  // Derive badge background
  const badgeBg = `${colors.primary}20`;

  // CTA palette
  const c = cta.colors ?? {
    background: colors.primaryDark,
    foreground: "#ffffff",
    muted: "rgba(255,255,255,0.6)",
    buttonBg: "#ffffff",
    buttonText: colors.primaryDark,
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
            <span
              className="inline-block text-sm font-semibold tracking-wider uppercase mb-4"
              style={{ color: colors.primary }}
            >
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
              <div
                className="rounded-xl p-6 relative overflow-hidden"
                style={{ backgroundColor: c.background }}
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[200px] rounded-full opacity-[0.06] blur-3xl"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <h3
                    className="text-lg font-bold mb-3 tracking-tight"
                    style={{ color: c.foreground }}
                  >
                    {cta.heading}
                  </h3>
                  <p
                    className="text-sm mb-5 leading-relaxed"
                    style={{ color: c.muted }}
                  >
                    {cta.description}
                  </p>
                  <a
                    href={cta.buttonUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-full text-sm transition-all hover:shadow-lg"
                    style={{ backgroundColor: c.buttonBg, color: c.buttonText }}
                  >
                    {cta.buttonText}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Categories Card */}
              <div className="rounded-xl border border-border bg-card p-6 card-highlight shadow-sm shadow-black/5 dark:shadow-black/30">
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
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: badgeBg, color: colors.primary }}
                        >
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
