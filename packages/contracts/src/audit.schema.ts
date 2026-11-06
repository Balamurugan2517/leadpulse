import { z } from "zod";

export const AuditStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "FAILED_SECURITY_CHECK",
]);
export type AuditStatus = z.infer<typeof AuditStatusEnum>;

export const AuditFindingSeverityEnum = z.enum([
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "INFO",
]);
export type AuditFindingSeverity = z.infer<typeof AuditFindingSeverityEnum>;

export const AuditFindingSchema = z.object({
  id: z.string().optional(),
  code: z.string(), // e.g. 'EXPIRED_SSL', 'SLOW_LCP', 'NO_MOBILE_VIEWPORT', 'MISSING_CONTACT_FORM'
  title: z.string(),
  description: z.string(),
  severity: AuditFindingSeverityEnum,
  evidenceSnippet: z.string().optional(),
});
export type AuditFinding = z.infer<typeof AuditFindingSchema>;

export const WebsiteAuditSchema = z.object({
  id: z.string().uuid().optional(),
  businessId: z.string().uuid(),
  targetUrl: z.string().url(),
  finalUrl: z.string().url().optional().nullable(),
  httpStatus: z.number().int().optional().nullable(),
  dnsResolves: z.boolean().default(false),
  sslValid: z.boolean().default(false),
  sslExpiresAt: z.date().optional().nullable(),
  redirectCount: z.number().int().default(0),
  isMobileResponsive: z.boolean().optional().nullable(),
  lighthousePerformance: z.number().min(0).max(100).optional().nullable(),
  lighthouseAccessibility: z.number().min(0).max(100).optional().nullable(),
  lighthouseSeo: z.number().min(0).max(100).optional().nullable(),
  hasContactForm: z.boolean().optional().nullable(),
  hasBookingEngine: z.boolean().optional().nullable(),
  hasWhatsappButton: z.boolean().optional().nullable(),
  rawFindings: z.array(AuditFindingSchema).default([]),
  auditCompletedAt: z.date().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
});
export type WebsiteAudit = z.infer<typeof WebsiteAuditSchema>;

export const CreateAuditJobInputSchema = z.object({
  workspaceId: z.string().uuid(),
  businessId: z.string().uuid(),
  targetUrl: z.string().url(),
  priority: z.enum(["HIGH", "NORMAL", "LOW"]).default("NORMAL"),
});
export type CreateAuditJobInput = z.infer<typeof CreateAuditJobInputSchema>;
