"use server";

import {
  executeOsmDiscovery,
  executeStartupIndiaDiscovery,
  deduplicateDiscoveredLeads,
  pollPublicIntentFeeds,
  getWebDb,
  BusinessRepository,
} from "@leadpulse/infrastructure";
import { Business } from "@leadpulse/contracts";
import { calculateLeadDemandScore, resolveLocationByCode } from "@leadpulse/domain";
import { revalidatePath } from "next/cache";

const DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

export async function runOsmDiscoveryAction(options: {
  category: "CLINIC" | "EDUCATION" | "RESTAURANT" | "PROFESSIONAL" | "SERVICES" | "ALL";
  locality: string;
  radiusKm?: number;
  source?: "OSM" | "STARTUP_INDIA" | "ALL";
  limit?: number;
}) {
  const sourceMode = options.source || "OSM";
  const locData = resolveLocationByCode(options.locality);
  let collectedLeads: Business[] = [];
  let sourceLabel = "OSM";

  if (sourceMode === "OSM" || sourceMode === "ALL") {
    const osmRes = await executeOsmDiscovery({
      workspaceId: DEFAULT_WORKSPACE_ID,
      category: options.category,
      locality: options.locality,
      radiusKm: options.radiusKm || 5,
      limit: options.limit || 25,
    });
    collectedLeads.push(...osmRes.leads);
    sourceLabel = osmRes.source;
  }

  if (sourceMode === "STARTUP_INDIA" || sourceMode === "ALL") {
    const startupRes = await executeStartupIndiaDiscovery({
      workspaceId: DEFAULT_WORKSPACE_ID,
      category: options.category,
      city: locData.city,
      state: locData.state,
      limit: options.limit || 25,
    });
    collectedLeads.push(...startupRes.leads);
    sourceLabel = sourceMode === "ALL" ? "OSM + STARTUP_INDIA" : startupRes.source;
  }

  // Strictly deduplicate across all discovered sources (ENH-009)
  const uniqueLeads = deduplicateDiscoveredLeads(collectedLeads).slice(0, options.limit || 25);

  // Calculate preview scores for each unique discovered lead
  const scoredLeads = uniqueLeads.map((business) => {
    const score = calculateLeadDemandScore({ business });
    return {
      business,
      score,
    };
  });

  return {
    source: sourceLabel,
    leads: scoredLeads,
    totalFound: scoredLeads.length,
  };
}

export async function importDiscoveredLeadsAction(businesses: Business[]) {
  if (businesses.length === 0) {
    return { success: false, message: "No leads selected to import", importedCount: 0, skippedCount: 0 };
  }

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);

      const csvRows = businesses.map((b) => ({
        name: b.name,
        category: b.category,
        phone: b.phone || "",
        email: b.email || "",
        website: b.sourceUrl || "",
        address: b.addressLine1 || "",
        city: b.city || "Chennai",
        whatsappNumber: b.whatsappNumber || b.phone || "",
        notes: `Imported via Discovery Studio (${b.category})`,
      }));

      const res = await repo.batchImportCsv(DEFAULT_WORKSPACE_ID, csvRows);
      revalidatePath("/dashboard/leads");
      revalidatePath("/dashboard/pipeline");
      revalidatePath("/dashboard/outreach");
      return {
        success: true,
        message: `Saved ${res.importedCount} leads to CRM (${res.skippedDuplicateCount} duplicates skipped)`,
        importedCount: res.importedCount,
        skippedCount: res.skippedDuplicateCount,
      };
    }
  } catch (err: any) {
    console.warn("[Import Discovery Leads] Database write failed:", err.message);
    return {
      success: false,
      message: `Database write failed: ${err.message}`,
      importedCount: 0,
      skippedCount: 0,
    };
  }

  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard/outreach");
  return {
    success: true,
    message: `Saved ${businesses.length} leads (in-memory demo mode)`,
    importedCount: businesses.length,
    skippedCount: 0,
  };
}

export async function getIntentSignalsAction() {
  return await pollPublicIntentFeeds();
}

export async function quickCaptureSubmitAction(formData: FormData) {
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const category = (formData.get("category") as string) || "Local Business";
  const phone = (formData.get("phone") as string) || "";
  const city = (formData.get("city") as string) || "Chennai";
  const notes = (formData.get("notes") as string) || "";
  const observedGap = (formData.get("observedGap") as string) || "NO_WEBSITE";

  const newBusiness: Business = {
    workspaceId: DEFAULT_WORKSPACE_ID,
    name,
    category,
    phone,
    whatsappNumber: phone,
    sourceUrl: url,
    city,
    state: "Tamil Nadu",
    country: "India",
    sourceType: "MANUAL_ASSISTED",
    description: `Observed gap: ${observedGap}. Notes: ${notes}`,
    sourceRetrievedAt: new Date(),
    verificationStatus: "VERIFIED",
  };

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const repo = new BusinessRepository(db);
      await repo.create({
        ...newBusiness,
        sourceUrl: url || undefined,
      });
    }
  } catch (err: any) {
    console.warn("[Quick Capture] Database insert failed:", err.message);
  }

  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function runGooglePlacesDiscoveryAction(query: string, apiKey?: string) {
  const { searchGooglePlaces, convertGooglePlaceToLead } = await import("@leadpulse/infrastructure");
  const places = await searchGooglePlaces({
    query,
    apiKey: apiKey || process.env.GOOGLE_PLACES_API_KEY,
  });

  return places.map((place) => {
    const lead = convertGooglePlaceToLead(place, DEFAULT_WORKSPACE_ID);
    const score = calculateLeadDemandScore({ business: lead as any });
    return {
      place,
      lead,
      score,
    };
  });
}

export async function runYouTubeDiscoveryAction(query: string, apiKey?: string) {
  const { searchYouTubeChannels, convertYouTubeChannelToLead } = await import("@leadpulse/infrastructure");
  const channels = await searchYouTubeChannels({
    query,
    apiKey: apiKey || process.env.YOUTUBE_API_KEY,
  });

  return channels.map((channel) => {
    const lead = convertYouTubeChannelToLead(channel, DEFAULT_WORKSPACE_ID);
    const score = calculateLeadDemandScore({ business: lead as any });
    return {
      channel,
      lead,
      score,
    };
  });
}

export async function analyzeSocialProfileAction(params: {
  profileUrl: string;
  bioText: string;
  explicitName?: string;
}) {
  const { analyzeSocialProfile, convertSocialProfileToLead } = await import("@leadpulse/infrastructure");
  const analysis = analyzeSocialProfile(params);
  const lead = convertSocialProfileToLead(analysis, DEFAULT_WORKSPACE_ID, params.explicitName);
  const score = calculateLeadDemandScore({ business: lead as any });

  return {
    analysis,
    lead,
    score,
  };
}
