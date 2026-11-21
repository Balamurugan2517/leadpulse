"use client";

import { Download } from "lucide-react";

interface AuditExportItem {
  audit: {
    id: string;
    targetUrl: string;
    finalUrl?: string;
    httpStatus?: number;
    sslValid: boolean;
    sslExpiresAt?: string | Date;
    isMobileResponsive?: boolean;
    lighthousePerformance?: string | number;
    lighthouseAccessibility?: string | number;
    lighthouseSeo?: string | number;
    hasContactForm?: boolean;
    hasWhatsappButton?: boolean;
    rawFindings?: Array<{ code: string; title: string; severity?: string }>;
    createdAt?: string | Date;
  };
  business?: {
    id?: string;
    name?: string;
    category?: string;
    city?: string;
  };
}

function sanitizeForCsv(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Defend against CSV formula injection
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  // Escape inner double quotes
  return `"${str.replace(/"/g, '""')}"`;
}

export function DownloadAuditsCsvButton({ audits }: { audits: AuditExportItem[] }) {
  function handleDownload() {
    if (!audits || audits.length === 0) return;

    const headers = [
      "Audit ID",
      "Business Name",
      "Category",
      "City",
      "Target URL",
      "HTTP Status",
      "SSL Certificate",
      "SSL Expiry Date",
      "Mobile Responsive",
      "Speed Performance Score",
      "Accessibility Score",
      "SEO Score",
      "WhatsApp CTA",
      "Contact Form",
      "Deficiencies Detected",
      "Audited Date",
    ];

    const rows = audits.map((item) => {
      const a = item.audit;
      const b = item.business;
      const findingsList = (a.rawFindings || [])
        .map((f) => `[${f.severity || "DEFECT"}] ${f.title}`)
        .join("; ");

      return [
        sanitizeForCsv(a.id),
        sanitizeForCsv(b?.name || "Independent Audit"),
        sanitizeForCsv(b?.category || "N/A"),
        sanitizeForCsv(b?.city || "N/A"),
        sanitizeForCsv(a.targetUrl),
        sanitizeForCsv(a.httpStatus ?? 200),
        sanitizeForCsv(a.sslValid ? "Valid HTTPS" : "Expired / Insecure"),
        sanitizeForCsv(a.sslExpiresAt ? new Date(a.sslExpiresAt).toISOString().split("T")[0] : "N/A"),
        sanitizeForCsv(a.isMobileResponsive ? "Yes (Mobile-Friendly)" : "No (Desktop Only)"),
        sanitizeForCsv(`${a.lighthousePerformance || 0}/100`),
        sanitizeForCsv(`${a.lighthouseAccessibility || 0}/100`),
        sanitizeForCsv(`${a.lighthouseSeo || 0}/100`),
        sanitizeForCsv(a.hasWhatsappButton ? "Present" : "Missing"),
        sanitizeForCsv(a.hasContactForm ? "Present" : "Missing"),
        sanitizeForCsv(findingsList || "No major deficiencies detected"),
        sanitizeForCsv(a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString()),
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateStr = new Date().toISOString().split("T")[0];
    link.download = `leadpulse-technical-audits-${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={!audits || audits.length === 0}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors shadow-sm cursor-pointer disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5 text-primary" />
      Download CSV Report
    </button>
  );
}
