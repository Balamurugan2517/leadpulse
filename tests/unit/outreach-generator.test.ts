import { describe, it, expect } from "vitest";
import {
  generateOutreachDrafts,
  generateCompleteOutreachPack,
} from "../../packages/domain/src/message-generator";
import { Business, LeadScore, WebsiteAudit } from "@leadpulse/contracts";

const MOCK_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

describe("Phase 7: Outreach Desk & WhatsApp Engine", () => {
  const baseBusiness: Business = {
    workspaceId: MOCK_WORKSPACE_ID,
    name: "Dr. Arvind Dental Care",
    category: "Dental Clinic",
    city: "Chennai",
    phone: "+91 98401 23456",
    whatsappNumber: "+91 98401 23456",
    email: "contact@arvinddental.in",
    sourceType: "GOOGLE_PLACES",
    sourceRetrievedAt: new Date(),
    verificationStatus: "VERIFIED",
  };

  const noWebsiteScore: LeadScore = {
    businessId: "b0001",
    priorityScore: 85,
    demandTier: "HIGH_DEMAND",
    needFitScore: 70,
    intentScore: 40,
    businessFitScore: 80,
    reachabilityScore: 90,
    evidenceConfidenceScore: 80,
    scoreReasons: ["No official website detected on Google Maps"],
    recommendedServices: ["WEBSITE_DEVELOPMENT"],
    calculatedAt: new Date(),
  };

  it("generates evidence-backed WhatsApp and Email pitches for no-website leads", () => {
    const drafts = generateOutreachDrafts(
      baseBusiness,
      null, // No audit because no website exists
      noWebsiteScore,
      "https://leadpulse.preview"
    );

    expect(drafts.length).toBe(2);

    const whatsapp = drafts.find((d) => d.channel === "WHATSAPP");
    expect(whatsapp).toBeDefined();
    expect(whatsapp?.evidenceSummary).toBe("NO_WEBSITE");
    expect(whatsapp?.bodyText).toContain("no official website");
    expect(whatsapp?.bodyText).toContain("https://leadpulse.preview/preview/dr-arvind-dental-care");
    expect(whatsapp?.whatsappDeepLink).toContain("https://wa.me/919840123456?text=");

    const email = drafts.find((d) => d.channel === "EMAIL");
    expect(email).toBeDefined();
    expect(email?.subject).toContain("Live website prototype created for Dr. Arvind Dental Care");
    expect(email?.emailDeepLink).toContain("mailto:contact%40arvinddental.in?subject=");
  });

  it("cites expired SSL security certificate when audit detects SSL failure", () => {
    const sslAudit: WebsiteAudit = {
      workspaceId: MOCK_WORKSPACE_ID,
      businessId: "b0001",
      targetUrl: "https://arvinddental.in",
      httpStatus: 200,
      sslValid: false,
      sslDaysRemaining: -5,
      isMobileResponsive: true,
      status: "COMPLETED",
    };

    const sslScore: LeadScore = {
      ...noWebsiteScore,
      scoreReasons: ["SSL Certificate Expired"],
    };

    const drafts = generateOutreachDrafts(
      baseBusiness,
      sslAudit,
      sslScore,
      "https://leadpulse.preview"
    );

    const whatsapp = drafts.find((d) => d.channel === "WHATSAPP");
    expect(whatsapp?.evidenceSummary).toBe("EXPIRED_SSL");
    expect(whatsapp?.bodyText).toContain("expired security warning (SSL)");
  });

  it("generates complete outreach pack with casual, consultative, and email drafts", () => {
    const pack = generateCompleteOutreachPack(
      baseBusiness,
      null,
      noWebsiteScore,
      "https://leadpulse.preview"
    );

    expect(pack.whatsappCasual).toBeDefined();
    expect(pack.whatsappCasual.bodyText).toContain("Put together a free 1-sec mobile website prototype");
    expect(pack.whatsappCasual.whatsappDeepLink).toContain("https://wa.me/919840123456");

    expect(pack.whatsappConsultative).toBeDefined();
    expect(pack.whatsappConsultative.bodyText).toContain("I drafted a free live preview website");

    expect(pack.emailFormal).toBeDefined();
    expect(pack.emailFormal?.subject).toBeTruthy();
    expect(pack.emailFormal?.emailDeepLink).toBeTruthy();

    expect(pack.previewUrl).toContain("/preview/dr-arvind-dental-care");
  });

  it("sanitizes various Indian phone formats for clean wa.me deep links", () => {
    const phoneFormats = [
      "+91 98401 23456",
      "9840123456",
      "09840123456",
      "+91-98401-23456",
    ];

    for (const phone of phoneFormats) {
      const b: Business = { ...baseBusiness, whatsappNumber: phone, phone };
      const drafts = generateOutreachDrafts(b, null, noWebsiteScore);
      const whatsapp = drafts.find((d) => d.channel === "WHATSAPP");

      expect(whatsapp?.whatsappDeepLink).toBeDefined();
      expect(whatsapp?.whatsappDeepLink).toMatch(/https:\/\/wa\.me\/\d+\?text=/);

      const targetPhone = whatsapp?.whatsappDeepLink?.split("?")[0];
      expect(targetPhone).not.toContain(" ");
      expect(targetPhone).not.toContain("-");
      expect(targetPhone).not.toContain("+");
    }
  });
});
