"use server";

import { parseAndValidateLeadCsv, calculateLeadDemandScore } from "@leadpulse/domain";
import { CreateBusinessInput, CreateBusinessInputSchema } from "@leadpulse/contracts";
import { getWebDb, BusinessRepository } from "@leadpulse/infrastructure";

// Fallback demo workspace ID for single-founder workspace
const DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

// In-memory demo store used for graceful demonstration when Neon is offline or unconfigured
let inMemoryLeads: any[] = [
  {
    business: {
      id: "b0000001-0000-0000-0000-000000000001",
      name: "Adyar Dental Spa",
      category: "Dental Clinic",
      city: "Chennai",
      phone: "+91 98765 43210",
      whatsappNumber: "+919876543210",
      email: "info@adyardentalspa.com",
      sourceUrl: "https://adyardentalspa.in",
      sourceType: "MANUAL_ASSISTED",
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    score: {
      demandTier: "ACTIVELY_LOOKING",
      priorityScore: "92.5",
      needFitScore: "75",
      intentScore: "90",
      recommendedServices: ["WEBSITE_REDESIGN", "ONLINE_BOOKING_SYSTEM"],
      scoreReasons: ['Explicit buying intent: "Looking for web developer to build modern booking site"'],
    },
    pipeline: {
      stage: "DISCOVERED",
      dealValueEstimate: "35000",
    },
  },
  {
    business: {
      id: "b0000002-0000-0000-0000-000000000002",
      name: "Velachery Diagnostic Lab",
      category: "Clinic",
      city: "Chennai",
      phone: "+91 98401 23456",
      whatsappNumber: "+919840123456",
      email: "",
      sourceUrl: "",
      sourceType: "OSM",
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
    score: {
      demandTier: "HIGH_DEMAND",
      priorityScore: "85.0",
      needFitScore: "80",
      intentScore: "40",
      recommendedServices: ["WEBSITE_DEVELOPMENT"],
      scoreReasons: ["No official business website detected", "Verified WhatsApp contact available"],
    },
    pipeline: {
      stage: "DISCOVERED",
      dealValueEstimate: "45000",
    },
  },
  {
    business: {
      id: "b0000003-0000-0000-0000-000000000003",
      name: "Marina Seafood Cafe",
      category: "Restaurant",
      city: "Chennai",
      phone: "+91 94440 98765",
      whatsappNumber: "+919444098765",
      email: "contact@marinaseafood.com",
      sourceUrl: "https://marinaseafoodcafe.com",
      sourceType: "MANUAL_ASSISTED",
      createdAt: new Date(Date.now() - 86400000 * 5),
    },
    score: {
      demandTier: "HIGH_DEMAND",
      priorityScore: "78.0",
      needFitScore: "65",
      intentScore: "35",
      recommendedServices: ["WEBSITE_REPAIR"],
      scoreReasons: ["Expired or invalid SSL certificate warning"],
    },
    pipeline: {
      stage: "CONTACTED",
      dealValueEstimate: "20000",
    },
  },
  {
    business: {
      id: "b0000004-0000-0000-0000-000000000004",
      name: "T Nagar Chartered Accountants",
      category: "Accountant",
      city: "Chennai",
      phone: "+91 98410 55555",
      whatsappNumber: "+919841055555",
      email: "audit@tnagarca.in",
      sourceUrl: "https://tnagarca.in",
      sourceType: "CSV",
      createdAt: new Date(Date.now() - 86400000 * 7),
    },
    score: {
      demandTier: "MEDIUM_DEMAND",
      priorityScore: "62.0",
      needFitScore: "45",
      intentScore: "20",
      recommendedServices: ["PERFORMANCE_OPTIMIZATION", "WEBSITE_REDESIGN"],
      scoreReasons: ["Low mobile performance score (32/100)", "Website layout is not responsive on mobile"],
    },
    pipeline: {
      stage: "IN_DISCUSSION",
      dealValueEstimate: "50000",
    },
  },
];

export async function getLeadsAction(filters?: {
  search?: string;
  category?: string;
  demandTier?: string;
}) {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);
      const leads = await repo.list({
        workspaceId: DEFAULT_WORKSPACE_ID,
        search: filters?.search,
        category: filters?.category,
        demandTier: filters?.demandTier as any,
      });
      if (leads.length > 0) return leads;
    }
  } catch (err: any) {
    console.warn("[Lead Actions] Database offline or unconfigured. Using in-memory store.", err.message);
  }

  // Filter in-memory leads
  let results = inMemoryLeads;

  if (filters?.demandTier && filters.demandTier !== "ALL") {
    results = results.filter((l) => l.score?.demandTier === filters.demandTier);
  }

  if (filters?.category && filters.category !== "ALL") {
    results = results.filter((l) =>
      l.business.category.toLowerCase().includes(filters.category!.toLowerCase())
    );
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.business.name.toLowerCase().includes(q) ||
        (l.business.phone && l.business.phone.includes(q)) ||
        l.business.category.toLowerCase().includes(q)
    );
  }

  return results;
}

