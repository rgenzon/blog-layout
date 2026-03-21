export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 225;
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function getWordCount(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  return text.trim().split(/\s+/).length;
}

export function normalizeDateString(dateStr: string): string {
  if (dateStr.includes("T")) return dateStr;
  return dateStr + "T12:00:00";
}

export function formatDate(dateStr: string): string {
  return new Date(normalizeDateString(dateStr)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
