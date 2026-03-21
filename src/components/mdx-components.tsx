import type { BlogConfig } from "../types";

/**
 * Returns MDX component overrides that produce the exact same visual output
 * as BlogContent. Pass these to MDXRemote's `components` prop.
 */
export function getMdxComponents(config: BlogConfig) {
  const isDark = config.theme === "dark";
  const primary = config.colors.primary;

  return {
    h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
      <h2
        className={`text-2xl md:text-3xl font-bold mt-12 mb-4 flex items-center gap-3 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
        {...props}
      >
        <span
          className="w-1 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: primary }}
        />
        {children}
      </h2>
    ),

    h3: ({ children, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className={`text-xl md:text-2xl font-semibold mt-8 mb-3 ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}
        {...props}
      >
        {children}
      </h3>
    ),

    p: ({ children, ...props }: React.ComponentProps<"p">) => (
      <p
        className={`leading-relaxed my-4 text-base md:text-lg ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
        {...props}
      >
        {children}
      </p>
    ),

    a: ({ children, ...props }: React.ComponentProps<"a">) => (
      <a
        className="font-medium underline underline-offset-2 transition-colors"
        style={{ color: primary }}
        {...props}
      >
        {children}
      </a>
    ),

    strong: ({ children, ...props }: React.ComponentProps<"strong">) => (
      <strong
        className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
        {...props}
      >
        {children}
      </strong>
    ),

    ul: ({ children, ...props }: React.ComponentProps<"ul">) => (
      <ul className="space-y-3 my-6" {...props}>
        {children}
      </ul>
    ),

    li: ({ children, ...props }: React.ComponentProps<"li">) => (
      <li className="flex items-start gap-3" {...props}>
        <span
          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: primary }}
        />
        <span className={isDark ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>
          {children}
        </span>
      </li>
    ),

    blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => (
      <blockquote
        className={`my-8 pl-6 py-4 rounded-r-xl italic leading-relaxed ${
          isDark ? "bg-white/5 text-gray-300" : "bg-blue-50/50 text-gray-700"
        }`}
        style={{ borderLeft: `4px solid ${primary}` }}
        {...props}
      >
        {children}
      </blockquote>
    ),

    hr: (props: React.ComponentProps<"hr">) => (
      <hr
        className={isDark ? "my-10 border-gray-700" : "my-10 border-gray-200"}
        {...props}
      />
    ),

    img: ({ alt, ...props }: React.ComponentProps<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt || ""}
        loading="lazy"
        className="w-full rounded-xl my-8 object-cover"
        {...props}
      />
    ),

    table: ({ children, ...props }: React.ComponentProps<"table">) => (
      <div
        className={`overflow-x-auto my-8 rounded-xl border ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <table className="min-w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }: React.ComponentProps<"thead">) => (
      <thead {...props}>{children}</thead>
    ),

    th: ({ children, ...props }: React.ComponentProps<"th">) => (
      <th
        className={`text-left font-semibold px-4 py-3 border-b ${
          isDark
            ? "text-gray-100 border-gray-700 bg-gray-800"
            : "text-gray-900 border-gray-200 bg-gray-50"
        }`}
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }: React.ComponentProps<"td">) => (
      <td
        className={`px-4 py-3 border-b ${
          isDark
            ? "text-gray-300 border-gray-700/50"
            : "text-gray-700 border-gray-100"
        }`}
        {...props}
      >
        {children}
      </td>
    ),
  };
}
