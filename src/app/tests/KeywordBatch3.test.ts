import { getAllBlogPosts, getBlogPost } from "@/lib/blogs";
import fs from "fs";
import path from "path";

// DEL-272: ten posts written from the Google Ads keyword research, scheduled
// weekly after the last post of the DEL-534 batch (2026-11-07).
const schedule: { id: string; date: string; keyword: string; toolUrl: string }[] = [
  { id: "paid-off-mortgage-early-checklist", date: "2026-11-14", keyword: "paid off your mortgage early", toolUrl: "/tools/mortgage-overpayment-calculator/" },
  { id: "when-will-my-mortgage-be-paid-off", date: "2026-11-21", keyword: "when will my mortgage be paid off", toolUrl: "/tools/mortgage-overpayment-calculator/" },
  { id: "saving-for-a-house-deposit", date: "2026-11-28", keyword: "saving for a house deposit", toolUrl: "/tools/afford/" },
  { id: "richest-man-in-babylon-modern-guide", date: "2026-12-05", keyword: "richest man in babylon", toolUrl: "/tools/budget/" },
  { id: "global-tracker-fund-explained", date: "2026-12-12", keyword: "global tracker fund", toolUrl: "/tools/investment-calculator/" },
  { id: "how-to-save-money-on-groceries", date: "2026-12-19", keyword: "save money on groceries", toolUrl: "/tools/budget/" },
  { id: "how-much-to-save-each-month", date: "2026-12-26", keyword: "how much to save", toolUrl: "/tools/budget/" },
  { id: "how-much-emergency-fund", date: "2027-01-02", keyword: "emergency fund", toolUrl: "/tools/budget/" },
  { id: "get-out-of-debt-on-a-low-income", date: "2027-01-09", keyword: "out of debt on a low income", toolUrl: "/tools/budget/" },
  { id: "pay-yourself-first", date: "2027-01-16", keyword: "pay yourself first", toolUrl: "/tools/budget/" },
];
const postIds = schedule.map((s) => s.id);

describe("Keyword research batch 3 (DEL-272)", () => {
  it.each(postIds)("%s exists in the blog posts folder", (id) => {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts", `${id}.md`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("schedules the posts weekly from 2026-11-14 to 2027-01-16", () => {
    const allPosts = getAllBlogPosts("oldest", true);
    const dates = schedule.map((s) => allPosts.find((p) => p.id === s.id)?.date);
    expect(dates).toEqual(schedule.map((s) => s.date));

    const weekMs = 7 * 24 * 60 * 60 * 1000;
    for (let i = 1; i < dates.length; i++) {
      expect(new Date(dates[i]!).getTime() - new Date(dates[i - 1]!).getTime()).toBe(weekMs);
    }
  });

  it("starts after every post already in the schedule", () => {
    const lastOwnDate = new Date(schedule[schedule.length - 1].date).getTime();
    const others = getAllBlogPosts("oldest", true).filter(
      (p) => !postIds.includes(p.id) && new Date(p.date).getTime() <= lastOwnDate
    );
    const latestOther = Math.max(...others.map((p) => new Date(p.date).getTime()));
    expect(new Date(schedule[0].date).getTime()).toBeGreaterThan(latestOther);
  });

  it.each(schedule)("$id targets its keyword in the title or description", async ({ id, keyword }) => {
    const post = await getBlogPost(id);
    expect(post.description).toBeTruthy();
    expect(`${post.title} ${post.description}`.toLowerCase()).toContain(keyword);
  });

  it.each(postIds)("%s follows the GEO guidelines: quick answer and question headings", async (id) => {
    const post = await getBlogPost(id);
    expect(post.content).toContain("> **Quick answer:**");
    const questionHeadings = post.content.match(/^## .+\?$/gm) ?? [];
    expect(questionHeadings.length).toBeGreaterThanOrEqual(2);
  });

  it.each(postIds)("%s shows a worked example with its inputs", async (id) => {
    const post = await getBlogPost(id);
    expect(post.content).toContain("Worked Example");
    expect(post.content).toMatch(/→ .*£[\d,]+/);
  });

  it.each(schedule)("$id ends with a ToolCTA pointing at $toolUrl", async ({ id, toolUrl }) => {
    const post = await getBlogPost(id);
    const cta = post.content.match(/<ToolCTA[\s\S]*?\/>/)?.[0] ?? "";
    expect(cta).toContain(`toolUrl="${toolUrl}"`);
    expect(cta).toMatch(/title="[^"]+"/);
    expect(cta).toMatch(/toolName="[^"]+"/);
    expect(cta).toMatch(/description="[^"]+"/);
  });

  it.each(postIds)("%s says it is not financial advice", async (id) => {
    const post = await getBlogPost(id);
    expect(post.content).toContain("not financial advice");
  });

  it.each(postIds)("%s only links to blog posts that exist", async (id) => {
    const post = await getBlogPost(id);
    const linked = [...post.content.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/?\)/g)].map((m) => m[1]);
    expect(linked.length).toBeGreaterThan(0);
    linked.forEach((slug) => {
      const filePath = path.join(process.cwd(), "src", "data", "blog-posts", `${slug}.md`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it.each(schedule)("$id is listed in docs/article-publish-dates.md on $date", async ({ id, date }) => {
    const post = await getBlogPost(id);
    const doc = fs.readFileSync(path.join(process.cwd(), "docs", "article-publish-dates.md"), "utf8");
    const row = doc.split("\n").find((line) => line.includes(post.title));
    expect(row).toBeDefined();
    expect(row).toContain(date);
  });

  // Facts checked against gov.uk and MoneySavingExpert on 2026-10-20.
  it("says the Lifetime ISA is being replaced, not just possibly reformed", async () => {
    const post = await getBlogPost("saving-for-a-house-deposit");
    expect(post.content).toContain("confirmed it will replace the Lifetime ISA");
    expect(post.content).not.toContain("signalled");
  });

  it("gives the gov.uk Debt Relief Order limits, and says they apply in England and Wales", async () => {
    const post = await getBlogPost("get-out-of-debt-on-a-low-income");
    expect(post.content).toContain("less than £50,000");
    expect(post.content).toContain("less than £75 a month");
    expect(post.content).toContain("less than £2,000");
    expect(post.content).toContain("£4,000");
    expect(post.content).toContain("England and Wales");
  });
});
