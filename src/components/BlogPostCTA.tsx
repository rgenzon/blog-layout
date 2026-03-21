"use client";

import Link from "next/link";
import type { BlogConfig } from "../types";

interface BlogPostCTAProps {
  config: BlogConfig;
}

export function BlogPostCTA({ config }: BlogPostCTAProps) {
  const { cta } = config;

  return (
    <section className="my-16 py-20 md:py-28 relative overflow-hidden rounded-xl">
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-dot-pattern [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_30%,transparent_100%)]" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

      <div className="max-w-[700px] mx-auto text-center relative z-10 px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] mb-6 text-foreground">
          {cta.heading}
        </h2>
        <p className="text-[17px] text-muted-foreground mb-10 max-w-[500px] mx-auto leading-relaxed">
          {cta.description}
        </p>
        <Link
          href={cta.buttonUrl}
          className="press-scale inline-flex items-center gap-2.5 px-6 py-3.5 bg-foreground text-background rounded-lg hover:opacity-90 transition-all font-semibold text-[15px] tracking-tight shadow-lg shadow-foreground/10"
        >
          {cta.buttonText}
          <svg
            className="w-4 h-4"
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
    </section>
  );
}
