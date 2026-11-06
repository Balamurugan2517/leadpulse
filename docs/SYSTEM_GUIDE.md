# LeadPulse AI - System Guide & Troubleshooting Manual

**Version:** 3.1  
**Operating Environment:** Next.js (Web) + Node.js (Worker) + Neon PostgreSQL  

---

## 1. System Overview & Architecture Summary

LeadPulse AI is a self-hosted B2B lead intelligence and CRM platform designed for a solo founder. It operates with two connected parts:
1. **Web Process (`apps/web`):** Fullstack Next.js App Router providing the public digital agency marketing site and the private operator dashboard. Deployable to Vercel or Cloudflare Workers.
2. **Background Worker (`apps/worker`):** Node.js long-running process that claims queued audit jobs from PostgreSQL, runs Playwright/Chromium audits, and computes scores. Runs on your development machine (WSL2 / Windows) or any low-cost host.

---

## 2. Step-by-Step Operating Workflow

### Step 1: Starting the Platform
```bash
# Terminal 1: Run the web application
npm run dev --workspace=apps/web

# Terminal 2: Run the background audit worker
npm run dev --workspace=apps/worker
```
Open `http://localhost:3000` in your browser. Access the dashboard at `/dashboard`.

---

### Step 2: Finding Leads (Discovery)
1. Navigate to **Discovery Studio** (`/dashboard/discovery`).
2. **Option A (OpenStreetMap Search):**
   - Select your target city (e.g. `Chennai`) and locality (e.g. `Anna Nagar`).
   - Select category (e.g. `Dental Clinics`, `Coaching Institutes`, `Cafes`).
   - Click **[Run Free Discovery]**. Leads are pulled and enqueued for audit.
3. **Option B (CSV Import):**
   - Drag and drop any spreadsheet or CSV with business names, phone numbers, and websites.
4. **Option C (1-Click Browser Quick-Capture):**
   - When browsing Google Maps or Instagram, click your browser bookmarklet. The business name, phone, address, and URL are automatically submitted to your LeadPulse database.

---

### Step 3: Reviewing Audited Leads
1. Navigate to **Lead Explorer** (`/dashboard/leads`).
2. Filter by Demand Tier:
   - **`ACTIVELY_LOOKING`:** High-intent buying signals (pitch immediately).
   - **`HIGH_DEMAND`:** No website or broken SSL/404s (pitch urgent repair/setup).
   - **`MEDIUM_DEMAND`:** Outdated mobile experience or slow loading (pitch redesign).
3. Click any lead to inspect technical audit evidence (Lighthouse scores, SSL expiry, missing forms).

---

### Step 4: 1-Click Outreach via WhatsApp & Email
1. Navigate to **Outreach Desk** (`/dashboard/outreach`).
2. Inspect the pre-generated message:
   - The message automatically highlights the exact defect found on their site.
   - You can edit any sentence directly in the text box.
3. Click **[Send via WhatsApp]**:
   - Opens WhatsApp Web or desktop with the pre-filled text.
   - Click send in WhatsApp.
4. An acknowledgment modal will pop up: *"Did you send the message to [Business Name]?"*
   - Click **[Yes, Mark as Contacted]**. The lead moves to `CONTACTED` stage in your database.

---

### Step 5: Sales Discussion, Proposal & Closing
1. When a prospect replies, open the **Sales Pipeline** (`/dashboard/pipeline`).
2. Drag the card to **`IN_DISCUSSION`**. Click to log notes from your phone call or meeting.
3. Click **[Generate Proposal]** to create a clean, printable scope & price document.
4. When the client approves, drag the card to **`DEAL_WON`**!
5. If the client declines, drag to **`DEAL_LOST`** and click **[Suppress Lead]** so the system permanently excludes them from future searches.

---

## 3. Comprehensive Troubleshooting Runbook

### Issue 1: "Cannot connect to PostgreSQL / Neon Database"
* **Symptom:** `Error: connect ECONNREFUSED` or timeout when running migrations or starting the app.
* **Root Cause:** Missing or invalid `DATABASE_URL` in `.env.local`, or Neon compute endpoint is suspended.
* **Fix:**
  1. Verify `.env.local` exists in your project root with valid credentials:
     ```env
     DATABASE_URL=postgres://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/leadpulse?sslmode=require
     ```
  2. Neon free endpoints sleep after 5 minutes of inactivity; the first query wakes the database within 1.5 seconds. Ensure connection retry logic is active.

---

### Issue 2: "Playwright / Chromium fails to launch in Worker"
* **Symptom:** `browserType.launch: Executable doesn't exist at C:\Users\...\AppData\Local\ms-playwright\...`
* **Root Cause:** Playwright browser binaries are not installed.
* **Fix:**
  Run the browser installer once:
  ```bash
  npx playwright install chromium
  ```

---

### Issue 3: "Audit job stuck in PENDING status"
* **Symptom:** You added a new lead or ran an OSM search, but the audit scores remain empty.
* **Root Cause:** The background worker (`apps/worker`) is not currently running.
* **Fix:**
  Start the worker in a separate terminal:
  ```bash
  npm run dev --workspace=apps/worker
  ```
  The worker will immediately claim all pending jobs using `SELECT ... FOR UPDATE SKIP LOCKED` and process them.

---

### Issue 4: "SSRF Security Alert: Hostname resolved to private IP"
* **Symptom:** Worker log displays: `[SSRF Blocked] target_url resolves to 192.168.1.1 or 127.0.0.1`.
* **Root Cause:** The website URL provided is attempting to access a local network or internal IP address.
* **Fix:**
  This is expected security behavior! LeadPulse blocks any URL attempting to probe internal infrastructure. The audit status will be marked `FAILED_SECURITY_CHECK`.

---

### Issue 5: "WhatsApp Web does not open with the pre-filled text"
* **Symptom:** WhatsApp opens, but the message box is blank.
* **Root Cause:** Unescaped special characters or phone number formatting issue.
* **Fix:**
  Ensure the phone number is normalized to E.164 standard without spaces, dashes, or `+` sign in the URL (e.g. `https://wa.me/919876543210?text=Hello`).
