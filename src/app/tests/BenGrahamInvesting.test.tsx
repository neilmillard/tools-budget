import "@testing-library/jest-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BenGrahamInvesting from "@/app/components/BenGrahamInvesting";
import { bgLessons } from "@/data/benGrahamInvestingData";

describe("BenGrahamInvesting Component", () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  test("renders without crashing", () => {
    render(<BenGrahamInvesting />);
    expect(screen.getByText("Ben Graham Investing Principles")).toBeInTheDocument();
    expect(screen.getByText('Inspired by "The Intelligent Investor"')).toBeInTheDocument();
  });

  test("displays the first lesson by default", () => {
    render(<BenGrahamInvesting />);
    
    // Check that the first lesson is displayed
    expect(screen.getByText(bgLessons[0].title)).toBeInTheDocument();
    expect(screen.getByText(bgLessons[0].summary)).toBeInTheDocument();
    expect(screen.getByText(`"${bgLessons[0].citation}"`)).toBeInTheDocument();
    expect(screen.getByText(bgLessons[0].story)).toBeInTheDocument();
  });

  test("changes lesson when a button is clicked", () => {
    render(<BenGrahamInvesting />);
    
    // Click on the second lesson button
    fireEvent.click(screen.getByText(bgLessons[1].button));
    
    // Check that the second lesson is displayed
    expect(screen.getByText(bgLessons[1].title)).toBeInTheDocument();
    expect(screen.getByText(bgLessons[1].summary)).toBeInTheDocument();
    expect(screen.getByText(`"${bgLessons[1].citation}"`)).toBeInTheDocument();
    expect(screen.getByText(bgLessons[1].story)).toBeInTheDocument();
  });

  test("displays all lesson buttons", () => {
    render(<BenGrahamInvesting />);
    
    // Check that all lesson buttons are displayed
    bgLessons.forEach((lesson) => {
      expect(screen.getByText(lesson.button)).toBeInTheDocument();
    });
  });

  test("has the correct component structure", () => {
    render(<BenGrahamInvesting />);
    
    // Check for the main heading
    expect(screen.getByRole("heading", { name: "Ben Graham Investing Principles" })).toBeInTheDocument();
    
    // Check for the subheading
    expect(screen.getByRole("heading", { name: 'Inspired by "The Intelligent Investor"' })).toBeInTheDocument();
    
    // Check for the "Find the Book" link
    expect(screen.getByText("Find the Book")).toBeInTheDocument();
    expect(screen.getByText("Find the Book").closest("a")).toHaveAttribute(
      "href",
      "https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661"
    );
  });
});