import { z } from "zod";

export const PipelineStageEnum = z.enum([
  "DISCOVERED",
  "VERIFIED",
  "QUALIFIED",
  "CONTACTED",
  "IN_DISCUSSION",
  "PROPOSAL_SENT",
  "DEAL_WON",
  "DEAL_LOST",
  "SUPPRESSED",
]);
export type PipelineStage = z.infer<typeof PipelineStageEnum>;

export const OutreachChannelEnum = z.enum([
  "WHATSAPP",
  "EMAIL",
  "PHONE_CALL",
  "IN_PERSON",
]);
export type OutreachChannel = z.infer<typeof OutreachChannelEnum>;

export const OutreachDraftStatusEnum = z.enum([
  "DRAFT",
  "APPROVED",
  "SENT",
  "REJECTED",
]);
export type OutreachDraftStatus = z.infer<typeof OutreachDraftStatusEnum>;

export const OutreachDraftSchema = z.object({
  id: z.string().uuid().optional(),
  leadId: z.string().uuid(),
  channel: OutreachChannelEnum,
  recipientTarget: z.string().min(1, "Recipient target is required"),
  subject: z.string().optional(),
  bodyText: z.string().min(1, "Message text is required"),
  status: OutreachDraftStatusEnum.default("DRAFT"),
  evidenceReferenced: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
export type OutreachDraft = z.infer<typeof OutreachDraftSchema>;

export const CommunicationLogSchema = z.object({
  id: z.string().uuid().optional(),
  leadId: z.string().uuid(),
  channel: OutreachChannelEnum,
  interactionType: z.enum([
    "WHATSAPP_CLICKED",
    "MANUAL_CALL",
    "EMAIL_SENT",
    "MEETING_ONLINE",
    "MEETING_IN_PERSON",
  ]),
  outcomeSummary: z.string().optional(),
  followUpScheduledFor: z.date().optional().nullable(),
  recordedBy: z.string().uuid().optional(),
  createdAt: z.date().default(() => new Date()),
});
export type CommunicationLog = z.infer<typeof CommunicationLogSchema>;

export const LeadsPipelineSchema = z.object({
  id: z.string().uuid().optional(),
  businessId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  stage: PipelineStageEnum.default("DISCOVERED"),
  dealValueEstimate: z.number().nonnegative().optional().nullable(),
  lostReason: z.string().optional().nullable(),
  nextFollowUpDate: z.date().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  lastContactedAt: z.date().optional().nullable(),
  notesSummary: z.string().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
export type LeadsPipeline = z.infer<typeof LeadsPipelineSchema>;

export const TransitionStageInputSchema = z.object({
  leadId: z.string().uuid(),
  targetStage: PipelineStageEnum,
  notes: z.string().optional(),
  dealValueEstimate: z.number().optional(),
  lostReason: z.string().optional(),
  followUpDate: z.date().optional(),
});
export type TransitionStageInput = z.infer<typeof TransitionStageInputSchema>;
