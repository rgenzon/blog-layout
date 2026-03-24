import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BlogContent } from "./BlogContent";
import type { BlogConfig } from "../types";

// ---------------------------------------------------------------------------
// Minimal BlogConfig fixture — only required fields needed by BlogContent
// (the component only reads `content`, but the prop type requires config)
// ---------------------------------------------------------------------------
const config: BlogConfig = {
  brand: {
    name: "TestBrand",
    tagline: "Testing tagline",
    blogTitle: "Test Blog",
  },
  cta: {
    heading: "Try it free",
    description: "Get started today",
    buttonText: "Sign up",
    buttonUrl: "/sign-up",
    stats: [],
    benefits: [],
  },
  domain: "example.com",
};

// ---------------------------------------------------------------------------
// Real-world content samples
// ---------------------------------------------------------------------------

const MARKDOWN_CONTENT = `## What Is a Cost Benefit Analysis?

<img src="https://example.com/img.webp" alt="Cost Benefit Analysis" width="1200" height="630" />

A cost benefit analysis (CBA) is a structured way to weigh the total expected costs against the total expected benefits of a decision.

### Step 1: Define the Scope

- **Identify the decision.** What are you evaluating?
- **Set boundaries.** Which costs and benefits will you include?
- **Choose a time frame.** Most analyses cover 3–5 years.

| Factor | Cost | Benefit |
| --- | --- | --- |
| Labor | $50,000 | — |
| Revenue | — | $120,000 |

"The best decisions aren't made on gut feeling — they're made on data."

---

**Ready to start?** [Try Makrly free →](/sign-up)`;

const HTML_CONTENT = `<p>A cookie banner is a notice shown on websites that tells visitors about cookie use and asks for their consent.</p>

<h2>What Is Cookie Banner?</h2>

<img src="https://example.com/img.webp" alt="What Is Cookie Banner?" width="1200" height="630" />

<p>A cookie consent banner is a popup, bar, or modal that appears when someone first visits your site.</p>

<h3>Key Components</h3>

<p>Under GDPR, you can't set marketing, analytics, or targeting cookies without <em>explicit</em> consent.</p>

<ul>
<li><strong>Legal compliance.</strong> GDPR, CCPA, ePrivacy, and LGPD all require a consent notice.</li>
<li><strong>User trust.</strong> According to a <a href="https://example.com" target="_blank" rel="noopener noreferrer">Pew Research survey</a>, 79% of consumers care about data.</li>
<li><strong>Ad measurement.</strong> Google Consent Mode v2 relies on cookie banner signals.</li>
</ul>

<ol>
<li><strong>Visitor arrives.</strong> Your consent management platform checks for a prior consent record.</li>
<li><strong>No consent found.</strong> The banner appears.</li>
<li><strong>Visitor chooses.</strong> They accept, reject, or pick categories.</li>
</ol>

<blockquote>
<p><strong>Key stat:</strong> "Websites without a GDPR compliant cookie banner can face fines of up to €20 million" — <a href="https://gdpr.eu/article-83" target="_blank">EU GDPR</a>.</p>
</blockquote>

<table>
<thead>
<tr>
<th>Solution</th>
<th>GDPR Compliant</th>
<th>Cost</th>
</tr>
</thead>
<tbody>
<tr>
<td>ConsentPop</td>
<td>Yes</td>
<td>Free to start</td>
</tr>
<tr>
<td>OneTrust</td>
<td>Yes</td>
<td>Enterprise pricing</td>
</tr>
</tbody>
</table>

<hr />

<p><strong>Add a compliant cookie banner.</strong> <a href="/sign-up">Start free →</a></p>`;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function renderContent(content: string) {
  return render(<BlogContent content={content} config={config} />);
}

/** Returns all text content visible in the rendered article, flattened. */
function getArticleText(container: HTMLElement): string {
  return container.querySelector("article")?.textContent ?? "";
}

