import { CreateBusinessInput } from "@leadpulse/contracts";
import { isIndependentWebsite } from "./google-places-connector";

export interface YouTubeChannelResult {
  channelId: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt?: string;
  subscriberCount?: number;
  videoCount?: number;
  viewCount?: number;
  detectedPhone?: string;
  detectedEmail?: string;
  detectedWebsite?: string;
  hasOfficialWebsite: boolean;
  opportunitySummary: string;
}

/**
 * Extracts phone numbers from text (specifically Indian 10-digit mobile numbers).
 */
export function extractPhoneFromText(text: string): string | undefined {
  if (!text) return undefined;
  // Matches +91 98401 23456, 9840123456, 09840123456
  const match = text.match(/(?:\+91[\s-]?)?[6789]\d{4}[\s-]?\d{5}/);
  if (match) {
    const digits = match[0].replace(/\D/g, "");
    if (digits.length >= 10) {
      return "+91" + digits.slice(-10);
    }
  }
  return undefined;
}

/**
 * Extracts email address from text.
 */
export function extractEmailFromText(text: string): string | undefined {
  if (!text) return undefined;
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase() : undefined;
}

/**
 * Extracts all URLs from text (including bare domains like linktr.ee/abc or wa.me/123).
 */
export function extractUrlsFromText(text: string): string[] {
  if (!text) return [];
  // Matches full URLs with protocol or www, as well as common domain patterns in bio text
  const urlRegex = /(?:(?:https?:\/\/|www\.)[^\s<>"{}|\\^`[\]]+|(?:[a-zA-Z0-9-]+\.)+(?:com|in|org|net|io|ee|link|cc|ai|co|to|me|app|dev)(?:\/[^\s<>"{}|\\^`[\]]*)?)/gi;
  const matches = text.match(urlRegex) || [];
  return matches.map((u) => {
    // Trim trailing punctuation like period or comma
    const clean = u.replace(/[.,;!]+$/, "");
    return clean.startsWith("http://") || clean.startsWith("https://") ? clean : `https://${clean}`;
  });
}

/**
 * Analyzes YouTube channel text to find websites and assess opportunity.
 */
export function analyzeYouTubeChannelBio(bio: string): {
  detectedPhone?: string;
  detectedEmail?: string;
  detectedWebsite?: string;
  hasOfficialWebsite: boolean;
  opportunitySummary: string;
} {
  const detectedPhone = extractPhoneFromText(bio);
  const detectedEmail = extractEmailFromText(bio);
  const urls = extractUrlsFromText(bio);

  const officialWebsite = urls.find((u) => isIndependentWebsite(u));
  const hasOfficialWebsite = !!officialWebsite;

  let opportunitySummary = "";
  if (!hasOfficialWebsite) {
    opportunitySummary =
      "Active YouTube presence with NO standalone website. Content creator losing inbound lead conversion. Prime candidate for lead capture & booking site.";
  } else {
    opportunitySummary = `YouTube channel references website (${officialWebsite}). Candidate for speed and modern CTA audit.`;
  }

  return {
    detectedPhone,
    detectedEmail,
    detectedWebsite: officialWebsite || urls[0],
    hasOfficialWebsite,
    opportunitySummary,
  };
}

/**
 * Realistic Chennai YouTube business channels for mock / offline mode
 */
const MOCK_CHENNAI_YOUTUBE_CHANNELS: YouTubeChannelResult[] = [
  {
    channelId: "UC_chennai_maths_academy",
    title: "Chennai Board & NEET Maths Academy",
    description:
      "Official channel of Chennai Board & NEET Maths Academy. Daily lessons for 10th, 11th & 12th state board & CBSE. For admissions and course inquiries, WhatsApp us at +91 98409 87654 or email admissions@chennaimathsacademy.in. Follow our Instagram @chennaimaths.",
    customUrl: "@chennaimathsacademy",
    subscriberCount: 14200,
    videoCount: 185,
    viewCount: 450000,
    detectedPhone: "+919840987654",
    detectedEmail: "admissions@chennaimathsacademy.in",
    detectedWebsite: undefined,
    hasOfficialWebsite: false,
    opportunitySummary:
      "14.2k subscribers and 185 videos with NO official website. Loses course admissions to manual WhatsApp chats. Needs automated student enrolment portal.",
  },
  {
    channelId: "UC_madras_smile_ortho",
    title: "Madras Smile Dental & Orthodontics",
    description:
      "Dr. K. Swaminathan (MDS) explaining dental implants, braces, and clear aligners in Tamil. Clinic located at Mylapore, Chennai. Call for consultation: 9884123456.",
    customUrl: "@madrassmiledental",
    subscriberCount: 5600,
    videoCount: 42,
    viewCount: 120000,
    detectedPhone: "+919884123456",
    detectedEmail: undefined,
    detectedWebsite: undefined,
    hasOfficialWebsite: false,
    opportunitySummary:
      "42 educational patient videos with NO website or booking calendar. High patient trust, prime lead for appointment scheduler.",
  },
  {
    channelId: "UC_t_nagar_sarees_studio",
    title: "Kanchipuram Silk Vault - T. Nagar",
    description:
      "Direct weaver silk sarees from Kanchipuram. Visit our retail showroom in T. Nagar Chennai. Browse our online catalogue at https://silkvault.in or WhatsApp 9444155555.",
    customUrl: "@silkvaultchennai",
    subscriberCount: 28000,
    videoCount: 310,
    viewCount: 980000,
    detectedPhone: "+919444155555",
    detectedEmail: undefined,
    detectedWebsite: "https://silkvault.in",
    hasOfficialWebsite: true,
    opportunitySummary:
      "E-commerce presence with high YouTube subscriber base. Needs mobile checkout speed audit and automated WhatsApp order tracking.",
  },
];

