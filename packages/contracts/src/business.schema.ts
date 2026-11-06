import { z } from "zod";

export const SourceTypeEnum = z.enum([
  "OSM",
  "MANUAL_ASSISTED",
  "CSV",
  "RSS",
  "GOOGLE_PLACES",
  "YOUTUBE",
  "X",
  "META_INSTA",
  "META_FB",
  "LINKEDIN",
  "DIRECT_WEB",
]);
export type SourceType = z.infer<typeof SourceTypeEnum>;

export const VerificationStatusEnum = z.enum([
  "UNVERIFIED",
  "VERIFIED",
  "FLAGGED",
  "SUPPRESSED",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>;

export const DigitalAssetTypeEnum = z.enum([
  "WEBSITE",
  "INSTAGRAM",
  "FACEBOOK",
  "LINKEDIN",
  "X",
  "YOUTUBE",
  "GOOGLE_MAPS",
]);
export type DigitalAssetType = z.infer<typeof DigitalAssetTypeEnum>;

export const DigitalAssetStatusEnum = z.enum([
  "ACTIVE",
  "NOT_FOUND",
  "BROKEN",
  "EXPIRED",
  "UNREACHABLE",
]);
export type DigitalAssetStatus = z.infer<typeof DigitalAssetStatusEnum>;

export const BusinessDigitalAssetSchema = z.object({
  id: z.string().uuid().optional(),
  businessId: z.string().uuid().optional(),
  assetType: DigitalAssetTypeEnum,
  url: z.string().url("Must be a valid URL"),
  status: DigitalAssetStatusEnum.default("ACTIVE"),
  isPrimary: z.boolean().default(false),
});
export type BusinessDigitalAsset = z.infer<typeof BusinessDigitalAssetSchema>;

export const BusinessSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  name: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  industry: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Must be valid E.164 phone number").optional().or(z.literal("")),
  addressLine1: z.string().optional(),
  city: z.string().default("Chennai"),
  state: z.string().default("Tamil Nadu"),
  country: z.string().default("India"),
  postalCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  googlePlaceId: z.string().optional().nullable(),
  sourceType: SourceTypeEnum.default("MANUAL_ASSISTED"),
  sourceUrl: z.string().optional(),
  sourceRetrievedAt: z.date().default(() => new Date()),
  verificationStatus: VerificationStatusEnum.default("UNVERIFIED"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Business = z.infer<typeof BusinessSchema>;

export const CreateBusinessInputSchema = BusinessSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  assets: z.array(BusinessDigitalAssetSchema).optional(),
});
export type CreateBusinessInput = z.infer<typeof CreateBusinessInputSchema>;

export const QuickCaptureInputSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Valid URL required"),
  category: z.string().default("General Business"),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  city: z.string().default("Chennai"),
  notes: z.string().optional(),
  observedGap: z.enum([
    "NO_WEBSITE",
    "BROKEN_WEBSITE",
    "OUTDATED_WEBSITE",
    "LOW_REVIEWS",
    "EXPLICIT_INTENT",
    "OTHER",
  ]).default("NO_WEBSITE"),
});
export type QuickCaptureInput = z.infer<typeof QuickCaptureInputSchema>;
