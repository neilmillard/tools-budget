import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import OrganizationSchema from "@/components/schema/OrganizationSchema";

describe("OrganizationSchema", () => {
  it("links the Organization founder to the canonical Person entity", () => {
    const { container } = render(<OrganizationSchema />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const schema = JSON.parse(script!.innerHTML);
    expect(schema["@type"]).toBe("Organization");
    expect(schema.founder).toEqual(
      expect.objectContaining({
        "@type": "Person",
        name: "Neil Millard",
        url: "https://neilmillard.com",
      })
    );
    expect(schema.sameAs).toEqual(expect.arrayContaining(["https://www.linkedin.com/in/neilmillard/"]));
  });

  it("sameAs cross-links the other Delta Famiglia properties", () => {
    const { container } = render(<OrganizationSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script!.innerHTML);

    expect(schema.sameAs).toEqual(
      expect.arrayContaining(["https://neilmillard.com", "https://devops-answers.com", "https://www.confident-contractor.co.uk"])
    );
  });

  it("declares knowsAbout and talksAbout", () => {
    const { container } = render(<OrganizationSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script!.innerHTML);

    expect(schema.knowsAbout).toEqual(
      expect.arrayContaining(["Debt", "Saving", "Buying a Home", "Investing"])
    );
    expect(schema.talksAbout).toEqual(
      expect.arrayContaining(["Weekly personal finance blog"])
    );
  });
});
