import { findTrailingSlashIssues } from "./check-links.mjs";

describe("findTrailingSlashIssues", () => {
  it("flags an internal link missing a trailing slash", () => {
    const content = "See [the guide](/guide/give-every-pound-a-job) for more.";
    expect(findTrailingSlashIssues(content)).toHaveLength(1);
  });

  it("does not flag a link that already has a trailing slash", () => {
    const content = "See [the guide](/guide/give-every-pound-a-job/) for more.";
    expect(findTrailingSlashIssues(content)).toHaveLength(0);
  });

  it("does not flag a trailing-slash link with a query string", () => {
    const content = "See [the guide](/guide/give-every-pound-a-job/?from=blog-50-30-20) for more.";
    expect(findTrailingSlashIssues(content)).toHaveLength(0);
  });

  it("flags a link with a query string but no trailing slash before it", () => {
    const content = "See [the guide](/guide/give-every-pound-a-job?from=blog-50-30-20) for more.";
    expect(findTrailingSlashIssues(content)).toHaveLength(1);
  });

  it("does not flag file links, with or without a query string", () => {
    const content =
      "See [the sheet](/download/budget-worksheet.xlsx) and [the chart](/images/chart.png?v=2).";
    expect(findTrailingSlashIssues(content)).toHaveLength(0);
  });
});
