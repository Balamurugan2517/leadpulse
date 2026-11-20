"use server";

import {
  PipelineDeal,
  PipelineStage,
  calculatePipelineRevenueMetrics,
  generateProposalData,
} from "@leadpulse/domain";
import { getWebDb, schema } from "@leadpulse/infrastructure";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const DEFAULT_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

// Demo in-memory store for development resilience
let inMemoryDeals: PipelineDeal[] = [
  {
    id: "deal-001",
    businessId: "b0000001-0000-0000-0000-000000000001",
    businessName: "Adyar Dental Spa",
    category: "Dental Clinic",
    city: "Chennai",
    phone: "+919876543210",
    email: "info@adyardentalspa.com",
    stage: "IN_DISCUSSION",
    dealValueEstimate: 35000,
    monthlyRecurringEstimate: 3500,
    lastContactedAt: new Date(Date.now() - 86400000),
    nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    notesSummary: "Discussed custom appointment scheduler to reduce phone receptionist workload.",
    recommendedServices: ["WEBSITE_DEVELOPMENT", "ONLINE_BOOKING_SYSTEM"],
  },
  {
    id: "deal-002",
    businessId: "b0000002-0000-0000-0000-000000000002",
    businessName: "Velachery Diagnostic Lab",
    category: "Clinic",
    city: "Chennai",
    phone: "+919840123456",
    email: "contact@velacherydiag.in",
    stage: "CONTACTED",
    dealValueEstimate: 45000,
    monthlyRecurringEstimate: 5000,
    lastContactedAt: new Date(Date.now() - 86400000 * 2),
    nextFollowUpDate: null,
    notesSummary: "Pitched live prototype via WhatsApp. Founder viewed preview.",
    recommendedServices: ["WEBSITE_DEVELOPMENT"],
  },
  {
    id: "deal-003",
    businessId: "b0000003-0000-0000-0000-000000000003",
    businessName: "Anna Nagar Math Academy",
    category: "Tuition Center",
    city: "Chennai",
    phone: "+919444098765",
    email: "info@annanagarmaths.com",
    stage: "PROPOSAL_SENT",
    dealValueEstimate: 28000,
    monthlyRecurringEstimate: 3500,
    lastContactedAt: new Date(Date.now() - 86400000 * 3),
    nextFollowUpDate: new Date(Date.now() + 86400000 * 1).toISOString().split("T")[0],
    notesSummary: "Delivered proposal for course admission portal & student registration.",
    recommendedServices: ["WEBSITE_DEVELOPMENT", "ONLINE_BOOKING_SYSTEM"],
  },
  {
    id: "deal-004",
    businessId: "b0000004-0000-0000-0000-000000000004",
    businessName: "Mylapore Heritage Cafe",
    category: "Restaurant & Cafe",
    city: "Chennai",
    phone: "+919884011223",
    email: "contact@mylaporeheritage.in",
    stage: "DEAL_WON",
    dealValueEstimate: 32000,
    monthlyRecurringEstimate: 3500,
    lastContactedAt: new Date(Date.now() - 86400000 * 5),
    nextFollowUpDate: null,
    notesSummary: "50% advance deposit paid! Development sprint underway.",
    recommendedServices: ["WEBSITE_DEVELOPMENT"],
  },
  {
    id: "deal-005",
    businessId: "b0000005-0000-0000-0000-000000000005",
    businessName: "T. Nagar Chartered Accountants",
    category: "Professional Services",
    city: "Chennai",
    phone: "+919841055555",
    email: "ca@tnagaradvisory.in",
    stage: "DISCOVERED",
    dealValueEstimate: 25000,
    monthlyRecurringEstimate: 2500,
    lastContactedAt: null,
    nextFollowUpDate: null,
    notesSummary: "Fresh prospect discovered via OpenStreetMap.",
    recommendedServices: ["LOCAL_SEO_FOUNDATIONS"],
  },
];

