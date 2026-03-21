"use client";

import Link from "next/link";
import type { BlogConfig } from "../types";

interface BlogPostCTAProps {
  config: BlogConfig;
}

export function BlogPostCTA({ config }: BlogPostCTAProps) {
  const { cta } = config;

  return (
    <section className="blog-cta my-16 py-16 md:py-20 px-6 sm:px-12 border border-border bg-card text-center">
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-foreground">
          {cta.heading}
        </h2>
        <p className="text-base md:text-lg mb-10 max-w-[500px] mx-auto leading-relaxed text-muted-foreground">
          {cta.description}
        </p>

        {/* Stats */}
        {cta.stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl mx-auto">
            {cta.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1 text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Benefits */}
        {cta.benefits.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {cta.benefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border bg-muted text-muted-foreground"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <Link
          href={cta.buttonUrl}
          className="blog-cta-button inline-flex items-center gap-2 px-8 py-4 font-semibold text-lg transition-all duration-200 bg-primary text-primary-foreground hover:opacity-90"
        >
          {cta.buttonText}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
