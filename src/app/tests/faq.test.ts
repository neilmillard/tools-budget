import { extractFAQItems, hasFAQPattern, hasQuickAnswerCallout } from "@/lib/faq";

describe("faq extraction", () => {
  const contentWithPattern = `
> **Quick answer:** Overpaying a mortgage saves interest and shortens the term.

## How much interest does a £200,000 mortgage cost over 25 years?

If they simply make their minimum payments for the next 25 years, they will pay a total of interest.

## What does £200/month extra actually save?

Result: interest saved, mortgage cleared early.

## Not a question header

This should not become an FAQ entry.
`;

  it("extracts question-form H2 headers with their following paragraph as FAQ items", () => {
    const items = extractFAQItems(contentWithPattern);
    expect(items).toHaveLength(2);
    expect(items[0].question).toBe("How much interest does a £200,000 mortgage cost over 25 years?");
    expect(items[0].answer).toContain("minimum payments");
    expect(items[1].question).toBe("What does £200/month extra actually save?");
  });

  it("ignores non-question H2 headers", () => {
    const items = extractFAQItems(contentWithPattern);
    expect(items.some((i) => i.question.includes("Not a question header"))).toBe(false);
  });

  it("strips markdown formatting from answers", () => {
    const content = `## Is this a question?\n\nThe **bold** answer with a [link](/foo) and \`code\`.`;
    const items = extractFAQItems(content);
    expect(items[0].answer).toBe("The bold answer with a link and code.");
  });

  it("skips question headers with no following paragraph", () => {
    const content = `## Is this a question?\n\n- a list item\n- another`;
    const items = extractFAQItems(content);
    expect(items).toHaveLength(0);
  });

  it("detects the Quick answer callout", () => {
    expect(hasQuickAnswerCallout(contentWithPattern)).toBe(true);
    expect(hasQuickAnswerCallout("no callout here")).toBe(false);
  });

  it("only reports the FAQ pattern when both a callout and question headers are present", () => {
    expect(hasFAQPattern(contentWithPattern)).toBe(true);
    expect(hasFAQPattern("## Not a question\n\nSome text")).toBe(false);
    expect(hasFAQPattern("> **Quick answer:** yes\n\n## Not a question\n\nSome text")).toBe(false);
  });
});
