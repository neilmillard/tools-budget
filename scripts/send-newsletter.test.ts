import { getNewlyPublishedPosts } from "./send-newsletter.mjs";

describe("getNewlyPublishedPosts", () => {
  const posts = [
    { id: "a", title: "A", date: "2026-07-25" },
    { id: "b", title: "B", date: "2026-08-01" },
    { id: "c", title: "C", date: "2026-10-10" },
    { id: "d", title: "D", date: "2026-10-17" },
  ];
  const today = new Date("2026-10-11");

  it("returns only posts published since the last sent date, oldest first", () => {
    const result = getNewlyPublishedPosts(posts, "2026-07-18", today);
    expect(result.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("excludes posts whose publish date is still in the future", () => {
    const result = getNewlyPublishedPosts(posts, "2026-07-18", today);
    expect(result.map((p) => p.id)).not.toContain("d");
  });

  it("returns nothing once every published post has already been sent", () => {
    const result = getNewlyPublishedPosts(posts, "2026-10-10", today);
    expect(result).toHaveLength(0);
  });

  it("treats a null lastSentDate as never-sent and includes all published posts", () => {
    const result = getNewlyPublishedPosts(posts, null, today);
    expect(result.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });
});
