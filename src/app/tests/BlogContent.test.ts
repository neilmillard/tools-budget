import { getAllBlogPosts, getBlogPost } from "@/lib/blogs";
import fs from "fs";
import path from "path";

describe("Blog Content Integration", () => {
  const postIds = [
    "what-the-50-30-20-rule-looks-like",
    "how-much-save-mortgage-overpayment",
    "know-if-you-can-afford-mortgage",
    "how-to-use-pension-calculator",
  ];

  it("should have all 4 new companion posts in the filesystem", () => {
    postIds.forEach((id) => {
      const filePath = path.join(process.cwd(), "src", "data", "blog-posts", `${id}.md`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it("should correctly load metadata for new posts via getAllBlogPosts", () => {
    const allPosts = getAllBlogPosts();
    const newPostMetadata = allPosts.filter((post) => postIds.includes(post.id));
    
    expect(newPostMetadata).toHaveLength(4);
    
    newPostMetadata.forEach((post) => {
      expect(post.title).toBeDefined();
      expect(post.date).toBeDefined();
      // Ensure date is valid
      expect(new Date(post.date).getTime()).not.toBeNaN();
    });
  });

  it("should correctly load content for each new post via getBlogPost", async () => {
    for (const id of postIds) {
      const post = await getBlogPost(id);
      expect(post.id).toBe(id);
      expect(post.title).toBeTruthy();
      expect(post.content).toContain("<ToolCTA");
      expect(post.content).toContain("Worked Example");
    }
  });

  it("should ensure ToolCTA usage has all required props in the markdown", async () => {
    for (const id of postIds) {
      const post = await getBlogPost(id);
      // Simple regex to check for prop names in ToolCTA
      expect(post.content).toMatch(/title=/);
      expect(post.content).toMatch(/toolName=/);
      expect(post.content).toMatch(/toolUrl=/);
      expect(post.content).toMatch(/description=/);
    }
  });
});
