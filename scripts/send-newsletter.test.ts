import { getNewlyPublishedPosts } from "./send-newsletter.mjs";

type Post = { id: string; title: string; date: string };

describe("importing send-newsletter.mjs", () => {
  it("has no side effects (no fetch calls, no process.exit)", async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit should not be called on import");
    });

    await jest.isolateModulesAsync(async () => {
      await import("./send-newsletter.mjs");
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });
});

describe("getNewlyPublishedPosts", () => {
  const posts: Post[] = [
    { id: "a", title: "A", date: "2026-07-25" },
    { id: "b", title: "B", date: "2026-08-01" },
    { id: "c", title: "C", date: "2026-10-10" },
    { id: "d", title: "D", date: "2026-10-17" },
  ];
  const today = new Date("2026-10-11");

  it("returns only posts published since the last sent date, oldest first", () => {
    const result: Post[] = getNewlyPublishedPosts(posts, "2026-07-18", today);
    expect(result.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("excludes posts whose publish date is still in the future", () => {
    const result: Post[] = getNewlyPublishedPosts(posts, "2026-07-18", today);
    expect(result.map((p) => p.id)).not.toContain("d");
  });

  it("returns nothing once every published post has already been sent", () => {
    const result: Post[] = getNewlyPublishedPosts(posts, "2026-10-10", today);
    expect(result).toHaveLength(0);
  });

  it("treats a null lastSentDate as never-sent and includes all published posts", () => {
    const result: Post[] = getNewlyPublishedPosts(posts, null, today);
    expect(result.map((p) => p.id)).toEqual(["a", "b", "c"]);
  });
});
