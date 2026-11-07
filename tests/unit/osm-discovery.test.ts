import { describe, it, expect } from "vitest";
import {
  buildOverpassQuery,
  parseOverpassResponse,
  parseRssXml,
  generateBrowserBookmarkletCode,
  CHENNAI_ZONE_BBOX,
} from "@leadpulse/infrastructure";

describe("OpenStreetMap Overpass Query & Response Engine", () => {
  it("builds valid Overpass QL queries with Chennai bounding boxes", () => {
    const query = buildOverpassQuery({
      workspaceId: "test-workspace",
      category: "CLINIC",
      locality: "ADYAR",
      limit: 20,
    });

    expect(query).toContain("[out:json]");
    expect(query).toContain('["amenity"="dentist"]');
    // Adyar bbox coordinates
    expect(query).toContain("12.99,80.24,13.02,80.27");
    expect(query).toContain("out center 20;");
  });

  it("parses OSM JSON elements into canonical Business entities with phone and website", () => {
    const mockOsmJson = {
      elements: [
        {
          type: "node",
          id: 1234567,
          lat: 13.0012,
          lon: 80.2541,
          tags: {
            name: "Dr. Smiles Dental Clinic",
            amenity: "dentist",
            phone: "+91 44 2441 5566",
            website: "https://drsmileschennai.com",
            "addr:street": "L.B. Road",
            "addr:suburb": "Adyar",
            "addr:postcode": "600020",
          },
        },
        {
          type: "node",
          id: 7654321,
          lat: 13.0045,
          lon: 80.2588,
          tags: {
            name: "Mylapore Traditional Mess",
            amenity: "restaurant",
            mobile: "9840112233",
            // Notice: no website tag -> represents a "No Website" gap
            "addr:suburb": "Mylapore",
          },
        },
      ],
    };

    const businesses = parseOverpassResponse(mockOsmJson, "test-ws-id", "CLINIC", "Adyar");

    expect(businesses).toHaveLength(2);

    // Business 1
    expect(businesses[0].name).toBe("Dr. Smiles Dental Clinic");
    expect(businesses[0].category).toBe("DENTIST");
    expect(businesses[0].phone).toBe("+91 44 2441 5566");
    expect(businesses[0].sourceUrl).toBe("https://drsmileschennai.com");
    expect(businesses[0].latitude).toBe(13.0012);
    expect(businesses[0].longitude).toBe(80.2541);
    expect(businesses[0].addressLine1).toContain("L.B. Road, Adyar");

    // Business 2
    expect(businesses[1].name).toBe("Mylapore Traditional Mess");
    expect(businesses[1].category).toBe("RESTAURANT");
    expect(businesses[1].phone).toBe("9840112233");
    expect(businesses[1].sourceUrl).toBeUndefined(); // Confirmed missing website
  });
});

describe("Public RSS & Intent Feeds Connector", () => {
  it("extracts buying-intent signals and matches keywords from RSS XML", () => {
    const mockRssXml = `
      <rss version="2.0">
        <channel>
          <title>Chennai Business Requirements</title>
          <item>
            <title><![CDATA[Urgent: Need website redesign & appointment booking for dental clinic]]></title>
            <link>https://example.com/post/1</link>
            <description><![CDATA[We are looking for a web developer to build a modern booking system.]]></description>
            <pubDate>Mon, 07 Nov 2026 10:00:00 GMT</pubDate>
          </item>
          <item>
            <title>Unrelated General Notice</title>
            <link>https://example.com/post/2</link>
            <description>Holiday schedule for local businesses.</description>
          </item>
        </channel>
      </rss>
    `;

    const signals = parseRssXml(mockRssXml, "Chennai Requirements Feed");

    expect(signals).toHaveLength(1);
    expect(signals[0].title).toContain("Need website redesign");
    expect(signals[0].matchedKeywords).toContain("website redesign");
    expect(signals[0].matchedKeywords).toContain("booking system");
    expect(signals[0].intentScore).toBeGreaterThanOrEqual(90);
  });
});

describe("Browser Quick-Capture Bookmarklet Generator", () => {
  it("generates a valid javascript: URI containing window.location and Indian phone regex", () => {
    const code = generateBrowserBookmarkletCode("http://localhost:3000");

    expect(code.startsWith("javascript:")).toBe(true);
    expect(code).toContain("window.location.href");
    expect(code).toContain("%5B6-9%5D%5Cd%7B9%7D"); // URL-encoded Indian phone regex [6-9]\d{9}
    expect(code).toContain("http%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Fdiscovery%2Fquick-capture");
  });
});
