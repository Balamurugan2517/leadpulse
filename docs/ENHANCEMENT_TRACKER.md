# LeadPulse AI - Enhancement Tracker

**Last Updated:** 2026-11-21  
**Tracking File for Feature Requests & Enhancements**

---

## 1. Enhancement Register

| ID | Module / URL | Description | Priority | Status |
|---|---|---|---|---|
| **ENH-001** | `/dashboard/settings` | Neon DB connection verification & live health check with ping test | **High** | ✅ **COMPLETED** |
| **ENH-002** | `/dashboard/discovery` | Strict industry + location filtering, scan progress bar with timer, lead quantity limit selector (10 to 1000) | **High** | ✅ **COMPLETED** |
| **ENH-003** | `/dashboard/audit-lab` | Save audits to Recent Diagnostics history + formatted CSV export button | **Medium** | ✅ **COMPLETED** |
| **ENH-004** | `/dashboard/leads/[id]` | Direct Google Maps navigation link & geolocation preview in Lead Details | **Medium** | ✅ **COMPLETED** |
| **ENH-005** | `/dashboard/discovery` | Enhanced contact intelligence (accurate business name, phone, email, locality, website) | **High** | ✅ **COMPLETED** |
| **ENH-006** | `/dashboard/discovery` | Rename to "Target Location" with PAN-India cascading selectors (State -> District/City -> Locality) | **High** | ✅ **COMPLETED** |
| **ENH-007** | Public Website (`/`, `/privacy`, `/terms`) | Complete legally compliant Privacy Policy and Terms of Service public pages | **Low** | ✅ **COMPLETED** |

---

## 2. Detailed Implementation Notes

### ENH-001: Neon DB Connection Verification & Live Health Check
- **Files:** `packages/infrastructure/src/db/client.ts`, `apps/web/src/app/actions/settings-actions.ts`, `apps/web/src/app/dashboard/settings/neon-status-card.tsx`, `apps/web/src/app/dashboard/settings/page.tsx`
- **Capabilities:**
  - Added `checkDatabaseHealth()` executing `SELECT 1, current_database(), version()` via serverless connection pooler.
  - Interactive "Test Connection Now" button with live roundtrip ping latency (ms), engine version, database name, and host display.
  - Clear diagnosis feedback banner with troubleshooting advice when `DATABASE_URL` is missing or unreachable.

### ENH-002: Strict Filter, Discovery Progress Bar & Limit Selector
- **Files:** `packages/infrastructure/src/connectors/osm-connector.ts`, `apps/web/src/app/dashboard/discovery/discovery-search-form.tsx`
- **Capabilities:**
  - Lead limit dropdown added: `10`, `25`, `50`, `100`, `250`, `500`, `1000` leads.
  - Strict filtering ensures only businesses matching the chosen category (Clinics, Education, Restaurants, CA/Professionals, Services/Spas) and chosen location are generated and listed.
  - Animated 4-phase execution progress bar showing active scanning stage (ODbL Overpass query, bounding box resolution, contact extraction, demand scoring) and remaining countdown time in seconds.

### ENH-003: Website Audit Lab History & Formatted CSV Export
- **Files:** `apps/web/src/app/actions/audit-actions.ts`, `apps/web/src/app/dashboard/audit-lab/download-csv-button.tsx`, `apps/web/src/app/dashboard/audit-lab/page.tsx`
- **Capabilities:**
  - When "Run Technical Audit" is performed, audit diagnostics are automatically saved to the session audit register and prepended to "Recent Website Diagnostics".
  - Added "Download CSV Report" button exporting full audit telemetry (Target URL, HTTP Status, SSL Valid, SSL Expiry, Mobile Responsive, Performance, SEO, Accessibility, Contact Form, WhatsApp CTA, and Detected Deficiencies) with CSV formula-injection defense.

### ENH-004: Lead Geolocation & Direct Google Maps Navigation
- **Files:** `apps/web/src/app/dashboard/leads/[id]/page.tsx`
- **Capabilities:**
  - Added "Locate on Google Maps" button in Lead Details header.
  - Added a dedicated "Physical Address & Geolocation" preview card with deep links to Google Maps using latitude/longitude coordinates or structured address query.

### ENH-005: High-Accuracy Contact Extraction & Formatting
- **Files:** `packages/infrastructure/src/connectors/osm-connector.ts`, `packages/infrastructure/src/connectors/google-places-connector.ts`, `apps/web/src/app/dashboard/discovery/page.tsx`
- **Capabilities:**
  - Phone numbers automatically cleaned and formatted into Indian standard 10-digit mobile format (`+91 XXXXX XXXXX`).
  - Extracted email addresses, physical address lines, websites, and exact locality/city labels rendered in Discovery prospect cards.

### ENH-006: PAN-India Cascading Location Selectors
- **Files:** `packages/domain/src/location-hierarchy.ts`, `packages/domain/src/index.ts`, `apps/web/src/app/dashboard/discovery/discovery-search-form.tsx`, `apps/web/src/app/dashboard/discovery/page.tsx`
- **Capabilities:**
  - Renamed "Target Location in Chennai" to "Target Location".
  - Cascading 3-level selector: State/UT (Tamil Nadu, Karnataka, Maharashtra, Telangana, Delhi NCR, etc.) -> District/City (Chennai, Coimbatore, Madurai, Trichy, Salem, Bangalore, Mysore, Mumbai, Pune, Hyderabad, Delhi) -> Locality/Area (e.g. Villivakkam, Anna Nagar, Adyar, RS Puram, Thillai Nagar, Koramangala, Bandra, Banjara Hills).
  - Exact bounding boxes and spatial coordinates automatically resolved for each selected area.

### ENH-007: Legally Compliant Privacy & Terms Public Pages
- **Files:** `apps/web/src/app/privacy/page.tsx`, `apps/web/src/app/terms/page.tsx`
- **Capabilities:**
  - Created `/privacy` policy page compliant with DPDPA 2023, explaining public open data sourcing, zero headless scraping, human-in-the-loop guarantee, and permanent suppression rights.
  - Created `/terms` of service page governing acceptable platform use and commercial terms.
