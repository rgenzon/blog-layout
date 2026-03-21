"use client";

import Link from "next/link";
import type { BlogConfig } from "../types";

interface BlogPostCTAProps {
  config: BlogConfig;
}

export function BlogPostCTA({ config }: BlogPostCTAProps) {
  const { cta, colors } = config;

  // CTA palette — use explicit overrides when provided, otherwise derive defaults
  const c = cta.colors ?? {
    background: "var(--foreground, #0c0c0c)",
    foreground: "var(--background, #fafaf9)",
    muted: "var(--muted-foreground, #78716c)",
    buttonBg: "var(--foreground, #0c0c0c)",
    buttonText: "var(--background, #fafaf9)",
  };

  return (
    <section
      className="my-16 py-20 md:py-28 relative overflow-hidden rounded-xl"
      style={{ backgroundColor: c.background }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
        aria-hidden="true"
      />

      <div className="max-w-[700px] mx-auto text-center relative z-10 px-6">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] mb-6"
          style={{ color: c.foreground }}
        >
          {cta.heading}
        </h2>
        <p
          className="text-[17px] mb-10 max-w-[500px] mx-auto leading-relaxed"
          style={{ color: c.muted }}
        >
          {cta.description}
        </p>
        <Link
          href={cta.buttonUrl}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: c.buttonBg, color: c.buttonText }}
          onMouseEnter={(e) => {
            if (cta.colors?.buttonHoverBg) e.currentTarget.style.backgroundColor = cta.colors.buttonHoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = c.buttonBg;
          }}
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
