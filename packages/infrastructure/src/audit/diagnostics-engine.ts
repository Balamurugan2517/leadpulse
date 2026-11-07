import http from "node:http";
import https from "node:https";
import tls from "node:tls";
import { URL } from "node:url";
import { validateUrlForSSRF } from "../security/ssrf-filter";
import { AuditFinding } from "@leadpulse/contracts";

export interface DiagnosticAuditResult {
  targetUrl: string;
  finalUrl: string;
  httpStatus: number;
  dnsResolves: boolean;
  sslValid: boolean;
  sslExpiresAt?: Date | null;
  sslDaysRemaining?: number | null;
  redirectCount: number;
  isMobileResponsive: boolean;
  hasContactForm: boolean;
  hasBookingEngine: boolean;
  hasWhatsappButton: boolean;
  hasPhoneLink: boolean;
  hasTitle: boolean;
  hasMetaDescription: boolean;
  ttfbMs: number;
  lighthousePerformance: number;
  lighthouseAccessibility: number;
  lighthouseSeo: number;
  findings: AuditFinding[];
}

/**
 * Inspects a remote website with full SSRF protection, measuring:
 * 1. TLS/SSL certificate validity and expiry date
 * 2. HTTP response code, redirects, and TTFB latency
 * 3. HTML parsing for mobile viewport, contact forms, booking CTAs, WhatsApp buttons, and SEO tags
 */
