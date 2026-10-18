import { getAllBlogPosts, getBlogPost } from "@/lib/blogs";
import fs from "fs";
import path from "path";

const POST_ID = "zero-based-budgeting";

describe("Zero-based budgeting post", () => {
  it("exists in the blog posts folder", () => {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts", `${POST_ID}.md`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("is published, with a title and description that target the search term", async () => {
    const listed = getAllBlogPosts().find((post) => post.id === POST_ID);
    expect(listed).toBeDefined();

    const post = await getBlogPost(POST_ID);
    expect(post.title.toLowerCase()).toContain("zero-based budgeting");
    expect(post.description).toBeTruthy();
    expect(new Date(post.date).getTime()).not.toBeNaN();
  });

  it("follows the GEO guidelines: quick answer, question headings, checkable inputs", async () => {
    const post = await getBlogPost(POST_ID);
    expect(post.content).toContain("> **Quick answer:**");

    const questionHeadings = post.content.match(/^## .+\?$/gm) ?? [];
    expect(questionHeadings.length).toBeGreaterThanOrEqual(3);

    expect(post.content).toContain("Worked Example");
    expect(post.content).toMatch(/Take-home pay: £[\d,]+/);
  });

  it("links to the paid guide, tagged with its own entry source", async () => {
    const post = await getBlogPost(POST_ID);
    expect(post.content).toContain("](/guide/give-every-pound-a-job/?from=blog-zero-based)");
  });

  it("offers the free worksheet and the Budget Planner", async () => {
    const post = await getBlogPost(POST_ID);
    expect(post.content).toContain("](/download/budget-worksheet/)");
    expect(post.content).toMatch(/<ToolCTA[\s\S]*toolUrl="\/tools\/budget\/"[\s\S]*\/>/);
  });

  it("explains that this is personal budgeting, not the corporate method", async () => {
    const post = await getBlogPost(POST_ID);
    expect(post.content.toLowerCase()).toContain("businesses");
  });
});
