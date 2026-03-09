import "@testing-library/jest-dom";
import {describe, test} from "@jest/globals";
import {cleanup, render, screen} from "@testing-library/react";
import BlogPost, {BlogPostProps} from "@/app/components/blog/BlogPost";
import matter from "gray-matter";


describe("BlogPost Component", () => {
  const mockContents = '---\ntitle: Test Post\ndate: 2025-03-23\n---\n# Hello World';
  const { data, content } = matter(mockContents);
  const article: BlogPostProps = {
    title: data.title,
    date: data.date.toString(),
    content: content,
  }

  test("renders with ToolCTA without crashing", () => {
    const contentWithCTA = "# Hello World\n\n<ToolCTA title='Try this' toolName='My Tool' toolUrl='/tools/my-tool' description='Cool tool' />";
    render(<BlogPost content={contentWithCTA} date={article.date} title={article.title}/>);
    expect(screen.getByText("Try this")).toBeInTheDocument();
    expect(screen.getByText("Try the My Tool")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Try the My Tool/i })).toHaveAttribute('href', '/tools/my-tool');
    cleanup()
  });
});
