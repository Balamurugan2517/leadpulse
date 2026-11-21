"use server";

import { checkDatabaseHealth } from "@leadpulse/infrastructure";

export interface DatabaseHealthStatus {
  connected: boolean;
  latencyMs?: number;
  database?: string;
  host?: string;
  version?: string;
  error?: string;
  testedAt: string;
}

export async function testNeonConnectionAction(): Promise<DatabaseHealthStatus> {
  const health = await checkDatabaseHealth();
  return {
    ...health,
    testedAt: new Date().toLocaleTimeString(),
  };
}
