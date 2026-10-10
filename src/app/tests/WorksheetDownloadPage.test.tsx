import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import WorksheetDownloadPageContent from "@/app/components/WorksheetDownloadPageContent";

afterEach(() => cleanup());

describe("WorksheetDownloadPageContent", () => {
  test("shows the worksheet title and a download link to the real file", () => {
    render(<WorksheetDownloadPageContent />);
    expect(screen.getByRole("heading", { name: /budget worksheet/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download/i })).toHaveAttribute(
      "href",
      "/download/Give%20Every%20Pound%20a%20Job%20-%20Budget%20Worksheet.xlsx"
    );
  });

  test("states the worksheet is free", () => {
    render(<WorksheetDownloadPageContent />);
    expect(screen.getAllByText(/free/i).length).toBeGreaterThan(0);
  });

  test("links to the paid guide as the natural next step", () => {
    render(<WorksheetDownloadPageContent />);
    expect(screen.getByRole("link", { name: /give every pound a job/i })).toHaveAttribute(
      "href",
      "/guide/give-every-pound-a-job"
    );
  });

  test("links to the 30-day challenge", () => {
    render(<WorksheetDownloadPageContent />);
    expect(screen.getByRole("link", { name: /30-day challenge/i })).toHaveAttribute(
      "href",
      "/challenge/give-every-pound-a-job"
    );
  });

  test("makes no investment, bank or product recommendations", () => {
    render(<WorksheetDownloadPageContent />);
    expect(
      screen.getByText(/does not recommend any specific bank, app, savings product or investment/i)
    ).toBeInTheDocument();
  });
});
