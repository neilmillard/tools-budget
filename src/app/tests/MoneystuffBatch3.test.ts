import { getAllBlogPosts, getBlogPost } from "@/lib/blogs";
import fs from "fs";
import path from "path";

describe("Moneystuff refill batch 3 (DEL-750)", () => {
  const postIds = [
    "fixed-vs-tracker-mortgage",
    "salary-sacrifice-pension",
    "cash-isa-vs-stocks-and-shares-isa",
    "junior-isa-explained",
    "early-repayment-charges-mortgage-overpaying",
    "debt-consolidation-vs-balance-transfer",
    "budgeting-on-variable-income",
    "how-much-cash-vs-invested",
  ];

  it("should have all 8 new posts in the filesystem", () => {
    postIds.forEach((id) => {
      const filePath = path.join(process.cwd(), "src", "data", "blog-posts", `${id}.md`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it("should correctly load metadata for new posts via getAllBlogPosts", () => {
    const allPosts = getAllBlogPosts("oldest", true);
    const newPostMetadata = allPosts.filter((post) => postIds.includes(post.id));

    expect(newPostMetadata).toHaveLength(8);

    newPostMetadata.forEach((post) => {
      expect(post.title).toBeDefined();
      expect(post.date).toBeDefined();
      expect(new Date(post.date).getTime()).not.toBeNaN();
    });
  });

  it("should have strictly increasing, weekly-staggered publish dates continuing from 2027-01-16", () => {
    const allPosts = getAllBlogPosts("oldest", true);
    const dates = postIds.map(
      (id) => new Date(allPosts.find((p) => p.id === id)!.date).getTime()
    );

    const lastExistingDate = new Date("2027-01-16").getTime();
    expect(dates[0]).toBeGreaterThan(lastExistingDate);

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeGreaterThan(dates[i - 1]);
    }
  });

  it("starts after every post already in the schedule", () => {
    const allPosts = getAllBlogPosts("oldest", true);
    const ownDates = postIds.map((id) => new Date(allPosts.find((p) => p.id === id)!.date).getTime());
    const earliestNew = Math.min(...ownDates);
    const latestNew = Math.max(...ownDates);
    const others = allPosts.filter(
      (p) => !postIds.includes(p.id) && new Date(p.date).getTime() <= latestNew
    );
    const latestOther = Math.max(...others.map((p) => new Date(p.date).getTime()));
    expect(earliestNew).toBeGreaterThan(latestOther);
  });

  it("should load content for each new post via getBlogPost, with a Quick answer callout", async () => {
    for (const id of postIds) {
      const post = await getBlogPost(id);
      expect(post.id).toBe(id);
      expect(post.title).toBeTruthy();
      expect(post.content).toContain("**Quick answer:**");
    }
  });

  it("should include at least one question-form H2 heading per post", async () => {
    for (const id of postIds) {
      const post = await getBlogPost(id);
      expect(post.content).toMatch(/^## .+\?$/m);
    }
  });

  it("should include a ToolCTA component in each post", async () => {
    for (const id of postIds) {
      const post = await getBlogPost(id);
      expect(post.content).toContain("<ToolCTA");
    }
  });
});
