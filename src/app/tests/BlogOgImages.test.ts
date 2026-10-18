import { getBlogOgImage } from "@/lib/blogs";
import { generateMetadata } from "@/app/blog/[id]/page";

describe("blog share image references", () => {
  it("getBlogOgImage returns the post's own image", () => {
    expect(getBlogOgImage("zero-based-budgeting")).toBe("/images/blog/zero-based-budgeting.png");
  });

  it("getBlogOgImage falls back to the site share image when a post has none", () => {
    expect(getBlogOgImage("no-such-post")).toBe("/images/give-every-pound-a-job-share.png");
  });

  it("puts the image in the post's Open Graph and Twitter metadata", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ id: "zero-based-budgeting" }) });
    expect(metadata.openGraph?.images).toEqual([
      { url: "/images/blog/zero-based-budgeting.png", width: 1200, height: 630 },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/images/blog/zero-based-budgeting.png"],
    });
  });
});
