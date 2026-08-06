import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import ArticleSchema from "@/components/schema/ArticleSchema";

describe("ArticleSchema", () => {
  it("renders a JSON-LD script tag with Article schema fields", () => {
    const { container } = render(
      <ArticleSchema
        headline="A Worked Example"
        description="A worked example post"
        datePublished="2026-02-28"
        author="Helpful Money Team"
        url="https://www.helpfulmoney.site/blog/a-worked-example/"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();

    const schema = JSON.parse(script!.innerHTML);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe("A Worked Example");
    expect(schema.description).toBe("A worked example post");
    expect(schema.datePublished).toBe("2026-02-28");
    expect(schema.dateModified).toBe("2026-02-28");
    expect(schema.author).toEqual({ "@type": "Person", name: "Helpful Money Team" });
    expect(schema.publisher).toEqual({
      "@type": "Organization",
      name: "Helpful Money",
      url: "https://www.helpfulmoney.site",
    });
    expect(schema.url).toBe("https://www.helpfulmoney.site/blog/a-worked-example/");
  });

  it("falls back dateModified to datePublished when not provided, and omits description when absent", () => {
    const { container } = render(
      <ArticleSchema
        headline="No Description"
        datePublished="2026-01-01"
        author="Helpful Money Team"
        url="https://www.helpfulmoney.site/blog/no-description/"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script!.innerHTML);
    expect(schema.dateModified).toBe("2026-01-01");
    expect(schema.description).toBeUndefined();
  });
});
