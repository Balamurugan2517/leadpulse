import { describe, it, expect } from "vitest";
import {
  calculateLeadDemandScore,
  generateCompleteOutreachPack,
  calculatePipelineRevenueMetrics,
  generateProposalData,
  PipelineDeal,
} from "@leadpulse/domain";
import { Business, WebsiteAudit } from "@leadpulse/contracts";

const TEST_WORKSPACE = "00000000-0000-0000-0000-000000000001";

describe("Phase 9 E2E: Full Lead-to-Revenue Operational Lifecycle", () => {
  it("executes the entire funnel: discovery -> scoring -> prototype -> outreach -> pipeline -> proposal -> won deal", () => {
    // -------------------------------------------------------------
    // STEP 1: Discover Lead (Raw prospect with phone and Google rating)
    // -------------------------------------------------------------
    const discoveredBusiness: Business = {
      workspaceId: TEST_WORKSPACE,
      name: "Anna Nagar Dental Spa & Implant Center",
      category: "Dentist",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+91 98401 22334",
      whatsappNumber: "+91 98401 22334",
      email: "dr.annadental@gmail.com",
      sourceUrl: "", // No website!
      sourceType: "GOOGLE_PLACES",
      googlePlaceId: "ChIJ_anna_nagar_dental",
      addressLine1: "12, 2nd Avenue, Anna Nagar East, Chennai",
      verificationStatus: "VERIFIED",
      sourceRetrievedAt: new Date(),
    };

    expect(discoveredBusiness.phone).toBeTruthy();
    expect(discoveredBusiness.sourceUrl).toBe("");

    // -------------------------------------------------------------
    // STEP 2: Score Demand Tier & Fit
    // -------------------------------------------------------------
    const score = calculateLeadDemandScore({
      business: discoveredBusiness,
      audit: null, // No website to audit
    });

    expect(score.demandTier).toBe("HIGH_DEMAND");
    expect(score.priorityScore).toBeGreaterThanOrEqual(60);
    expect(score.needFitScore).toBeGreaterThanOrEqual(70); // High need because no website
    expect(score.recommendedServices).toContain("WEBSITE_DEVELOPMENT");

    // -------------------------------------------------------------
    // STEP 3: Generate Live Prototype Preview & Outreach Drafts
    // -------------------------------------------------------------
    const outreachPack = generateCompleteOutreachPack(
      discoveredBusiness,
      null,
      score,
      "https://leadpulse.agency"
    );

    // Verify Prototype Preview URL exists
    expect(outreachPack.previewUrl).toContain("/preview/anna-nagar-dental-spa-implant-center");
    expect(outreachPack.previewUrl).toContain("category=Dentist");

    // Verify WhatsApp Consultative Message
    expect(outreachPack.whatsappConsultative.bodyText).toContain("no official website");
    expect(outreachPack.whatsappConsultative.whatsappDeepLink).toContain("https://wa.me/919840122334?text=");

    // Verify Email Proposal Subject & Body
    expect(outreachPack.emailFormal).toBeDefined();
    expect(outreachPack.emailFormal?.subject).toContain("Anna Nagar Dental Spa & Implant Center");
    expect(outreachPack.emailFormal?.emailDeepLink).toContain("mailto:dr.annadental%40gmail.com?subject=");

    // -------------------------------------------------------------
    // STEP 4: Initialize Deal in Sales Pipeline
    // -------------------------------------------------------------
    const deal: PipelineDeal = {
      id: "deal-e2e-001",
      businessId: "biz-e2e-001",
      businessName: discoveredBusiness.name,
      category: discoveredBusiness.category,
      city: discoveredBusiness.city,
      stage: "DISCOVERED",
      dealValueEstimate: 35000,
      monthlyRecurringEstimate: 3500,
      recommendedServices: score.recommendedServices,
    };

    // Initial metrics: 1 active deal in DISCOVERED
    let metrics = calculatePipelineRevenueMetrics([deal]);
    expect(metrics.totalPipelineValueInr).toBe(35000);
    expect(metrics.closedWonRevenueInr).toBe(0);

    // -------------------------------------------------------------
    // STEP 5: Pitch Sent -> Move to CONTACTED
    // -------------------------------------------------------------
    deal.stage = "CONTACTED";
    deal.lastContactedAt = new Date();

    // -------------------------------------------------------------
    // STEP 6: Client Replies via WhatsApp -> Move to IN_DISCUSSION
    // -------------------------------------------------------------
    deal.stage = "IN_DISCUSSION";
    deal.notesSummary = "Doctor loved the 1-sec prototype speed. Wants WhatsApp appointment booking integrated.";

    // -------------------------------------------------------------
    // STEP 7: Generate Commercial Proposal & Deliver -> Move to PROPOSAL_SENT
    // -------------------------------------------------------------
    const proposal = generateProposalData({
      proposalId: "PROP-E2E-DENTAL",
      businessName: deal.businessName,
      clientCategory: deal.category,
      city: deal.city,
      serviceCodes: ["WEBSITE_DEVELOPMENT", "ONLINE_BOOKING_SYSTEM"],
      prototypeUrl: outreachPack.previewUrl,
    });

    expect(proposal.services.length).toBe(2);
    expect(proposal.totalInvestmentInr).toBeGreaterThan(0);
    expect(proposal.advanceDepositInr).toBe(Math.round(proposal.totalInvestmentInr * 0.5));
    expect(proposal.optionalMonthlySupportInr).toBe(7000); // 2 services with recurring support

    deal.stage = "PROPOSAL_SENT";
    deal.dealValueEstimate = proposal.totalInvestmentInr;
    deal.monthlyRecurringEstimate = 3500;

    // -------------------------------------------------------------
    // STEP 8: Client Signs & Pays Advance Deposit -> DEAL_WON
    // -------------------------------------------------------------
    deal.stage = "DEAL_WON";
    deal.notesSummary = "Deposit paid! Contract signed. Kickoff scheduled.";

    metrics = calculatePipelineRevenueMetrics([deal]);
    expect(metrics.totalPipelineValueInr).toBe(0); // No longer pending in active pipeline
    expect(metrics.closedWonRevenueInr).toBe(proposal.totalInvestmentInr);
    expect(metrics.closedWonCount).toBe(1);
    expect(metrics.projectedMrrInr).toBe(3500);
    expect(metrics.winRatePercentage).toBe(100);
  });
});
