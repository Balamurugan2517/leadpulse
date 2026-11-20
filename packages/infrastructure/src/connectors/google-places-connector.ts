import { CreateBusinessInput } from "@leadpulse/contracts";

export interface GooglePlaceResult {
  placeId: string;
  name: string;
  formattedAddress?: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  latitude?: number;
  longitude?: number;
  types?: string[];
  hasOfficialWebsite: boolean;
  opportunitySummary?: string;
}

export interface GooglePlacesCacheEntry {
  placeId: string;
  data: GooglePlaceResult;
  cachedAt: number; // Unix timestamp
  expiresAt: number; // Google allows up to 30 days caching for non-Place-ID data
}

// In-memory compliant cache storage (can be backed by DB or Redis)
const placesCache = new Map<string, GooglePlacesCacheEntry>();
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Normalizes phone number into Indian standard 10-digit or E.164.
 */
function cleanPhoneNumber(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    return "+91" + digits.slice(-10);
  }
  return phone;
}

/**
 * Checks if a given website URL is an actual independent website
 * or merely a social link (e.g. instagram, facebook, justdial, etc.)
 */
export function isIndependentWebsite(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = parsed.hostname.toLowerCase();
    const socialDomains = [
      "facebook.com",
      "fb.com",
      "instagram.com",
      "instagr.am",
      "twitter.com",
      "x.com",
      "linkedin.com",
      "justdial.com",
      "indiamart.com",
      "sulekha.com",
      "youtube.com",
      "linktr.ee",
      "bio.link",
    ];
    return !socialDomains.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}

/**
 * Sample realistic Chennai business results for fallback / offline testing
 */
const MOCK_CHENNAI_PLACES: GooglePlaceResult[] = [
  {
    placeId: "ChIJ_38Qv_pkUjoR4M6_w1pLw9M",
    name: "Dr. Arvind Dental Care & Implant Center",
    formattedAddress: "42, 2nd Main Rd, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020",
    phone: "+91 98401 23456",
    website: undefined, // NO WEBSITE! Prime prospect
    rating: 4.8,
    userRatingsTotal: 124,
    latitude: 13.0067,
    longitude: 80.2575,
    types: ["dentist", "health"],
    hasOfficialWebsite: false,
    opportunitySummary: "High review volume (124 reviews, 4.8★) with NO official website. Needs appointment booking portal.",
  },
  {
    placeId: "ChIJ7wJjJdpkUjoR9K6kX_zB4gA",
    name: "Sri Krishna Tuition Academy",
    formattedAddress: "15, 3rd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040",
    phone: "+91 94440 98765",
    website: "https://www.facebook.com/srikrishnatuition", // Only Facebook!
    rating: 4.2,
    userRatingsTotal: 38,
    latitude: 13.085,
    longitude: 80.21,
    types: ["school", "tutoring"],
    hasOfficialWebsite: false,
    opportunitySummary: "Relies only on Facebook page. Needs dedicated course showcase & student enquiry portal.",
  },
  {
    placeId: "ChIJ54V9_VVkUjoR_00d922M2kA",
    name: "Velachery Artisanal Bakery & Cafe",
    formattedAddress: "88, 100 Feet Bypass Rd, Velachery, Chennai, Tamil Nadu 600042",
    phone: "+91 98842 11223",
    website: "http://velacherybakery.in",
    rating: 3.9,
    userRatingsTotal: 86,
    latitude: 12.9815,
    longitude: 80.218,
    types: ["bakery", "cafe", "restaurant"],
    hasOfficialWebsite: true,
    opportunitySummary: "Unsecured HTTP website. Low mobile rating. Needs modern mobile menu & WhatsApp order integration.",
  },
];

/**
 * Fetches Google Places details with compliance caching (max 30 days cache for details).
 */
