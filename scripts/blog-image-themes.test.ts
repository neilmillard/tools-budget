import { MOTIFS, motifForPost } from "./blog-image-themes.mjs";

describe("motifForPost", () => {
  it.each([
    ["zero-based-budgeting", "envelopes"],
    ["sinking-funds-envelope-method", "envelopes"],
    ["what-the-50-30-20-rule-looks-like", "envelopes"],
    ["your-financial-safety-net", "jar"],
    ["using-isa-allowance", "jar"],
    ["how-much-save-mortgage-overpayment", "house"],
    ["building-wealth-through-property", "house"],
    ["power-of-dividends", "chart"],
    ["investment-platform-fees", "fees"],
    ["workplace-pension-auto-enrolment", "chart"],
    ["debt-snowball-vs-avalanche", "coins"],
    ["inflation-invisible-thief", "coins"],
    ["prices-are-messages", "scales"],
    ["why-trade-makes-everyone-richer", "scales"],
  ])("%s gets the %s picture", (id, motif) => {
    expect(motifForPost(id)).toBe(motif);
  });

  it("falls back to the jar for a post that matches no rule", () => {
    expect(motifForPost("mastering-your-mind")).toBe("jar");
  });

  it("lets a frontmatter image override the rules", () => {
    expect(motifForPost("power-of-dividends", "house")).toBe("house");
  });

  it("ignores an unknown frontmatter image", () => {
    expect(motifForPost("power-of-dividends", "unicorn")).toBe("chart");
  });

  it("has an SVG drawing for every motif", () => {
    for (const drawing of Object.values(MOTIFS)) {
      expect(drawing).toMatch(/^<svg[\s\S]*<\/svg>$/);
    }
  });
});
