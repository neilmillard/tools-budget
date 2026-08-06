import fs from "fs";
import path from "path";
import { getBlogPost } from "@/lib/blogs";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog-posts");

describe("getBlogPost author field", () => {
  it("falls back to the default site author when frontmatter has no author", async () => {
    const post = await getBlogPost("the-art-of-balance");
    expect(post.author).toBe("Helpful Money Team");
  });

  describe("with a custom author in frontmatter", () => {
    const fixtureId = "__test-fixture-author-post";
    const fixturePath = path.join(POSTS_DIR, `${fixtureId}.md`);

    beforeAll(() => {
      fs.writeFileSync(
        fixturePath,
        '---\ntitle: "Fixture Post"\ndate: "2026-01-01"\nauthor: "Jane Doe"\nauthorUrl: "/about/jane-doe/"\n---\n\n# Fixture Post\n\nBody text.\n'
      );
    });

    afterAll(() => {
      fs.unlinkSync(fixturePath);
    });

    it("uses the frontmatter author and authorUrl when present", async () => {
      const post = await getBlogPost(fixtureId);
      expect(post.author).toBe("Jane Doe");
      expect(post.authorUrl).toBe("/about/jane-doe/");
    });
  });
});
