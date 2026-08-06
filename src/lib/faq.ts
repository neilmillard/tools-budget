export type FAQItem = {
  question: string;
  answer: string;
};

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

export function extractFAQItems(content: string): FAQItem[] {
  const lines = content.split("\n");
  const items: FAQItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headingMatch = line.match(/^##\s+(.+?)\?\s*$/);
    if (!headingMatch) continue;

    const question = `${headingMatch[1]}?`;
    const answerLines: string[] = [];

    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j].trim();
      if (next.startsWith("#")) break;
      if (next.length === 0) {
        if (answerLines.length > 0) break;
        continue;
      }
      if (next.startsWith("-") || next.startsWith("*") || next.startsWith("<") || /^\d+\./.test(next)) {
        break;
      }
      answerLines.push(next);
    }

    if (answerLines.length > 0) {
      items.push({ question, answer: stripMarkdown(answerLines.join(" ")) });
    }
  }

  return items;
}

export function hasQuickAnswerCallout(content: string): boolean {
  return /^>\s*\*\*Quick answer:\*\*/m.test(content);
}

export function hasFAQPattern(content: string): boolean {
  return hasQuickAnswerCallout(content) && extractFAQItems(content).length > 0;
}
