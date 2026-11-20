"use server";

import {
  generateCompleteOutreachPack,
  calculateLeadDemandScore,
} from "@leadpulse/domain";
import { getWebDb, BusinessRepository, schema } from "@leadpulse/infrastructure";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

// Demo leads for offline / development resilience
const DEMO_OUTREACH_LEADS: any[] = [
  {
    business: {
      id: "b0000001-0000-0000-0000-000000000001",
      workspaceId: DEFAULT_WORKSPACE_ID,
      name: "Adyar Dental Spa",
      category: "Dental Clinic",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+919876543210",
      whatsappNumber: "+919876543210",
      email: "info@adyardentalspa.com",
      sourceUrl: "https://adyardentalspa.in",
      sourceType: "MANUAL_ASSISTED",
      sourceRetrievedAt: new Date(),
      verificationStatus: "VERIFIED",
      addressLine1: "14, Gandhi Nagar 1st Main Rd, Adyar, Chennai",
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    audit: {
      sslValid: false,
      isMobileResponsive: false,
      lighthousePerformance: 38,
      status: "COMPLETED",
    },
    pipeline: {
      stage: "DISCOVERED",
      dealValueEstimate: "35000",
      lastContactedAt: null,
    },
  },
  {
    business: {
      id: "b0000002-0000-0000-0000-000000000002",
      workspaceId: DEFAULT_WORKSPACE_ID,
      name: "Velachery Diagnostic Lab",
      category: "Clinic",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+919840123456",
      whatsappNumber: "+919840123456",
      email: "contact@velacherydiag.in",
      sourceUrl: "", // NO WEBSITE!
      sourceType: "OSM",
      sourceRetrievedAt: new Date(),
      verificationStatus: "VERIFIED",
      addressLine1: "100 Feet Bypass Rd, Velachery, Chennai",
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
    audit: null,
    pipeline: {
      stage: "DISCOVERED",
      dealValueEstimate: "45000",
      lastContactedAt: null,
    },
  },
  {
    business: {
      id: "b0000003-0000-0000-0000-000000000003",
      workspaceId: DEFAULT_WORKSPACE_ID,
      name: "Anna Nagar Math Academy",
      category: "Tuition Center",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      phone: "+919444098765",
      whatsappNumber: "+919444098765",
      email: "info@annanagarmaths.com",
      sourceUrl: "https://facebook.com/annanagarmaths",
      sourceType: "YOUTUBE",
      sourceRetrievedAt: new Date(),
      verificationStatus: "VERIFIED",
      addressLine1: "5th Avenue, Anna Nagar, Chennai",
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
    audit: null,
    pipeline: {
      stage: "DISCOVERED",
      dealValueEstimate: "25000",
      lastContactedAt: null,
    },
  },
];

export async function getLeadsForOutreachDesk(tierFilter?: string) {
  let leadsData: any[] = [...DEMO_OUTREACH_LEADS];

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const dbLeads = await db
        .select({
          business: schema.businesses,
          pipeline: schema.leadsPipeline,
          audit: schema.websiteAudits,
        })
        .from(schema.businesses)
        .leftJoin(
          schema.leadsPipeline,
          eq(schema.leadsPipeline.businessId, schema.businesses.id)
        )
        .leftJoin(
          schema.websiteAudits,
          eq(schema.websiteAudits.businessId, schema.businesses.id)
        )
        .limit(50);

      if (dbLeads && dbLeads.length > 0) {
        leadsData = dbLeads.map((row) => ({
          business: row.business as any,
          audit: row.audit as any,
          pipeline: row.pipeline || {
            stage: "DISCOVERED",
            dealValueEstimate: "25000",
            lastContactedAt: null,
          },
        }));
      }
    }
  } catch (err: any) {
    console.warn("[Outreach Desk] DB fetch failed, using demo store:", err.message);
  }

  // Calculate scores and generate tailored outreach packs
  const enriched = leadsData
    .filter((l) => l.pipeline.stage !== "SUPPRESSED")
    .map((item) => {
      const score = calculateLeadDemandScore({
        business: item.business,
        audit: item.audit,
      });

      const outreachPack = generateCompleteOutreachPack(
        item.business,
        item.audit,
        score,
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      );

      return {
        business: item.business,
        audit: item.audit,
        pipeline: item.pipeline,
        score,
        outreachPack,
      };
    });

  // Filter by demand tier if requested
  if (tierFilter && tierFilter !== "ALL") {
    return enriched.filter((i) => i.score.demandTier === tierFilter);
  }

  return enriched;
}

export async function recordMessageSentAction(businessId: string, channel = "WHATSAPP") {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      // Update pipeline stage to CONTACTED
      await db
        .update(schema.leadsPipeline)
        .set({
          stage: "CONTACTED",
          lastContactedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.leadsPipeline.businessId, businessId));
    }
  } catch (err: any) {
    console.warn("[Record Sent] DB update failed:", err.message);
  }

  // Update in-memory record if exists
  const demoItem = DEMO_OUTREACH_LEADS.find((l) => l.business.id === businessId);
  if (demoItem) {
    demoItem.pipeline.stage = "CONTACTED";
    demoItem.pipeline.lastContactedAt = new Date() as any;
  }

  revalidatePath("/dashboard/outreach");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/pipeline");
  return { success: true };
}

export async function suppressLeadAction(businessId: string, reason = "DO_NOT_CONTACT") {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      await db
        .update(schema.leadsPipeline)
        .set({
          stage: "SUPPRESSED",
          lostReason: reason,
          updatedAt: new Date(),
        })
        .where(eq(schema.leadsPipeline.businessId, businessId));
    }
  } catch (err: any) {
    console.warn("[Suppress Lead] DB update failed:", err.message);
  }

  // Update in-memory demo
  const demoItem = DEMO_OUTREACH_LEADS.find((l) => l.business.id === businessId);
  if (demoItem) {
    demoItem.pipeline.stage = "SUPPRESSED";
  }

  revalidatePath("/dashboard/outreach");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/pipeline");
  return { success: true };
}