// ---------------------------------------------------------------------------
// CRITICAL REGRESSION: no raw HTML tag strings in rendered output
// ---------------------------------------------------------------------------

describe("Critical regression: no raw HTML in rendered text", () => {
  it("markdown content does not leak raw HTML tag strings", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const text = getArticleText(container);
    expect(text).not.toMatch(/<p>/);
    expect(text).not.toMatch(/<\/p>/);
    expect(text).not.toMatch(/<h2>/);
    expect(text).not.toMatch(/<h3>/);
    expect(text).not.toMatch(/<ul>/);
    expect(text).not.toMatch(/<\/ul>/);
    expect(text).not.toMatch(/<li>/);
    expect(text).not.toMatch(/<strong>/);
    expect(text).not.toMatch(/<em>/);
    expect(text).not.toMatch(/<blockquote>/);
    expect(text).not.toMatch(/<table>/);
    expect(text).not.toMatch(/<tr>/);
    expect(text).not.toMatch(/<td>/);
    expect(text).not.toMatch(/<hr/);
  });

  it("HTML content does not leak raw HTML tag strings — the critical ConsentPop regression", () => {
    const { container } = renderContent(HTML_CONTENT);
    const text = getArticleText(container);
    expect(text).not.toMatch(/<p>/);
    expect(text).not.toMatch(/<\/p>/);
    expect(text).not.toMatch(/<h2>/);
    expect(text).not.toMatch(/<h3>/);
    expect(text).not.toMatch(/<ul>/);
    expect(text).not.toMatch(/<ol>/);
    expect(text).not.toMatch(/<\/ul>/);
    expect(text).not.toMatch(/<\/ol>/);
    expect(text).not.toMatch(/<li>/);
    expect(text).not.toMatch(/<strong>/);
    expect(text).not.toMatch(/<em>/);
    expect(text).not.toMatch(/<blockquote>/);
    expect(text).not.toMatch(/<table>/);
    expect(text).not.toMatch(/<thead>/);
    expect(text).not.toMatch(/<tbody>/);
    expect(text).not.toMatch(/<tr>/);
    expect(text).not.toMatch(/<th>/);
    expect(text).not.toMatch(/<td>/);
    expect(text).not.toMatch(/<hr/);
    expect(text).not.toMatch(/<img/);
  });
});

// ---------------------------------------------------------------------------
// MARKDOWN CONTENT — element presence and structure
// ---------------------------------------------------------------------------

describe("Markdown content — headings", () => {
  it("renders an h2 with the correct text", () => {
    renderContent(MARKDOWN_CONTENT);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toBeInTheDocument();
    expect(h2).toHaveTextContent("What Is a Cost Benefit Analysis?");
  });

  it("renders an h3 with the correct text", () => {
    renderContent(MARKDOWN_CONTENT);
    const h3 = screen.getByRole("heading", { level: 3 });
    expect(h3).toBeInTheDocument();
    expect(h3).toHaveTextContent("Step 1: Define the Scope");
  });

  it("renders exactly one h2 and one h3", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(container.querySelectorAll("h3")).toHaveLength(1);
  });
});

describe("Markdown content — image", () => {
  it("renders the img element with correct src and alt", () => {
    renderContent(MARKDOWN_CONTENT);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/img.webp");
    expect(img).toHaveAttribute("alt", "Cost Benefit Analysis");
  });

  it("renders the img with the specified width and height", () => {
    renderContent(MARKDOWN_CONTENT);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "1200");
    expect(img).toHaveAttribute("height", "630");
  });
});

