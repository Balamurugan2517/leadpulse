import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNode } from "drizzle-orm/postgres-js";
import { Pool, neonConfig } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema.js";

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