export async function getGooglePlaceDetails(
  placeId: string,
  apiKey?: string
): Promise<GooglePlaceResult | null> {
  // 1. Check cache first
  const cached = placesCache.get(placeId);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  // 2. If no API key or MOCK, return mock if matches, or generate structured result
  if (!apiKey || apiKey === "MOCK" || apiKey.trim() === "") {
    const mockMatch = MOCK_CHENNAI_PLACES.find((p) => p.placeId === placeId);
    if (mockMatch) {
      placesCache.set(placeId, {
        placeId,
        data: mockMatch,
        cachedAt: Date.now(),
        expiresAt: Date.now() + THIRTY_DAYS_MS,
      });
      return mockMatch;
    }
    return null;
  }

  // 3. Make live Google Places Details API call
  try {
    const fields = "place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,geometry,types";
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=${fields}&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google Places API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.status !== "OK" || !data.result) {
      return null;
    }

    const r = data.result;
    const hasWebsite = isIndependentWebsite(r.website);
    const normalizedPhone = cleanPhoneNumber(r.formatted_phone_number || r.international_phone_number);

    const result: GooglePlaceResult = {
      placeId: r.place_id,
      name: r.name,
      formattedAddress: r.formatted_address,
      phone: normalizedPhone,
      website: r.website,
      rating: r.rating,
      userRatingsTotal: r.user_ratings_total,
      latitude: r.geometry?.location?.lat,
      longitude: r.geometry?.location?.lng,
      types: r.types,
      hasOfficialWebsite: hasWebsite,
      opportunitySummary: !hasWebsite
        ? "Business does not have an independent website. Prime candidate for website development."
        : "Business has website, candidates for speed and SEO audit.",
    };

    // Cache the result for up to 30 days
    placesCache.set(placeId, {
      placeId,
      data: result,
      cachedAt: Date.now(),
      expiresAt: Date.now() + THIRTY_DAYS_MS,
    });

    return result;
  } catch (error) {
    console.error("Failed to fetch Google Place details:", error);
    return null;
  }
}

/**
 * Searches Google Places by text query (e.g. "clinics in Anna Nagar Chennai").
 */
export async function searchGooglePlaces(params: {
  query: string;
  location?: { lat: number; lng: number };
  radiusMeters?: number;
  apiKey?: string;
}): Promise<GooglePlaceResult[]> {
  const { query, location, radiusMeters = 5000, apiKey } = params;

  // If no API key or MOCK, return mock matches filtered by query
  if (!apiKey || apiKey === "MOCK" || apiKey.trim() === "") {
    const normalized = query.toLowerCase();
    const matches = MOCK_CHENNAI_PLACES.filter((p) => {
      return (
        p.name.toLowerCase().includes(normalized) ||
        p.formattedAddress?.toLowerCase().includes(normalized) ||
        p.types?.some((t) => t.toLowerCase().includes(normalized)) ||
        normalized.includes("chennai")
      );
    });
    return matches.length > 0 ? matches : MOCK_CHENNAI_PLACES;
  }

  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${encodeURIComponent(apiKey)}`;

    if (location) {
      url += `&location=${location.lat},${location.lng}&radius=${radiusMeters}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google Places search returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.status !== "OK" || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((r: any): GooglePlaceResult => {
      const hasWebsite = isIndependentWebsite(r.website);
      return {
        placeId: r.place_id,
        name: r.name,
        formattedAddress: r.formatted_address,
        rating: r.rating,
        userRatingsTotal: r.user_ratings_total,
        latitude: r.geometry?.location?.lat,
        longitude: r.geometry?.location?.lng,
        types: r.types,
        hasOfficialWebsite: hasWebsite,
        opportunitySummary: !hasWebsite
          ? "Discovered via Google Places with no official website"
          : "Discovered via Google Places with existing website",
      };
    });
  } catch (error) {
    console.error("Failed to search Google Places:", error);
    return [];
  }
}

/**
 * Transforms a GooglePlaceResult into a CreateBusinessInput for the CRM repository.
 */
export function convertGooglePlaceToLead(
  place: GooglePlaceResult,
  workspaceId: string
): CreateBusinessInput {
  const category = (place.types && place.types[0]) ? place.types[0].replace(/_/g, " ").toUpperCase() : "LOCAL BUSINESS";
  
  return {
    workspaceId,
    name: place.name,
    category,
    phone: place.phone,
    whatsappNumber: place.phone,
    addressLine1: place.formattedAddress,
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    latitude: place.latitude,
    longitude: place.longitude,
    googlePlaceId: place.placeId,
    sourceType: "GOOGLE_PLACES",
    sourceUrl: `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
    sourceRetrievedAt: new Date(),
    verificationStatus: "VERIFIED",
    description: place.opportunitySummary,
    assets: place.website
      ? [
          {
            assetType: "WEBSITE",
            url: place.website,
            status: "ACTIVE",
            isPrimary: true,
          },
        ]
      : [],
  };
}