describe("Markdown content — unordered list", () => {
  it("renders a ul element", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("renders exactly 3 list items", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const ul = container.querySelector("ul");
    expect(ul).not.toBeNull();
    // Each li contains a bullet span + content span
    expect(ul!.querySelectorAll("li")).toHaveLength(3);
  });

  it("renders bold text inside list items", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const ul = container.querySelector("ul");
    const strongTags = ul!.querySelectorAll("strong");
    expect(strongTags.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Markdown content — table", () => {
  it("renders a table element", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    expect(container.querySelector("table")).toBeInTheDocument();
  });

  it("renders the correct header cells", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const headerCells = container.querySelectorAll("th");
    expect(headerCells).toHaveLength(3);
    expect(headerCells[0].textContent?.trim()).toBe("Factor");
    expect(headerCells[1].textContent?.trim()).toBe("Cost");
    expect(headerCells[2].textContent?.trim()).toBe("Benefit");
  });

  it("renders 2 data rows (separator row is filtered out)", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const bodyRows = container.querySelectorAll("tbody tr");
    expect(bodyRows).toHaveLength(2);
  });

  it("renders correct data in first body row", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const firstRow = container.querySelectorAll("tbody tr")[0];
    const cells = firstRow.querySelectorAll("td");
    expect(cells[0].textContent?.trim()).toContain("Labor");
    expect(cells[1].textContent?.trim()).toContain("$50,000");
  });
});

describe("Markdown content — blockquote", () => {
  it("renders a blockquote element", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });

  it("renders the quote text without surrounding double-quote characters", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const bq = container.querySelector("blockquote");
    const text = bq?.textContent ?? "";
    expect(text).toContain("The best decisions");
    // The outer quotes should be stripped by the parser
    expect(text[0]).not.toBe('"');
    expect(text[text.length - 1]).not.toBe('"');
  });
});

describe("Markdown content — horizontal rule", () => {
  it("renders an hr element", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });
});

describe("Markdown content — inline formatting in paragraph", () => {
  it("renders a bold element for **text** syntax", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const article = container.querySelector("article");
    const strongs = article!.querySelectorAll("p strong");
    const boldTexts = Array.from(strongs).map((el) => el.textContent);
    expect(boldTexts).toContain("Ready to start?");
  });

  it("renders a link with correct href for [text](url) syntax", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    const links = container.querySelectorAll("a");
    const signUpLink = Array.from(links).find((a) =>
      a.textContent?.includes("Try Makrly free"),
    );
    expect(signUpLink).toBeDefined();
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });
});

describe("Markdown content — paragraph", () => {
  it("renders a paragraph with the intro text", () => {
    renderContent(MARKDOWN_CONTENT);
    expect(
      screen.getByText(/structured way to weigh the total expected costs/),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// HTML CONTENT — element presence and structure (ConsentPop format)
// ---------------------------------------------------------------------------

describe("HTML content — headings", () => {
  it("renders h2 with the correct text", () => {
    renderContent(HTML_CONTENT);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2).toHaveTextContent("What Is Cookie Banner?");
  });

  it("renders h3 with the correct text", () => {
    renderContent(HTML_CONTENT);
    const h3 = screen.getByRole("heading", { level: 3 });
    expect(h3).toHaveTextContent("Key Components");
  });

  it("renders exactly one h2 and one h3", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.querySelectorAll("h2")).toHaveLength(1);
    expect(container.querySelectorAll("h3")).toHaveLength(1);
  });
});

describe("HTML content — paragraphs", () => {
  it("renders the opening paragraph text correctly", () => {
    renderContent(HTML_CONTENT);
    expect(
      screen.getByText(/cookie banner is a notice shown on websites/),
    ).toBeInTheDocument();
  });

  it("renders the closing paragraph with bold and link", () => {
    const { container } = renderContent(HTML_CONTENT);
    const paragraphs = container.querySelectorAll("p");
    const lastParagraph = paragraphs[paragraphs.length - 1];
    expect(lastParagraph.querySelector("strong")).toBeInTheDocument();
    expect(lastParagraph.querySelector("a")).toHaveAttribute(
      "href",
      "/sign-up",
    );
  });

  it("renders em (italic) inline element inside paragraph", () => {
    const { container } = renderContent(HTML_CONTENT);
    const emElements = container.querySelectorAll("em");
    expect(emElements.length).toBeGreaterThanOrEqual(1);
    const explicitEm = Array.from(emElements).find(
      (el) => el.textContent === "explicit",
    );
    expect(explicitEm).toBeDefined();
  });
});

describe("HTML content — image", () => {
  it("renders the img element with correct src", () => {
    renderContent(HTML_CONTENT);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/img.webp");
  });

  it("renders the img element with correct alt", () => {
    renderContent(HTML_CONTENT);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "What Is Cookie Banner?");
  });

  it("renders the img element with correct dimensions", () => {
    renderContent(HTML_CONTENT);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "1200");
    expect(img).toHaveAttribute("height", "630");
  });
});