/**
 * Searches YouTube channels for business leads.
 */
export async function searchYouTubeChannels(params: {
  query: string;
  maxResults?: number;
  apiKey?: string;
}): Promise<YouTubeChannelResult[]> {
  const { query, maxResults = 10, apiKey } = params;

  // Mock / offline fallback
  if (!apiKey || apiKey === "MOCK" || apiKey.trim() === "") {
    const normalized = query.toLowerCase();
    const filtered = MOCK_CHENNAI_YOUTUBE_CHANNELS.filter(
      (c) =>
        c.title.toLowerCase().includes(normalized) ||
        c.description.toLowerCase().includes(normalized) ||
        normalized.includes("chennai")
    );
    return filtered.length > 0 ? filtered : MOCK_CHENNAI_YOUTUBE_CHANNELS.slice(0, maxResults);
  }

  try {
    // 1. Call YouTube search endpoint
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(searchUrl);
    if (!res.ok) {
      throw new Error(`YouTube API returned status ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data.items)) {
      return [];
    }

    const channelIds = data.items.map((i: any) => i.id?.channelId).filter(Boolean);
    if (channelIds.length === 0) return [];

    // 2. Fetch channel statistics and details
    const detailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds.join(
      ","
    )}&key=${encodeURIComponent(apiKey)}`;

    const detailsRes = await fetch(detailsUrl);
    if (!detailsRes.ok) {
      throw new Error(`YouTube Channel details returned status ${detailsRes.status}`);
    }

    const detailsData = await detailsRes.json();
    const items = detailsData.items || [];

    return items.map((item: any): YouTubeChannelResult => {
      const bioAnalysis = analyzeYouTubeChannelBio(item.snippet?.description || "");
      return {
        channelId: item.id,
        title: item.snippet?.title || "Untitled Channel",
        description: item.snippet?.description || "",
        customUrl: item.snippet?.customUrl,
        publishedAt: item.snippet?.publishedAt,
        subscriberCount: parseInt(item.statistics?.subscriberCount || "0", 10),
        videoCount: parseInt(item.statistics?.videoCount || "0", 10),
        viewCount: parseInt(item.statistics?.viewCount || "0", 10),
        detectedPhone: bioAnalysis.detectedPhone,
        detectedEmail: bioAnalysis.detectedEmail,
        detectedWebsite: bioAnalysis.detectedWebsite,
        hasOfficialWebsite: bioAnalysis.hasOfficialWebsite,
        opportunitySummary: bioAnalysis.opportunitySummary,
      };
    });
  } catch (error) {
    console.error("Failed to query YouTube API:", error);
    return [];
  }
}

/**
 * Transforms YouTubeChannelResult into CreateBusinessInput for the CRM.
 */
export function convertYouTubeChannelToLead(
  channel: YouTubeChannelResult,
  workspaceId: string
): CreateBusinessInput {
  return {
    workspaceId,
    name: channel.title,
    category: "CREATOR / LOCAL EDUCATOR",
    phone: channel.detectedPhone,
    whatsappNumber: channel.detectedPhone,
    email: channel.detectedEmail,
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    sourceType: "YOUTUBE",
    sourceUrl: `https://www.youtube.com/channel/${channel.channelId}`,
    sourceRetrievedAt: new Date(),
    verificationStatus: "VERIFIED",
    description: `${channel.opportunitySummary} (${channel.videoCount || 0} videos, ${channel.subscriberCount || 0} subscribers)`,
    assets: [
      {
        assetType: "YOUTUBE",
        url: `https://www.youtube.com/channel/${channel.channelId}`,
        status: "ACTIVE",
        isPrimary: !channel.hasOfficialWebsite,
      },
      ...(channel.detectedWebsite && channel.hasOfficialWebsite
        ? [
            {
              assetType: "WEBSITE" as const,
              url: channel.detectedWebsite,
              status: "ACTIVE" as const,
              isPrimary: true,
            },
          ]
        : []),
    ],
  };
}
