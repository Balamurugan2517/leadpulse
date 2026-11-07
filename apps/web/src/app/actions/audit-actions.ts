"use server";

import { runWebsiteDiagnostics, getWebDb, schema } from "@leadpulse/infrastructure";
import { desc, eq } from "drizzle-orm";

export async function getAuditsListAction() {
  try {
    if (process.env.DATABASE_URL) {
      const db = getWebDb();
      const audits = await db
        .select({
          audit: schema.websiteAudits,
          business: schema.businesses,
        })
        .from(schema.websiteAudits)
        .leftJoin(schema.businesses, eq(schema.websiteAudits.businessId, schema.businesses.id))
        .orderBy(desc(schema.websiteAudits.createdAt))
        .limit(20);

      if (audits.length > 0) return audits;
    }
  } catch (err: any) {
    console.warn("[Audit Actions] DB unavailable, returning mock audits.", err.message);
  }

  // Fallback demo audit telemetry
  return [
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
    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
