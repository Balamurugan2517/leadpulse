# LeadPulse AI - Discovery Sources & Connector Authorization Matrix

**Date:** 7 November 2026  
**Operating Principle:** Maximum legal intelligence gathering with strict adherence to platform terms and privacy guidelines.

---

## 1. Master Connector Registry

| Source ID | Channel Name | Auth Type | Primary Data Collected | State | Compliance & Operating Method |
|---|---|---|---|---|---|
| `SRC_OSM` | OpenStreetMap / Overpass | None (User-Agent ID) | Business name, category, address, phone, website, lat/long | **AVAILABLE** | Automated Overpass queries; rate-limited to 1 req/sec; ODbL attribution rendered. |
| `SRC_MANUAL_CAPTURE` | Assisted Web Quick-Capture | Session Cookie / Webhook | Full URL, social handle, phone, email, notes, business name | **AVAILABLE** | 1-click browser bookmarklet or dashboard form; founder records public profile while browsing. |
| `SRC_CSV_IMPORT` | CSV / Spreadsheet Import | Workspace Session | Custom bulk business listings with column mapping | **AVAILABLE** | Client/server Zod validation; deduplication on domain, phone, and name. |
| `SRC_RSS_FEEDS` | Permitted RSS / Job Feeds | Feed URL / HTTP Polling | Buying signals ("need a website", "web developer RFP") | **AVAILABLE** | Polled every 6 hours with ETag caching; only public syndication feeds accessed. |
| `SRC_GOOGLE_PLACES` | Google Places API (New) | Server API Key | Place ID, phone, lat/long, rating, review count | **AVAILABLE** | Official API only. Place ID stored permanently; live data fetched per compliant display guidelines. |
| `SRC_YOUTUBE` | YouTube Data API v3 | Google Cloud API Key | Channel title, business website link, description | **NEEDS_CREDENTIALS** | Official Search API used to identify local businesses publishing videos without websites. |
| `SRC_X_SEARCH` | X API v2 (Recent Search) | Bearer Token | High-intent posts ("need website redesign Chennai") | **NEEDS_CREDENTIALS** | Official Recent Search endpoint only; strict query filters and daily budget cap. |
| `SRC_META_INSTA` | Meta Instagram Graph API | OAuth Token | Business account media, bio URL, public email/phone | **APP_REVIEW_REQUIRED** | Restricted to authorized professional accounts and approved discovery scopes. |
| `SRC_META_FB` | Meta Facebook Graph API | Page Access Token | Page public metadata, website link, phone, rating | **APP_REVIEW_REQUIRED** | Official Pages API only. No private group scraping or personal profile inspection. |
| `SRC_REDDIT` | Reddit Data API | OAuth App Credentials | Subreddit buying requests (e.g. r/chennai, r/india) | **COMMERCIAL_PERMISSION_REQ** | Disabled by default. Manual URL capture supported until written contract executed. |
| `SRC_LINKEDIN` | LinkedIn Official API | Developer OAuth | Verified company website, industry, headquarters | **MANUAL_ASSISTED** | Scraping strictly prohibited. Founder uses Assisted Quick-Capture on public company pages. |
| `SRC_TIKTOK` | TikTok Commercial API | Developer App | Merchant presence, bio link | **DISABLED_BY_POLICY** | TikTok Research API is not permitted for commercial prospecting. |

---

## 2. Business Intelligence Fields Collected

Every business lead stored in Neon DB targets the following comprehensive schema:

### 1. Identity & Contact Details
* **Business Name:** Official or trade name.
* **Category & Industry:** (e.g., Dental Clinic, Tuition Centre, Italian Restaurant, Chartered Accountant, Electrical Contractor).
* **Phone Number:** Landline or mobile contact.
* **WhatsApp Number:** Normalized E.164 phone format for 1-click messaging (`+91XXXXXXXXXX`).
* **Email Address:** Direct or public business email (`info@`, `contact@`, etc.).

### 2. Geographic & Map Location
* **Full Address Line:** Street address and landmark.
* **City / Locality:** (e.g., T. Nagar, Adyar, Velachery, Anna Nagar, Chennai).
* **Postal Code:** Area PIN code.
* **Geo-Coordinates:** Latitude & Longitude (precision $10, 7$) for spatial mapping and distance filtering.
* **Google Place ID:** Unique Google reference for 1-click Google Maps navigation.

### 3. Digital Presence & Audit Telemetry
* **Website URL:** Primary business URL (or marked as `NO_WEBSITE`).
* **Website Health Status:** `ACTIVE`, `BROKEN_4XX`, `BROKEN_5XX`, `SSL_EXPIRED`, `REDIRECT_LOOP`, `OUTDATED_MOBILE`.
* **Social Links:** Instagram, Facebook, LinkedIn, YouTube, X profile links.
* **Review Signals:**
  * Average rating (e.g., $3.4 / 5.0$)
  * Total review count (e.g., $3$ reviews vs. local industry average of $45$)
  * Negative sentiment themes (e.g., complaints regarding broken booking, slow phone response, outdated menu).

### 4. Buying Intent Flags
* Explicit request detected: `"Looking for a website developer"`, `"Need an e-commerce store"`, `"Want an appointment booking app"`.
* Timing triggers: Grand opening, new branch launch, rebranding announcement.

---

## 3. The Assisted Quick-Capture Workflow (Zero-Risk Discovery)

To empower the founder to find leads across any platform (Google Maps, Instagram, LinkedIn, Reddit, Local Directories) without risking account bans or violating scraping terms:

1. **Browser Bookmarklet / Quick Drawer:**
   The founder activates a simple JavaScript snippet on any active web tab.
2. **Auto-Extraction:**
   The tool extracts the active page's URL, page title, detected phone numbers, and meta tags.
3. **Founder Annotations:**
   The founder selects:
   - Category / Niche
   - Observed gap (e.g., "Has no website, only uses Instagram", "Website has expired SSL cert")
4. **Push to Neon DB:**
   The lead is saved directly to `businesses` with `source_type = 'MANUAL_ASSISTED'` and immediate trigger for the website audit queue.
