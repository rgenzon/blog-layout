"use client";

import Link from "next/link";
import type { BlogConfig } from "../types";

interface BlogPostCTAProps {
  config: BlogConfig;
}

export function BlogPostCTA({ config }: BlogPostCTAProps) {
  const { cta, colors } = config;
  const ctaBg = `${colors.primary}15`;

  return (
    <section className="my-16 rounded-xl overflow-hidden" style={{ backgroundColor: ctaBg }}>
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {cta.heading}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            {cta.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-xl mx-auto">
          {cta.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: colors.primary }}
              >
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {cta.benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-card text-foreground border border-border"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                style={{ color: colors.primary }}
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

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href={cta.buttonUrl}
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-full text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: colors.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
            }}
          >
            {cta.buttonText}
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
