import "@testing-library/jest-dom";
import { describe, test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import ToolCTA from "@/app/components/blog/ToolCTA";

describe("ToolCTA Component", () => {
  const props = {
    title: "Plan Your Future",
    toolName: "Budget Planner",
    toolUrl: "/tools/budget",
    description: "Take control of your finances today."
  };

  test("renders the title and description", () => {
    render(<ToolCTA {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  test("renders the link with correct href and text", () => {
    render(<ToolCTA {...props} />);
    const link = screen.getByRole("link", { name: /Try the Budget Planner/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", props.toolUrl);
  });
});
