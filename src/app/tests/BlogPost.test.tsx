import "@testing-library/jest-dom";
import {describe, test} from "@jest/globals";
import {cleanup, render, screen} from "@testing-library/react";
import BlogPost from "@/app/components/BlogPost";


describe("BlogPost Component", () => {
  const mockData = {title: 'Test Post', date: '2025-03-23'};
  const mockContents = '---\ntitle: Test Post\ndate: 2025-03-23\n---\n# Hello World';

  test("renders without crashing", () => {
    render(<BlogPost content={mockContents} date={mockData.date} title={mockData.title}/>);
    expect(screen.getByText(mockData.title)).toBeInTheDocument();
    cleanup()
  });
});
