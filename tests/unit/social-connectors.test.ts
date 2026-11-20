import { describe, it, expect } from "vitest";
import {
  isIndependentWebsite,
  searchGooglePlaces,
  getGooglePlaceDetails,
  convertGooglePlaceToLead,
} from "../../packages/infrastructure/src/connectors/google-places-connector";
import {
  extractPhoneFromText,
  extractEmailFromText,
  extractUrlsFromText,
  analyzeYouTubeChannelBio,
  searchYouTubeChannels,
  convertYouTubeChannelToLead,
} from "../../packages/infrastructure/src/connectors/youtube-connector";
import {
  isLinkAggregator,
  isWhatsAppLink,
  parseSocialProfileUrl,
  analyzeSocialProfile,
  convertSocialProfileToLead,
} from "../../packages/infrastructure/src/connectors/social-connector";

const MOCK_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

describe("Phase 6: Extended Connectors & Social Ingestion", () => {
  describe("Google Places Connector & Compliance Caching", () => {
    it("distinguishes independent websites from social walled gardens and link aggregators", () => {
      expect(isIndependentWebsite("https://drswaminathandental.com")).toBe(true);
      expect(isIndependentWebsite("http://velacherybakery.in/menu")).toBe(true);
      expect(isIndependentWebsite("https://www.instagram.com/chennaibakes")).toBe(false);
      expect(isIndependentWebsite("https://facebook.com/srikrishnatuition")).toBe(false);
      expect(isIndependentWebsite("https://linktr.ee/mybusiness")).toBe(false);
      expect(isIndependentWebsite("")).toBe(false);
      expect(isIndependentWebsite(undefined)).toBe(false);
    });

    it("returns Chennai business results in free/offline fallback mode", async () => {
      const results = await searchGooglePlaces({
        query: "Dentist clinic Chennai",
      });

      expect(results.length).toBeGreaterThan(0);
      const dentalLead = results.find((r) => r.name.includes("Dental"));
      expect(dentalLead).toBeDefined();
      expect(dentalLead?.hasOfficialWebsite).toBe(false);
      expect(dentalLead?.opportunitySummary).toContain("NO official website");
    });

    it("caches Google Place details compliant with Google 30-day policy", async () => {
      const placeId = "ChIJ_38Qv_pkUjoR4M6_w1pLw9M";
      const firstLookup = await getGooglePlaceDetails(placeId);
      expect(firstLookup).not.toBeNull();
      expect(firstLookup?.name).toBe("Dr. Arvind Dental Care & Implant Center");

      // Second lookup should retrieve from cache
      const secondLookup = await getGooglePlaceDetails(placeId);
      expect(secondLookup).toEqual(firstLookup);
    });

    it("converts Google Place result into valid CRM Lead schema", () => {
      const mockPlace = {
        placeId: "ChIJ_38Qv_pkUjoR4M6_w1pLw9M",
        name: "Dr. Arvind Dental Care",
        formattedAddress: "42, 2nd Main Rd, Adyar, Chennai",
        phone: "+919840123456",
        rating: 4.8,
        userRatingsTotal: 120,
        hasOfficialWebsite: false,
      };

      const lead = convertGooglePlaceToLead(mockPlace, MOCK_WORKSPACE_ID);
      expect(lead.workspaceId).toBe(MOCK_WORKSPACE_ID);
      expect(lead.name).toBe("Dr. Arvind Dental Care");
      expect(lead.sourceType).toBe("GOOGLE_PLACES");
      expect(lead.googlePlaceId).toBe("ChIJ_38Qv_pkUjoR4M6_w1pLw9M");
      expect(lead.whatsappNumber).toBe("+919840123456");
      expect(lead.assets).toEqual([]);
    });
  });

  describe("YouTube Channel Discovery", () => {
    it("extracts phone numbers, emails, and links from YouTube channel descriptions", () => {
      const bio = "Welcome to Madras Maths Academy! Call us at +91 98409 87654 or email info@madrasmaths.com. Follow linktr.ee/madrasmaths";
      expect(extractPhoneFromText(bio)).toBe("+919840987654");
      expect(extractEmailFromText(bio)).toBe("info@madrasmaths.com");
      expect(extractUrlsFromText(bio)).toContain("https://linktr.ee/madrasmaths");
    });

    it("analyzes YouTube bio and flags channels lacking standalone websites", () => {
      const bio = "Daily tuition classes for 12th board. WhatsApp: 9840987654. No website yet!";
      const analysis = analyzeYouTubeChannelBio(bio);

      expect(analysis.hasOfficialWebsite).toBe(false);
      expect(analysis.detectedPhone).toBe("+919840987654");
      expect(analysis.opportunitySummary).toContain("NO standalone website");
    });

    it("searches YouTube channels and converts to CRM lead format", async () => {
      const channels = await searchYouTubeChannels({
        query: "Maths Academy Chennai",
      });

      expect(channels.length).toBeGreaterThan(0);
      const firstChannel = channels[0];
      expect(firstChannel.subscriberCount).toBeGreaterThan(0);

      const lead = convertYouTubeChannelToLead(firstChannel, MOCK_WORKSPACE_ID);
      expect(lead.sourceType).toBe("YOUTUBE");
      expect(lead.name).toBe(firstChannel.title);
      expect(lead.assets?.[0].assetType).toBe("YOUTUBE");
    });
  });

  describe("Social Profile Assisted Ingestion (Meta & LinkedIn)", () => {
    it("identifies link aggregators and direct WhatsApp links", () => {
      expect(isLinkAggregator("https://linktr.ee/bakingchennai")).toBe(true);
      expect(isLinkAggregator("https://bio.link/creator")).toBe(true);
      expect(isLinkAggregator("https://chennaicakes.in")).toBe(false);

      expect(isWhatsAppLink("https://wa.me/919840123456")).toBe(true);
      expect(isWhatsAppLink("https://api.whatsapp.com/send?phone=919840123456")).toBe(true);
      expect(isWhatsAppLink("https://chennaicakes.in")).toBe(false);
    });

    it("parses social handles across Instagram, Facebook, and LinkedIn", () => {
      expect(parseSocialProfileUrl("https://instagram.com/chennaicupcakes")).toEqual({
        platform: "META_INSTA",
        handle: "@chennaicupcakes",
      });
      expect(parseSocialProfileUrl("https://www.facebook.com/srikrishnatuition")).toEqual({
        platform: "META_FB",
        handle: "@srikrishnatuition",
      });
      expect(parseSocialProfileUrl("https://linkedin.com/company/chennai-consulting")).toEqual({
        platform: "LINKEDIN",
        handle: "@chennai-consulting",
      });
    });

    it("diagnoses opportunity for Instagram accounts using Linktree", () => {
      const analysis = analyzeSocialProfile({
        profileUrl: "https://instagram.com/chennaicupcakes",
        bioText: "Custom cakes in Chennai. WhatsApp 9840123456 or linktr.ee/chennaicupcakes",
      });

      expect(analysis.platform).toBe("META_INSTA");
      expect(analysis.handle).toBe("@chennaicupcakes");
      expect(analysis.linkType).toBe("AGGREGATOR_LINK");
      expect(analysis.detectedPhone).toBe("+919840123456");
      expect(analysis.opportunityDiagnosis).toContain("Linktree");
      expect(analysis.recommendedServiceCode).toBe("WEBSITE_DEVELOPMENT");
    });

    it("converts social analysis into a CRM business lead", () => {
      const analysis = analyzeSocialProfile({
        profileUrl: "https://instagram.com/chennaicupcakes",
        bioText: "Custom cakes in Chennai. WhatsApp 9840123456 or linktr.ee/chennaicupcakes",
      });

      const lead = convertSocialProfileToLead(analysis, MOCK_WORKSPACE_ID, "Chennai Cupcakes");
      expect(lead.name).toBe("Chennai Cupcakes");
      expect(lead.sourceType).toBe("META_INSTA");
      expect(lead.phone).toBe("+919840123456");
      expect(lead.assets?.[0].assetType).toBe("INSTAGRAM");
    });
  });
});
