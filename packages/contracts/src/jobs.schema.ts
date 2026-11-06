import { z } from "zod";

export const TaskTypeEnum = z.enum([
  "WEBSITE_AUDIT",
  "OSM_DISCOVERY",
  "GENERATE_OUTREACH_DRAFT",
  "RECHECK_STALE_LEAD",
  "EXPORT_LEADS_CSV",
]);
export type TaskType = z.infer<typeof TaskTypeEnum>;

export const JobStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);
export type JobStatus = z.infer<typeof JobStatusEnum>;

export const JobQueueItemSchema = z.object({
  id: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  taskType: TaskTypeEnum,
  payload: z.record(z.any()),
  status: JobStatusEnum.default("PENDING"),
  retryCount: z.number().int().default(0),
  maxRetries: z.number().int().default(3),
  lastError: z.string().optional().nullable(),
  lockedAt: z.date().optional().nullable(),
  lockedBy: z.string().optional().nullable(),
  scheduledFor: z.date().default(() => new Date()),
  completedAt: z.date().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
});
export type JobQueueItem = z.infer<typeof JobQueueItemSchema>;
