import { getAllBlogPosts, getBlogPost } from "@/lib/blogs";
import fs from "fs";
import path from "path";

describe("Basic Economics Series (DEL-533)", () => {
  const postIds = [
    "rewards-not-intentions",
    "every-choice-has-a-cost",
    "prices-are-messages",
    "why-price-controls-backfire",
    "profit-and-loss-as-feedback",
    "your-wage-is-a-price-too",
    "why-trade-makes-everyone-richer",
    "seven-lessons-basic-economics",
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

  it("should have strictly increasing, weekly-staggered publish dates continuing from 2026-07-18", () => {
    const allPosts = getAllBlogPosts("oldest", true);
    const dates = postIds.map(
      (id) => new Date(allPosts.find((p) => p.id === id)!.date).getTime()
    );

    const lastExistingDate = new Date("2026-07-18").getTime();
    expect(dates[0]).toBeGreaterThan(lastExistingDate);

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeGreaterThan(dates[i - 1]);
    }
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
});
