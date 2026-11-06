import { z } from "zod";

export const DemandTierEnum = z.enum([
  "ACTIVELY_LOOKING", // Tier 1: 24hr SLA
  "HIGH_DEMAND",      // Tier 2: 2-3 Days SLA
  "MEDIUM_DEMAND",    // Tier 3: Weekly Batch
  "LOW_DEMAND",       // Tier 4: Nurture / Skip
]);
export type DemandTier = z.infer<typeof DemandTierEnum>;

export const ServiceRecommendationEnum = z.enum([
  "WEBSITE_DEVELOPMENT",     // For businesses with no website
  "WEBSITE_REPAIR",          // For broken SSL, 404s, 500 errors
  "WEBSITE_REDESIGN",        // Outdated layout, slow performance
  "PERFORMANCE_OPTIMIZATION",// Mobile speed fix
  "LOCAL_SEO_FOUNDATIONS",   // Missing structured data & meta
  "ONLINE_BOOKING_SYSTEM",   // Clinic/salon/restaurant appointment workflow
  "ECOMMERCE_CATALOGUE",     // Online ordering
  "BUSINESS_AUTOMATION",     // Custom lead intake & workflows
]);
export type ServiceRecommendation = z.infer<typeof ServiceRecommendationEnum>;

export const LeadScoreSchema = z.object({
  id: z.string().uuid().optional(),
  businessId: z.string().uuid(),
  needFitScore: z.number().min(0).max(100).default(0),
  intentScore: z.number().min(0).max(100).default(0),
  businessFitScore: z.number().min(0).max(100).default(0),
  reachabilityScore: z.number().min(0).max(100).default(0),
  evidenceConfidence: z.number().min(0).max(100).default(0),
  priorityScore: z.number().min(0).max(100).default(0),
  demandTier: DemandTierEnum.default("LOW_DEMAND"),
  recommendedServices: z.array(ServiceRecommendationEnum).default([]),
  scoreReasons: z.array(z.string()).default([]),
  calculatedAt: z.date().default(() => new Date()),
});
export type LeadScore = z.infer<typeof LeadScoreSchema>;
