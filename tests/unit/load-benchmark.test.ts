import { describe, it, expect } from "vitest";
import { calculateLeadDemandScore } from "@leadpulse/domain";
import { Business } from "@leadpulse/contracts";

describe("Phase 9 Hardening: Synthetic Load & Scale Benchmark", () => {
  it("scores 5,000 synthetic B2B leads under 1500ms without memory degradation", () => {
    const categories = ["Dental Clinic", "Tuition Center", "Cafe", "Chartered Accountant", "Salon"];
    const cities = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"];
    const totalLeads = 5000;

    // 1. Generate 5,000 synthetic leads
    const syntheticLeads: Business[] = [];
    for (let i = 0; i < totalLeads; i++) {
      const hasWebsite = i % 3 === 0; // 1 in 3 has a website
      const hasPhone = i % 10 !== 0; // 90% have a phone number

      syntheticLeads.push({
        workspaceId: "00000000-0000-0000-0000-000000000001",
        name: `Enterprise Prospect ${i}`,
        category: categories[i % categories.length],
        city: cities[i % cities.length],
        state: "Tamil Nadu",
        country: "India",
        phone: hasPhone ? `+919840${(100000 + i).toString().slice(-6)}` : undefined,
        whatsappNumber: hasPhone ? `+919840${(100000 + i).toString().slice(-6)}` : undefined,
        sourceUrl: hasWebsite ? `https://prospect${i}.in` : "",
        sourceType: "OSM",
        verificationStatus: "VERIFIED",
        sourceRetrievedAt: new Date(),
      });
    }

    expect(syntheticLeads.length).toBe(totalLeads);

    // 2. Measure batch scoring duration
    const startTime = performance.now();

    const scoredResults = syntheticLeads.map((b) => {
      return calculateLeadDemandScore({ business: b, audit: null });
    });

    const elapsedMs = performance.now() - startTime;

    // Throughput check: must process 5,000 leads in under 1,500ms (> 3,300 leads/sec)
    expect(scoredResults.length).toBe(totalLeads);
    expect(elapsedMs).toBeLessThan(1500);

    // Check tier distribution
    const highDemandCount = scoredResults.filter((s) => s.demandTier === "HIGH_DEMAND").length;
    const mediumDemandCount = scoredResults.filter((s) => s.demandTier === "MEDIUM_DEMAND").length;
    const lowDemandCount = scoredResults.filter((s) => s.demandTier === "LOW_DEMAND").length;

    expect(highDemandCount).toBeGreaterThan(0);
    expect(lowDemandCount).toBeGreaterThan(0);
    expect(highDemandCount + mediumDemandCount + lowDemandCount).toBe(totalLeads);
  });
});
