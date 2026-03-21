"use client";

import type { BlogConfig } from "../types";

interface BlogContentProps {
  content: string;
  config: BlogConfig;
}

export function BlogContent({ content, config }: BlogContentProps) {
  const isDark = config.theme === "dark";
  const primary = config.colors.primary;
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="space-y-3 my-6">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: primary }}
              />
              <span className={isDark ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>
                {parseInline(item)}
              </span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function flushTable() {
    if (tableRows.length === 0) return;

    const headerRow = tableRows[0];
    const bodyRows = tableRows
      .slice(1)
      .filter((row) => !row.every((cell) => /^[-: ]+$/.test(cell.trim())));

    elements.push(
      <div
        key={key++}
        className={`overflow-x-auto my-8 rounded-xl border ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className={isDark ? "bg-gray-800" : "bg-gray-50"}>
              {headerRow.map((cell, i) => (
                <th
                  key={i}
                  className={`text-left font-semibold px-4 py-3 border-b ${
                    isDark
                      ? "text-gray-100 border-gray-700"
                      : "text-gray-900 border-gray-200"
                  }`}
                >
                  {parseInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr
                key={ri}
                className={
                  isDark
                    ? ri % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"
                    : ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-3 border-b ${
                      isDark
                        ? "text-gray-300 border-gray-700/50"
                        : "text-gray-700 border-gray-100"
                    }`}
                  >
                    {parseInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableRows = [];
  }

  function flushBuffers() {
    flushList();
    flushTable();
  }

  function parseInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1]) {
        parts.push(
          <strong
            key={`b-${match.index}`}
            className={isDark ? "font-semibold text-gray-100" : "font-semibold text-gray-900"}
          >
            {match[1]}
          </strong>
        );
      } else if (match[2] && match[3]) {
        parts.push(
          <a
            key={`a-${match.index}`}
            href={match[3]}
            className="font-medium underline underline-offset-2 transition-colors"
            style={{ color: primary }}
          >
            {match[2]}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushBuffers();
      continue;
    }

    // Horizontal rule
    if (trimmed === "---") {
      flushBuffers();
      elements.push(
        <hr key={key++} className={isDark ? "my-10 border-gray-700" : "my-10 border-gray-200"} />
      );
      continue;
    }

    // Image tag
    if (trimmed.startsWith("<img ")) {
      flushBuffers();
      const srcMatch = trimmed.match(/src="([^"]+)"/);
      const altMatch = trimmed.match(/alt="([^"]+)"/);
      const widthMatch = trimmed.match(/width="(\d+)"/);
      const heightMatch = trimmed.match(/height="(\d+)"/);

      if (srcMatch) {
        elements.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={key++}
            src={srcMatch[1]}
            alt={altMatch?.[1] || ""}
            width={widthMatch ? parseInt(widthMatch[1]) : 1200}
            height={heightMatch ? parseInt(heightMatch[1]) : 630}
            loading="lazy"
            className="w-full rounded-xl my-8 object-cover"
          />
        );
      }
      continue;
    }

    // H2
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      flushBuffers();
      const text = trimmed.replace("## ", "");
      elements.push(
        <h2
          key={key++}
          className={`text-2xl md:text-3xl font-bold mt-12 mb-4 flex items-center gap-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <span
            className="w-1 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: primary }}
          />
          {text}
        </h2>
      );
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      flushBuffers();
      const text = trimmed.replace("### ", "");
      elements.push(
        <h3
          key={key++}
          className={`text-xl md:text-2xl font-semibold mt-8 mb-3 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {text}
        </h3>
      );
      continue;
    }

    // Table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      const cells = trimmed.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    }

    // List item
    if (trimmed.startsWith("- ")) {
      flushTable();
      listItems.push(trimmed.replace("- ", ""));
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      flushBuffers();
      const text = trimmed.slice(1, -1);
      elements.push(
        <blockquote
          key={key++}
          className={`my-8 pl-6 py-4 rounded-r-xl italic leading-relaxed ${
            isDark ? "bg-white/5 text-gray-300" : "text-gray-700"
          }`}
          style={{ borderLeft: `4px solid ${primary}`, ...(!isDark && { backgroundColor: `${primary}08` }) }}
        >
          {parseInline(text)}
        </blockquote>
      );
      continue;
    }

    // Paragraph
    flushBuffers();
    elements.push(
      <p
        key={key++}
        className={`leading-relaxed my-4 text-base md:text-lg ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {parseInline(trimmed)}
      </p>
    );
  }

  flushBuffers();

  return (
    <article className="prose-custom max-w-none">
      {elements}
    </article>
  );
}
