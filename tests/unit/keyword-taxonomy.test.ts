import { describe, it, expect } from "vitest";
import {
  SEED_KEYWORD_PACKS,
  DEFAULT_SERVICE_CATALOG,
  matchKeywordsInText,
} from "../../packages/domain/src/keyword-taxonomy";

describe("Phase 5: Keyword Taxonomy & Service Catalog", () => {
  it("defines the mandatory keyword packs including buying intent and exclusions", () => {
    const requiredPacks = [
      "NO_WEBSITE",
      "BROKEN_WEBSITE",
      "OUTDATED_WEBSITE",
      "LOW_REVIEWS",
      "NEGATIVE_SENTIMENT",
      "BUYING_INTENT",
      "NEGATIVE_EXCLUSIONS",
    ];

    for (const pack of requiredPacks) {
      expect(SEED_KEYWORD_PACKS).toHaveProperty(pack);
      expect(Array.isArray(SEED_KEYWORD_PACKS[pack])).toBe(true);
      expect(SEED_KEYWORD_PACKS[pack].length).toBeGreaterThan(0);
    }
  });

  it("defines a comprehensive default service catalog with INR pricing ranges", () => {
    expect(DEFAULT_SERVICE_CATALOG.length).toBeGreaterThanOrEqual(4);

    for (const service of DEFAULT_SERVICE_CATALOG) {
      expect(service.code).toBeTruthy();
      expect(service.title).toBeTruthy();
      expect(service.typicalTrigger).toBeTruthy();
      expect(service.deliverables.length).toBeGreaterThan(0);
      expect(service.indicativePriceInr.min).toBeGreaterThan(0);
      expect(service.indicativePriceInr.max).toBeGreaterThanOrEqual(service.indicativePriceInr.min);
      expect(service.targetNiches.length).toBeGreaterThan(0);
    }

    const websiteDev = DEFAULT_SERVICE_CATALOG.find((s) => s.code === "WEBSITE_DEVELOPMENT");
    expect(websiteDev).toBeDefined();
    expect(websiteDev?.indicativePriceInr.min).toBe(25000);
  });

  it("detects high-intent buying signals from prospect text", () => {
    const text = "Urgent: We are looking for web developer to build appointment booking website needed for our dental clinic in Anna Nagar.";
    const result = matchKeywordsInText(text);

    expect(result.isExcluded).toBe(false);
    expect(result.matchedPacks).toContain("BUYING_INTENT");
    expect(result.matchedKeywords).toContain("looking for web developer");
    expect(result.intentScore).toBeGreaterThanOrEqual(90);
  });

  it("detects broken website triggers from reviews or error logs", () => {
    const text = "Tried booking online but received 500 internal server error and security warning.";
    const result = matchKeywordsInText(text);

    expect(result.isExcluded).toBe(false);
    expect(result.matchedPacks).toContain("BROKEN_WEBSITE");
    expect(result.matchedKeywords).toContain("500 internal server error");
    expect(result.matchedKeywords).toContain("security warning");
    expect(result.intentScore).toBeGreaterThanOrEqual(65);
  });

  it("detects no-website / social-only presence", () => {
    const text = "We run a boutique bakery in Adyar, order via whatsapp only or instagram, no official website yet.";
    const result = matchKeywordsInText(text);

    expect(result.isExcluded).toBe(false);
    expect(result.matchedPacks).toContain("NO_WEBSITE");
    expect(result.matchedKeywords).toContain("no official website");
    expect(result.matchedKeywords).toContain("whatsapp only");
    expect(result.intentScore).toBeGreaterThanOrEqual(65);
  });

  it("filters out false positives when negative exclusion terms are detected", () => {
    const jobPost = "Hiring: Looking for web developer intern for summer student project. Send resume.";
    const result = matchKeywordsInText(jobPost);

    expect(result.isExcluded).toBe(true);
    expect(result.intentScore).toBe(0);
    expect(result.matchedKeywords).toEqual([]);
    expect(result.matchedPacks).toEqual([]);
  });

  it("handles case-insensitivity seamlessly", () => {
    const uppercaseText = "OUR COMPANY NEEDS A WEBSITE REDESIGN AND 404 ERROR RESOLUTION";
    const result = matchKeywordsInText(uppercaseText);

    expect(result.isExcluded).toBe(false);
    expect(result.matchedPacks).toContain("BROKEN_WEBSITE");
    expect(result.matchedPacks).toContain("OUTDATED_WEBSITE");
    expect(result.matchedKeywords).toContain("404 error");
    expect(result.matchedKeywords).toContain("website redesign");
  });
});
