"use client";

import Link from "next/link";
import type { BlogConfig } from "../types";

interface BlogPostCTAProps {
  config: BlogConfig;
}

export function BlogPostCTA({ config }: BlogPostCTAProps) {
  const { cta, colors } = config;

  // CTA palette — use explicit overrides when provided, otherwise derive from primary
  const c = cta.colors ?? {
    background: colors.primaryDark,
    foreground: "#ffffff",
    muted: "rgba(255,255,255,0.6)",
    buttonBg: "#ffffff",
    buttonText: colors.primaryDark,
    buttonHoverBg: "#f0f0f0",
  };

  return (
    <section
      className="my-16 relative overflow-hidden rounded-2xl px-6 py-16 sm:px-12 text-center"
      style={{ backgroundColor: c.background }}
    >
      {/* Decorative gradient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Header */}
        <h2
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          style={{ color: c.foreground }}
        >
          {cta.heading}
        </h2>
        <p
          className="text-base leading-relaxed max-w-md mx-auto"
          style={{ color: c.muted }}
        >
          {cta.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10 mb-8 max-w-xl mx-auto">
          {cta.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: c.foreground }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs md:text-sm"
                style={{ color: c.muted }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {cta.benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${c.foreground}0d`,
                color: c.muted,
                boxShadow: `inset 0 0 0 1px ${c.foreground}15`,
              }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                style={{ color: c.foreground }}
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
        <Link
          href={cta.buttonUrl}
          className="inline-flex items-center gap-2 rounded-full h-14 px-8 text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: c.buttonBg, color: c.buttonText }}
          onMouseEnter={(e) => {
            if (c.buttonHoverBg) e.currentTarget.style.backgroundColor = c.buttonHoverBg;
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
