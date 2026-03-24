import remarkGfm from "remark-gfm";

/**
 * Returns default MDX options with remark-gfm included.
 * Use this when calling compileMDX or MDXRemote directly
 * so tables, strikethrough, and other GFM features work.
 */
export function getMdxOptions() {
  return {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  };
}
