import { CreateBusinessInput, SourceType } from "@leadpulse/contracts";
import { isIndependentWebsite } from "./google-places-connector";
import { extractPhoneFromText, extractEmailFromText, extractUrlsFromText } from "./youtube-connector";

export interface SocialProfileAnalysis {
  platform: "META_INSTA" | "META_FB" | "LINKEDIN";
  profileUrl: string;
  handle: string;
  bioText: string;
  detectedPhone?: string;
  detectedEmail?: string;
  detectedLinks: string[];
  linkType: "STANDALONE_WEBSITE" | "AGGREGATOR_LINK" | "WHATSAPP_LINK" | "NO_LINK";
  primaryWebsite?: string;
  opportunityDiagnosis: string;
  recommendedServiceCode: string;
}

const AGGREGATOR_DOMAINS = [
  "linktr.ee",
  "bio.link",
  "instabio.cc",
  "beacons.ai",
  "campsite.bio",
  "taplink.cc",
  "solo.to",
  "carrd.co",
];

const WHATSAPP_LINK_DOMAINS = ["wa.me", "api.whatsapp.com", "chat.whatsapp.com"];

/**
 * Detects whether a URL belongs to a multi-link aggregator (e.g. linktr.ee).
 */
export function isLinkAggregator(url: string): boolean {
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
    return AGGREGATOR_DOMAINS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

/**
 * Detects whether a URL is a direct WhatsApp link.
 */
export function isWhatsAppLink(url: string): boolean {
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
    return WHATSAPP_LINK_DOMAINS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

/**
 * Extracts social platform and handle from a URL.
 */
export function parseSocialProfileUrl(url: string): {
  platform: "META_INSTA" | "META_FB" | "LINKEDIN";
  handle: string;
} {
  const normalized = url.toLowerCase();
  let platform: "META_INSTA" | "META_FB" | "LINKEDIN" = "META_INSTA";

  if (normalized.includes("linkedin.com")) {
    platform = "LINKEDIN";
  } else if (normalized.includes("facebook.com") || normalized.includes("fb.com")) {
    platform = "META_FB";
  } else {
    platform = "META_INSTA";
  }

  // Extract handle from URL path
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const segments = parsed.pathname.split("/").filter(Boolean);
    let handle = segments[segments.length - 1] || "unknown";
    if (handle.startsWith("@")) handle = handle.slice(1);
    return { platform, handle: `@${handle}` };
  } catch {
    return { platform, handle: "@business" };
  }
}

/**
 * Analyzes a social profile (e.g. pasted Instagram bio or bookmarklet capture)
 * to uncover contact data and evaluate digital presence gaps.
 */
export function analyzeSocialProfile(params: {
  profileUrl: string;
  bioText: string;
  explicitName?: string;
}): SocialProfileAnalysis {
  const { profileUrl, bioText, explicitName } = params;
  const { platform, handle } = parseSocialProfileUrl(profileUrl);

  const detectedPhone = extractPhoneFromText(bioText);
  const detectedEmail = extractEmailFromText(bioText);
  const detectedLinks = extractUrlsFromText(bioText);

  let linkType: SocialProfileAnalysis["linkType"] = "NO_LINK";
  let primaryWebsite: string | undefined = undefined;
  let opportunityDiagnosis = "";
  let recommendedServiceCode = "WEBSITE_DEVELOPMENT";

  const firstLink = detectedLinks[0];

  if (firstLink) {
    if (isLinkAggregator(firstLink)) {
      linkType = "AGGREGATOR_LINK";
      primaryWebsite = firstLink;
      opportunityDiagnosis =
        "Relies on a generic link aggregator (e.g. Linktree) without an official website. Loses brand authority and SEO ranking. High-converting branded micro-site recommended.";
      recommendedServiceCode = "WEBSITE_DEVELOPMENT";
    } else if (isWhatsAppLink(firstLink)) {
      linkType = "WHATSAPP_LINK";
      primaryWebsite = firstLink;
      opportunityDiagnosis =
        "Directs traffic directly to unautomated WhatsApp chat. Founders get overwhelmed with manual FAQs. Automated booking & product catalogue needed.";
      recommendedServiceCode = "ONLINE_BOOKING_SYSTEM";
    } else if (isIndependentWebsite(firstLink)) {
      linkType = "STANDALONE_WEBSITE";
      primaryWebsite = firstLink;
      opportunityDiagnosis =
        "Has an active website linked in bio. Candidate for speed diagnostics and mobile conversion audit.";
      recommendedServiceCode = "WEBSITE_REDESIGN";
    } else {
      linkType = "AGGREGATOR_LINK";
      primaryWebsite = firstLink;
      opportunityDiagnosis =
        "Links to secondary social channel. Needs an independent business website.";
      recommendedServiceCode = "WEBSITE_DEVELOPMENT";
    }
  } else {
    linkType = "NO_LINK";
    opportunityDiagnosis =
      "No link listed in bio. The business operates entirely inside social media walled gardens with zero owned digital web assets.";
    recommendedServiceCode = "WEBSITE_DEVELOPMENT";
  }

  return {
    platform,
    profileUrl,
    handle,
    bioText,
    detectedPhone,
    detectedEmail,
    detectedLinks,
    linkType,
    primaryWebsite,
    opportunityDiagnosis,
    recommendedServiceCode,
  };
}

/**
 * Transforms SocialProfileAnalysis into CreateBusinessInput for the CRM.
 */
export function convertSocialProfileToLead(
  analysis: SocialProfileAnalysis,
  workspaceId: string,
  businessName?: string
): CreateBusinessInput {
  const name = businessName || analysis.handle.replace(/^@/, "").replace(/[._-]/g, " ").toUpperCase();
  const assetTypeMap: Record<string, "INSTAGRAM" | "FACEBOOK" | "LINKEDIN"> = {
    META_INSTA: "INSTAGRAM",
    META_FB: "FACEBOOK",
    LINKEDIN: "LINKEDIN",
  };

  return {
    workspaceId,
    name,
    category: "SOCIAL COMMERCE / PROFESSIONAL",
    phone: analysis.detectedPhone,
    whatsappNumber: analysis.detectedPhone,
    email: analysis.detectedEmail,
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    sourceType: analysis.platform as SourceType,
    sourceUrl: analysis.profileUrl,
    sourceRetrievedAt: new Date(),
    verificationStatus: "VERIFIED",
    description: analysis.opportunityDiagnosis,
    assets: [
      {
        assetType: assetTypeMap[analysis.platform] || "INSTAGRAM",
        url: analysis.profileUrl,
        status: "ACTIVE",
        isPrimary: analysis.linkType !== "STANDALONE_WEBSITE",
      },
      ...(analysis.primaryWebsite && analysis.linkType === "STANDALONE_WEBSITE"
        ? [
            {
              assetType: "WEBSITE" as const,
              url: analysis.primaryWebsite,
              status: "ACTIVE" as const,
              isPrimary: true,
            },
          ]
        : []),
    ],
  };
}
