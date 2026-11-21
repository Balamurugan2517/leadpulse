# LeadPulse AI - Defect & Issue Tracker

**Last Updated:** 2026-11-20  
**Status:** All 5 Reported Issues Fixed and Verified  

---

## 1. Issue Summary Register

| Issue ID | Affected URL / Component | Severity | Root Cause | Status |
|---|---|---|---|---|
| **ISS-001** | `/dashboard/outreach` | **High (Crash)** | `Cannot read properties of undefined (reading 'some')` in `scoring-calculator.ts:25`. Evaluated `audit?.rawFindings.some(...)` when `rawFindings` was undefined. | ✅ **RESOLVED** |
| **ISS-002** | `/dashboard/settings` | **Medium (404)** | Missing route handler for `/dashboard/settings`. | ✅ **RESOLVED** |
| **ISS-003** | `/dashboard/discovery` | **High (Crash)** | `Event handlers cannot be passed to Client Component props`. Passing inline `onClick` to `<a href=...>` inside Server Component. | ✅ **RESOLVED** |
| **ISS-004** | Homepage `/` (Free Audit Form) | **Medium (Functional)** | Free audit input form lacked `action="/dashboard/audit-lab"`, input `name="url"`, and submit button trigger. | ✅ **RESOLVED** |
| **ISS-005** | Prototype Previews (`/preview/[slug]`) | **Medium (UX/Product)** | All business prototypes used identical blue theme and generic services regardless of industry niche. | ✅ **RESOLVED** |
| **ISS-006** | Database Migration (`npm run db:push`) | **High (Config)** | `drizzle-kit push` looked for default `drizzle.config.json` instead of `drizzle.config.ts`. | ✅ **RESOLVED** |
| **ISS-007** | `/dashboard/outreach` (Live Prototypes) | **High (Vercel)** | Prototype links hardcoded to `localhost:3000` instead of dynamic production app URL. | ✅ **RESOLVED** |
| **ISS-008** | `/dashboard/discovery` (Social Connectors) | **High (Discovery)** | Social search connectors yielded empty results for local queries (e.g., "spa in villivakkam"). | ✅ **RESOLVED** |

---

## 2. Detailed Defect & Resolution Logs

### ISS-001: Runtime TypeError on `/dashboard/outreach`
* **Symptom:**
  ```text
  Runtime TypeError: Cannot read properties of undefined (reading 'some')
  at calculateLeadDemandScore (packages/domain/src/scoring-calculator.ts:25:29)
  at getLeadsForOutreachDesk (apps/web/src/app/actions/outreach-actions.ts)
  ```
* **Root Cause:**
  In `packages/domain/src/scoring-calculator.ts`, line 25 checked:
  `if (!hasWebsite || audit?.rawFindings.some((f) => f.code === "NO_WEBSITE"))`
  When an audit record exists (or demo audit data is loaded) without an initialized `rawFindings` array, `audit?.rawFindings` evaluates to `undefined`, causing `.some()` to throw a fatal TypeError.
* **Fix Applied:**
  Refactored line 25 to perform safe array validation:
  `const hasNoWebsiteFinding = Array.isArray(audit?.rawFindings) && audit.rawFindings.some((f) => f.code === "NO_WEBSITE");`
  Also fortified category normalization: `const catLower = (business.category || "").toLowerCase();`.
* **Verification:**
  `npx vitest run` and direct rendering of `/dashboard/outreach` loaded cleanly without crashes.

---

### ISS-002: 404 Not Found on `/dashboard/settings`
* **Symptom:**
  Navigating to `http://localhost:3000/dashboard/settings` resulted in a Next.js 404 page.
* **Root Cause:**
  Sidebar navigation in `apps/web/src/app/dashboard/layout.tsx` linked to `/dashboard/settings`, but `apps/web/src/app/dashboard/settings/page.tsx` was not yet created.
* **Fix Applied:**
  Created `apps/web/src/app/dashboard/settings/page.tsx` with full operator configuration sections:
  1. Agency Profile & Quotation Branding (Agency name, principal founder, contact email, WhatsApp number).
  2. Discovery Connectors (OpenStreetMap, optional Google Places API, optional YouTube API).
  3. PostgreSQL & Neon DB Telemetry status.
  4. Anti-Spam & Ethical Outreach Compliance and Suppression policies.
