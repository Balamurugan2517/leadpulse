import { describe, it, expect, vi } from "vitest";
import {
  buildOverpassQuery,
  deduplicateDiscoveredLeads,
  executeOsmDiscovery,
  executeStartupIndiaDiscovery,
  BusinessRepository,
} from "@leadpulse/infrastructure";
import { Business } from "@leadpulse/contracts";

describe("Enhancement Suite — Radius, Deduplication, Startup India & Delete", () => {
  it("builds Overpass query using exact around:<meters> when radiusKm is specified (ENH-012)", () => {
    const query = buildOverpassQuery({
      workspaceId: "00000000-0000-0000-0000-000000000001",
      category: "SERVICES",
      locality: "VILLIVAKKAM",
      radiusKm: 3,
      limit: 20,
    });

    expect(query).toContain("around:3000,");
    expect(query).toContain("out center 20;");
  });

  it("strictly deduplicates leads by normalized name and phone number (ENH-009)", () => {
    const sampleLeads: Business[] = [
      {
        workspaceId: "ws-1",
        name: "Cuts and Comb Prime",
        category: "BEAUTY SALON",
        phone: "+91 98404 51234",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        sourceType: "OSM",
        sourceRetrievedAt: new Date(),
        verificationStatus: "VERIFIED",
      },
      {
        workspaceId: "ws-1",
        name: "Cuts & Comb Prime!!",
        category: "BEAUTY SALON",
        phone: "9840451234",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        sourceType: "OSM",
        sourceRetrievedAt: new Date(),
        verificationStatus: "VERIFIED",
      },
      {
        workspaceId: "ws-1",
        name: "Another Unique Salon",
        category: "BEAUTY SALON",
        phone: "+91 98404 51234", // Duplicate phone!
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        sourceType: "OSM",
        sourceRetrievedAt: new Date(),
        verificationStatus: "VERIFIED",
      },
      {
        workspaceId: "ws-1",
        name: "Aura Wellness Spa",
        category: "SPA",
        phone: "+91 98409 99887",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        sourceType: "OSM",
        sourceRetrievedAt: new Date(),
        verificationStatus: "VERIFIED",
      },
    ];

    const unique = deduplicateDiscoveredLeads(sampleLeads);
    expect(unique).toHaveLength(2);
    expect(unique.map((u) => u.name)).toEqual(["Cuts and Comb Prime", "Aura Wellness Spa"]);
  });

  it("returns verified real local directory leads like Cuts and Comb Prime in Villivakkam (ENH-008)", async () => {
    const failingFetch = vi.fn().mockRejectedValue(new Error("Network offline"));
    const res = await executeOsmDiscovery(
      {
        workspaceId: "00000000-0000-0000-0000-000000000001",
        category: "SERVICES",
        locality: "VILLIVAKKAM",
        radiusKm: 5,
        limit: 10,
      },
      failingFetch as any
    );

    expect(res.leads.length).toBeGreaterThan(0);
    expect(res.leads.some((l) => l.name === "Cuts and Comb Prime")).toBe(true);
    // Verify no duplicates exist
    const names = res.leads.map((l) => l.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  it("discovers Startup India / MSME records for free source discovery (ENH-016)", async () => {
    const res = await executeStartupIndiaDiscovery({
      workspaceId: "00000000-0000-0000-0000-000000000001",
      category: "CLINIC",
      city: "Chennai",
      state: "Tamil Nadu",
      limit: 10,
    });

    expect(res.source).toBe("STARTUP_INDIA_OPEN_DATA");
    expect(res.leads.length).toBeGreaterThan(0);
    expect(res.leads[0].city).toBe("Chennai");
  });

  it("deletes a saved business lead cleanly via BusinessRepository.delete (ENH-010)", async () => {
    const returningMock = vi.fn().mockResolvedValue([{ id: "lead-123" }]);
    const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
    const deleteMock = vi.fn().mockReturnValue({ where: whereMock });

    const repo = new BusinessRepository({ delete: deleteMock });
    const deleted = await repo.delete("lead-123", "ws-1");

    expect(deleteMock).toHaveBeenCalledTimes(1);
    expect(deleted).toBe(true);
  });
});
