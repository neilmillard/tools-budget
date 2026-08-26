import { describe, expect, test } from "@jest/globals";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  test("points the blog listing entry at /blog/newest/ instead of /blog/", () => {
    expect(urls).toContain("https://www.helpfulmoney.site/blog/newest/");
    expect(urls).not.toContain("https://www.helpfulmoney.site/blog/");
  });
});
