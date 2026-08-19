import { describe, expect, test } from "@jest/globals";
import { metadata as privacyPolicyMetadata } from "@/app/privacy-policy/page";
import { metadata as termsOfServiceMetadata } from "@/app/terms-of-service/page";

describe("privacy-policy and terms-of-service page metadata", () => {
  test("privacy-policy page declares its own canonical URL", () => {
    expect(privacyPolicyMetadata.alternates).toEqual({
      canonical: "/privacy-policy/",
    });
  });

  test("terms-of-service page declares its own canonical URL", () => {
    expect(termsOfServiceMetadata.alternates).toEqual({
      canonical: "/terms-of-service/",
    });
  });
});