export async function getLeadDetailAction(id: string) {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);
      const lead = await repo.getById(id, DEFAULT_WORKSPACE_ID);
      if (lead) return lead;
    }
  } catch (err: any) {
    console.warn("[Lead Detail] Using in-memory store for ID lookup.", err.message);
  }

  const found = inMemoryLeads.find((l) => l.business.id === id);
  if (!found) return null;

  return {
    business: found.business,
    assets: found.business.sourceUrl
      ? [{ id: "asset-1", assetType: "WEBSITE", url: found.business.sourceUrl, isPrimary: true }]
      : [],
    audits: found.score?.scoreReasons.some((r: string) => r.includes("SSL"))
      ? [
          {
            id: "audit-1",
            sslValid: false,
            isMobileResponsive: false,
            lighthousePerformance: 34,
            createdAt: new Date(),
          },
        ]
      : [],
    score: found.score,
    pipeline: found.pipeline,
  };
}

export async function createLeadAction(formData: FormData) {
  const name = formData.get("name") as string;
  const category = (formData.get("category") as string) || "Local Business";
  const phone = (formData.get("phone") as string) || "";
  const email = (formData.get("email") as string) || "";
  const website = (formData.get("website") as string) || "";
  const address = (formData.get("address") as string) || "";
  const city = (formData.get("city") as string) || "Chennai";

  const rawInput: CreateBusinessInput = {
    workspaceId: DEFAULT_WORKSPACE_ID,
    name,
    category,
    phone,
    whatsappNumber: phone,
    email,
    sourceUrl: website || undefined,
    addressLine1: address,
    city,
    state: "Tamil Nadu",
    country: "India",
    sourceRetrievedAt: new Date(),
    sourceType: "MANUAL_ASSISTED",
    verificationStatus: "VERIFIED",
  };

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);
      const result = await repo.create(rawInput);
      return { success: true, lead: result.business };
    }
  } catch (err: any) {
    console.warn("[Create Lead] Database write failed, updating in-memory store:", err.message);
  }

  // Create in memory
  const id = `b-${Date.now().toString(36)}`;
  const business = {
    id,
    ...rawInput,
    createdAt: new Date(),
  };

  const initialScore = calculateLeadDemandScore({ business: business as any });
  const newLeadEntry = {
    business,
    score: initialScore,
    pipeline: { stage: "DISCOVERED", dealValueEstimate: "30000" },
  };

  inMemoryLeads.unshift(newLeadEntry);
  return { success: true, lead: business };
}

export async function importCsvLeadsAction(csvText: string) {
  const { validRows, errors, totalRows } = parseAndValidateLeadCsv(csvText);

  if (validRows.length === 0) {
    return {
      success: false,
      message: errors[0]?.reason || "No valid rows found in CSV",
      totalRows,
      importedCount: 0,
      skippedDuplicateCount: 0,
    };
  }

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);
      const importStats = await repo.batchImportCsv(DEFAULT_WORKSPACE_ID, validRows);
      return {
        success: true,
        message: `Successfully imported ${importStats.importedCount} leads (${importStats.skippedDuplicateCount} duplicates skipped).`,
        ...importStats,
      };
    }
  } catch (err: any) {
    console.warn("[CSV Import] DB import failed, importing into in-memory store:", err.message);
  }

  // In-memory import & deduplication
  let importedCount = 0;
  let skippedDuplicates = 0;

  for (const row of validRows) {
    const isDup = inMemoryLeads.some(
      (ex) =>
        (ex.business.phone && ex.business.phone.includes(row.phone.replace(/[^0-9]/g, "").slice(-10))) ||
        (ex.business.sourceUrl && row.website && ex.business.sourceUrl.includes(row.website)) ||
        ex.business.name.toLowerCase() === row.name.toLowerCase()
    );

    if (isDup) {
      skippedDuplicates++;
    } else {
      const id = `csv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const business = {
        id,
        workspaceId: DEFAULT_WORKSPACE_ID,
        name: row.name,
        category: row.category,
        phone: row.phone,
        whatsappNumber: row.whatsappNumber || row.phone,
        email: row.email,
        sourceUrl: row.website,
        addressLine1: row.address,
        city: row.city,
        sourceType: "CSV",
        verificationStatus: "UNVERIFIED",
        createdAt: new Date(),
      };

      const score = calculateLeadDemandScore({ business: business as any });
      inMemoryLeads.unshift({
        business,
        score,
        pipeline: { stage: "DISCOVERED" },
      });
      importedCount++;
    }
  }

  return {
    success: true,
    message: `Successfully processed ${totalRows} rows: ${importedCount} unique leads imported, ${skippedDuplicates} duplicates skipped.`,
    importedCount,
    skippedDuplicateCount: skippedDuplicates,
    totalRows,
  };
}

export async function suppressLeadAction(id: string) {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);
      await repo.suppress(id, DEFAULT_WORKSPACE_ID);
    }
  } catch (err: any) {
    console.warn("[Suppress Lead] Database update failed:", err.message);
  }

  inMemoryLeads = inMemoryLeads.filter((l) => l.business.id !== id);
  return { success: true };
}
