import {
  Business,
  WebsiteAudit,
  LeadScore,
  DemandTier,
  ServiceRecommendation,
} from "@leadpulse/contracts";

export interface ScoreCalculationInput {
  business: Business;
  audit?: WebsiteAudit | null;
  intentSignals?: string[];
  observedThemes?: string[];
}

export function calculateLeadDemandScore(input: ScoreCalculationInput): LeadScore {
  const { business, audit, intentSignals = [], observedThemes = [] } = input;
  const reasons: string[] = [];
  const recommendedServices: ServiceRecommendation[] = [];

  // --- 1. NeedFit Score (0-100) ---
  let needFit = 0;
  const hasWebsite = Boolean(business.sourceUrl || (audit && audit.targetUrl));

  const hasNoWebsiteFinding = Array.isArray(audit?.rawFindings) && audit.rawFindings.some((f) => f.code === "NO_WEBSITE");

  if (!hasWebsite || hasNoWebsiteFinding) {
    needFit += 70; // High urgent need: no official digital presence
    reasons.push("No official business website detected");
    recommendedServices.push("WEBSITE_DEVELOPMENT");
  } else if (audit) {
    // Broken SSL or 5xx/4xx
    if (audit.sslValid === false || (audit.httpStatus && audit.httpStatus >= 400)) {
      needFit += 65; // Critical defect
      reasons.push(
        audit.sslValid === false
          ? "Expired or invalid SSL certificate warning"
          : `HTTP error status ${audit.httpStatus}`
      );
      recommendedServices.push("WEBSITE_REPAIR");
    }

    // Mobile Responsiveness & Speed
    if (audit.isMobileResponsive === false) {
      needFit += 25;
      reasons.push("Website layout is not responsive on mobile screens");
      recommendedServices.push("WEBSITE_REDESIGN");
    }

    if (audit.lighthousePerformance !== null && audit.lighthousePerformance !== undefined) {
      if (audit.lighthousePerformance < 45) {
        needFit += 20;
        reasons.push(`Low mobile performance score (${audit.lighthousePerformance}/100)`);
        recommendedServices.push("PERFORMANCE_OPTIMIZATION");
      }
    }

    // Missing Contact / Booking
    if (audit.hasContactForm === false && audit.hasWhatsappButton === false) {
      needFit += 15;
      reasons.push("Missing direct conversion path (no contact form or WhatsApp button)");
      recommendedServices.push("ONLINE_BOOKING_SYSTEM");
    }

    // SEO Basics
    if (audit.lighthouseSeo !== null && audit.lighthouseSeo !== undefined && audit.lighthouseSeo < 50) {
      needFit += 10;
      reasons.push("Low local SEO foundations score");
      recommendedServices.push("LOCAL_SEO_FOUNDATIONS");
    }
  }

  needFit = Math.min(100, needFit);

  // --- 2. Intent Score (0-100) ---
  let intent = 0;
  const highIntentKeywords = [
    "need website",
    "looking for web developer",
    "website redesign",
    "need booking system",
    "hiring web designer",
    "rfp",
    "tender",
    "developer required",
  ];

  const matchedKeywords = intentSignals.filter((signal) =>
    highIntentKeywords.some((keyword) => signal.toLowerCase().includes(keyword))
  );

  if (matchedKeywords.length > 0) {
    intent = 90;
    reasons.push(`Explicit buying intent detected: "${matchedKeywords[0]}"`);
  } else if (
    intentSignals.some(
      (s) => s.toLowerCase().includes("new branch") || s.toLowerCase().includes("grand opening")
    )
  ) {
    intent = 65;
    reasons.push("Business expansion / new location launch detected");
  } else if (needFit >= 35) {
    intent = 40; // Latent need
  } else {
    intent = 10;
  }

  // --- 3. Business Fit Score (0-100) ---
  let businessFit = 75; // Default for local SMEs
  const primeCategories = [
    "clinic",
    "dental",
    "doctor",
    "hospital",
    "coaching",
    "tuition",
    "school",
    "restaurant",
    "cafe",
    "accountant",
    "legal",
    "real estate",
    "contractor",
  ];

  const catLower = (business.category || "").toLowerCase();
  if (primeCategories.some((prime) => catLower.includes(prime))) {
    businessFit = 95;
    reasons.push(`High-margin target SME sector (${business.category})`);
  }

  // --- 4. Reachability Score (0-100) ---
  let reachability = 0;
  if (business.whatsappNumber || business.phone) {
    reachability += 50;
    reasons.push("Verified phone/WhatsApp contact available");
  }
  if (business.email) {
    reachability += 30;
  }
  if (business.addressLine1 || (business.latitude && business.longitude)) {
    reachability += 20;
  }

  // --- 5. Evidence Confidence (0-100) ---
  let confidence = 70;
  if (audit && audit.auditCompletedAt) {
    confidence = 95;
  } else if (business.sourceType === "MANUAL_ASSISTED") {
    confidence = 90;
  }

  // --- 6. Weighted Priority Score Formula ---
  // PriorityScore = 0.30*Intent + 0.25*NeedFit + 0.20*BusinessFit + 0.15*Reachability + 0.10*Confidence
  const priorityScore = Number(
    (
      0.3 * intent +
      0.25 * needFit +
      0.2 * businessFit +
      0.15 * reachability +
      0.1 * confidence
    ).toFixed(1)
  );

  // --- 7. Demand Tier Assignment ---
  let demandTier: DemandTier = "LOW_DEMAND";

  if (intent >= 75) {
    demandTier = "ACTIVELY_LOOKING"; // Tier 1: Chase in 24 hrs
  } else if (needFit >= 60 && reachability >= 50) {
    demandTier = "HIGH_DEMAND"; // Tier 2: Chase in 2-3 days
  } else if (needFit >= 35) {
    demandTier = "MEDIUM_DEMAND"; // Tier 3: Weekly batch
  } else {
    demandTier = "LOW_DEMAND"; // Tier 4: Nurture / skip
  }

  // Deduplicate recommended services
  const uniqueServices = Array.from(new Set(recommendedServices));

  return {
    businessId: business.id || "00000000-0000-0000-0000-000000000000",
    needFitScore: needFit,
    intentScore: intent,
    businessFitScore: businessFit,
    reachabilityScore: reachability,
    evidenceConfidence: confidence,
    priorityScore,
    demandTier,
    recommendedServices: uniqueServices,
    scoreReasons: reasons,
    calculatedAt: new Date(),
  };
}
