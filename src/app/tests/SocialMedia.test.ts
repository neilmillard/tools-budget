import { describe, expect, test } from "@jest/globals";
import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const publicDir = path.join(process.cwd(), "public");
const r1 = path.join(publicDir, "media/nan/r1-meet-nan-pearl.mp4");

const headerRules = () => {
  const file = path.join(publicDir, "_headers");
  const rules: Record<string, string[]> = {};
  let current = "";
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^\S/.test(line)) {
      current = line.trim();
      rules[current] = [];
    } else if (current) {
      rules[current].push(line.trim());
    }
  }
  return rules;
};

describe("social media files under /media/", () => {
  test("the R1 reel is published as a static file Instagram can fetch", () => {
    expect(existsSync(r1)).toBe(true);
    // Cloudflare Pages rejects single assets over 25 MiB.
    expect(statSync(r1).size).toBeLessThan(25 * 1024 * 1024);
  });

  test("everything under /media/ is served with X-Robots-Tag: noindex", () => {
    expect(headerRules()["/media/*"]).toEqual(
      expect.arrayContaining(["X-Robots-Tag: noindex"]),
    );
  });

  test("/media/ is not in the sitemap", () => {
    for (const entry of sitemap()) {
      expect(entry.url).not.toContain("/media/");
    }
  });

  test("robots.txt does not block /media/, so Instagram can still fetch it", () => {
    const r = robots().rules;
    for (const rule of Array.isArray(r) ? r : [r]) {
      const disallow = [rule.disallow ?? []].flat();
      expect(disallow.some((d) => "/media/nan/".startsWith(d) && d !== "")).toBe(false);
    }
  });
});
