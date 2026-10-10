import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import PrivacyPolicyComponent from "@/app/components/PrivacyPolicyComponent";

afterEach(() => cleanup());

describe("PrivacyPolicyComponent", () => {
  test("names Brevo as the email processor and distinguishes service from marketing email", () => {
    render(<PrivacyPolicyComponent />);
    expect(screen.getByText(/we use brevo/i)).toBeInTheDocument();
    expect(screen.getByText(/regardless of marketing consent/i)).toBeInTheDocument();
    expect(screen.getByText(/unsubscribe from at any time/i)).toBeInTheDocument();
  });
});
