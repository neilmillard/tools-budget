import {
  campaignName,
  fetchSentCampaignNames,
  getNewlyPublishedPosts,
  withoutAlreadySent,
} from "./send-newsletter.mjs";

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

describe("campaignName", () => {
  it("names the Brevo campaign after the post title", () => {
    expect(campaignName({ id: "a", title: "Zero-Based Budgeting", date: "2026-10-18" })).toBe(
      "Newsletter - Zero-Based Budgeting",
    );
  });
});

describe("withoutAlreadySent", () => {
  const posts: Post[] = [
    { id: "nw", title: "Net Worth Tracking", date: "2026-10-17" },
    { id: "zb", title: "Zero-Based Budgeting", date: "2026-10-18" },
    { id: "lc", title: "Lifestyle Creep", date: "2026-10-24" },
  ];

  it("drops posts that already have a campaign in Brevo, so a stale state file cannot resend them", () => {
    const sent = new Set(["Newsletter - Net Worth Tracking", "Newsletter - Zero-Based Budgeting"]);
    const kept: Post[] = withoutAlreadySent(posts, sent);
    expect(kept.map((p) => p.id)).toEqual(["lc"]);
  });

  it("keeps every post when nothing has been sent", () => {
    expect(withoutAlreadySent(posts, new Set())).toHaveLength(3);
  });
});

describe("fetchSentCampaignNames", () => {
  const page = (campaigns: { name: string; status: string }[], count: number) => ({
    ok: true,
    json: async () => ({ campaigns, count }),
  });

  it("collects non-draft campaign names across pages", async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(
        page(
          [
            { name: "Newsletter - A", status: "sent" },
            { name: "Newsletter - B", status: "draft" },
          ],
          3,
        ),
      )
      .mockResolvedValueOnce(page([{ name: "Newsletter - C", status: "queued" }], 3));

    const names = await fetchSentCampaignNames(fetchFn, "key", 2);

    expect([...names].sort()).toEqual(["Newsletter - A", "Newsletter - C"]);
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(fetchFn.mock.calls[0][0]).toContain("offset=0");
    expect(fetchFn.mock.calls[1][0]).toContain("offset=2");
    expect(fetchFn.mock.calls[0][1].headers["api-key"]).toBe("key");
  });

  it("stops on an empty page even if count is larger", async () => {
    const fetchFn = jest.fn().mockResolvedValueOnce(page([], 50));
    const names = await fetchSentCampaignNames(fetchFn, "key", 100);
    expect(names.size).toBe(0);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("throws rather than sending blind when Brevo cannot be read", async () => {
    const fetchFn = jest.fn().mockResolvedValueOnce({ ok: false, status: 401, text: async () => "unauthorized" });
    await expect(fetchSentCampaignNames(fetchFn, "key", 100)).rejects.toThrow(/401/);
  });
});
