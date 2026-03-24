"use client";

import type { BlogConfig } from "../types";

interface BlogContentProps {
  content: string;
  config: BlogConfig;
}

export function BlogContent({ content }: BlogContentProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let tableRows: string[][] = [];
  let tableHeaderRows: string[][] = [];
  let inTableHead = false;
  let blockquoteLines: string[] = [];
  let key = 0;

  // Detect if content is HTML (first non-empty line starts with an HTML tag)
  const isHtml = lines.some((l) => {
    const t = l.trim();
    return t && /^<[a-z]/.test(t);
  });

  function flushList() {
    if (listItems.length === 0) return;
    if (listType === "ol") {
      elements.push(
        <ol key={key++} className="space-y-3 my-6 list-none pl-0">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 min-w-[1.5rem] text-sm font-semibold text-primary">
                {i + 1}.
              </span>
              <span className="text-foreground/80 leading-relaxed">
                {parseInline(item)}
              </span>
            </li>
          ))}
        </ol>,
      );
    } else {
      elements.push(
        <ul key={key++} className="space-y-3 my-6">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
              <span className="text-foreground/80 leading-relaxed">
                {parseInline(item)}
              </span>
            </li>
          ))}
        </ul>,
      );
    }
    listItems = [];
  }

  function flushTable() {
    const allRows = [...tableHeaderRows, ...tableRows];
    if (allRows.length === 0) return;

    const headerRow =
      tableHeaderRows.length > 0 ? tableHeaderRows[0] : allRows[0];
    const bodyRows =
      tableHeaderRows.length > 0
        ? tableRows
        : allRows
            .slice(1)
            .filter(
              (row) => !row.every((cell) => /^[-: ]+$/.test(cell.trim())),
            );

    elements.push(
      <div key={key++} className="overflow-x-auto my-8 border border-border">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted">
              {headerRow.map((cell, i) => (
                <th
                  key={i}
                  className="text-left font-semibold px-4 py-3 border-b border-border text-foreground"
                >
                  {parseInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/50"}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 border-b border-border/50 text-foreground/80"
                  >
                    {parseInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );

    tableRows = [];
    tableHeaderRows = [];
    inTableHead = false;
  }

  function flushBlockquote() {
    if (blockquoteLines.length === 0) return;
    const text = blockquoteLines.join(" ");
    elements.push(
      <blockquote
        key={key++}
        className="my-8 pl-6 py-4 italic leading-relaxed bg-muted/50 text-foreground/80 border-l-4 border-primary"
      >
        {parseInline(text)}
      </blockquote>,
    );
    blockquoteLines = [];
  }

  function flushBuffers() {
    flushList();
    flushTable();
    flushBlockquote();
  }

  /** Strip a single HTML tag wrapper, e.g. `<p>text</p>` → `text` */
  function stripTag(line: string, tag: string): string {
    return line
      .replace(new RegExp(`^<${tag}[^>]*>`, "i"), "")
      .replace(new RegExp(`</${tag}>$`, "i"), "")
      .trim();
  }

  /**
   * Parse inline formatting — supports both markdown (**bold**, [text](url))
   * and HTML (<strong>, <em>, <a href="">) inline elements.
   */
  function parseInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    // Combined regex for markdown and HTML inline elements
    const regex =
      /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|<strong>(.+?)<\/strong>|<em>(.+?)<\/em>|<a\s+href="([^"]+)"[^>]*>(.+?)<\/a>/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[1]) {
        // Markdown bold: **text**
        parts.push(
          <strong
            key={`b-${match.index}`}
            className="font-semibold text-foreground"
          >
            {match[1]}
          </strong>,
        );
      } else if (match[2] && match[3]) {
        // Markdown link: [text](url)
        parts.push(
          <a
            key={`a-${match.index}`}
            href={match[3]}
            className="font-medium underline underline-offset-2 transition-colors text-primary"
          >
            {match[2]}
          </a>,
        );
      } else if (match[4]) {
        // HTML <strong>text</strong>
        parts.push(
          <strong
            key={`b-${match.index}`}
            className="font-semibold text-foreground"
          >
            {match[4]}
          </strong>,
        );
      } else if (match[5]) {
        // HTML <em>text</em>
        parts.push(
          <em key={`em-${match.index}`} className="italic">
            {match[5]}
          </em>,
        );
      } else if (match[6] && match[7]) {
        // HTML <a href="url">text</a>
        parts.push(
          <a
            key={`a-${match.index}`}
            href={match[6]}
            className="font-medium underline underline-offset-2 transition-colors text-primary"
          >
            {match[7]}
          </a>,
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
      // Don't flush blockquote/list/table on blank lines if we're inside HTML blocks
      if (!isHtml) flushBuffers();
      continue;
    }

    // ── HTML block-level tags ──────────────────────────────────────────

    if (isHtml) {
      // Skip pure closing/opening wrapper tags
      if (/^<\/?(ul|ol|table|thead|tbody)>$/i.test(trimmed)) {
        if (/^<ul>/i.test(trimmed)) {
          flushBlockquote();
          flushTable();
          listType = "ul";
        } else if (/^<ol>/i.test(trimmed)) {
          flushBlockquote();
          flushTable();
          listType = "ol";
        } else if (/^<\/(?:ul|ol)>/i.test(trimmed)) {
          flushList();
        } else if (/^<table>/i.test(trimmed)) {
          flushBlockquote();
          flushList();
        } else if (/^<\/table>/i.test(trimmed)) {
          flushTable();
        } else if (/^<thead>/i.test(trimmed)) {
          inTableHead = true;
        } else if (/^<\/thead>/i.test(trimmed)) {
          inTableHead = false;
        }
        // tbody open/close: no-op
        continue;
      }

      // Table row: <tr>...<th>/<td>...</tr>
      if (/^<tr>/i.test(trimmed)) {
        // Collect cells from this row and following lines until </tr>
        let rowContent = trimmed;
        // If </tr> is not on this line, accumulate
        while (i < lines.length - 1 && !rowContent.includes("</tr>")) {
          i++;
          rowContent += " " + lines[i].trim();
        }
        const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gi;
        const cells: string[] = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
          cells.push(cellMatch[1].trim());
        }
        if (cells.length > 0) {
          if (inTableHead) {
            tableHeaderRows.push(cells);
          } else {
            tableRows.push(cells);
          }
        }
        continue;
      }

      // Blockquote
      if (/^<blockquote>/i.test(trimmed)) {
        flushList();
        flushTable();
        continue;
      }
      if (/^<\/blockquote>/i.test(trimmed)) {
        flushBlockquote();
        continue;
      }
      // Lines inside blockquote: strip <p> wrapper if present
      if (blockquoteLines.length > 0 || elements.length === 0) {
        // Check if we're inside a blockquote by looking back
      }

      // HTML <hr> or <hr />
      if (/^<hr\s*\/?>$/i.test(trimmed)) {
        flushBuffers();
        elements.push(<hr key={key++} className="my-10 border-border" />);
        continue;
      }

      // HTML <img>
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
              className="w-full my-8 object-cover"
            />,
          );
        }
        continue;
      }

      // HTML <h2>
      if (/^<h2[^>]*>/i.test(trimmed)) {
        flushBuffers();
        const text = stripTag(trimmed, "h2");
        elements.push(
          <h2
            key={key++}
            className="text-2xl md:text-3xl font-bold mt-12 mb-4 flex items-center gap-3 text-foreground"
          >
            <span className="w-1 h-8 rounded-full flex-shrink-0 bg-primary" />
            {parseInline(text)}
          </h2>,
        );
        continue;
      }

      // HTML <h3>
      if (/^<h3[^>]*>/i.test(trimmed)) {
        flushBuffers();
        const text = stripTag(trimmed, "h3");
        elements.push(
          <h3
            key={key++}
            className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground"
          >
            {parseInline(text)}
          </h3>,
        );
        continue;
      }

      // HTML <li>
      if (/^<li[^>]*>/i.test(trimmed)) {
        const inner = stripTag(trimmed, "li");
        listItems.push(inner);
        continue;
      }

      // HTML <p> — also handles <p> inside <blockquote>
      if (/^<p[^>]*>/i.test(trimmed)) {
        const inner = stripTag(trimmed, "p");
        // Check if we're inside a blockquote by scanning backward for unclosed <blockquote>
        let insideBlockquote = false;
        for (let j = i - 1; j >= 0; j--) {
          const prev = lines[j].trim();
          if (/^<\/blockquote>/i.test(prev)) break;
          if (/^<blockquote>/i.test(prev)) {
            insideBlockquote = true;
            break;
          }
        }
        if (insideBlockquote) {
          blockquoteLines.push(inner);
        } else {
          flushBuffers();
          elements.push(
            <p
              key={key++}
              className="leading-relaxed my-4 text-base md:text-lg text-foreground/80"
            >
              {parseInline(inner)}
            </p>,
          );
        }
        continue;
      }
    }

    // ── Markdown syntax (original parser) ──────────────────────────────

    // Horizontal rule
    if (trimmed === "---") {
      flushBuffers();
      elements.push(<hr key={key++} className="my-10 border-border" />);
      continue;
    }

    // Image tag (markdown content can also have <img>)
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
            className="w-full my-8 object-cover"
          />,
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
          className="text-2xl md:text-3xl font-bold mt-12 mb-4 flex items-center gap-3 text-foreground"
        >
          <span className="w-1 h-8 rounded-full flex-shrink-0 bg-primary" />
          {text}
        </h2>,
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
          className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground"
        >
          {text}
        </h3>,
      );
      continue;
    }

    // Table row (markdown pipe tables)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      const cells = trimmed.split("|").slice(1, -1);
      tableRows.push(cells);
      continue;
    }

    // List item
    if (trimmed.startsWith("- ")) {
      flushTable();
      listType = "ul";
      listItems.push(trimmed.replace("- ", ""));
      continue;
    }

    // Blockquote (markdown: lines wrapped in quotes)
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      flushBuffers();
      const text = trimmed.slice(1, -1);
      elements.push(
        <blockquote
          key={key++}
          className="my-8 pl-6 py-4 italic leading-relaxed bg-muted/50 text-foreground/80 border-l-4 border-primary"
        >
          {parseInline(text)}
        </blockquote>,
      );
      continue;
    }

    // Paragraph (fallback)
    flushBuffers();
    elements.push(
      <p
        key={key++}
        className="leading-relaxed my-4 text-base md:text-lg text-foreground/80"
      >
        {parseInline(trimmed)}
      </p>,
    );
  }

  flushBuffers();

  return <article className="prose-custom max-w-none">{elements}</article>;
}
