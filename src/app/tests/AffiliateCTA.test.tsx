import "@testing-library/jest-dom";
import { describe, test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import AffiliateCTA from "@/app/components/ui/AffiliateCTA";

describe("AffiliateCTA Component", () => {
  const props = {
    title: "Start Investing",
    description: "Open an account today.",
    buttonText: "Open Account",
    url: "https://example.com/invest",
  };

  test("renders the title, description, and button text", () => {
    render(<AffiliateCTA {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByText(props.buttonText)).toBeInTheDocument();
  });

  test("renders the link with correct href and attributes", () => {
    render(<AffiliateCTA {...props} />);
    const link = screen.getByRole("link", { name: props.buttonText });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", props.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("always shows the affiliate disclosure note", () => {
    render(<AffiliateCTA {...props} />);
    expect(screen.getByText(/This is an affiliate link/i)).toBeInTheDocument();
    expect(screen.getByText(/We may earn a commission at no cost to you/i)).toBeInTheDocument();
  });

  test("shows 'Capital at risk' warning when isInvestment is true", () => {
    render(<AffiliateCTA {...props} isInvestment={true} />);
    expect(screen.getByText(/Capital at risk/i)).toBeInTheDocument();
  });

  test("does not show 'Capital at risk' warning when isInvestment is false", () => {
    render(<AffiliateCTA {...props} isInvestment={false} />);
    expect(screen.queryByText(/Capital at risk/i)).not.toBeInTheDocument();
  });
});