* **Verification:**
  `/dashboard/settings` compiles and renders cleanly as a production route.

---

### ISS-003: Client Component Event Handler Error on `/dashboard/discovery`
* **Symptom:**
  ```text
  Runtime Error: Event handlers cannot be passed to Client Component props.
  <a href=... onClick={function onClick} ...>
  ```
* **Root Cause:**
  In `apps/web/src/app/dashboard/discovery/page.tsx` (a Next.js Server Component), the browser bookmarklet button had an inline `onClick={(e) => { navigator.clipboard.writeText(...) }}` event handler. Next.js App Router forbids serializing JavaScript function closures across the Server Component boundary.
* **Fix Applied:**
  Extracted the bookmarklet button into a dedicated Client Component (`apps/web/src/app/dashboard/discovery/bookmarklet-button.tsx`) decorated with `"use client"`, complete with visual copy-feedback and clipboard handling.
* **Verification:**
  `/dashboard/discovery` loads with 0 serialization errors.

---

### ISS-004: Homepage Free Instant Audit Button Unresponsive
* **Symptom:**
  On `http://localhost:3000/`, typing a website URL into the hero section form and clicking "Get Free Audit" produced no reaction.
* **Root Cause:**
  In `apps/web/src/app/page.tsx`, the form was rendered with a static `<button type="button">` with no `action`, no input `name`, and no form submission handler.
* **Fix Applied:**
  Updated the form to `<form action="/dashboard/audit-lab" method="GET">`, gave the input `name="url"` and `required`, and made the button `<button type="submit">`.
  Submitting instantly routes the visitor to `/dashboard/audit-lab?url=<target>`, which automatically executes real-time diagnostics and displays results.
* **Verification:**
  Submitting the form immediately triggers real-time TLS/SSL, mobile speed, and conversion CTA analysis in Audit Lab.

---

### ISS-005: Prototype Previews Lacked Visual Diversity & Niche Customization
* **Symptom:**
  In `http://localhost:3000/dashboard/leads`, clicking "Preview" for any lead generated the same generic blue layout and identical placeholder services.
* **Root Cause:**
  `apps/web/src/app/preview/[slug]/page.tsx` used hardcoded blue styling and fixed generic consultation text.
* **Fix Applied:**
  Implemented dynamic niche-specific design systems in `apps/web/src/app/preview/[slug]/page.tsx`:
  - **Clinics & Healthcare:** Clean teal/emerald/cyan gradients, verified doctor credentials, sterilized suite badges, and root canal / smile makeover services.
  - **Restaurants, Cafes & Food:** Warm amber/orange/rose gradients, FSSAI certified badges, chef specials, and direct WhatsApp table reservation CTAs.
  - **Education, Tuition & Academies:** Vibrant indigo/blue/violet gradients, top ranker badges, CBSE/Board mastery, and NEET foundation courses.
  - **Chartered Accountants & Legal:** Sophisticated deep navy & slate gradients, ICAI licensed expert badges, GST filing, and ROC compliance services.
  - **Salons, Spas & Wellness:** Luxurious rose gold & pink gradients, organic product badges, and hair/skincare treatment menus.
* **Verification:**
  Every lead generated across different categories now displays an authentic, distinct, industry-tailored brand identity.

---

## 3. How to Specify Any Custom City or Area for Discovery
To answer **Question 1** (*"Where can I give the area or city to find the lead?"*):
1. **In OpenStreetMap Discovery (`/dashboard/discovery`):**
   - The Target Locality dropdown now supports major zones across Chennai (Adyar, Anna Nagar, T. Nagar, Velachery, Mylapore, Tambaram, Porur, Nungambakkam) and leading cities (Coimbatore, Madurai, Trichy, Salem, Bangalore, Hyderabad).
2. **In Multi-Channel Connectors (Google Places & YouTube tabs):**
   - Click the **Google Places** or **YouTube** tab inside Discovery Studio to type **any custom city, district, or neighborhood** (e.g. `"Dentists in Coimbatore"`, `"Bakeries in Tambaram"`, `"Maths Academy in Madurai"`).
