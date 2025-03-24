import "@testing-library/jest-dom";
import {describe, test} from "@jest/globals";
import {cleanup, render, screen} from "@testing-library/react";
import BlogPost, {BlogPostProps} from "@/app/components/BlogPost";
import matter from "gray-matter";


describe("BlogPost Component", () => {
  const mockContents = '---\ntitle: Test Post\ndate: 2025-03-23\n---\n# Hello World';
  const { data, content } = matter(mockContents);
  const article: BlogPostProps = {
    title: data.title,
    date: data.date.toString(),
    content: content,
  }

  test("renders without crashing", () => {
    render(<BlogPost content={article.content} date={article.date} title={article.title}/>);
    expect(screen.getByText(article.title)).toBeInTheDocument();
    expect(screen.getByText(article.date)).toBeInTheDocument();
    cleanup()
  });
});
