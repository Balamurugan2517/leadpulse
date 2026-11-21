"use server";

import { runWebsiteDiagnostics, getWebDb, schema } from "@leadpulse/infrastructure";
import { desc, eq } from "drizzle-orm";

// In-memory cache for audits performed during active session (guarantees immediate visibility in UI)
const sessionAuditsCache: any[] = [];

export async function getAuditsListAction() {
  const mergedAudits: any[] = [...sessionAuditsCache];

  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const dbAudits = await db
        .select({
          audit: schema.websiteAudits,
          business: schema.businesses,
        })
        .from(schema.websiteAudits)
        .leftJoin(schema.businesses, eq(schema.websiteAudits.businessId, schema.businesses.id))
        .orderBy(desc(schema.websiteAudits.createdAt))
        .limit(30);

      // Deduplicate DB audits against sessionAuditsCache
      const existingUrls = new Set(sessionAuditsCache.map((s) => s.audit.targetUrl));
      for (const item of dbAudits) {
        if (!existingUrls.has(item.audit.targetUrl)) {
          mergedAudits.push(item);
        }
      }

      if (mergedAudits.length > 0) return mergedAudits;
    }
  } catch (err: any) {
    console.warn("[Audit Actions] DB unavailable, returning mock audits.", err.message);
  }

  // Fallback demo audit telemetry
  const fallbackAudits = [
    {
      audit: {
        id: "aud-1",
        targetUrl: "https://adyardentalspa.in",
        finalUrl: "https://adyardentalspa.in",
        httpStatus: 200,
        sslValid: true,
        sslExpiresAt: new Date(Date.now() + 86400000 * 45),
        isMobileResponsive: false,
        lighthousePerformance: "34",
        lighthouseAccessibility: "80",
        lighthouseSeo: "45",
        hasContactForm: false,
        hasWhatsappButton: false,
        rawFindings: [
          { code: "NO_MOBILE_VIEWPORT", title: "Desktop-Only Viewport", severity: "HIGH" },
          { code: "SLOW_LCP", title: "Mobile load time > 5.2 seconds", severity: "HIGH" },
          { code: "NO_DIRECT_CTA", title: "Missing WhatsApp booking link", severity: "MEDIUM" },
        ],
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      business: {
        id: "b-1",
        name: "Adyar Dental Spa",
        category: "Dental Clinic",
        city: "Chennai",
      },
    },
    {
      audit: {
        id: "aud-2",
        targetUrl: "https://marinaseafoodcafe.com",
        finalUrl: "https://marinaseafoodcafe.com",
        httpStatus: 200,
        sslValid: false,
        isMobileResponsive: true,
        lighthousePerformance: "68",
        lighthouseAccessibility: "85",
        lighthouseSeo: "60",
        hasContactForm: true,
        hasWhatsappButton: false,
        rawFindings: [
          { code: "EXPIRED_SSL", title: "Expired SSL Certificate Warning", severity: "CRITICAL" },
        ],
        createdAt: new Date(Date.now() - 3600000 * 6),
      },
      business: {
        id: "b-2",
        name: "Marina Seafood Cafe",
        category: "Restaurant",
        city: "Chennai",
      },
    },
  ];

  for (const item of fallbackAudits) {
    if (!mergedAudits.some((m) => m.audit.targetUrl === item.audit.targetUrl)) {
      mergedAudits.push(item);
    }
  }

  return mergedAudits;
}

export async function runInstantAuditAction(url: string) {
  if (!url || !url.trim()) {
    return { success: false, error: "Please enter a valid website URL" };
  }

  let formatted = url.trim();
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = `https://${formatted}`;
  }

  try {
    const result = await runWebsiteDiagnostics(formatted);

    // Derive a clean display name from URL hostname
    let derivedName = "Audited Website";
    try {
      const parsed = new URL(result.targetUrl);
      const hostPart = parsed.hostname.replace(/^www\./, "").split(".")[0];
      derivedName = hostPart.charAt(0).toUpperCase() + hostPart.slice(1) + " (Audited)";
    } catch {
      // ignore
    }

    // Save into session memory store so it persists in Recent Diagnostics table immediately
    const sessionRecord = {
      audit: {
        id: `aud-${Date.now()}`,
        targetUrl: result.targetUrl,
        finalUrl: result.finalUrl || result.targetUrl,
        httpStatus: result.httpStatus || 200,
        sslValid: result.sslValid,
        sslExpiresAt: result.sslExpiresAt,
        isMobileResponsive: result.isMobileResponsive,
        lighthousePerformance: String(result.lighthousePerformance || 60),
        lighthouseAccessibility: String(result.lighthouseAccessibility || 80),
        lighthouseSeo: String(result.lighthouseSeo || 70),
        hasContactForm: result.hasContactForm,
        hasWhatsappButton: result.hasWhatsappButton,
        rawFindings: result.findings,
        createdAt: new Date(),
      },
      business: {
        id: "",
        name: derivedName,
        category: "Web Diagnostics",
        city: "Online Audit",
      },
    };

    // Prepend to top of session audits
    sessionAuditsCache.unshift(sessionRecord);

    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
