import { getWorkerDb, schema, validateUrlForSSRF } from "@leadpulse/infrastructure";
import { eq, and, lte, sql } from "drizzle-orm";

const WORKER_ID = `worker-${process.pid}-${Date.now().toString(36)}`;
const POLL_INTERVAL_MS = parseInt(process.env.WORKER_POLL_INTERVAL_MS || "3000", 10);
let isRunning = true;

console.log(`[LeadPulse Worker] Initializing with ID: ${WORKER_ID}`);

async function processNextJob() {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_URL_UNPOOLED) {
    console.warn("[LeadPulse Worker] No DATABASE_URL configured. Sleeping...");
    return;
  }

  try {
    const db = getWorkerDb();

    // 1. Claim next pending job using SKIP LOCKED
    // Transactional atomic lock
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

      // Mark as PROCESSING
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
      return; // No pending work
    }

    const job = claimedJobs[0];
    console.log(`[LeadPulse Worker] Claimed job ${job.id} (${job.taskType})`);

    // 2. Execute Task Handler
    try {
      await handleJob(job);

      // Mark COMPLETED
      await db
        .update(schema.jobsQueue)
        .set({
          status: "COMPLETED",
          completedAt: new Date(),
        })
        .where(eq(schema.jobsQueue.id, job.id));

      console.log(`[LeadPulse Worker] Successfully completed job ${job.id}`);
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

async function handleJob(job: any) {
  const payload = job.payload as Record<string, any>;

  switch (job.taskType) {
    case "WEBSITE_AUDIT": {
      const targetUrl = payload.targetUrl;
      console.log(`[Audit Handler] Starting security pre-flight for ${targetUrl}`);

      // SSRF & DNS Rebinding validation
      const ssrfCheck = await validateUrlForSSRF(targetUrl);
      if (!ssrfCheck.isSafe) {
        throw new Error(`SSRF Blocked: ${ssrfCheck.reason}`);
      }

      console.log(`[Audit Handler] Target is safe (${ssrfCheck.resolvedIp}). Audit processing ready.`);
      break;
    }

    default:
      console.log(`[Task Handler] Task type ${job.taskType} acknowledged.`);
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
  console.log("[LeadPulse Worker] Received SIGINT. Shutting down gracefully...");
  isRunning = false;
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("[LeadPulse Worker] Received SIGTERM. Shutting down gracefully...");
  isRunning = false;
  process.exit(0);
});

loop();
