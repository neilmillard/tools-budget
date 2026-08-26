import "@testing-library/jest-dom";
import {describe, test, expect} from "@jest/globals";
import {cleanup, render} from "@testing-library/react";
import NewsletterForm from "@/app/components/NewsletterForm";

describe("NewsletterForm Component", () => {
  test("does not render a raw email address (triggers Cloudflare email obfuscation, breaking crawlers)", () => {
    const {container} = render(<NewsletterForm />);

    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    expect(container.innerHTML).not.toMatch(emailPattern);

    cleanup();
  });
});
