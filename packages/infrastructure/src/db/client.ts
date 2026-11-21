import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNode } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { Pool, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

// Enable WebSocket for Neon serverless pool in Node environments if needed
neonConfig.fetchConnectionCache = true;

/**
 * Serverless / Edge Database Client (Used by Next.js Server Actions & API routes)
 * Connects through Neon's connection pooler with graceful connection caching.
 */
let serverlessPool: Pool | null = null;

export function getWebDb(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }

  if (!serverlessPool) {
    serverlessPool = new Pool({ connectionString: url });
  }

  return drizzleServerless(serverlessPool, { schema });
}

/**
 * Live Database Health & Latency Checker for Operator Console
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  latencyMs?: number;
  database?: string;
  host?: string;
  version?: string;
  error?: string;
}> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return {
      connected: false,
      error: "DATABASE_URL is not set in environment.",
    };
  }

  try {
    let host = "neon.tech";
    try {
      const parsed = new URL(url);
      host = parsed.hostname;
    } catch {
      // ignore
    }

    const startTime = Date.now();
    const db = getWebDb();
    const result: any = await db.execute(sql`SELECT 1 as ok, current_database() as db_name, version() as version`);
    const latencyMs = Date.now() - startTime;
    const dbName = result?.rows?.[0]?.db_name || result?.[0]?.db_name || "neondb";
    const rawVersion = result?.rows?.[0]?.version || result?.[0]?.version || "PostgreSQL 16";
    const cleanVersion = typeof rawVersion === "string" ? rawVersion.split(" ")[0] + " " + rawVersion.split(" ")[1] : "PostgreSQL 16";

    return {
      connected: true,
      latencyMs,
      database: dbName,
      host,
      version: cleanVersion,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || "Failed to reach Neon PostgreSQL endpoint.",
    };
  }
}

/**
 * Worker Database Client (Used by the Node.js Background Worker)
 * Connects via direct TCP connection pool, enabling durable `SKIP LOCKED` queries.
 */
let workerSqlClient: ReturnType<typeof postgres> | null = null;

export function getWorkerDb(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL / DATABASE_URL_UNPOOLED environment variable is missing.");
  }

  if (!workerSqlClient) {
    workerSqlClient = postgres(url, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return drizzleNode(workerSqlClient, { schema });
}
