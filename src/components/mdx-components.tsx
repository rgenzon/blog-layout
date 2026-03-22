import type { BlogConfig } from "../types";

/**
 * Returns MDX component overrides that use the project's own design tokens
 * via Tailwind semantic classes. Pass these to MDXRemote's `components` prop.
 */
export function getMdxComponents(_config: BlogConfig) {
  return {
    h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
      <h2
        className="text-2xl md:text-3xl font-bold mt-12 mb-4 flex items-center gap-3 text-foreground"
        {...props}
      >
        <span className="w-1 h-8 rounded-full flex-shrink-0 bg-primary" />
        {children}
      </h2>
    ),

    h3: ({ children, ...props }: React.ComponentProps<"h3">) => (
      <h3
        className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground"
        {...props}
      >
        {children}
      </h3>
    ),

    p: ({ children, ...props }: React.ComponentProps<"p">) => (
      <p
        className="leading-relaxed my-4 text-base md:text-lg text-foreground/80"
        {...props}
      >
        {children}
      </p>
    ),

    a: ({ children, ...props }: React.ComponentProps<"a">) => (
      <a
        className="font-medium underline underline-offset-2 transition-colors text-primary"
        {...props}
      >
        {children}
      </a>
    ),

    strong: ({ children, ...props }: React.ComponentProps<"strong">) => (
      <strong
        className="font-semibold text-foreground"
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
        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
        <span className="text-foreground/80 leading-relaxed">
          {children}
        </span>
      </li>
    ),

    blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => (
      <blockquote
        className="my-8 pl-6 py-4 italic leading-relaxed bg-muted/50 text-foreground/80 border-l-4 border-primary"
        {...props}
      >
        {children}
      </blockquote>
    ),

    hr: (props: React.ComponentProps<"hr">) => (
      <hr
        className="my-10 border-border"
        {...props}
      />
    ),

    img: ({ alt, ...props }: React.ComponentProps<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt || ""}
        loading="lazy"
        className="w-full my-8 object-cover"
        {...props}
      />
    ),

    table: ({ children, ...props }: React.ComponentProps<"table">) => (
      <div className="overflow-x-auto my-8 border border-border">
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
        className="text-left font-semibold px-4 py-3 border-b border-border bg-muted text-foreground"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }: React.ComponentProps<"td">) => (
      <td
        className="px-4 py-3 border-b border-border/50 text-foreground/80"
        {...props}
      >
        {children}
      </td>
    ),
  };
}
