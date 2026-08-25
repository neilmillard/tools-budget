import { getNewlyPublishedPosts, NewsletterPost } from "@/lib/newsletter";

const posts: NewsletterPost[] = [
  { id: "old-post", title: "Old Post", date: "2026-07-04" },
  { id: "mid-post", title: "Mid Post", date: "2026-07-11" },
  { id: "new-post", title: "New Post", date: "2026-07-18" },
  { id: "future-post", title: "Future Post", date: "2026-07-25" },
];

describe("getNewlyPublishedPosts", () => {
  it("returns posts published after lastSentDate and up to today, oldest first", () => {
    const result = getNewlyPublishedPosts(
      posts,
      "2026-07-04",
      new Date("2026-07-18")
    );

    expect(result.map((p) => p.id)).toEqual(["mid-post", "new-post"]);
  });

  it("excludes posts published on or before lastSentDate", () => {
    const result = getNewlyPublishedPosts(
      posts,
      "2026-07-11",
      new Date("2026-07-18")
    );

    expect(result.map((p) => p.id)).toEqual(["new-post"]);
  });

  it("excludes posts dated after today even if newer than lastSentDate", () => {
    const result = getNewlyPublishedPosts(
      posts,
      "2026-07-04",
      new Date("2026-07-20")
    );

    expect(result.map((p) => p.id)).toEqual(["mid-post", "new-post"]);
  });

  it("treats a null lastSentDate as everything up to today", () => {
    const result = getNewlyPublishedPosts(posts, null, new Date("2026-07-11"));

    expect(result.map((p) => p.id)).toEqual(["old-post", "mid-post"]);
  });

  it("returns an empty array when nothing new has been published", () => {
    const result = getNewlyPublishedPosts(
      posts,
      "2026-07-18",
      new Date("2026-07-18")
    );

    expect(result).toEqual([]);
  });
});
