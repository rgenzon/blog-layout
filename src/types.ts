export interface BlogConfig {
  brand: {
    name: string;
    tagline: string;
    blogTitle: string;
  };
  /** @deprecated Colors are now inherited from project CSS variables (--color-primary, etc.). Kept for backward compatibility. */
  colors?: {
    primary: string;
    primaryDark: string;
    background: string;
  };
  /** @deprecated Theme is now inherited from the project's CSS. Kept for backward compatibility. */
  theme?: "light" | "dark";
  cta: {
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
    stats: Array<{ value: string; label: string }>;
    benefits: string[];
  };
  domain: string;
}

export interface TemplateBlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  category: string;
  tags: string[];
  publishedDate: string;
  modifiedDate?: string;
  author: { name: string; role?: string };
  readingTime: string;
  wordCount: number;
  coverImage?: string;
  featured?: boolean;
  faqData?: Array<{ question: string; answer: string }>;
}