describe("HTML content — unordered list", () => {
  it("renders a ul element", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("renders exactly 3 items in the ul", () => {
    const { container } = renderContent(HTML_CONTENT);
    const ul = container.querySelector("ul");
    expect(ul!.querySelectorAll("li")).toHaveLength(3);
  });

  it("renders a link inside the second ul item pointing to the survey", () => {
    const { container } = renderContent(HTML_CONTENT);
    const ul = container.querySelector("ul");
    const secondLi = ul!.querySelectorAll("li")[1];
    const link = secondLi.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});

describe("HTML content — ordered list", () => {
  it("renders an ol element", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.querySelector("ol")).toBeInTheDocument();
  });

  it("renders exactly 3 items in the ol", () => {
    const { container } = renderContent(HTML_CONTENT);
    const ol = container.querySelector("ol");
    expect(ol!.querySelectorAll("li")).toHaveLength(3);
  });

  it("renders numbered labels 1, 2, 3 in the ol", () => {
    const { container } = renderContent(HTML_CONTENT);
    const ol = container.querySelector("ol");
    const numberSpans = Array.from(
      ol!.querySelectorAll("li > span:first-child"),
    );
    const labels = numberSpans.map((s) => s.textContent?.trim());
    expect(labels).toContain("1.");
    expect(labels).toContain("2.");
    expect(labels).toContain("3.");
  });
});

describe("HTML content — blockquote", () => {
  it("renders a blockquote element", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });

  it("renders blockquote text that includes the key stat content", () => {
    const { container } = renderContent(HTML_CONTENT);
    const bq = container.querySelector("blockquote");
    expect(bq?.textContent).toContain("€20 million");
  });

  it("renders a link inside the blockquote pointing to gdpr.eu", () => {
    const { container } = renderContent(HTML_CONTENT);
    const bq = container.querySelector("blockquote");
    const link = bq?.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://gdpr.eu/article-83");
  });
});

describe("HTML content — table", () => {
  it("renders a table element", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.querySelector("table")).toBeInTheDocument();
  });

  it("renders 3 header columns", () => {
    const { container } = renderContent(HTML_CONTENT);
    const headerCells = container.querySelectorAll("th");
    expect(headerCells).toHaveLength(3);
    expect(headerCells[0].textContent?.trim()).toBe("Solution");
    expect(headerCells[1].textContent?.trim()).toBe("GDPR Compliant");
    expect(headerCells[2].textContent?.trim()).toBe("Cost");
  });

  it("renders 2 data rows", () => {
    const { container } = renderContent(HTML_CONTENT);
    const bodyRows = container.querySelectorAll("tbody tr");
    expect(bodyRows).toHaveLength(2);
  });

  it("renders ConsentPop row with correct cell values", () => {
    const { container } = renderContent(HTML_CONTENT);
    const firstRow = container.querySelectorAll("tbody tr")[0];
    const cells = firstRow.querySelectorAll("td");
    expect(cells[0].textContent?.trim()).toBe("ConsentPop");
    expect(cells[1].textContent?.trim()).toBe("Yes");
    expect(cells[2].textContent?.trim()).toBe("Free to start");
  });

  it("renders OneTrust row with correct cell values", () => {
    const { container } = renderContent(HTML_CONTENT);
    const secondRow = container.querySelectorAll("tbody tr")[1];
    const cells = secondRow.querySelectorAll("td");
    expect(cells[0].textContent?.trim()).toBe("OneTrust");
    expect(cells[2].textContent?.trim()).toBe("Enterprise pricing");
  });
});

