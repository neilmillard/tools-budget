import { describe, expect, test } from "@jest/globals";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  test("points the blog listing entry at /blog/newest/ instead of /blog/", () => {
    expect(urls).toContain("https://www.helpfulmoney.site/blog/newest/");
    expect(urls).not.toContain("https://www.helpfulmoney.site/blog/");
  });

  test("includes the legal pages with trailing slashes", () => {
    expect(urls).toContain("https://www.helpfulmoney.site/terms-of-service/");
    expect(urls).toContain("https://www.helpfulmoney.site/privacy-policy/");
  });

  test("every entry uses a trailing-slash URL", () => {
    urls.forEach((url) => {
      expect(url.endsWith("/")).toBe(true);
    });
  });
});
