import { describe, it, expect } from "vitest";
import { calculateLeadDemandScore, generateOutreachDrafts } from "@leadpulse/domain";
import { Business } from "@leadpulse/contracts";

describe("Scoring & Demand Categorization Engine", () => {
  it("categorizes a lead with explicit buying keywords as ACTIVELY_LOOKING (Tier 1)", () => {
    const business: Business = {
      workspaceId: "a0000000-0000-0000-0000-000000000001",
      name: "Anna Nagar Dental Spa",
      category: "Dental Clinic",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+919876543210",
      whatsappNumber: "+919876543210",
      sourceType: "MANUAL_ASSISTED",
      sourceRetrievedAt: new Date(),
      verificationStatus: "VERIFIED",
    };

    const score = calculateLeadDemandScore({
      business,
      intentSignals: ['Client posted: "Looking for web developer to build modern booking site"'],
    });

    expect(score.demandTier).toBe("ACTIVELY_LOOKING");
    expect(score.intentScore).toBeGreaterThanOrEqual(80);
    expect(score.scoreReasons.some((r) => r.includes("Explicit buying intent"))).toBe(true);
  });

  it("categorizes a business with NO website as HIGH_DEMAND (Tier 2)", () => {
    const business: Business = {
      workspaceId: "a0000000-0000-0000-0000-000000000001",
      name: "T Nagar CA Associates",
      category: "Chartered Accountant",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+919840112233",
      whatsappNumber: "+919840112233",
      sourceType: "OSM",
      sourceRetrievedAt: new Date(),
      verificationStatus: "VERIFIED",
    };

    const score = calculateLeadDemandScore({ business });

    expect(score.demandTier).toBe("HIGH_DEMAND");
    expect(score.needFitScore).toBeGreaterThanOrEqual(35);
    expect(score.recommendedServices).toContain("WEBSITE_DEVELOPMENT");
  });

  it("generates WhatsApp draft with instant prototype preview URL", () => {
    const business: Business = {
      workspaceId: "a0000000-0000-0000-0000-000000000001",
      name: "Adyar Diagnostics",
      category: "Clinic",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+919876543210",
      whatsappNumber: "+919876543210",
      email: "info@adyardiagnostics.com",
      sourceType: "MANUAL_ASSISTED",
      sourceRetrievedAt: new Date(),
      verificationStatus: "VERIFIED",
    };

    const score = calculateLeadDemandScore({ business });
    const drafts = generateOutreachDrafts(business, null, score, "https://leadpulse.agency");

    const whatsappDraft = drafts.find((d) => d.channel === "WHATSAPP");
    expect(whatsappDraft).toBeDefined();
    expect(whatsappDraft?.previewUrl).toContain("https://leadpulse.agency/preview/adyar-diagnostics");
    expect(whatsappDraft?.whatsappDeepLink).toContain("https://wa.me/919876543210?text=");
    expect(whatsappDraft?.bodyText).toContain(whatsappDraft?.previewUrl);
  });
});