describe("HTML content — horizontal rule", () => {
  it("renders an hr for <hr />", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// HTML <hr> variant: bare <hr> (no slash)
// ---------------------------------------------------------------------------

describe("HTML content — <hr> without trailing slash", () => {
  it("renders an hr element for bare <hr> tag", () => {
    const content = `<p>First paragraph.</p>\n<hr>\n<p>Second paragraph.</p>`;
    const { container } = renderContent(content);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// EDGE CASES
// ---------------------------------------------------------------------------

describe("Edge case — empty content", () => {
  it("renders an article element with no children", () => {
    const { container } = renderContent("");
    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
    expect(article?.childNodes).toHaveLength(0);
  });

  it("does not throw when content is an empty string", () => {
    expect(() => renderContent("")).not.toThrow();
  });
});

describe("Edge case — content with only paragraphs (no headings)", () => {
  const plainContent = `This is the first paragraph about nothing in particular.

This is the second paragraph, also about nothing.

This is a third paragraph wrapping things up.`;

  it("renders all three paragraphs", () => {
    const { container } = renderContent(plainContent);
    expect(container.querySelectorAll("p")).toHaveLength(3);
  });

  it("renders no headings", () => {
    const { container } = renderContent(plainContent);
    expect(container.querySelector("h2")).not.toBeInTheDocument();
    expect(container.querySelector("h3")).not.toBeInTheDocument();
  });

  it("renders each paragraph's text correctly", () => {
    renderContent(plainContent);
    expect(
      screen.getByText(/first paragraph about nothing/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/second paragraph, also about nothing/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/third paragraph wrapping things up/),
    ).toBeInTheDocument();
  });
});

describe("Edge case — HTML content with inline <em> and <strong> in paragraphs", () => {
  const inlineContent = `<p>Here is some <em>italic text</em> and some <strong>bold text</strong> together.</p>`;

  it("renders em element with correct text", () => {
    const { container } = renderContent(inlineContent);
    const em = container.querySelector("em");
    expect(em).toBeInTheDocument();
    expect(em?.textContent).toBe("italic text");
  });

  it("renders strong element with correct text", () => {
    const { container } = renderContent(inlineContent);
    const strong = container.querySelector("strong");
    expect(strong).toBeInTheDocument();
    expect(strong?.textContent).toBe("bold text");
  });
});

describe("Edge case — HTML content with <a> link in paragraph", () => {
  const linkContent = `<p>Visit <a href="https://makrly.com" target="_blank" rel="noopener noreferrer">Makrly</a> for more.</p>`;

  it("renders the anchor with the correct href", () => {
    const { container } = renderContent(linkContent);
    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://makrly.com");
  });

  it("renders the anchor with the correct link text", () => {
    const { container } = renderContent(linkContent);
    const link = container.querySelector("a");
    expect(link?.textContent).toBe("Makrly");
  });
});

describe("Edge case — article wrapper element", () => {
  it("renders an article as the root element", () => {
    const { container } = renderContent(MARKDOWN_CONTENT);
    expect(container.firstChild?.nodeName).toBe("ARTICLE");
  });

  it("renders an article as the root element for HTML content", () => {
    const { container } = renderContent(HTML_CONTENT);
    expect(container.firstChild?.nodeName).toBe("ARTICLE");
  });
});

describe("Edge case — markdown bold and link in same paragraph", () => {
  const content = `**Ready to go?** [Click here](/start)`;

  it("renders both strong and anchor in the paragraph", () => {
    const { container } = renderContent(content);
    const p = container.querySelector("p");
    expect(p?.querySelector("strong")).toBeInTheDocument();
    expect(p?.querySelector("a")).toHaveAttribute("href", "/start");
  });
});
