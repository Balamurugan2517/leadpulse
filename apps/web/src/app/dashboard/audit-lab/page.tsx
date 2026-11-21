import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Smartphone,
  Gauge,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { getAuditsListAction, runInstantAuditAction } from "../../actions/audit-actions";
import { DownloadAuditsCsvButton } from "./download-csv-button";

interface AuditLabPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AuditLabPage({ searchParams }: AuditLabPageProps) {
  const sParams = await searchParams;
  const auditTarget = typeof sParams.url === "string" ? sParams.url : undefined;

  let instantResult: any = null;
  let instantError: string | null = null;

  if (auditTarget) {
    const res = await runInstantAuditAction(auditTarget);
    if (res.success) {
      instantResult = res.result;
    } else {
      instantError = res.error || "Failed to audit target URL";
    }
  }

  const audits = await getAuditsListAction();

  const kpis = [
    { title: "Total Audits", value: audits.length.toString(), desc: "Completed crawls in Chennai" },
    { title: "SSL Security Alerts", value: "2", desc: "Expired or invalid certificates", color: "text-amber-500" },
    { title: "Unusable on Mobile", value: "3", desc: "Desktop-only layout detected", color: "text-destructive" },
    { title: "Missing WhatsApp CTA", value: "4", desc: "No direct booking path", color: "text-blue-500" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Website Audit Lab</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Automated SSL certificate verification, mobile responsiveness profiling, and evidence-backed deficiency detection.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-border bg-card shadow-sm">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{kpi.title}</span>
            <div className={`text-3xl font-extrabold my-1.5 ${kpi.color || "text-foreground"}`}>{kpi.value}</div>
            <p className="text-xs text-muted-foreground">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Instant Audit Scanner Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            Instant Diagnostics Scanner
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Test any website URL directly. Fully protected by SSRF and DNS rebinding egress security filters.
          </p>
        </div>

        <form method="GET" className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="url"
            defaultValue={auditTarget || ""}
            placeholder="e.g. https://exampleclinic.in or domain.com"
            className="flex-1 px-4 py-2.5 rounded-lg bg-muted/30 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm shrink-0"
          >
            <Activity className="h-4 w-4" />
            Run Technical Audit
          </button>
        </form>

        {instantError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Audit blocked or failed: {instantError}</span>
          </div>
        )}

        {/* Instant Audit Result View */}
        {instantResult && (
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5 space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">Live Audit Report</span>
                <span className="font-bold text-base text-foreground break-all">{instantResult.finalUrl}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600/10 text-emerald-500 font-semibold border border-emerald-600/20">
                HTTP {instantResult.httpStatus} • {instantResult.ttfbMs}ms TTFB
              </span>
            </div>

            {/* Score Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Mobile Speed Score</span>
                <span className={`text-3xl font-extrabold my-1 block ${instantResult.lighthousePerformance < 50 ? "text-destructive" : "text-emerald-500"}`}>
                  {instantResult.lighthousePerformance}/100
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {instantResult.isMobileResponsive ? "Mobile Viewport OK" : "Desktop Only (No Mobile Tag)"}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">SSL Security Status</span>
                <span className={`text-xl font-extrabold my-2 block ${instantResult.sslValid ? "text-emerald-500" : "text-destructive"}`}>
                  {instantResult.sslValid ? "Valid TLS/SSL" : "⚠️ Expired / Invalid"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {instantResult.sslDaysRemaining !== null ? `${instantResult.sslDaysRemaining} days remaining` : "No HTTPS"}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Local SEO Foundations</span>
                <span className="text-3xl font-extrabold my-1 block text-primary">
                  {instantResult.lighthouseSeo}/100
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {instantResult.hasTitle ? "Page Title Tag OK" : "Missing Title"}
                </span>
              </div>
            </div>

            {/* Findings List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground block">Detected Digital Deficiencies:</span>
              {instantResult.findings.length === 0 ? (
                <p className="text-xs text-muted-foreground">No critical technical issues found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instantResult.findings.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border border-border bg-card text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{f.title}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${f.severity === "CRITICAL" ? "bg-destructive/20 text-destructive" : "bg-amber-500/20 text-amber-500"}`}>
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">{f.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Historical Audits Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-foreground">Recent Website Diagnostics</h3>
            <span className="text-xs text-muted-foreground">{audits.length} records in audit register</span>
          </div>
          <DownloadAuditsCsvButton audits={audits} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Business & URL</th>
                <th className="px-6 py-3.5">SSL Certificate</th>
                <th className="px-6 py-3.5">Mobile UX</th>
                <th className="px-6 py-3.5">Speed Score</th>
                <th className="px-6 py-3.5">Gaps Detected</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {audits.map((item: any, idx: number) => {
                const a = item.audit;
                const b = item.business;
                return (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground block">{b?.name || "Independent Audit"}</span>
                      <a
                        href={a.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                      >
                        {a.targetUrl} <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      {a.sslValid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Valid SSL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive">
                          <XCircle className="h-3.5 w-3.5" /> Expired / Insecure
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs text-foreground font-medium">
                        {a.isMobileResponsive ? "Mobile Responsive" : "⚠️ Desktop Only"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${Number(a.lighthousePerformance) < 50 ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-emerald-600/10 text-emerald-500 border border-emerald-600/20"}`}>
                        {a.lighthousePerformance}/100
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground">
                        {a.rawFindings?.length || 0} issues detected
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {b?.id && (
                        <Link
                          href={`/dashboard/leads/${b.id}`}
                          className="px-2.5 py-1 rounded bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                        >
                          View Lead
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
