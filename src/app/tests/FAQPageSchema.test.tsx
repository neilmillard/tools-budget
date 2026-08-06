import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import FAQPageSchema from "@/components/schema/FAQPageSchema";

describe("FAQPageSchema", () => {
  it("renders a JSON-LD script tag with FAQPage entities", () => {
    const { container } = render(
      <FAQPageSchema
        items={[
          { question: "What does £200/month extra actually save?", answer: "It saves £43,850 in interest." },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const schema = JSON.parse(script!.innerHTML);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "What does £200/month extra actually save?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It saves £43,850 in interest.",
      },
    });
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(<FAQPageSchema items={[]} />);
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
