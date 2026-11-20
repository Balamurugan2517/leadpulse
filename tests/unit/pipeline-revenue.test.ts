import { describe, it, expect } from "vitest";
import {
  calculatePipelineRevenueMetrics,
  generateProposalData,
  PipelineDeal,
} from "../../packages/domain/src/pipeline-analytics";

describe("Phase 8: Sales Pipeline & Revenue Tracking", () => {
  const sampleDeals: PipelineDeal[] = [
    {
      id: "d1",
      businessId: "b1",
      businessName: "Adyar Dental Spa",
      category: "Dental Clinic",
      city: "Chennai",
      stage: "IN_DISCUSSION",
      dealValueEstimate: 35000,
      monthlyRecurringEstimate: 3500,
    },
    {
      id: "d2",
      businessId: "b2",
      businessName: "Velachery Diagnostic Lab",
      category: "Clinic",
      city: "Chennai",
      stage: "CONTACTED",
      dealValueEstimate: 45000,
      monthlyRecurringEstimate: 5000,
    },
    {
      id: "d3",
      businessId: "b3",
      businessName: "Mylapore Heritage Cafe",
      category: "Cafe",
      city: "Chennai",
      stage: "DEAL_WON",
      dealValueEstimate: 30000,
      monthlyRecurringEstimate: 3500,
    },
    {
      id: "d4",
      businessId: "b4",
      businessName: "Old Bakery",
      category: "Bakery",
      city: "Chennai",
      stage: "DEAL_LOST",
      dealValueEstimate: 20000,
      monthlyRecurringEstimate: 2500,
    },
  ];

  it("calculates active pipeline value and excludes closed won / lost deals", () => {
    const metrics = calculatePipelineRevenueMetrics(sampleDeals);

    // Active in flight: d1 (35,000) + d2 (45,000) = 80,000
    expect(metrics.totalPipelineValueInr).toBe(80000);
    expect(metrics.activeDealsCount).toBe(2);

    // Closed Won: d3 (30,000)
    expect(metrics.closedWonRevenueInr).toBe(30000);
    expect(metrics.closedWonCount).toBe(1);

    // Projected MRR from won deals: 3,500
    expect(metrics.projectedMrrInr).toBe(3500);

    // Win Rate: 1 Won / (1 Won + 1 Lost) = 50%
    expect(metrics.winRatePercentage).toBe(50);
  });

  it("handles empty deal collections gracefully", () => {
    const metrics = calculatePipelineRevenueMetrics([]);
    expect(metrics.totalPipelineValueInr).toBe(0);
    expect(metrics.closedWonRevenueInr).toBe(0);
    expect(metrics.winRatePercentage).toBe(0);
    expect(metrics.activeDealsCount).toBe(0);
  });

  it("generates an itemized proposal with 50-50 milestone payments and optional MRR", () => {
    const proposal = generateProposalData({
      proposalId: "PROP-ADYAR-001",
      businessName: "Adyar Dental Spa",
      clientCategory: "Dental Clinic",
      city: "Chennai",
      serviceCodes: ["WEBSITE_DEVELOPMENT", "ONLINE_BOOKING_SYSTEM"],
      prototypeUrl: "/preview/adyar-dental-spa",
    });

    expect(proposal.proposalId).toBe("PROP-ADYAR-001");
    expect(proposal.businessName).toBe("Adyar Dental Spa");
    expect(proposal.services.length).toBe(2);

    // Check pricing summation
    expect(proposal.totalInvestmentInr).toBeGreaterThan(0);
    expect(proposal.advanceDepositInr).toBe(Math.round(proposal.totalInvestmentInr * 0.5));
    expect(proposal.balanceDueOnLaunchInr).toBe(proposal.totalInvestmentInr - proposal.advanceDepositInr);

    // Monthly care plan support
    expect(proposal.optionalMonthlySupportInr).toBeGreaterThan(0);
    expect(proposal.prototypeUrl).toBe("/preview/adyar-dental-spa");
    expect(proposal.estimatedDeliveryDays).toBe(10);
  });
});