export async function getPipelineBoardData() {
  let deals: PipelineDeal[] = [...inMemoryDeals];

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const rows = await db
        .select({
          pipeline: schema.leadsPipeline,
          business: schema.businesses,
        })
        .from(schema.leadsPipeline)
        .innerJoin(
          schema.businesses,
          eq(schema.leadsPipeline.businessId, schema.businesses.id)
        );

      if (rows && rows.length > 0) {
        deals = rows.map((r): PipelineDeal => ({
          id: r.pipeline.id,
          businessId: r.business.id,
          businessName: r.business.name,
          category: r.business.category,
          city: r.business.city,
          phone: r.business.phone || undefined,
          email: r.business.email || undefined,
          stage: r.pipeline.stage as PipelineStage,
          dealValueEstimate: parseFloat(r.pipeline.dealValueEstimate || "25000"),
          lastContactedAt: r.pipeline.lastContactedAt,
          nextFollowUpDate: r.pipeline.nextFollowUpDate,
          notesSummary: r.pipeline.notesSummary || undefined,
        }));
      }
    }
  } catch (err: any) {
    console.warn("[Pipeline Board] DB fetch failed, using demo data:", err.message);
  }

  const metrics = calculatePipelineRevenueMetrics(deals);

  return {
    deals,
    metrics,
  };
}

export async function updateDealStageAction(
  businessId: string,
  newStage: PipelineStage,
  dealValue?: number
) {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      await db
        .update(schema.leadsPipeline)
        .set({
          stage: newStage,
          dealValueEstimate: dealValue !== undefined ? dealValue.toString() : undefined,
          updatedAt: new Date(),
        })
        .where(eq(schema.leadsPipeline.businessId, businessId));
    }
  } catch (err: any) {
    console.warn("[Update Deal Stage] DB update failed:", err.message);
  }

  // Update in-memory record
  const match = inMemoryDeals.find((d) => d.businessId === businessId);
  if (match) {
    match.stage = newStage;
    if (dealValue !== undefined) {
      match.dealValueEstimate = dealValue;
    }
  }

  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/outreach");
  return { success: true };
}

export async function logMeetingNoteAction(params: {
  businessId: string;
  interactionType: string;
  outcomeSummary: string;
  nextFollowUpDate?: string;
}) {
  const { businessId, interactionType, outcomeSummary, nextFollowUpDate } = params;

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      // 1. Insert communication log
      const [pipelineRow] = await db
        .select({ id: schema.leadsPipeline.id })
        .from(schema.leadsPipeline)
        .where(eq(schema.leadsPipeline.businessId, businessId));

      if (pipelineRow) {
        await db.insert(schema.communicationLogs).values({
          leadId: pipelineRow.id,
          channel: "MANUAL",
          interactionType,
          outcomeSummary,
        });

        // 2. Update pipeline note & follow-up date
        await db
          .update(schema.leadsPipeline)
          .set({
            notesSummary: outcomeSummary,
            nextFollowUpDate: nextFollowUpDate || null,
            updatedAt: new Date(),
          })
          .where(eq(schema.leadsPipeline.id, pipelineRow.id));
      }
    }
  } catch (err: any) {
    console.warn("[Log Meeting] DB write failed:", err.message);
  }

  // In-memory update
  const match = inMemoryDeals.find((d) => d.businessId === businessId);
  if (match) {
    match.notesSummary = outcomeSummary;
    if (nextFollowUpDate) {
      match.nextFollowUpDate = nextFollowUpDate;
    }
  }

  revalidatePath("/dashboard/pipeline");
  return { success: true };
}

export async function getProposalDetailsAction(businessId: string) {
  const match = inMemoryDeals.find((d) => d.businessId === businessId) || inMemoryDeals[0];

  const serviceCodes = match.recommendedServices && match.recommendedServices.length > 0
    ? match.recommendedServices
    : ["WEBSITE_DEVELOPMENT"];

  const slug = match.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const prototypeUrl = `/preview/${slug}?name=${encodeURIComponent(
    match.businessName
  )}&category=${encodeURIComponent(match.category)}`;

  return generateProposalData({
    proposalId: `PROP-${match.businessId.slice(0, 8).toUpperCase()}`,
    businessName: match.businessName,
    clientCategory: match.category,
    city: match.city,
    serviceCodes,
    prototypeUrl,
  });
}
