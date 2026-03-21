"use client";

import Link from "next/link";
import type { BlogConfig } from "../types";

interface BlogPostCTAProps {
  config: BlogConfig;
}

export function BlogPostCTA({ config }: BlogPostCTAProps) {
  const { cta, colors } = config;

  return (
    <section className="my-16 relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-16 sm:px-12 text-center">
      {/* Decorative gradient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
          {cta.heading}
        </h2>
        <p className="text-base leading-relaxed text-slate-400 max-w-md mx-auto">
          {cta.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10 mb-8 max-w-xl mx-auto">
          {cta.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1 text-white">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-500">
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/[0.05] text-white/70 ring-1 ring-white/[0.08]"
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
        <Link
          href={cta.buttonUrl}
          className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100"
        >
          {cta.buttonText}
        </Link>
      </div>
    </section>
  );
}
