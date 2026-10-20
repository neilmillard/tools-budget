import { getBlogPost } from "@/lib/blogs";

// The FSCS deposit limit rose from £85,000 to £120,000 on 1 December 2025
// (DEL-272, confirmed against fscs.org.uk and MoneySavingExpert).
describe("FSCS savings protection post", () => {
  it("states the current £120,000 limit, and £240,000 for joint accounts", async () => {
    const post = await getBlogPost("fscs-savings-protection");
    expect(post.content).toContain("£120,000");
    expect(post.content).toContain("£240,000");
  });

  it("only mentions the old £85,000 limit as the previous figure", async () => {
    const post = await getBlogPost("fscs-savings-protection");
    const mentions = post.content.match(/£85,000/g) ?? [];
    expect(mentions).toHaveLength(1);
    expect(post.content).toMatch(/rose from £85,000 to £120,000 on 1 December 2025/);
  });

  it("covers temporary high balances", async () => {
    const post = await getBlogPost("fscs-savings-protection");
    expect(post.content.toLowerCase()).toContain("temporary high balance");
    expect(post.content).toContain("£1.4 million");
  });
});
