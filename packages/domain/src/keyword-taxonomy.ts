export interface KeywordRule {
  id: string;
  phrase: string;
  pack: "NO_WEBSITE" | "BROKEN_WEBSITE" | "OUTDATED_WEBSITE" | "LOW_REVIEWS" | "NEGATIVE_SENTIMENT" | "BUYING_INTENT";
  weight: number;
  serviceTarget: string;
}

export interface ServiceCatalogItem {
  code: string;
  title: string;
  typicalTrigger: string;
  deliverables: string[];
  indicativePriceInr: { min: number; max: number };
  recurringSupportOption: boolean;
  targetNiches: string[];
}

export const SEED_KEYWORD_PACKS: Record<string, string[]> = {
  NO_WEBSITE: [
    "no website",
    "no official website",
    "website not listed",
    "website unavailable",
    "only instagram",
    "only facebook",
    "whatsapp only",
    "need website development",
    "business website required",
  ],
  BROKEN_WEBSITE: [
    "broken website",
    "website not working",
    "site is down",
    "site down",
    "404 error",
    "500 internal server error",
    "502 bad gateway",
    "503 service unavailable",
    "ssl expired",
    "certificate expired",
    "security warning",
    "redirect loop",
    "broken contact form",
    "broken booking form",
  ],
  OUTDATED_WEBSITE: [
    "outdated website",
    "old website design",
    "website redesign",
    "website redesign needed",
    "not mobile friendly",
    "not responsive",
    "desktop only layout",
    "slow loading",
    "poor mobile experience",
    "no clear call to action",
    "missing contact form",
    "no booking option",
    "unsecured http",
  ],
  LOW_REVIEWS: [
    "low review count",
    "few reviews",
    "no reviews found",
    "limited local reviews",
    "low review volume",
  ],
  NEGATIVE_SENTIMENT: [
    "difficulty booking",
    "booking not working",
    "phone not answered",
    "slow response",
    "poor communication",
    "unresponsive contact form",
    "outdated pricing information",
    "menu not accessible",
  ],
  BUYING_INTENT: [
    "looking for web developer",
    "need a website",
    "website developer recommendation",
    "need website redesign",
    "website quotation required",
    "recommend a web designer",
    "need online booking system",
    "appointment booking website needed",
    "custom web application needed",
    "rfp",
    "tender",
    "project requirement",
  ],
  NEGATIVE_EXCLUSIONS: [
    "jobs for jobseekers",
    "resume",
    "internship",
    "student project",
    "free website builder",
    "wordpress tutorial",
    "learn web development",
  ],
};

export const DEFAULT_SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    code: "WEBSITE_DEVELOPMENT",
    title: "High-Conversion Business Website",
    typicalTrigger: "Business relies only on Google Maps or Instagram with NO official website.",
    deliverables: [
      "Custom responsive 5-page website (Home, Services, About, Reviews, Contact)",
      "1-Click WhatsApp appointment & enquiry buttons",
      "Local SEO foundations (Google structured data, meta tags, sitemap)",
      "Lightning-fast mobile load time (< 1.5 seconds)",
      "Domain and SSL certificate configuration",
    ],
    indicativePriceInr: { min: 25000, max: 45000 },
    recurringSupportOption: true,
    targetNiches: ["Clinics & Dentists", "Tuition Centres", "Restaurants & Cafes", "Chartered Accountants"],
  },
  {
    code: "WEBSITE_REPAIR",
    title: "Urgent Website Remediation & SSL Fix",
    typicalTrigger: "Expired SSL security certificate warning, 404 links, or 500 server errors.",
    deliverables: [
      "Full TLS/SSL certificate renewal and automated auto-renew setup",
      "Broken link, form, and database connection remediation",
      "Security header configuration (HSTS, CSP, X-Frame-Options)",
      "Verification across desktop and mobile browsers",
    ],
    indicativePriceInr: { min: 8000, max: 15000 },
    recurringSupportOption: true,
    targetNiches: ["All businesses with live broken websites"],
  },
  {
    code: "WEBSITE_REDESIGN",
    title: "Mobile Modernization & Speed Revamp",
    typicalTrigger: "Desktop-only layout, slow mobile load time (> 5s), outdated visual design.",
    deliverables: [
      "Mobile-first redesign using clean, modern UI components",
      "Performance optimization achieving 85+ mobile Lighthouse score",
      "Streamlined customer conversion paths and prominent call-to-actions",
      "Seamless content migration from old website",
    ],
    indicativePriceInr: { min: 20000, max: 40000 },
    recurringSupportOption: true,
    targetNiches: ["Established local businesses with websites older than 3 years"],
  },
  {
    code: "ONLINE_BOOKING_SYSTEM",
    title: "Direct WhatsApp & Appointment Booking Engine",
    typicalTrigger: "Manual phone booking bottlenecks, customer complaints regarding appointment scheduling.",
    deliverables: [
      "Interactive appointment scheduler with time-slot selection",
      "Instant WhatsApp confirmation and founder notification",
      "Admin dashboard to view and manage daily client slots",
      "Automated calendar synchronization",
    ],
    indicativePriceInr: { min: 15000, max: 30000 },
    recurringSupportOption: true,
    targetNiches: ["Clinics", "Salons", "Tuition Centres", "Consultants"],
  },
  {
    code: "LOCAL_SEO_FOUNDATIONS",
    title: "Local Search Visibility & Reputation Setup",
    typicalTrigger: "Missing metadata, poor ranking on local Google searches, low review count.",
    deliverables: [
      "Local business Schema.org JSON-LD structured data",
      "Title tag and meta description optimization for Chennai localities",
      "Review collection workflow (automated WhatsApp feedback link)",
      "Google Search Console registration and indexing",
    ],
    indicativePriceInr: { min: 8000, max: 18000 },
    recurringSupportOption: true,
    targetNiches: ["Local retail, professional services, healthcare"],
  },
];

/**
 * Matches an input text (e.g. review excerpt, public post, website text) against the keyword taxonomy.
 * Returns matched categories, matched keywords, and whether negative exclusion keywords were found.
 */
export function matchKeywordsInText(text: string): {
  isExcluded: boolean;
  matchedPacks: string[];
  matchedKeywords: string[];
  intentScore: number;
} {
  const normalized = text.toLowerCase();

  // 1. Check for negative exclusions
  const isExcluded = SEED_KEYWORD_PACKS.NEGATIVE_EXCLUSIONS.some((ex) =>
    normalized.includes(ex)
  );

  if (isExcluded) {
    return { isExcluded: true, matchedPacks: [], matchedKeywords: [], intentScore: 0 };
  }

  const matchedPacks = new Set<string>();
  const matchedKeywords: string[] = [];
  let intentScore = 20;

  for (const [packName, keywords] of Object.entries(SEED_KEYWORD_PACKS)) {
    if (packName === "NEGATIVE_EXCLUSIONS") continue;

    for (const kw of keywords) {
      if (normalized.includes(kw)) {
        matchedPacks.add(packName);
        matchedKeywords.push(kw);

        if (packName === "BUYING_INTENT") {
          intentScore = Math.max(intentScore, 90);
        } else if (packName === "BROKEN_WEBSITE" || packName === "NO_WEBSITE") {
          intentScore = Math.max(intentScore, 65);
        }
      }
    }
  }

  return {
    isExcluded: false,
    matchedPacks: Array.from(matchedPacks),
    matchedKeywords,
    intentScore,
  };
}
