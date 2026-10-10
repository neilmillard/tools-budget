import { describe, expect, test } from "@jest/globals";
import { metadata as privacyPolicyMetadata } from "@/app/privacy-policy/page";
import { metadata as termsOfServiceMetadata } from "@/app/terms-of-service/page";
import { metadata as blogIndexMetadata } from "@/app/blog/page";
import { metadata as blogNewestMetadata } from "@/app/blog/newest/page";
import { metadata as blogOldestMetadata } from "@/app/blog/oldest/page";
import { metadata as guideMetadata } from "@/app/guide/give-every-pound-a-job/page";
import { metadata as challengeMetadata } from "@/app/challenge/give-every-pound-a-job/page";
import { metadata as worksheetMetadata } from "@/app/download/budget-worksheet/page";

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

describe("blog listing page metadata", () => {
  test("blog index page declares its own canonical URL", () => {
    expect(blogIndexMetadata.alternates).toEqual({
      canonical: "/blog/",
    });
  });

  test("blog newest page declares its own canonical URL", () => {
    expect(blogNewestMetadata.alternates).toEqual({
      canonical: "/blog/newest/",
    });
  });

  test("blog oldest page declares its own self-referencing canonical URL", () => {
    expect(blogOldestMetadata.alternates).toEqual({
      canonical: "/blog/oldest/",
    });
  });
});

describe("guide sales page metadata", () => {
  test("declares its own canonical URL and is indexable", () => {
    expect(guideMetadata.alternates).toEqual({
      canonical: "/guide/give-every-pound-a-job/",
    });
    expect(guideMetadata.robots).toBeUndefined();
  });
});

describe("challenge sales page metadata", () => {
  test("declares its own canonical URL and is indexable", () => {
    expect(challengeMetadata.alternates).toEqual({
      canonical: "/challenge/give-every-pound-a-job/",
    });
    expect(challengeMetadata.robots).toBeUndefined();
  });
});

describe("worksheet download page metadata", () => {
  test("declares its own canonical URL and is indexable", () => {
    expect(worksheetMetadata.alternates).toEqual({
      canonical: "/download/budget-worksheet/",
    });
    expect(worksheetMetadata.robots).toBeUndefined();
  });
});
