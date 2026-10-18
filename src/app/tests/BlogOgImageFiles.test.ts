import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog-posts");
const postIds = fs.readdirSync(POSTS_DIR).map((file) => file.replace(/\.md$/, ""));

function pngSize(filePath: string) {
  const buffer = fs.readFileSync(filePath);
  expect(buffer.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

describe("blog share image files", () => {
  it.each(postIds)("%s has a 1200x630 share image (run scripts/generate-blog-og-images.mjs)", (id) => {
    const filePath = path.join(process.cwd(), "public", "images", "blog", `${id}.png`);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(pngSize(filePath)).toEqual({ width: 1200, height: 630 });
  });
});
