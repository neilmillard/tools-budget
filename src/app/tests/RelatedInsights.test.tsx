import "@testing-library/jest-dom";
import { describe, test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";

describe("RelatedInsights Component", () => {
  const posts = [
    { title: "First Insight", url: "/blog/first" },
    { title: "Second Insight", url: "/blog/second" }
  ];

  test("renders nothing when posts are empty", () => {
    const { container } = render(<RelatedInsights posts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders the section heading and posts", () => {
    render(<RelatedInsights posts={posts} />);
    expect(screen.getByText(/Why This Matters: Timeless Insights/i)).toBeInTheDocument();
    expect(screen.getByText(posts[0].title)).toBeInTheDocument();
    expect(screen.getByText(posts[1].title)).toBeInTheDocument();
  });

  test("renders links with correct hrefs", () => {
    render(<RelatedInsights posts={posts} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", posts[0].url);
    expect(links[1]).toHaveAttribute("href", posts[1].url);
  });
});
