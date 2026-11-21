"use client";

import { useState } from "react";
import { Database, CheckCircle2, XCircle, RefreshCw, Activity, ExternalLink } from "lucide-react";
import { testNeonConnectionAction, DatabaseHealthStatus } from "../../actions/settings-actions";

export function NeonConnectionCard({ initialStatus }: { initialStatus: DatabaseHealthStatus }) {
  const [status, setStatus] = useState<DatabaseHealthStatus>(initialStatus);
  const [isTesting, setIsTesting] = useState(false);

  async function handleTest() {
    setIsTesting(true);
    try {
      const res = await testNeonConnectionAction();
      setStatus(res);
    } catch (err: any) {
      setStatus({
        connected: false,
        error: err?.message || "Failed to execute connection test.",
        testedAt: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${status.connected ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500"}`}>
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              Neon PostgreSQL Connection
              {status.connected ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected & Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <XCircle className="h-3 w-3" />
                  Not Connected / Offline Demo Mode
                </span>
              )}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Live serverless PostgreSQL telemetry with direct connection testing.
            </p>
          </div>
        </div>

        <button
          onClick={handleTest}
          disabled={isTesting}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} />
          {isTesting ? "Testing Connection..." : "Test Connection Now"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-muted/20 border border-border">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Status</span>
          <span className={`font-semibold flex items-center gap-1.5 ${status.connected ? "text-emerald-400" : "text-amber-400"}`}>
            <span className={`h-2 w-2 rounded-full ${status.connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            {status.connected ? "Active & Healthy" : "Offline / Mock Fallback"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-muted/20 border border-border">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Roundtrip Latency</span>
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            {status.connected && status.latencyMs !== undefined ? `${status.latencyMs} ms` : "N/A"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-muted/20 border border-border">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Database / Host</span>
          <span className="font-semibold text-foreground truncate block" title={status.host || "Local in-memory"}>
            {status.database ? `${status.database} (${status.host?.split(".")[0] || "neon"})` : "Local in-memory"}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-muted/20 border border-border">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Engine Version</span>
          <span className="font-semibold text-foreground truncate block">
            {status.version || "PostgreSQL 16 (Neon Serverless)"}
          </span>
        </div>
      </div>

      {status.error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex flex-col gap-1">
          <span className="font-bold flex items-center gap-1.5">
            <XCircle className="h-4 w-4" /> Connection Diagnosis:
          </span>
          <p className="font-mono text-[11px] leading-relaxed break-all bg-background/50 p-2 rounded border border-destructive/10">
            {status.error}
          </p>
          <span className="text-[11px] text-muted-foreground mt-1">
            Check your <code className="font-bold">DATABASE_URL</code> in <code className="font-bold">.env</code> or Vercel Environment Variables.
          </span>
        </div>
      )}

      <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-1">
        <span>Last checked: {status.testedAt || "Just now"}</span>
        <a
          href="https://console.neon.tech"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          Neon Console <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
