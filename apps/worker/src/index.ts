import {
  getWorkerDb,
  schema,
  validateUrlForSSRF,
  runWebsiteDiagnostics,
} from "@leadpulse/infrastructure";
import { calculateLeadDemandScore } from "@leadpulse/domain";
import { eq, and, lte } from "drizzle-orm";

const WORKER_ID = `worker-${process.pid}-${Date.now().toString(36)}`;
const POLL_INTERVAL_MS = parseInt(process.env.WORKER_POLL_INTERVAL_MS || "3000", 10);
let isRunning = true;

console.log(`[LeadPulse Worker] Initializing with ID: ${WORKER_ID}`);

async function processNextJob() {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_URL_UNPOOLED) {
    return;
  }

  try {
    const db = getWorkerDb();

    // 1. Claim next pending job using SKIP LOCKED
    const claimedJobs = await db.transaction(async (tx) => {
      const candidates = await tx
        .select()
        .from(schema.jobsQueue)
        .where(
          and(
            eq(schema.jobsQueue.status, "PENDING"),
            lte(schema.jobsQueue.scheduledFor, new Date())
          )
        )
        .limit(1)
        .for("update", { skipLocked: true });

      if (candidates.length === 0) {
        return [];
      }

      const job = candidates[0];

      await tx
        .update(schema.jobsQueue)
        .set({
          status: "PROCESSING",
          lockedAt: new Date(),
          lockedBy: WORKER_ID,
        })
        .where(eq(schema.jobsQueue.id, job.id));

      return [job];
    });

    if (claimedJobs.length === 0) {
      return; // No pending jobs
    }

    const job = claimedJobs[0];
    console.log(`[LeadPulse Worker] Processing job ${job.id} (${job.taskType})`);

    // 2. Execute Task Handler
    try {
      await handleJob(db, job);

      await db
        .update(schema.jobsQueue)
        .set({
          status: "COMPLETED",
          completedAt: new Date(),
        })
        .where(eq(schema.jobsQueue.id, job.id));

      console.log(`[LeadPulse Worker] Completed job ${job.id}`);
    } catch (jobErr: any) {
      console.error(`[LeadPulse Worker] Job ${job.id} failed:`, jobErr.message);

      const nextRetry = job.retryCount + 1;
      const willRetry = nextRetry < job.maxRetries;

      await db
        .update(schema.jobsQueue)
        .set({
          status: willRetry ? "PENDING" : "FAILED",
          retryCount: nextRetry,
          lastError: jobErr.message,
          scheduledFor: willRetry ? new Date(Date.now() + nextRetry * 10000) : job.scheduledFor,
        })
        .where(eq(schema.jobsQueue.id, job.id));
    }
  } catch (dbErr: any) {
    console.error("[LeadPulse Worker] Polling error:", dbErr.message);
  }
}

async function handleJob(db: any, job: any) {
  const payload = job.payload as Record<string, any>;

  switch (job.taskType) {
    case "WEBSITE_AUDIT": {
      const { businessId, targetUrl } = payload;
      console.log(`[Audit Worker] Starting diagnostics for ${targetUrl}`);

      // Run diagnostics with SSRF and SSL checks
      const auditResult = await runWebsiteDiagnostics(targetUrl);

      // Save audit into website_audits
      const [newAudit] = await db
        .insert(schema.websiteAudits)
        .values({
          businessId,
          targetUrl: auditResult.targetUrl,
          finalUrl: auditResult.finalUrl,
          httpStatus: auditResult.httpStatus,
          dnsResolves: auditResult.dnsResolves,
          sslValid: auditResult.sslValid,
          sslExpiresAt: auditResult.sslExpiresAt,
          redirectCount: auditResult.redirectCount,
          isMobileResponsive: auditResult.isMobileResponsive,
          lighthousePerformance: String(auditResult.lighthousePerformance),
          lighthouseAccessibility: String(auditResult.lighthouseAccessibility),
          lighthouseSeo: String(auditResult.lighthouseSeo),
          hasContactForm: auditResult.hasContactForm,
          hasBookingEngine: auditResult.hasBookingEngine,
          hasWhatsappButton: auditResult.hasWhatsappButton,
          rawFindings: auditResult.findings,
          auditCompletedAt: new Date(),
        })
        .returning();

      // Retrieve business to recalculate score
      const [businessRecord] = await db
        .select()
        .from(schema.businesses)
        .where(eq(schema.businesses.id, businessId))
        .limit(1);

      if (businessRecord) {
        const updatedScore = calculateLeadDemandScore({
          business: businessRecord,
          audit: newAudit,
        });

        await db
          .update(schema.leadScores)
          .set({
            needFitScore: String(updatedScore.needFitScore),
            intentScore: String(updatedScore.intentScore),
            businessFitScore: String(updatedScore.businessFitScore),
            reachabilityScore: String(updatedScore.reachabilityScore),
            evidenceConfidence: String(updatedScore.evidenceConfidence),
            priorityScore: String(updatedScore.priorityScore),
            demandTier: updatedScore.demandTier,
            recommendedServices: updatedScore.recommendedServices,
            scoreReasons: updatedScore.scoreReasons,
            calculatedAt: new Date(),
          })
          .where(eq(schema.leadScores.businessId, businessId));

        console.log(
          `[Audit Worker] Recalculated demand score for ${businessRecord.name}: Tier ${updatedScore.demandTier} (Score: ${updatedScore.priorityScore}/100)`
        );
      }
      break;
    }

    default:
      console.log(`[Worker] Unhandled task type: ${job.taskType}`);
      break;
  }
}

async function loop() {
  while (isRunning) {
    await processNextJob();
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

process.on("SIGINT", () => {
  console.log("[LeadPulse Worker] Received SIGINT. Shutting down...");
  isRunning = false;
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("[LeadPulse Worker] Received SIGTERM. Shutting down...");
  isRunning = false;
  process.exit(0);
});

loop();