export async function runWebsiteDiagnostics(rawUrl: string): Promise<DiagnosticAuditResult> {
  // Step 1: SSRF Pre-flight validation
  const ssrfCheck = await validateUrlForSSRF(rawUrl);
  if (!ssrfCheck.isSafe) {
    throw new Error(`SSRF Blocked: ${ssrfCheck.reason}`);
  }

  const findings: AuditFinding[] = [];
  let currentUrl = ssrfCheck.canonicalUrl || rawUrl;
  let redirectCount = 0;
  let httpStatus = 0;
  let responseHtml = "";
  let ttfbMs = 0;

  // Step 2: HTTP Fetch with redirect following & in-flight SSRF check
  const maxRedirects = 5;
  let isDone = false;

  while (!isDone && redirectCount <= maxRedirects) {
    const parsed = new URL(currentUrl);
    const isHttps = parsed.protocol === "https:";
    const transport = isHttps ? https : http;

    const startTime = Date.now();

    const fetchResult = await new Promise<{
      statusCode: number;
      headers: http.IncomingHttpHeaders;
      body: string;
      ttfb: number;
    }>((resolve, reject) => {
      const req = transport.request(
        currentUrl,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (LeadPulse Health Audit)",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          timeout: 12000,
        },
        (res) => {
          let body = "";
          let firstByteTime = Date.now() - startTime;

          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            if (body.length < 500000) {
              body += chunk; // Cap at 500KB to prevent memory exhaustion
            }
          });

          res.on("end", () => {
            resolve({
              statusCode: res.statusCode || 0,
              headers: res.headers,
              body,
              ttfb: firstByteTime,
            });
          });
        }
      );

      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timed out after 12 seconds"));
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    });

    httpStatus = fetchResult.statusCode;
    ttfbMs = fetchResult.ttfb;
    responseHtml = fetchResult.body;

    // Check for redirects (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(httpStatus) && fetchResult.headers.location) {
      redirectCount++;
      const nextUrl = new URL(fetchResult.headers.location, currentUrl).toString();

      // In-flight redirect target SSRF verification
      const redirectSSRF = await validateUrlForSSRF(nextUrl);
      if (!redirectSSRF.isSafe) {
        throw new Error(`SSRF Blocked on redirect: ${redirectSSRF.reason}`);
      }

      currentUrl = redirectSSRF.canonicalUrl || nextUrl;
    } else {
      isDone = true;
    }
  }

  // Step 3: SSL Certificate Inspection
  let sslValid = false;
  let sslExpiresAt: Date | null = null;
  let sslDaysRemaining: number | null = null;

  try {
    const finalParsed = new URL(currentUrl);
    if (finalParsed.protocol === "https:") {
      const port = finalParsed.port ? parseInt(finalParsed.port, 10) : 443;
      const certInfo = await inspectTlsCertificate(finalParsed.hostname, port);
      sslValid = certInfo.valid;
      sslExpiresAt = certInfo.expiresAt;
      sslDaysRemaining = certInfo.daysRemaining;

      if (!sslValid || (sslDaysRemaining !== null && sslDaysRemaining <= 0)) {
        findings.push({
          code: "EXPIRED_SSL",
          title: "Expired or Invalid SSL Certificate",
          description: "Browsers display a prominent 'Site Not Secure' warning, causing visitors to bounce immediately.",
          severity: "CRITICAL",
        });
      } else if (sslDaysRemaining !== null && sslDaysRemaining <= 14) {
        findings.push({
          code: "SSL_EXPIRING_SOON",
          title: `SSL Certificate Expiring in ${sslDaysRemaining} Days`,
          description: "Certificate requires imminent renewal to avoid browser security blocking.",
          severity: "HIGH",
        });
      }
    } else {
      findings.push({
        code: "NO_HTTPS",
        title: "Website Not Using Secure HTTPS",
        description: "Website uses unencrypted HTTP. Customer data is not encrypted and browsers flag the site as insecure.",
        severity: "CRITICAL",
      });
    }
  } catch (err: any) {
    sslValid = false;
    findings.push({
      code: "SSL_ERROR",
      title: "SSL Handshake Failed",
      description: `Unable to establish secure TLS connection: ${err.message}`,
      severity: "CRITICAL",
    });
  }

  // Step 4: HTML Telemetry & Mobile UX Inspection
  const htmlLower = responseHtml.toLowerCase();

  // Mobile viewport meta tag check
  const isMobileResponsive =
    htmlLower.includes('name="viewport"') ||
    htmlLower.includes("name='viewport'") ||
    htmlLower.includes('content="width=device-width');

  if (!isMobileResponsive) {
    findings.push({
      code: "NO_MOBILE_VIEWPORT",
      title: "Desktop-Only Viewport (Not Mobile Responsive)",
      description: "Page lacks a responsive mobile viewport tag, forcing phone users to pinch-to-zoom.",
      severity: "HIGH",
    });
  }

  // Contact form & conversion checks
  const hasContactForm =
    htmlLower.includes("<form") &&
    (htmlLower.includes('type="submit"') ||
      htmlLower.includes("<button") ||
      htmlLower.includes("contact") ||
      htmlLower.includes("enquiry"));

  const hasWhatsappButton =
    htmlLower.includes("wa.me") ||
    htmlLower.includes("api.whatsapp.com") ||
    htmlLower.includes("whatsapp");

  const hasPhoneLink = htmlLower.includes("href=\"tel:") || htmlLower.includes("href='tel:");

  const hasBookingEngine =
    htmlLower.includes("calendly") ||
    htmlLower.includes("appointment") ||
    htmlLower.includes("booking") ||
    htmlLower.includes("schedule") ||
    htmlLower.includes("practo");

  if (!hasContactForm && !hasWhatsappButton && !hasPhoneLink) {
    findings.push({
      code: "NO_DIRECT_CTA",
      title: "Missing Direct Contact / Booking Conversion Path",
      description: "No direct phone call, WhatsApp chat button, or contact form was found above the fold.",
      severity: "HIGH",
    });
  }

  // SEO Foundations
  const hasTitle = /<title[^>]*>[\s\S]*?<\/title>/i.test(responseHtml);
  const hasMetaDescription = htmlLower.includes('name="description"') || htmlLower.includes("name='description'");

  if (!hasTitle) {
    findings.push({
      code: "MISSING_TITLE",
      title: "Missing HTML Page Title Tag",
      description: "Search engines require an informative title tag to index and rank the business locally.",
      severity: "MEDIUM",
    });
  }

  if (!hasMetaDescription) {
    findings.push({
      code: "MISSING_META_DESCRIPTION",
      title: "Missing SEO Meta Description",
      description: "Missing snippet description shown in Google local search results.",
      severity: "LOW",
    });
  }

  // Server HTTP Error findings
  if (httpStatus >= 500) {
    findings.push({
      code: "SERVER_ERROR_5XX",
      title: `Server Internal Error (${httpStatus})`,
      description: "Website server returned a critical error indicating backend outage or database crash.",
      severity: "CRITICAL",
    });
  } else if (httpStatus === 404) {
    findings.push({
      code: "NOT_FOUND_404",
      title: "Page Not Found (404 Error)",
      description: "The primary website URL leads to an error page.",
      severity: "CRITICAL",
    });
  }

  // Latency & Speed score estimation
  let estimatedPerformance = 85;
  if (ttfbMs > 1500) estimatedPerformance -= 30;
  else if (ttfbMs > 800) estimatedPerformance -= 15;
  if (!isMobileResponsive) estimatedPerformance -= 25;
  if (redirectCount >= 3) estimatedPerformance -= 10;
  estimatedPerformance = Math.max(15, estimatedPerformance);

  let estimatedSeo = 80;
  if (!hasTitle) estimatedSeo -= 30;
  if (!hasMetaDescription) estimatedSeo -= 20;
  if (!isMobileResponsive) estimatedSeo -= 20;
  estimatedSeo = Math.max(10, estimatedSeo);

  return {
    targetUrl: rawUrl,
    finalUrl: currentUrl,
    httpStatus,
    dnsResolves: true,
    sslValid,
    sslExpiresAt,
    sslDaysRemaining,
    redirectCount,
    isMobileResponsive,
    hasContactForm,
    hasBookingEngine,
    hasWhatsappButton,
    hasPhoneLink,
    hasTitle,
    hasMetaDescription,
    ttfbMs,
    lighthousePerformance: estimatedPerformance,
    lighthouseAccessibility: 85,
    lighthouseSeo: estimatedSeo,
    findings,
  };
}

/**
 * Inspects the TLS certificate of a hostname using Node.js standard tls module.
 */
function inspectTlsCertificate(
  hostname: string,
  port = 443
): Promise<{ valid: boolean; expiresAt: Date; daysRemaining: number }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        rejectUnauthorized: false, // We inspect the raw cert to analyze expired/self-signed certs
      },
      () => {
        const cert = socket.getPeerCertificate();
        if (!cert || !cert.valid_to) {
          socket.destroy();
          return reject(new Error("No certificate presented"));
        }

        const expiresAt = new Date(cert.valid_to);
        const daysRemaining = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const isAuthorized = socket.authorized;

        socket.destroy();
        resolve({
          valid: isAuthorized && daysRemaining > 0,
          expiresAt,
          daysRemaining,
        });
      }
    );

    socket.setTimeout(8000, () => {
      socket.destroy();
      reject(new Error("TLS connection timed out"));
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}
